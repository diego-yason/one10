import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Page from './+page.svelte';

// --- Helpers & environment setup ---
// Synchronous FileReader mock so component's reader.onload executes immediately in tests
class MockFileReader {
  onload: ((ev: any) => void) | null = null;
  result: string | null = 'data:image/jpeg;base64,FAKE';
  readAsDataURL(_blob: Blob) {
    // call onload asynchronously but fast enough for tests
    if (this.onload) {
      // emulate event object
      this.onload({ target: { result: this.result } });
    }
  }
}
beforeEach(() => {
  // Replace global FileReader before each test
  // @ts-ignore
  global.FileReader = MockFileReader;
});

// Price/stock tables used by assertions (arbitrary)
const PRICE_TABLE: Record<string, number> = {
  '3R': 10,
  '4R': 15,
  '5R': 20,
  '6R': 25,
  '7R': 30,
  '8R': 40
};

const STOCK_TABLE: Record<string, number> = {
  '3R': 20,
  '4R': 0,
  '5R': 10,
  '6R': 5,
  '7R': 2,
  '8R': 1
};

// helper to create File objects
function createFile(name: string, type = 'image/jpeg') {
  return new File(['x'], name, { type });
}

// helper to parse numeric total from element text like "TOTAL: ₱10.00"
function parseTotalText(node: HTMLElement | null) {
  if (!node) return 0;
  const match = node.textContent?.match(/[\d,]+(?:\.\d+)?/);
  if (!match) return 0;
  // remove commas and parse
  return parseFloat(match[0].replace(/,/g, ''));
}

describe('Photo Printing - Integration tests (Feature 1) — required 15 tests', () => {
  beforeEach(() => {
    // nothing to do; each render gets fresh component state
  });

  // 1) Upload Single Image
  it('1. Upload Single Image → new entry size=3R copies=1 and total == 3R price', async () => {
    const { getByTestId, getAllByTestId } = render(Page);

    const input = getByTestId('file-input') as HTMLInputElement;
    const file = createFile('single.jpg');

    await fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(getAllByTestId('photo-entry').length).toBe(1);
    });

    // check first entry size select default
    const sizeSelect = getByTestId('size-select-1') as HTMLSelectElement;
    expect(sizeSelect.value).toBe('3R');

    // copies display (qty-input-1 assumed)
    const qtyInput = getByTestId('qty-input-1') as HTMLElement;
    expect(qtyInput.textContent).toContain('1');

    // total equals PRICE_TABLE['3R'] * 1
    const totalEl = getByTestId('total-price') as HTMLElement;
    const totalValue = parseTotalText(totalEl);
    expect(totalValue).toBeCloseTo(PRICE_TABLE['3R'] * 1);
  });

  // 2) Upload Multiple Images
  it('2. Upload Multiple Images → each file separate entry with default size & copies; total sums', async () => {
    const { getByTestId, getAllByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    const files = [createFile('a.jpg'), createFile('b.jpg'), createFile('c.jpg')];

    await fireEvent.change(input, { target: { files } });

    await waitFor(() => {
      expect(getAllByTestId('photo-entry').length).toBe(3);
    });

    // ensure each has default size=3R and copies=1
    for (let i = 1; i <= 3; i++) {
      const s = getByTestId(`size-select-${i}`) as HTMLSelectElement;
      expect(s.value).toBe('3R');
      const q = getByTestId(`qty-input-${i}`) as HTMLElement;
      expect(q.textContent).toContain('1');
    }

    // total should be 3 * price(3R)
    const total = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(total)).toBeCloseTo(PRICE_TABLE['3R'] * 3);
  });

  // 3) Increase Copy Count Within Stock
  it('3. Increase Copy Count Within Stock → copies++, total updates accordingly', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    // upload one file
    await fireEvent.change(input, { target: { files: [createFile('x.jpg')] } });

    // ensure initial total equals 3R price
    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 1);

    // click plus (id 1). assume stock for 3R >= 2
    const plus = getByTestId('qty-plus-1');
    await fireEvent.click(plus);

    // expect copies become 2 and total double
    const qty = getByTestId('qty-input-1') as HTMLElement;
    expect(qty.textContent).toContain('2');
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 2);
  });

  // 4) Prevent Copy Increase Beyond Stock
  it('4. Prevent Copy Increase Beyond Stock → cannot increase beyond size stock', async () => {
    const { getByTestId, getAllByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    // upload one file
    await fireEvent.change(input, { target: { files: [createFile('limit.jpg')] } });

    // change its size to one with small stock, e.g., '7R' which stock=2 per STOCK_TABLE
    const sizeSelect = getByTestId('size-select-1') as HTMLSelectElement;
    await fireEvent.change(sizeSelect, { target: { value: '7R' } });
    expect(sizeSelect.value).toBe('7R');

    // set copies to stock (2)
    const plus = getByTestId('qty-plus-1');
    // first click: 1 -> 2 allowed
    await fireEvent.click(plus);

    const qty = getByTestId('qty-input-1') as HTMLElement;
    expect(qty.textContent).toContain(String(STOCK_TABLE['7R'])); // should be '2'

    // attempt to increment beyond stock (stock is 2)
    await fireEvent.click(plus);

    // still should be equal to stock (2)
    expect(qty.textContent).toContain(String(STOCK_TABLE['7R']));

    // total equals price(7R) * stock (2)
    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['7R'] * STOCK_TABLE['7R']);
  });

  // 5) Decrease Copy Count Within Valid Range
  it('5. Decrease Copy Count Within Valid Range → copies-- and total updates', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    // upload, then increase to 3 copies by clicking plus twice
    await fireEvent.change(input, { target: { files: [createFile('multi.jpg')] } });
    const plus = getByTestId('qty-plus-1');
    await fireEvent.click(plus); // 2
    await fireEvent.click(plus); // 3

    // check total (3 * price of default size 3R)
    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 3);

    // click minus once
    const minus = getByTestId('qty-minus-1');
    await fireEvent.click(minus);

    // expect copies now 2 and total updated
    const qty = getByTestId('qty-input-1') as HTMLElement;
    expect(qty.textContent).toContain('2');
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 2);
  });

  // 6) Prevent Copy Decrease Below 1
  it('6. Prevent Copy Decrease Below 1 → cannot decrement below 1', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [createFile('min.jpg')] } });

    const minus = getByTestId('qty-minus-1');
    await fireEvent.click(minus); // should stay at 1

    const qty = getByTestId('qty-input-1') as HTMLElement;
    expect(qty.textContent).toContain('1');

    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 1);
  });

  // 7) Valid Typed Copy Input
  it('7. Valid Typed Copy Input → typing a valid number within stock accepted and total updates', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [createFile('type.jpg')] } });

    // assume qty-input-1 is an input element we can change value on
    const qtyInput = getByTestId('qty-input-1') as HTMLInputElement;

    // set valid value 4 (stock >=4 for 3R)
    await fireEvent.input(qtyInput, { target: { value: '4' } });

    // expect value accepted and total updated
    expect(qtyInput.value || qtyInput.textContent).toContain('4');

    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 4);
  });

  // 8) Invalid Typed Input Auto-Corrects to 1
  it('8. Invalid Typed Input Auto-Corrects to 1 (blank, zero, negative)', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [createFile('badinput.jpg')] } });

    const qtyInput = getByTestId('qty-input-1') as HTMLInputElement;

    // blank
    await fireEvent.input(qtyInput, { target: { value: '' } });
    // simulate blur or commit if component corrects on blur
    await fireEvent.blur(qtyInput);
    expect(qtyInput.value || qtyInput.textContent).toContain('1');

    // zero
    await fireEvent.input(qtyInput, { target: { value: '0' } });
    await fireEvent.blur(qtyInput);
    expect(qtyInput.value || qtyInput.textContent).toContain('1');

    // negative
    await fireEvent.input(qtyInput, { target: { value: '-123' } });
    await fireEvent.blur(qtyInput);
    expect(qtyInput.value || qtyInput.textContent).toContain('1');

    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 1);
  });

  // 9) Change Size from Dropdown -> price update
  it('9. Change Size from Dropdown → price and total update accordingly', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [createFile('sizes.jpg')] } });

    const totalEl = getByTestId('total-price') as HTMLElement;
    // initial price should equal 3R
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R']);

    const sizeSelect = getByTestId('size-select-1') as HTMLSelectElement;
    // change to 5R
    await fireEvent.change(sizeSelect, { target: { value: '5R' } });
    expect(sizeSelect.value).toBe('5R');

    // total should equal price(5R) * copies (1)
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['5R'] * 1);
  });

  // 10) Remove Photo Entry
  it('10. Remove Photo Entry → deleting removes entry and updates total', async () => {
    const { getByTestId, getAllByTestId, queryAllByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    // upload three files (each price 3R)
    await fireEvent.change(input, { target: { files: [createFile('a.jpg'), createFile('b.jpg'), createFile('c.jpg')] } });

    await waitFor(() => {
      expect(getAllByTestId('photo-entry').length).toBe(3);
    });

    // total should be 3 * price(3R)
    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 3);

    // delete first entry
    const del = getByTestId('delete-1');
    await fireEvent.click(del);

    // now two entries
    await waitFor(() => {
      expect(queryAllByTestId('photo-entry').length).toBe(2);
    });

    // total should be price(3R) * 2
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['3R'] * 2);
  });

  // 11) Select Delivery Mode Enables Add to Cart
  it('11. Select Delivery Mode Enables Add to Cart button', async () => {
    const { getByTestId, getByLabelText, getByText } = render(Page);

    // start with one uploaded image
    const input = getByTestId('file-input') as HTMLInputElement;
    await fireEvent.change(input, { target: { files: [createFile('cart.jpg')] } });

    // assume Add to cart button has no testid but text "Add to cart" and is disabled when no delivery selected
    const addBtn = getByText('Add to cart') as HTMLButtonElement;
    expect(addBtn).toBeDisabled();

    // choose delivery radio (same-day)
    // find radio input by value
    const radio = document.querySelector('input[name="pickupMode"][value="same-day"]') as HTMLInputElement;
    expect(radio).toBeTruthy();
    await fireEvent.click(radio);

    // after selecting delivery mode, Add to cart should be enabled (and not a staff user)
    await waitFor(() => {
      expect(addBtn).not.toBeDisabled();
    });
  });

  // 12) Add to Cart Disabled With No Uploaded Images
  it('12. Add to Cart stays disabled with no uploaded images', async () => {
    const { getByText } = render(Page);
    const addBtn = getByText('Add to cart') as HTMLButtonElement;

    // starting component with no uploads — should be disabled
    expect(addBtn).toBeDisabled();

    // click it (should do nothing) — spy not attached; ensure still disabled
    await fireEvent.click(addBtn);
    expect(addBtn).toBeDisabled();
  });

  // 13) Auto-Correct Input When Value Exceeds Stock
  it('13. Auto-correct copy input when value exceeds stock', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    // upload one image
    await fireEvent.change(input, { target: { files: [createFile('stock.jpg')] } });

    // change size to one with stock 7 for this test; we'll use '6R' stock=5 in our table but we'll override by selecting a size with known stock
    // to follow the plan: choose a size, then type a value > STOCK_TABLE[size], expect correction.
    const sizeSelect = getByTestId('size-select-1') as HTMLSelectElement;
    // pick 6R which has stock 5 in our STOCK_TABLE
    await fireEvent.change(sizeSelect, { target: { value: '6R' } });
    expect(sizeSelect.value).toBe('6R');

    const qtyInput = getByTestId('qty-input-1') as HTMLInputElement;

    // type a large number exceeding stock (e.g., 15)
    await fireEvent.input(qtyInput, { target: { value: '15' } });
    // simulate blur for correction
    await fireEvent.blur(qtyInput);

    // expect auto-correct to STOCK_TABLE['6R'] which is 5
    const expected = STOCK_TABLE['6R'];
    expect(qtyInput.value || qtyInput.textContent).toContain(String(expected));

    const totalEl = getByTestId('total-price') as HTMLElement;
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['6R'] * expected);
  });

  // 14) Total Price Updates After Sequential Adjustments
  it('14. Total updates after size change → qty change → size change', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [createFile('seq.jpg')] } });

    const sizeSelect = getByTestId('size-select-1') as HTMLSelectElement;
    const totalEl = getByTestId('total-price') as HTMLElement;
    const qtyInput = getByTestId('qty-input-1') as HTMLInputElement;
    const plus = getByTestId('qty-plus-1');

    // Change size -> 5R (₱20)
    await fireEvent.change(sizeSelect, { target: { value: '5R' } });
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['5R'] * 1);

    // Adjust copies to 3 (click plus twice)
    await fireEvent.click(plus); // 2
    await fireEvent.click(plus); // 3
    expect(qtyInput.value || qtyInput.textContent).toContain('3');
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['5R'] * 3);

    // Change size to 4R (₱15) and expect total = 15 * 3 = 45
    await fireEvent.change(sizeSelect, { target: { value: '4R' } });
    expect(parseTotalText(totalEl)).toBeCloseTo(PRICE_TABLE['4R'] * 3);
  });

  // 15) Size Dropdown Shows Only Available Sizes
  it('15. Size dropdown only lists sizes with stock > 0', async () => {
    const { getByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;

    // upload single image
    await fireEvent.change(input, { target: { files: [createFile('stockfilter.jpg')] } });

    // inspect options of size-select-1
    const sizeSelect = getByTestId('size-select-1') as HTMLSelectElement;

    // gather option values that are shown
    const optionValues = Array.from(sizeSelect.options).map((opt) => opt.value);

    // 4R had stock 0 in our STOCK_TABLE - assert it's not present
    expect(optionValues).not.toContain('4R');

    // 3R and 5R which have stock > 0 should be present
    expect(optionValues).toContain('3R');
    expect(optionValues).toContain('5R');
  });
});

// ---------------------------------------------------------------------------
// Additional tests
// ---------------------------------------------------------------------------
describe('Photo Printing - extra UI checks', () => {
  it.todo('renders initial empty state (SSR-like) without entries', () => {
    const { queryAllByTestId } = render(Page);
    expect(queryAllByTestId('photo-entry').length).toBe(0);
  });

  it.todo('allows uploading same file twice as separate entries', async () => {
    const { getByTestId, getAllByTestId } = render(Page);
    const input = getByTestId('file-input') as HTMLInputElement;
    const f = createFile('dup.jpg');
    await fireEvent.change(input, { target: { files: [f] } });
    await fireEvent.change(input, { target: { files: [f] } });

    await waitFor(() => {
      expect(getAllByTestId('photo-entry').length).toBe(2);
    });
  });
});

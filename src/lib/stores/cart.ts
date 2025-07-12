import { writable } from 'svelte/store';

export type CartItem = {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  details?: any;
};

function createCart() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('cart') : null;
  const initial: CartItem[] = stored ? JSON.parse(stored) : [];
  const { subscribe, set, update } = writable<CartItem[]>(initial);

  function persist(items: CartItem[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  return {
    subscribe,
    add(item: CartItem) {
      update(items => {
        // If item with same id/type/details exists, increase quantity
        const idx = items.findIndex(i => i.id === item.id && i.type === item.type && JSON.stringify(i.details) === JSON.stringify(item.details));
        if (idx !== -1) {
          items[idx].quantity += item.quantity;
          persist(items);
          return [...items];
        }
        const newItems = [...items, item];
        persist(newItems);
        return newItems;
      });
    },
    remove(index: number) {
      update(items => {
        const newItems = items.slice();
        newItems.splice(index, 1);
        persist(newItems);
        return newItems;
      });
    },
    updateQuantity(index: number, quantity: number) {
      update(items => {
        const newItems = items.slice();
        if (quantity > 0) {
          newItems[index] = { ...newItems[index], quantity };
        } else {
          newItems.splice(index, 1);
        }
        persist(newItems);
        return newItems;
      });
    },
    clear() {
      set([]);
      persist([]);
    },
    set(items: CartItem[]) {
      set(items);
      persist(items);
    }
  };
}

export const cart = createCart();

// Toast store for global notifications
export const toast = writable<string | null>(null);
export function showToast(message: string) {
  toast.set(message);
  setTimeout(() => toast.set(null), 2000);
} 
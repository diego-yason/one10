import { render, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PrintingForm from "$public/store/printing/+page.svelte";

// Mock the entire module before importing
vi.mock("$lib/db/cartImages", () => ({
    saveImage: vi.fn().mockResolvedValue(undefined),
    getImage: vi.fn().mockResolvedValue(null),
    deleteImage: vi.fn().mockResolvedValue(undefined),
    clearImages: vi.fn().mockResolvedValue(undefined),
    saveFormState: vi.fn().mockResolvedValue(undefined),
    getFormState: vi.fn().mockResolvedValue(null),
    clearFormState: vi.fn().mockResolvedValue(undefined),
}));

import * as cartImages from "$lib/db/cartImages";

describe("file upload UI", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("uploads and previews images", async () => {
        const { getByTestId } = render(PrintingForm);

        const input = getByTestId("upload") as HTMLInputElement;
        const testFile = new File(["hello"], "photo.jpg", { type: "image/jpeg" });

        // Mock the files property directly
        Object.defineProperty(input, 'files', {
            value: [testFile],
            writable: false,
        });

        await fireEvent.change(input);

        expect(cartImages.saveImage).toHaveBeenCalled();
        expect(cartImages.saveImage).toHaveBeenCalledWith(
            expect.any(String), // UUID
            testFile
        );
    });
});
import { render, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import PrintingForm from "$public/store/printing/+page.svelte";
import * as cartImages from "$lib/db/cartImages";

// mock IndexedDB saveImage
vi.spyOn(cartImages, "saveImage").mockResolvedValue(undefined);

describe("file upload UI", () => {
    it("uploads and previews images", async () => {
        const { getByTestId } = render(PrintingForm);

        const input = getByTestId("upload");
        const testFile = new File(["hello"], "photo.jpg", { type: "image/jpeg" });

        await fireEvent.change(input, { target: { files: [testFile] } });

        expect(cartImages.saveImage).toHaveBeenCalled();
    });
});

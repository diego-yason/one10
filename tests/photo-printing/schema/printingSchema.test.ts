import { describe, it, expect } from "vitest";
import { printingSchema } from "$public/store/printing/schema";

function mockUpload() {
    return {
        id: "1",
        file: new File(["data"], "test.jpg"),
        name: "test.jpg",
        copies: 1,
        size: "3R",
        fitMode: "fit",
        price: 10
    };
}

describe("printingSchema", () => {
    it("validates correct form", () => {
        const result = printingSchema.safeParse({
            basePrice: 10,
            total: 10,
            uploadedImages: [mockUpload()],
            pickupMode: "same-day",
            pickupOther: ""
        });

        expect(result.success).toBe(true);
    });

    it("validates correct form with other", () => {
        const result = printingSchema.safeParse({
            basePrice: 10,
            total: 10,
            uploadedImages: [mockUpload()],
            pickupMode: "other",
            pickupOther: "deliver to friend"
        });

        expect(result.success).toBe(true);
    });

    it("requires pickupOther when pickupMode is 'other'", () => {
        const result = printingSchema.safeParse({
            basePrice: 10,
            total: 10,
            uploadedImages: [mockUpload()],
            pickupMode: "other",
            pickupOther: ""
        });

        expect(result.success).toBe(false);
    });

    it("invalid pickup mode", () => {
        const result = printingSchema.safeParse({
            basePrice: 10,
            total: 10,
            uploadedImages: [mockUpload()],
            pickupMode: "teleport",
            pickupOther: ""
        });

        expect(result.success).toBe(false);
    });

    it("empty pickup mode", () => {
        const result = printingSchema.safeParse({
            basePrice: 10,
            total: 10,
            uploadedImages: [mockUpload()],
            pickupMode: "teleport",
            pickupOther: ""
        });

        expect(result.success).toBe(false);
    });
});

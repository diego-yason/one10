import { describe, it, expect } from "vitest";
import { uploadSchema, printingSchema } from "$public/store/printing/schema";

describe("uploadSchema", () => {
    it("accepts a valid upload", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 1,
            size: "3R",
            fitMode: "fit",
            price: 10
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it("rejects oversized file", () => {
        const size = 25 * 1024 * 1024;
        const bigArray = new Uint8Array(size);
        
        const big = new File([bigArray], "big.jpg", { type: "image/jpeg" });

        const result = uploadSchema.safeParse({
            id: "1",
            file: big,
            name: "big.jpg",
            copies: 1,
            size: "3R",
            fitMode: "fit",
            price: 10
        });

        expect(result.success).toBe(false);
    });

    it("rejects invalid size", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 1,
            size: "9R",
            fitMode: "fit",
            price: 10
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(false);

    });

    it("rejects invalid fit mode", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 1,
            size: "3R",
            fitMode: "shrink",
            price: 10
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(false);

    });

    it("rejects empty size", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 1,
            size: "",
            fitMode: "fit",
            price: 10
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(false);

    });

    it("rejects empty fit mode", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 1,
            size: "3R",
            fitMode: "",
            price: 10
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(false);

    });

    it("rejects invalid price", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 1,
            size: "3R",
            fitMode: "fit",
            price: -1
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(false);

    });

    it("rejects invalid copy count (small)", () => {
        const file = new File(["hello"], "test.jpg", { type: "image/jpeg" });

        const data = {
            id: "123",
            file,
            name: "test.jpg",
            copies: 0,
            size: "3R",
            fitMode: "fit",
            price: 100
        };

        const result = uploadSchema.safeParse(data);
        expect(result.success).toBe(false);

    });


});

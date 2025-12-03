import { describe, it, expect } from "vitest";
import { actions } from "$public/store/printing/+page.server";
import type { imgMeta } from "$public/store/printing/schema";

function createMockRequest(data: {
    files: File[],
    metas: any[],
    total: number
    basePrice: number
    pickupMode: string
    pickupOther?: string
}) {
    const formData = new FormData();
    data.files.forEach(f => formData.append("files", f));
    data.metas.forEach(m => formData.append("meta", JSON.stringify(m)));

    formData.append("total", String(data.total));
    formData.append("basePrice", String(data.basePrice));
    formData.append("pickupMode", data.pickupMode);
    formData.append("pickupOther", data.pickupOther ?? "");

    return new Request("http://localhost/store/printing/", {
        method: "POST",
        body: formData
    });
}

describe("printing action", () => {

    it("accepts a valid print order", async () => {
        const request = createMockRequest({
            files: [new File(["data"], "test.jpg", { type: "image/jpeg" })],
            metas: [{
                id: "abc",
                name: "test.jpg",
                copies: 1,
                size: "3R",
                fitMode: "fit",
                price: 10
            }],
            total: 10,
            basePrice: 10,
            pickupMode: "same-day"
        });

        const response = await actions.default({ request });

        if (response) {
             if ('status' in response) {
                expect.fail('Expected success but got failure');
            } else {
                expect(response.success).toBe(true);
                expect(response.item).toBeDefined();
                expect(response.item.details.uploadedImages as imgMeta[]).toBe(1);
            }
        }

    });

    it("fails validation on bad metadata", async () => {
        const request = createMockRequest({
            files: [new File(["data"], "test.jpg", { type: "image/jpeg" })],
            metas: [{
                id: "abc",
                name: "test.jpg",
                copies: 0, // INVALID
                size: "WRONG", // INVALID
                fitMode: "fit",
                price: 10
            }],
            total: 10,
            basePrice: 10,
            pickupMode: "same-day"
        });

        const response = await actions.default({ request });

        // If using fail(400, { ... }), check for status
        if (response) {
            if ('status' in response) {
                expect(response.status).toBe(400);
                expect(response.data.error).toBe(true);
                expect(response.data.issues).toBeDefined();
            } else {
                expect.fail('Expected failure but got success');
            }
        }
    });

    it("rejects when pickup mode is 'other' but no value provided", async () => {
        const request = createMockRequest({
            files: [new File(["data"], "test.jpg", { type: "image/jpeg" })],
            metas: [{
                id: "abc",
                name: "test.jpg",
                copies: 1,
                size: "3R",
                fitMode: "fit",
                price: 10
            }],
            total: 10,
            basePrice: 10,
            pickupMode: "other",
            pickupOther: "" // Empty when 'other' is selected
        });

        const response = await actions.default({ request });
        // If using fail(400, { ... }), check for status
        if (response) {
            if ('status' in response) {
                expect(response.status).toBe(400);
                expect(response.data.error).toBe(true);
                expect(response.data.issues).toBeDefined();
            } else {
                expect.fail('Expected failure but got success');
            }
        }
    });
});
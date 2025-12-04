import { describe, it, expect, vi } from "vitest";
import { actions } from "$public/store/printing/+page.server";
import type { imgMeta } from "$public/store/printing/schema";

function createMockRequestEvent(data: {
    files: File[],
    metas: any[],
    total: number
    basePrice: number
    pickupMode: string
    pickupOther?: string
}) {
    const formData = new FormData();
    
    data.files.forEach(f => {
        const file = new File([f], f.name, { type: f.type || "image/jpeg" });
        formData.append("files", file);
    });
    
    data.metas.forEach(m => formData.append("meta", JSON.stringify(m)));
    formData.append("total", String(data.total));
    formData.append("basePrice", String(data.basePrice));
    formData.append("pickupMode", data.pickupMode);
    formData.append("pickupOther", data.pickupOther ?? "");

    // Create a mock request that returns formData immediately
    const request = {
        formData: vi.fn().mockResolvedValue(formData),
        method: "POST",
        url: "http://localhost/store/printing",
        headers: new Headers(),
    } as any;

    return {
        request,
        cookies: {
            get: () => undefined,
            set: () => {},
            delete: () => {},
            serialize: () => "",
        } as any,
        fetch: global.fetch,
        getClientAddress: () => "127.0.0.1",
        locals: {},
        params: {},
        platform: undefined,
        route: { id: "/store/printing" },
        setHeaders: () => {},
        url: new URL("http://localhost/store/printing"),
        isDataRequest: false,
        isSubRequest: false,
    } as any;
}

describe("printing action", () => {

    it("accepts a valid print order", async () => {
        const fileContent = new Uint8Array(1024);
        const testFile = new File([fileContent], "test.jpg", { type: "image/jpeg" });

        const event = createMockRequestEvent({
            files: [testFile],
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

        const response = await actions.default(event);

        if (!response) {
            expect.fail('Expected a response but got undefined');
            return;
        }

        if ('status' in response) {
            console.error("Failure response:", response.data);
            expect.fail(`Expected success but got failure: ${JSON.stringify(response.data)}`);
        } else {
            expect(response.success).toBe(true);
            expect(response.item).toBeDefined();
            expect((response.item.details.uploadedImages as imgMeta[]).length).toBe(1);
        }
    });

    it("fails validation on bad metadata", async () => {
        const fileContent = new Uint8Array(1024);
        const testFile = new File([fileContent], "test.jpg", { type: "image/jpeg" });

        const event = createMockRequestEvent({
            files: [testFile],
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

        const response = await actions.default(event);

        if (!response) {
            expect.fail('Expected a response but got undefined');
            return;
        }

        if ('status' in response) {
            expect(response.status).toBe(400);
            expect(response.data.error).toBe(true);
            expect(response.data.issues).toBeDefined();
        } else {
            expect.fail('Expected failure but got success');
        }
    });

    it("rejects when pickup mode is 'other' but no value provided", async () => {
        const fileContent = new Uint8Array(1024);
        const testFile = new File([fileContent], "test.jpg", { type: "image/jpeg" });

        const event = createMockRequestEvent({
            files: [testFile],
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
            pickupOther: ""
        });

        const response = await actions.default(event);

        if (!response) {
            expect.fail('Expected a response but got undefined');
            return;
        }

        if ('status' in response) {
            expect(response.status).toBe(400);
            expect(response.data.error).toBe(true);
            expect(response.data.issues).toBeDefined();
        } else {
            expect.fail('Expected failure but got success');
        }
    });
});
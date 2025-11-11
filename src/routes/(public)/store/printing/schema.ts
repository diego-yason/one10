import { z } from "zod";


export const printingSchema = z.object({
  uploadedImages: z.object({
    id: z.number(),
    name: z.string(),
    preview: z.string(),
    copies: z.number(),
    size: z.string(),
    price: z.number()
  })
  .array()
  .min(1, "Please upload a photo."),
  pickupMode: z.string({message: "Pickup mode is required."}),
  pickupOther: z.string().optional()
});

export type PrintingFormData = z.infer<typeof printingSchema>;
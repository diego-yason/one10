  import { z } from "zod";

  const MAX_FILE_SIZE = 20; // change as needed
  const MAX_COPY_COUNT = 20; // change as needed

  export const uploadSchema = z.object({
      id: z.number(),
      file: z.custom<Blob>((value) => {
        return value instanceof Blob && value.size <= MAX_FILE_SIZE * 1024 * 1024;
      }, "File too large."),
      name: z.string({message: "Error here"}),
      preview: z.string(),
      copies: z.number().min(1, "Copies cannot be less than zero").max(MAX_COPY_COUNT, "Copy limit reached."),
      size: z.string().min(1, "Print size is required."),
      fitMode: z.string().min(1, "Fit mode is required."), // No need for validating if crop or fit since no other choice.
      price: z.number().min(0, "Price cannot be negative.")
  }); 

  export const printingSchema = z.object({
    uploadedImages: uploadSchema
    .array()
    .min(1, "Please upload a photo."),
    pickupMode: z.string().min(1, "Pickup mode is required."),
    pickupOther: z.string().optional()
  });

  
  export type PrintingFormData = z.infer<typeof printingSchema>;
  export type UploadSchema= z.infer<typeof uploadSchema>;
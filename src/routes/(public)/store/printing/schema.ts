import { z } from "zod";

const MAX_FILE_SIZE = 20; // change as needed
const FIT_MODES = ["fit", "crop"];
const PICKUP_MODES = ["same-day", "courier", "dropoff", "other"];
const SIZE = ["3R", "4R", "5R", "6R", "7R", "8R"];

export const PRICE_PER_SIZE : {[key: string]: number}  = {
  "3R": 100,
  "4R": 200,
  "5R": 300,
  "6R": 400,
  "7R": 500,
  "8R": 700
}

export const PICKUP_MAP : {[key: string]: string} = {
  "same-day": "SAME DAY COURIER (LALAMOVE, GRAB, MR. SPEEDY, ETC.)",
  "courier": "COURIER (JRS, LBC, J&T, GOGOEXPRESS, ETC.)",
  "dropoff": "DROP-OFF AT LOCATION (ONE10STUDIOLAB, MUNTINLUPA CITY)"
};

export interface imgMeta {
  [key: string]: unknown
}

	// for photo printing

export const uploadSchema = z.object({
    id: z.string(),
    file: z.custom<Blob>((value) => {
      return value instanceof Blob && value.size <= (MAX_FILE_SIZE * 1024 * 1024);
    }, "File too large."),
    name: z.string({message: "File name is invalid."}),
    copies: z.number().min(1, "Copies cannot be less than one."),
    size: z.string().min(1, "Print size is required.").refine((size) => SIZE.includes(size), {message: "Print size is invalid."}),
    fitMode: z.string().min(1, "Fit mode is required.").refine((fitMode) => FIT_MODES.includes(fitMode), {message: "Fit mode is invalid."}), 
    price: z.number().min(0, "Price cannot be negative.")
}); 

export const printingSchema = z.object({
  basePrice: z.number().min(1, "Price cannot be zero."),
  total: z.number().min(1, "Price cannot be zero."),
  uploadedImages: uploadSchema
  .array()
  .min(1, "Please upload a photo."),
  pickupMode: z.string().min(1, "Pickup mode is required.").refine((pickup) => PICKUP_MODES.includes(pickup), {message: "Pickup mode is invalid."}),
  pickupOther: z.string().optional()
}).refine((data) => {
  if (data.pickupMode === "other" && data.pickupOther?.length === 0)
    return false;
  else
    return true;
}, { message: "Pickup mode is required." });


export type PrintingFormData = z.infer<typeof printingSchema>;
export type UploadSchema= z.infer<typeof uploadSchema>;
/* duplicate block removed */
import { browser } from "$app/environment";
import { ZodError } from 'zod';
import type { PageServerLoad } from './$types'; 
import { printingSchema } from './schema';
import type { PrintingFormData, UploadSchema } from './schema';
import { error, fail } from '@sveltejs/kit';
import { v4 as uuidv4 } from "uuid";
import type { CartItem } from '$types/Cart';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    
    // Reconstruct according to schema
    const total = Number(formData.get("total"));
    const basePrice = Number(formData.get("basePrice"));
    const pickupMode = formData.get("pickupMode");
    const pickupOther = formData.get("pickupOther");
    const files = formData.getAll("files") as File[];
    const metas = formData.getAll("meta").map((m) => JSON.parse(m.toString()));

    files.forEach((file, i) => {
      console.log(`File ${i}: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    });

    // TODO: figure out a way to send images and make them persist (local storage before checkout or upload to firebase)
    const uploadedImages = files.map((file, i) => {
      return {
        ...metas[i],
        file
      }
    });

    // for (let i=1; i < uploadedImages.length; i++) {
    //   console.log("Img", (uploadedImages[i].file.size / 1024 / 1024).toFixed(2))
    // }
    
    const combined = { // Reconstructed form data
      basePrice: basePrice,
      total: total,
      uploadedImages: uploadedImages,
      pickupMode: pickupMode,
      pickupOther: pickupOther
    }

    try {
      const {success, data, error} = printingSchema.safeParse(combined);
      
      if (!success) {
        throw error
      }
      
      // Send only the metas (especiall the id) to get the images stored elsewhere.
      const imgMetas = data.uploadedImages.map((img) => {
        const { file, ...rest } = img as any;
        return rest;
      });

      // Build cart item using serializable metadata only
      const cartItem : CartItem = {
        id: String(uuidv4()),
        details: {
          total: data.total,
          basePrice: data.basePrice,
          type: "print",
          uploadedImages: imgMetas, // Store meta in the cart item with id
          pickupMode: data.pickupMode,
          pickupOther: data.pickupOther
        },
        name:"image", // A little bruteforce
        imageUrl: "/", // A little bruteforce 
        quantity: 1, // 1 instance, multiple images
        price: data.total
      } 
      console.log("success", cartItem);
      
      
      return { success, item: cartItem };
    } 
    catch (error) {
      if (error instanceof ZodError) {
        const issues = Object.fromEntries(
          error.issues.map((issue) => [issue.path.join('.'), issue.message])
        );

        console.log("Error here ", issues);

        return fail(400, { error: true, issues });
      }
      else 
        console.log("Error in photo printing.");
    }

  }
}

import { ZodError } from 'zod';
import type { PageServerLoad } from './$types'; 
import { printingSchema } from './schema';
import type { PrintingFormData, UploadSchema } from './schema';
import { error, fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    
    // Reconstruct according to schema
    const pickupMode = formData.get("pickupMode");
    const pickupOther = formData.get("pickupOther");
    const files = formData.getAll("files") as File[];
    const metas = formData.getAll("meta").map((m) => JSON.parse(m.toString()));

    const uploadedImages = files.map((file, i) => ({
      file,
      ...metas[i]
    }));
    
    const combined = { // Reconstructed form data
      uploadedImages: uploadedImages,
      pickupMode: pickupMode,
      pickupOther: pickupOther
    }

    try {
      const result = printingSchema.parse(combined);
      
      console.log("success", result.uploadedImages);

      return 
    } 
    catch (error) {
      if (error instanceof ZodError) {
        const issues = Object.fromEntries(
          error.issues.map((issue) => [issue.path.join('.'), issue.message])
        );

        console.log(issues);

        return fail(400, { error: true, issues });
      }
      else 
        console.log("Error in photo printing.");
    }

  }
}

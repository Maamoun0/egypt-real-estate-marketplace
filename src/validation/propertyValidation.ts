import { z } from 'zod';

export const propertySchema = z.object({
  title_ar: z.string().min(10, "العنوان بالعربية يجب أن يكون 10 أحرف على الأقل"),
  title_en: z.string().min(10, "English title must be at least 10 characters").optional(),
  description_ar: z.string().min(20, "الوصف يجب أن يكون 20 حرفاً على الأقل"),
  description_en: z.string().optional(),
  price: z.number().positive("السعر يجب أن يكون رقماً موجباً"),
  currency: z.string().default('EGP'),
  type: z.enum(['sale', 'rent']),
  category: z.enum(['apartment', 'villa', 'land']),
  city: z.string().min(2),
  district: z.string().optional(),
  address_text: z.string().optional(),
  area_size: z.number().positive().optional(),
  rooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;

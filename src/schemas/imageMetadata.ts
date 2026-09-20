import { z } from "zod";

export const ImageMetadataSchema = z.object({
  subject: z.string(),
  category: z.string(),
  attributes: z.array(z.string()),
  caption: z.string(),
  confidence: z.number().min(0.0).max(1.0),
});

export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;

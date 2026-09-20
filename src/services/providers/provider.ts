import { type ImageMetadata } from "../../schemas/imageMetadata.js";

export abstract class MetadataProvider {
  abstract generate(imageUrl?: string): Promise<ImageMetadata>;
  abstract loadPrompt(filepath?: string, prompt?: string): void;
}

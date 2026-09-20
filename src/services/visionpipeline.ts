import { OllamaProvider } from "./providers/ollamaprovider.js";
import { GeminiProvider } from "./providers/geminiprovider.js";
import { MetadataProvider } from "./providers/provider.js";

export class VisionPipeline {
  constructor(private provider: MetadataProvider) {}

  async process(imagePath?: string) {
    return await this.provider.generate(imagePath);
  }
}

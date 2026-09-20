import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { z } from "zod";
import {
  ImageMetadataSchema,
  type ImageMetadata,
} from "../../schemas/imageMetadata.js";
import { MetadataProvider } from "./provider.js";
import { Ollama } from "ollama";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("API key loaded:", !!process.env.OLLAMA_API_KEY);

export class OllamaProvider extends MetadataProvider {
  ollamaClient: Ollama;
  prompt: string = "";

  constructor() {
    super();
    this.ollamaClient = new Ollama({
      host: "https://ollama.com",
      headers: {
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
    });
    this.loadPrompt();
  }

  loadPrompt(filepath?: string, prompt?: string): void {
    if (prompt) {
      this.prompt = prompt;
      return;
    }

    const resolved =
      filepath ??
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "prompts",
        `metadata-generation-v1.md`,
      );

    this.prompt = fs.readFileSync(resolved, "utf-8");
  }

  async generate(imagePath?: string): Promise<ImageMetadata> {
    const base64Image = fs.readFileSync(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "resources",
        "images",
        "sample",
        "image1.png",
      ),
      {
        encoding: "base64",
      },
    );

    const response = await this.ollamaClient.chat({
      model: "gemma4:31b",
      messages: [
        {
          role: "user",
          content: this.prompt,
          images: [base64Image],
        },
      ],
      format: z.toJSONSchema(ImageMetadataSchema),
    });

    const parsed = JSON.parse(response.message.content);
    const output = ImageMetadataSchema.parse(parsed);

    return output;
  }
}

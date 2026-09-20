import { GoogleGenAI } from "@google/genai";
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class GeminiProvider extends MetadataProvider {
  geminiClient: GoogleGenAI;
  prompt: string = "";

  constructor() {
    super();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    this.geminiClient = new GoogleGenAI({ apiKey: apiKey });
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

  async generate(imageUrl?: string): Promise<ImageMetadata> {
    const outputSchema = z.toJSONSchema(ImageMetadataSchema);

    const interaction = await this.geminiClient.interactions.create({
      model: "gemini-3.8-flash",
      input: [
        { type: "text", text: this.prompt },
        {
          type: "image",
          // data: base64ImageFile,
          mime_type: "image/png",
        },
      ],

      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: outputSchema,
      },
    });

    if (!interaction.output_text)
      throw new Error("output_text field is missing");

    const parsed = JSON.parse(interaction.output_text);
    const output: ImageMetadata = ImageMetadataSchema.parse(parsed);
    return output;
  }
}

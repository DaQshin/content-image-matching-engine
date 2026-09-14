import express from "express";
import type { Request, Response, Application } from "express";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

export const app: Application = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

app.get("/", async (req: Request, res: Response) => {
  const base64ImageFile = fs.readFileSync(
    path.join(__dirname, "..", "resources", "images", "sample", "image1.png"),
    {
      encoding: "base64",
    },
  );

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: [
      { type: "text", text: "Caption this image." },
      {
        type: "image",
        data: base64ImageFile,
        mime_type: "image/jpeg",
      },
    ],
  });

  res.json({
    interaction,
  });
});

app.get("/health", (req: Request, res: Response) => {
  return res.json({
    status: "ok",
  });
});

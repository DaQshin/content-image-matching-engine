import express from "express";
import type { Request, Response, Application } from "express";
import { GeminiProvider } from "./services/providers/geminiprovider.js";
import { OllamaProvider } from "./services/providers/ollamaprovider.js";
import { VisionPipeline } from "./services/visionpipeline.js";

export const app: Application = express();
app.use(express.json());

// const geminiClient = new GeminiProvider();
// const ollamaClient = new OllamaProvider();

const pipeline = new VisionPipeline(new OllamaProvider());

app.get("/", async (req: Request, res: Response) => {
  const interaction = await pipeline.process();

  res.json({
    interaction,
  });
});

app.get("/health", (req: Request, res: Response) => {
  return res.json({
    status: "ok",
  });
});

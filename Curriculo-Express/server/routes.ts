import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // API Routes (Optional for basic version, but good for saving)
  app.post(api.resumes.create.path, async (req, res) => {
    try {
      const input = api.resumes.create.input.parse(req.body);
      const resume = await storage.createResume(input);
      res.status(201).json(resume);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.resumes.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const resume = await storage.getResume(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  });

  // AI Text Improvement Endpoint
  app.post("/api/improve-text", async (req, res) => {
    try {
      const { text, context = "professional resume" } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Texto inválido" });
      }

      if (text.length === 0) {
        return res.status(400).json({ error: "O texto não pode estar vazio" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are a professional resume editor. Your task is to improve and polish text for a ${context}. 
            Keep the same meaning but make it more impactful, professional, and concise.
            Always respond in Brazilian Portuguese (pt-BR).
            Return ONLY the improved text, nothing else.`,
          },
          {
            role: "user",
            content: `Melhore este texto: "${text}"`,
          },
        ],
        max_completion_tokens: 500,
      });

      const improvedText = response.choices[0]?.message?.content?.trim() || text;

      res.json({ text: improvedText });
    } catch (error) {
      console.error("Error improving text:", error);
      res.status(500).json({ error: "Não foi possível melhorar o texto" });
    }
  });

  return httpServer;
}

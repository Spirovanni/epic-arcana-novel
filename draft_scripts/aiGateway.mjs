import "dotenv/config";
import fs from "node:fs/promises";
import OpenAI from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import fetch from "node-fetch"; // for DeepSeek / Perplexity

export const ai = {
  openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  claude: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
};


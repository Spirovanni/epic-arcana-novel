import 'dotenv/config';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

export const models = {
  openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  claude: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // DeepSeek & Perplexity below...
};

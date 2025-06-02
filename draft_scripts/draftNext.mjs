import { ai } from "./aiGateway.mjs";
import fs from "node:fs/promises";

const timeline = JSON.parse(
  await fs.readFile("lore/json/story_timeline_seed.json", "utf8")
);

const next = timeline.timeline.find(t => t.draft !== "complete");
if (!next) {
  console.log("All scenes drafted 🎉");
  process.exit(0);
}

const prompt = `Write a 1-2k-word prose draft for scene "${next.label}".`;

const gpt = await ai.openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are an epic fantasy novelist." },
    { role: "user", content: prompt }
  ]
});

const mdPath = `docs/scenes/${next.id}.md`;
await fs.writeFile(mdPath, `# ${next.label}\n\n${gpt.choices[0].message.content}`);
console.log(`Draft saved to ${mdPath}`);

/* leave timeline.json untouched—human merges after Sudowrite pass */

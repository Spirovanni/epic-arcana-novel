import { promises as fs } from 'fs';
import path from 'path';

export interface SceneImportState {
  lastProcessed?: {
    chapterId: string;
    sceneNumber: number;
  } | null;
  lastStorySequence?: number | null;
}

const STATE_PATH = path.resolve(process.cwd(), '.scene-import-state.json');

const defaultState: SceneImportState = {
  lastProcessed: null,
  lastStorySequence: null,
};

export async function loadImportState(reset = false): Promise<SceneImportState> {
  if (reset) {
    return { ...defaultState };
  }

  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      lastProcessed: parsed.lastProcessed ?? null,
      lastStorySequence: parsed.lastStorySequence ?? null,
    };
  } catch (error: unknown) {
    // If the file does not exist or is malformed, start fresh
    return { ...defaultState };
  }
}

export async function persistImportState(state: SceneImportState): Promise<void> {
  const safeState: SceneImportState = {
    lastProcessed: state.lastProcessed ?? null,
    lastStorySequence: state.lastStorySequence ?? null,
  };

  await fs.writeFile(STATE_PATH, JSON.stringify(safeState, null, 2), 'utf8');
}

export async function resetImportState(): Promise<void> {
  try {
    await fs.unlink(STATE_PATH);
  } catch (error: unknown) {
    // It's fine if the file doesn't exist yet
  }
}


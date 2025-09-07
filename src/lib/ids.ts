import { nanoid } from 'nanoid'

export function createResultId(): string {
  // Create a short, URL-safe ID
  return nanoid(8)
}

export function createResumeToken(): string {
  return nanoid(16)
}
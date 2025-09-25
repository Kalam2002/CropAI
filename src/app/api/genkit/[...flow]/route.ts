// src/app/api/genkit/[...flow]/route.ts
import { nextHandler } from '@genkit-ai/next';
import '@/ai';

// This is the correct and final syntax.
// It exposes all Genkit flows as API endpoints.
export const POST = nextHandler();
// src/app/api/genkit/[...flow]/route.ts
import { nextHandler } from '@genkit-ai/next';
import '@/ai';

export const { POST } = nextHandler();

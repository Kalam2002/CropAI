// src/app/api/genkit/[...flow]/route.ts
import {nextHandler} from '@genkit-ai/next';
import '@/ai/dev';

export const POST = nextHandler();

// src/app/api/genkit/[...flow]/route.ts
import { appRoute } from "@genkit-ai/next";

import '@/ai';
export const POST = appRoute(yourFlow);
export const GET = appRoute(yourFlow);

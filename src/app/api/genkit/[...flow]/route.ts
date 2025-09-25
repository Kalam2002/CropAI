// src/app/api/genkit/[...flow]/route.ts
import { appRoute } from "@genkit-ai/next";
import { cropAnalysis } from "@/ai/flows/crop-analysis"; // import the exported flow

export const POST = appRoute(cropAnalysis);
export const GET = appRoute(cropAnalysis);

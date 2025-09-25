// src/ai/flows/determine-crop-feasibility.ts
'use server';
/**
 * @fileOverview Determines the feasibility of growing specific crops in a given area based on environmental and economic data, as well as uploaded images.
 *
 * - determineCropFeasibility - A function that handles the crop feasibility analysis process.
 * - DetermineCropFeasibilityInput - The input type for the determineCropFeasibility function.
 * - DetermineCropFeasibilityOutput - The return type for the determineCropFeasibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineCropFeasibilityInputSchema = z.object({
  cropType: z.string().describe('The type of crop to analyze for feasibility.'),
  region: z.string().describe('The geographical region where the crop will be grown.'),
  environmentalData: z.string().describe('Environmental data for the region, such as rainfall, temperature, and soil quality.'),
  economicData: z.string().describe('Economic data relevant to crop production, such as market prices and input costs.'),
  cropImageUri: z
    .string()
    .describe(
      "A photo of the region where the crop will be grown, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetermineCropFeasibilityInput = z.infer<typeof DetermineCropFeasibilityInputSchema>;

const DetermineCropFeasibilityOutputSchema = z.object({
  feasibilityScore: z.number().describe('A numerical score indicating the feasibility of growing the specified crop in the given area.'),
  rationale: z.string().describe('An explanation of the factors contributing to the feasibility score.'),
  recommendations: z.string().describe('Recommendations for optimizing crop production in the area.'),
});
export type DetermineCropFeasibilityOutput = z.infer<typeof DetermineCropFeasibilityOutputSchema>;

export async function determineCropFeasibility(input: DetermineCropFeasibilityInput): Promise<DetermineCropFeasibilityOutput> {
  return determineCropFeasibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineCropFeasibilityPrompt',
  input: {schema: DetermineCropFeasibilityInputSchema},
  output: {schema: DetermineCropFeasibilityOutputSchema},
  prompt: `You are an agricultural expert tasked with determining the feasibility of growing a specific crop in a given region.  Use the environmental data, economic data, and image of the region to determine the feasibility.

Crop Type: {{{cropType}}}
Region: {{{region}}}
Environmental Data: {{{environmentalData}}}
Economic Data: {{{economicData}}}
Region Photo: {{media url=cropImageUri}}

Assess the feasibility of growing the specified crop in the given region, considering all available data. Provide a feasibility score, rationale, and recommendations.
`,
});

const determineCropFeasibilityFlow = ai.defineFlow(
  {
    name: 'determineCropFeasibilityFlow',
    inputSchema: DetermineCropFeasibilityInputSchema,
    outputSchema: DetermineCropFeasibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

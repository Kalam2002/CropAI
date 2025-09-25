'use server';

/**
 * @fileOverview Estimates crop yield based on crop type, region, and historical data.
 *
 * - estimateCropYield - A function that takes crop type, region, and historical data as input and returns an estimated crop yield prediction.
 * - EstimateCropYieldInput - The input type for the estimateCropYield function.
 * - EstimateCropYieldOutput - The return type for the estimateCropYield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCropYieldInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., corn, wheat, soy).'),
  region: z.string().describe('The region where the crop is grown (e.g., Iowa, Ukraine).'),
  historicalData: z
    .string()
    .describe(
      'Historical data related to crop yields, weather patterns, and other relevant factors for the specified crop and region.'
    ),
});
export type EstimateCropYieldInput = z.infer<typeof EstimateCropYieldInputSchema>;

const EstimateCropYieldOutputSchema = z.object({
  estimatedYield: z
    .string()
    .describe('The estimated crop yield prediction based on the provided inputs.'),
  confidenceLevel: z
    .string()
    .describe('The confidence level associated with the yield prediction (e.g., high, medium, low).'),
  factorsInfluencingYield: z
    .string()
    .describe('Key factors influencing the estimated crop yield, such as weather patterns or soil conditions.'),
});
export type EstimateCropYieldOutput = z.infer<typeof EstimateCropYieldOutputSchema>;

export async function estimateCropYield(input: EstimateCropYieldInput): Promise<EstimateCropYieldOutput> {
  return estimateCropYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateCropYieldPrompt',
  input: {schema: EstimateCropYieldInputSchema},
  output: {schema: EstimateCropYieldOutputSchema},
  prompt: `You are an expert agriculture consultant specializing in crop yield prediction.

You will use the following information to predict the crop yield.

Crop Type: {{{cropType}}}
Region: {{{region}}}
Historical Data: {{{historicalData}}}

Based on the provided information, estimate the crop yield, confidence level, and factors influencing yield.
`,
});

const estimateCropYieldFlow = ai.defineFlow(
  {
    name: 'estimateCropYieldFlow',
    inputSchema: EstimateCropYieldInputSchema,
    outputSchema: EstimateCropYieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

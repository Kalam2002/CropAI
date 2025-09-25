'use server';
/**
 * @fileOverview Predicts crop diseases based on an uploaded image.
 *
 * - predictCropDisease - A function that handles the crop disease prediction process.
 * - PredictCropDiseaseInput - The input type for the predictCropDisease function.
 * - PredictCropDiseaseOutput - The return type for the predictCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PredictCropDiseaseInput = z.infer<typeof PredictCropDiseaseInputSchema>;

const PredictCropDiseaseOutputSchema = z.object({
  diseasePrediction: z.string().describe('The predicted disease affecting the crop.'),
  confidenceLevel: z.number().describe('The confidence level of the prediction (0-1).'),
  suggestedActions: z.string().describe('Suggested actions to mitigate the disease.'),
});
export type PredictCropDiseaseOutput = z.infer<typeof PredictCropDiseaseOutputSchema>;

export async function predictCropDisease(input: PredictCropDiseaseInput): Promise<PredictCropDiseaseOutput> {
  return predictCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCropDiseasePrompt',
  input: {schema: PredictCropDiseaseInputSchema},
  output: {schema: PredictCropDiseaseOutputSchema},
  prompt: `You are an AI assistant specialized in predicting crop diseases based on images.

  Analyze the image of the crop and predict potential diseases affecting it. Provide a confidence level for your prediction and suggest actions to mitigate the disease.

  Here is the image of the crop:
  {{media url=photoDataUri}}

  Respond with a JSON object that can be parsed by Typescript:
  {
    diseasePrediction: string // The predicted disease affecting the crop.
    confidenceLevel: number // The confidence level of the prediction (0-1).
    suggestedActions: string // Suggested actions to mitigate the disease.
  }`,
});

const predictCropDiseaseFlow = ai.defineFlow(
  {
    name: 'predictCropDiseaseFlow',
    inputSchema: PredictCropDiseaseInputSchema,
    outputSchema: PredictCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

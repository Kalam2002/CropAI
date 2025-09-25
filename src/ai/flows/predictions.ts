'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

//                            //
//  Crop Yield Estimate Flow  //
//                            //

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

const estimateCropYieldPrompt = ai.definePrompt({
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
    const {output} = await estimateCropYieldPrompt(input);
    return output!;
  }
);

export async function estimateCropYield(input: EstimateCropYieldInput): Promise<EstimateCropYieldOutput> {
  return estimateCropYieldFlow(input);
}


//                             //
//  Disease Prediction Flow    //
//                             //

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

const predictCropDiseasePrompt = ai.definePrompt({
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
    const {output} = await predictCropDiseasePrompt(input);
    return output!;
  }
);

export async function predictCropDisease(input: PredictCropDiseaseInput): Promise<PredictCropDiseaseOutput> {
  return predictCropDiseaseFlow(input);
}

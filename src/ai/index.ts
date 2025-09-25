'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Resend} from 'resend';


//                                  //
//  Crop Feasibility Analysis Flow  //
//                                  //

const DetermineCropFeasibilityInputSchema = z.object({
  cropType: z.string().describe('The type of crop to analyze for feasibility.'),
  region: z.string().describe('The geographical region where the crop will be grown.'),
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


const WeatherDataSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in meters per second.'),
  weatherCondition: z.string().describe('A brief description of the current weather conditions (e.g., "clear sky", "light rain").'),
  sunrise: z.number().describe('The time of sunrise, as a UNIX timestamp.'),
  sunset: z.number().describe('The time of sunset, as a UNIX timestamp.'),
});

export const getWeatherDataTool = ai.defineTool(
  {
    name: 'getWeatherData',
    description: 'Get the current weather data for a specified location. This is considered the environmental data.',
    inputSchema: z.object({
      location: z.string().describe('The city name or zip code for which to get the weather data (e.g., "San Francisco", "94107").'),
    }),
    outputSchema: WeatherDataSchema,
  },
  async (input) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key is not configured.');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${input.location}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch weather data: ${errorData.message}`);
      }
      
      const data = await response.json();

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherCondition: data.weather[0]?.description || 'N/A',
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Could not retrieve weather information.');
    }
  }
);


const determineCropFeasibilityPrompt = ai.definePrompt({
  name: 'determineCropFeasibilityPrompt',
  input: {schema: DetermineCropFeasibilityInputSchema},
  output: {schema: DetermineCropFeasibilityOutputSchema},
  prompt: `You are an agricultural expert tasked with determining the feasibility of growing a specific crop in a given region.  Use the environmental data, economic data, and image of the region to determine the feasibility.

You must use the getWeatherData tool to get the environmental data for the region.

Crop Type: {{{cropType}}}
Region: {{{region}}}
Economic Data: {{{economicData}}}
Region Photo: {{media url=cropImageUri}}

Assess the feasibility of growing the specified crop in the given region, considering all available data. Provide a feasibility score, rationale, and recommendations.
`,
  tools: [getWeatherDataTool]
});

const determineCropFeasibilityFlow = ai.defineFlow(
  {
    name: 'determineCropFeasibilityFlow',
    inputSchema: DetermineCropFeasibilityInputSchema,
    outputSchema: DetermineCropFeasibilityOutputSchema,
  },
  async input => {
    const {output} = await determineCropFeasibilityPrompt(input);
    return output!;
  }
);

export async function determineCropFeasibility(input: DetermineCropFeasibilityInput): Promise<DetermineCropFeasibilityOutput> {
  return determineCropFeasibilityFlow(input);
}


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


//                         //
//  Contact Form Email Flow  //
//                         //

const SendContactEmailInputSchema = z.object({
  name: z.string().describe('Name of the person sending the message.'),
  email: z.string().email().describe('Email of the person sending the message.'),
  subject: z.string().describe('Subject of the message.'),
  message: z.string().describe('The message content.'),
});
export type SendContactEmailInput = z.infer<typeof SendContactEmailInputSchema>;

const sendContactEmailFlow = ai.defineFlow(
  {
    name: 'sendContactEmailFlow',
    inputSchema: SendContactEmailInputSchema,
    outputSchema: z.object({ success: z.boolean(), error: z.string().optional() }),
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const sendToEmail = process.env.CONTACT_FORM_SEND_TO_EMAIL;

    if (!resendApiKey) {
      console.error('Resend API key is not configured.');
      return { success: false, error: 'The server is not configured to send emails. Please contact support.' };
    }
    if (!sendToEmail) {
        console.error('CONTACT_FORM_SEND_TO_EMAIL is not configured.');
        return { success: false, error: 'The server is not configured to send emails. Please contact support.' };
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: 'KrishiMitra Contact Form <onboarding@resend.dev>',
        to: sendToEmail,
        subject: `New Contact Form Submission: ${input.subject}`,
        reply_to: input.email,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <hr />
          <h2>Message:</h2>
          <p>${input.message}</p>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: 'An unexpected error occurred while trying to send the message.' };
    }
  }
);

export async function sendContactEmail(input: SendContactEmailInput): Promise<{ success: boolean; error?: string }> {
  return sendContactEmailFlow(input);
}

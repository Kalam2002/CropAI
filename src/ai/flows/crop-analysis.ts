'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

// src/ai/tools/get-weather-data.ts
'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

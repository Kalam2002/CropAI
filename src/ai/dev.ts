import { config } from 'dotenv';
config();

import '@/ai/flows/determine-crop-feasibility.ts';
import '@/ai/flows/estimate-crop-yield.ts';
import '@/ai/flows/predict-crop-disease-from-image.ts';
import '@/ai/tools/get-weather-data';

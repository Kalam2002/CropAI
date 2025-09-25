import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import '@/ai/flows/determine-crop-feasibility.ts';
import '@/ai/flows/estimate-crop-yield.ts';
import '@/ai/flows/predict-crop-disease-from-image.ts';
import '@/ai/tools/get-weather-data';
import '@/ai/flows/send-contact-email';

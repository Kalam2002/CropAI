'use server';

// Initialize flows
import { cropAnalysis } from './flows/crop-analysis';
import { email } from './flows/email';
import { predictions } from './flows/predictions';

// Export flows for the API route
export { cropAnalysis, email, predictions };

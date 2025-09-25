'use server';

// This file is responsible for initializing and registering all AI flows.
// It is imported by the API route to make the flows available.
// It should not export anything other than what is necessary for the server.

import {ai} from '@/ai/genkit';
import './flows/crop-analysis';
import './flows/email';
import './flows/predictions';

export {
  determineCropFeasibility,
} from './flows/crop-analysis';

export {
  sendContactEmail,
} from './flows/email';

export {
  estimateCropYield,
  predictCropDisease,
} from './flows/predictions';

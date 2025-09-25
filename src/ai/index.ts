'use server';

import {ai} from '@/ai/genkit';
import './flows/crop-analysis';
import './flows/email';
import './flows/predictions';

export {
  determineCropFeasibility,
  type DetermineCropFeasibilityInput,
  type DetermineCropFeasibilityOutput,
} from './flows/crop-analysis';

export {
  sendContactEmail,
  type SendContactEmailInput,
} from './flows/email';

export {
  estimateCropYield,
  type EstimateCropYieldInput,
  type EstimateCropYieldOutput,
  predictCropDisease,
  type PredictCropDiseaseInput,
  type PredictCropDiseaseOutput,
} from './flows/predictions';

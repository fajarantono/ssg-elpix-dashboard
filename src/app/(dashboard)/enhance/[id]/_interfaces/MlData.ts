import { Main } from '@/types/main';

export interface MLModel extends Main {
  name: string;
  task: number;
  costWeight: number;
  upscaleFactor: number;
  fpsBoostFactor: number;
  priority: number;
  maxResolution: number;
  isDisabled?: boolean;
}

export interface Enhancer extends Main {
  name: string;
  description: string;
  videoUrl: string;
  task: number;
  sequenceNo: number;
  icon: string;
  isDisable: boolean;
  isActive: boolean;
  updatedAt: string; // sama seperti di atas
  mlModels: MLModel[];
}
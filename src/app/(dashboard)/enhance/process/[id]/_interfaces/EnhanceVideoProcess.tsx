import { Main } from '@/types/main';

interface PreviewVideos {
  beforeVideo: string;
  afterVideo: string;
}

interface OutputVideo extends Main {
  jobId: number;
  previewVideos: PreviewVideos;
  name: string;
  deleted: string | null;
  framerate: number;
  nFrames: number;
  bitrate: number | null;
  codecId: string | null;
  bitDepth: number | null;
  chromaSubsampling: string | null;
  colorSpace: string | null;
  size: number;
  file: string;
  thumbnail: string;
  width: number;
  height: number;
  qualityScore: number | null;
  owner: number;
}

interface InputVideo extends Main {
  name: string;
  width: number;
  height: number;
  nFrames: number;
  framerate: number;
  size: number;
  file: string;
  owner: string;
  thumbnail: string;
  externalUrl: string | null;
  bitrate: number;
  codecId: string;
  bitDepth: number;
  chromaSubsampling: string;
  colorSpace: string;
}

interface MLModel extends Main {
  name: string;
  task: number;
  costWeight: number;
  upscaleFactor: number;
  fpsBoostFactor: number;
  priority: number;
  maxResolution: number;
}

export interface EnhanceJob extends Main {
  started: string; // Bisa diubah ke Date
  preview: boolean;
  description: string;
  costUsd: string;
  status: number;
  etaS: number;
  finished: string; // Bisa diubah ke Date
  processingProgress: number;
  inputVideo: InputVideo;
  outputVideo: OutputVideo;
  mlModels: MLModel[];
  grain: number;
  codec: string;
  outputResolution: number;
  comparison: boolean;
  stabilizationSmoothing: number;
  startFrame: number;
  endFrame: number;
}

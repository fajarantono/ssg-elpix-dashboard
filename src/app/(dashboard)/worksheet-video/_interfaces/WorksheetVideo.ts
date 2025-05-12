import { Main } from '@/types/main';

export interface UploadedVideo extends Main {
  name: string;
  width: number;
  height: number;
  nFrames: number;
  framerate: number;
  size: number;
  file: string;
  owner: string;
  thumbnail: string;
  externalUrl?: string;
  bitrate: number;
  codecId: string;
  bitDepth: number;
  chromaSubsampling: string;
  colorSpace: string;
  enhance?: string;
}

export interface JobVideo extends Main {
  started: string; // ISO date string
  preview: boolean;
  description: string;
  costUsd: string;
  status: number;
  etaS: number;
  finished: string; // ISO date string
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
  externalUrl: string;
  bitrate: number;
  codecId: string;
  bitDepth: number;
  chromaSubsampling: string;
  colorSpace: string;
}

interface OutputVideo extends Main {
  jobId: number;
  previewVideos: PreviewVideos;
  name: string;
  createdAt: string;
  deleted: string;
  framerate: number;
  nFrames: number;
  bitrate: number;
  codecId: string;
  bitDepth: number;
  chromaSubsampling: string;
  colorSpace: string;
  size: number;
  file: string;
  thumbnail: string;
  width: number;
  height: number;
  qualityScore: number;
  owner: number;
}

interface PreviewVideos {
  beforeVideo: string;
  afterVideo: string;
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

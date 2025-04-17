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
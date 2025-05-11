import { Main } from "@/types/main";

export interface DownloadVideo extends Main {
  jobId: number;
  previewVideos: {
    beforeVideo: string;
    afterVideo: string;
  } | null;
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

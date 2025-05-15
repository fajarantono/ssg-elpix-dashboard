import { DownloadVideo } from '../../download-video/_interfaces/DownloadVideo';
import { UploadedVideo } from '../../worksheet-video/_interfaces/WorksheetVideo';

export interface Dashboard {
  videoCount: number;
  enhanceCount: number;
  video: UploadedVideo[];
  enhance: DownloadVideo[];
}

export interface Analytics {
  total: {
    video: number;
    enhance: number;
  };
  analytics: AnalyticsValue[];
}

export interface AnalyticsValue {
  label: string;
  video: number;
  enhance: number;
}

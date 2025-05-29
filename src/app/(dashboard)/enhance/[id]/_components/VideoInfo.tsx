import React from "react";
import Image from "next/image";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from '@/components/ui/badge/Badge';
import { ClockIcon, FilmIcon, ScanIcon } from "lucide-react";
import { duration, getVideoQuality } from "@/lib/utils";

interface UploadedVideo {
  name?: string;
  thumbnail?: string;
  nFrames?: number;
  framerate?: number;
  width?: number;
  height?: number;
  bitrate?: number;
}

interface VideoInfoProps {
  data: UploadedVideo | null;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ data }) => {
  return (
    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
      <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
        {data?.thumbnail ? (
          <Image
            src={data.thumbnail}
            alt="Video thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 480px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AvatarText name={data?.name ?? ''} />
          </div>
        )}
      </div>
  
      <div className="flex-grow">
        <div className="text-lg font-semibold text-gray-800 truncate mb-1 overflow-ellipsis dark:text-white">
          {data?.name}
        </div>
        
        <Badge size="md" color="success">Upload Complete</Badge>
  
        <div className="space-y-1 text-sm pt-2">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {duration((data?.nFrames ?? 0) / (data?.framerate ?? 0))}
            </span>
          </div>
  
          <div className="flex items-center">
            <FilmIcon className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {data?.framerate} FPS
            </span>
          </div>
  
          <div className="flex items-center">
            <ScanIcon className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {data?.width}x{data?.height}&nbsp;
              {getVideoQuality({
                width: data?.width ?? 1,
                height: data?.height ?? 1,
                bitrate: data?.bitrate,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default VideoInfo;
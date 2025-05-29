import React from "react";
import Image from "next/image";
import AvatarText from "@/components/ui/avatar/AvatarText";
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

interface VideoInfoCardProps {
  data: UploadedVideo | null;
}

const VideoInfoCard: React.FC<VideoInfoCardProps> = ({ data }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-xl flex gap-4 dark:bg-gray-800">
      <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-lg overflow-hidden">
        {data?.thumbnail ? (
          <Image
            width={480}
            height={200}
            src={data?.thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <AvatarText name={data?.name ?? ""} />
        )}
      </div>

      <div className="flex-grow">
        <div className="text-lg font-semibold text-gray-800 truncate mb-1 overflow-ellipsis dark:text-white">
          {data?.name}
        </div>

        <div className="text-blue-500 font-medium text-sm mb-3 dark:text-gray-300">
          Upload Complete
        </div>

        <div>
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

export default VideoInfoCard;
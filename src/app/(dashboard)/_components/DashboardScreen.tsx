import ComponentCard from '@/components/common/ComponentCard';
import BasicTable from '@/components/tables/BasicTable';
import { DownloadVideo } from '../download-video/_interfaces/DownloadVideo';
import { ColumnProps } from '@/types/common';
import Image from 'next/image';
import AvatarText from '@/components/ui/avatar/AvatarText';
import Link from 'next/link';
import { duration, getVideoQuality } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { EyeIcon, HardDriveDownloadIcon } from 'lucide-react';
import { UploadedVideo } from '../worksheet-video/_interfaces/WorksheetVideo';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getAllData } from '@/services/api';
import { Dashboard } from '../_interfaces/Dashboard';
import ErrorPage from '@/components/pages/ErrorPage';
import AnalyticsChart from './AnalyticsChart';
import LoadingDashboard from './LoadingDashboard';

export default function DashboardScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(`/api/v1/dashboard`);

      setData(res.data ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const ListColumnVideo: ColumnProps<UploadedVideo>[] = [
    {
      key: 'thumbnail',
      title: 'Thumbnail',
      render: (row) => (
        <div className="w-15 h-15 overflow-hidden rounded-md">
          {row.thumbnail ? (
            <Image
              width={60}
              height={60}
              src={row.thumbnail}
              alt={row.name ?? ''}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <AvatarText name={row.name ?? ''} />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      render: (row) => (
        <>
          <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
            {row.name.replace('TensorPix', 'ElpixAI')}
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            {row.owner ?? ''}
          </span>
        </>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      inlineSize: 200,
      render: (row) => (
        <div className="flex justify-center items-center w-full gap-2">
          <Button
            size="sm"
            className="text-gray-500 dark:text-gray-400 dark:hover:text-white/90 text-sm dark:bg-gray-dark"
            variant="primary"
            onClick={() => router.push(`/enhance/${row.id}`)}
          >
            Try Enhance
          </Button>
        </div>
      ),
    },
  ];

  const ListColumnEnhance: ColumnProps<DownloadVideo>[] = [
    {
      key: 'thumbnail',
      title: 'Thumbnail',
      render: (row) => (
        <div className="w-15 h-15 overflow-hidden rounded-md">
          {row.thumbnail ? (
            <Image
              width={60}
              height={60}
              src={row.thumbnail}
              alt={row.name ?? ''}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <AvatarText name={row.name ?? ''} />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      render: (row) => (
        <>
          <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
            {row.name.replace('TensorPix', 'ElpixAI')}
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            {row.owner ?? ''}
          </span>
        </>
      ),
    },
    {
      key: 'width',
      title: 'Quality',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {duration(row.nFrames / row.framerate)} | {row.name.split('.')[1]} |{' '}
          {getVideoQuality({
            width: row.width,
            height: row.height,
            bitrate: row.bitrate,
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      inlineSize: 200,
      render: (row) => {
        const child =
          row.previewVideos !== null ? (
            <Link
              href={`/download-video/preview/${row.id}`}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <EyeIcon size="20" />
            </Link>
          ) : (
            <a
              href={row.file}
              download
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HardDriveDownloadIcon size="20" />
            </a>
          );
        return (
          <div className="flex justify-center items-center w-full gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{child}</TooltipTrigger>
                <TooltipContent side="top" className="relative">
                  <div className="drop-shadow-lg whitespace-nowrap rounded-lg bg-[#1E2634] px-3 py-2 text-xs font-medium text-white">
                    {row.previewVideos !== null ? 'View' : 'Download'}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#1E2634]"></div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {isLoading && <LoadingDashboard />}
      {error && <ErrorPage />}
      {!isLoading && !error && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            <ComponentCard>
              <h4 className="text-md font-bold dark:text-gray-300">
                Upload Video
              </h4>
              <div className="flex flex-row items-end justify-between">
                <h2 className="text-2xl font-bold dark:text-white">
                  {data.videoCount}
                </h2>
                <div className="flex flex-row gap-2 items-center">
                  <span className="text-green-500 px-2 py-1 rounded-lg text-xs bg-green-100 dark:bg-green-800">
                    +200
                  </span>
                  <p className="text-gray-400 text-xs">Vs last month</p>
                </div>
              </div>
            </ComponentCard>
            <ComponentCard>
              <h4 className="text-md font-bold dark:text-gray-300">
                Enhance Video
              </h4>
              <div className="flex flex-row items-end justify-between">
                <h2 className="text-2xl font-bold dark:text-white">
                  {data.enhanceCount}
                </h2>
                <div className="flex flex-row gap-2 items-center">
                  <span className="text-green-500 px-2 py-1 rounded-lg text-xs bg-green-100 dark:bg-green-800">
                    +200
                  </span>
                  <p className="text-gray-400 text-xs">Vs last month</p>
                </div>
              </div>
            </ComponentCard>
          </div>
          <AnalyticsChart />
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <ComponentCard>
              <div className="span">
                <h4 className="text-md font-bold dark:text-gray-300">
                  Uploaded Videos
                </h4>
                <p className="text-gray-600">List update uploaded videos</p>
              </div>
              <BasicTable
                columns={ListColumnVideo}
                data={data.video}
                variant={{
                  striped: true,
                  sm: true,
                  hover: true,
                }}
              />
            </ComponentCard>
            <ComponentCard>
              <div className="span">
                <h4 className="text-md font-bold dark:text-gray-300">
                  Enhanced Videos
                </h4>
                <p className="text-gray-600">List update enhanced videos</p>
              </div>
              <BasicTable
                columns={ListColumnEnhance}
                data={data.enhance}
                variant={{
                  striped: true,
                  sm: true,
                  hover: true,
                }}
              />
            </ComponentCard>
          </div>
        </>
      )}
    </>
  );
}

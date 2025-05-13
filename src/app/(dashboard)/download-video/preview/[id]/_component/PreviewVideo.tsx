import ComponentCard from '@/components/common/ComponentCard';
import { getAllData } from '@/services/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DownloadVideo } from '../../../_interfaces/DownloadVideo';
import ErrorPage from '@/components/pages/ErrorPage';
import '../styles/styles.css';
import Button from '@/components/ui/button/Button';
import { LucideArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingForm from './LoadingForm';

export const PreviewVideo: React.FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<DownloadVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoAspect, setVideoAspect] = useState<'portrait' | 'landscape'>(
    'landscape',
  );
  const [remainingTime, setRemainingTime] = useState('00.00.00');

  const videoBeforeRef = useRef<HTMLVideoElement>(null);
  const videoAfterRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}.${m}.${s}`;
  };

  const updateProgress = useCallback(() => {
    const before = videoBeforeRef.current;
    const after = videoAfterRef.current;
    if (!before || !after) return;

    const remaining = (before.duration || 0) - before.currentTime;
    setRemainingTime(formatTime(remaining));
  }, []);

  const syncVideos = useCallback(() => {
    const before = videoBeforeRef.current;
    const after = videoAfterRef.current;
    if (!before || !after) return;

    const onTimeUpdate = () => {
      if (Math.abs(before.currentTime - after.currentTime) > 0.1) {
        after.currentTime = before.currentTime;
      }
      setCurrentTime(before.currentTime);
      updateProgress();
    };

    before.addEventListener('timeupdate', onTimeUpdate);
    return () => before.removeEventListener('timeupdate', onTimeUpdate);
  }, [updateProgress]);

  const handlePlayPause = () => {
    const before = videoBeforeRef.current;
    const after = videoAfterRef.current;
    if (!before || !after) return;

    if (before.paused) {
      before.play().catch(console.warn);
      after.play().catch(console.warn);
      setIsPlaying(true);
    } else {
      before.pause();
      after.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoBeforeRef.current && videoAfterRef.current) {
      videoBeforeRef.current.currentTime = time;
      videoAfterRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEndVideo = useCallback(() => {
    const before = videoBeforeRef.current;
    const after = videoAfterRef.current;
    if (!before || !after) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    before.addEventListener('ended', handleEnded);
    after.addEventListener('ended', handleEnded);

    return () => {
      before.removeEventListener('ended', handleEnded);
      after.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayVideo = useCallback(() => {
    const before = videoBeforeRef.current;
    const after = videoAfterRef.current;
    if (!before || !after) return;

    setDuration(before.duration);
    const onCanPlay = () => {
      before?.play().catch(console.warn);
      after?.play().catch(console.warn);
      setIsPlaying(true);
    };

    if (before && after) {
      before.addEventListener('canplay', onCanPlay);
      return () => {
        before.removeEventListener('canplay', onCanPlay);
      };
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllData(`/api/v1/enhance/video/${id}`);
      const datas: DownloadVideo = res.data;
      setData(datas);
      if (datas.height > datas.width) {
        setVideoAspect('portrait');
      } else {
        setVideoAspect('landscape');
      }
      setIsLoading(false);

      syncVideos();
      handlePlayVideo();
      handleEndVideo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [handleEndVideo, handlePlayVideo, id, syncVideos]);

  //   const loadVideoToCache = async (url: string): Promise<string> => {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     return URL.createObjectURL(blob);
  //   };

  //   useEffect(() => {
  //     const cacheVideos = async () => {
  //       if (!data?.previewVideos) return;

  //       const [beforeSrc, afterSrc] = await Promise.all([
  //         loadVideoToCache(
  //           `/api/proxy?url=${encodeURIComponent(
  //             data.previewVideos.beforeVideo,
  //           )}`,
  //         ),
  //         loadVideoToCache(
  //           `/api/proxy?url=${encodeURIComponent(data.previewVideos.afterVideo)}`,
  //         ),
  //       ]);

  //       videoBeforeRef.current!.src = beforeSrc;
  //       videoAfterRef.current!.src = afterSrc;
  //     };

  //     cacheVideos();
  //   }, [data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ComponentCard>
      <Button
        onClick={router.back}
        startIcon={<LucideArrowLeftFromLine size={30} />}
        size="xs"
        variant="none"
      >
        <h3 className="text-lg font-semibold hover:text-gray-800 hover:dark:text-white/90">
          {isLoading
            ? 'Loading Video'
            : data?.name.replace('TensorPix', 'ElpixAI')}
        </h3>
      </Button>
      {isLoading && <LoadingForm />}
      {error && <ErrorPage />}
      {!isLoading && !error && data && data.previewVideos && (
        // <div className="mx-auto p-4 bg-gray-100 rounded-xl flex">
        //   <div className="flex-shrink-0 w-full h-full bg-gray-200 rounded-lg overflow-hidden">
        <div className="relative">
          <div className={`video-wrapper ${videoAspect}`}>
            <video
              ref={videoBeforeRef}
              className="absolute w-full h-full object-cover before"
              preload="auto"
              src={data.previewVideos?.beforeVideo}
              muted
              playsInline
            />
            <video
              ref={videoAfterRef}
              className="absolute w-full h-full object-cover after"
              preload="auto"
              src={data.previewVideos?.afterVideo}
              muted
              playsInline
            />

            <div className="absolute px-[10px] py-[4px] border border-[#666] rounded-md bg-black/50 text-white font-semibold text-sm z-10 top-[10px] left-[10px]">Before</div>
            <div className="absolute px-[10px] py-[4px] border border-[#666] rounded-md bg-black/50 text-white font-semibold text-sm z-10 top-[10px] right-[10px]">After</div>

            <div
              className="handle"
              style={{ left: '50%' }}
              role="slider"
              aria-valuenow={(currentTime / duration) * 100}
              onMouseDown={(e) => {
                const wrapper = e.currentTarget.parentElement!;
                const handle = e.currentTarget;
                const afterVideo = wrapper.querySelector(
                  '.after',
                ) as HTMLElement;

                const onMouseMove = (ev: MouseEvent) => {
                  const rect = wrapper.getBoundingClientRect();
                  let x = ev.clientX - rect.left;
                  x = Math.max(0, Math.min(x, rect.width)); // clamp
                  const percent = (x / rect.width) * 100;

                  afterVideo.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
                  handle.style.left = `${percent}%`;
                };

                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
            />

            <div className="custom-controls">
              <button onClick={handlePlayPause} className="play-pause-btn">
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <input
                type="range"
                className="progress-bar"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                style={
                  {
                    '--progress': `${(currentTime / duration) * 100}%`,
                  } as React.CSSProperties
                }
              />
              <span className="duration">{remainingTime}</span>
            </div>
          </div>
        </div>
        // <div className="video-compare-container relative w-full rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        //   <div className={`video-wrapper relative w-full ${videoAspect}`}>
        //     {/* BEFORE VIDEO */}
        //     <video
        //       ref={videoBeforeRef}
        //       className="absolute top-0 left-0 w-full h-full object-cover z-0"
        //       preload="auto"
        //       src={data.previewVideos?.beforeVideo}
        //       muted
        //       playsInline
        //     />

        //     {/* AFTER VIDEO */}
        //     <video
        //       ref={videoAfterRef}
        //       className="absolute top-0 left-0 w-full h-full object-cover z-10 clip-after"
        //       preload="auto"
        //       src={data.previewVideos?.afterVideo}
        //       muted
        //       playsInline
        //     />

        //     {/* Labels */}
        //     <div className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 z-20">
        //       Before
        //     </div>
        //     <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 z-20">
        //       After
        //     </div>

        //     {/* Handle slider */}
        //     <div
        //       className="absolute top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-200 cursor-ew-resize z-30"
        //       style={{ left: '50%' }}
        //       role="slider"
        //       aria-valuenow={(currentTime / duration) * 100}
        //       onMouseDown={(e) => {
        //         const wrapper = e.currentTarget.parentElement!;
        //         const handle = e.currentTarget;
        //         const afterVideo = wrapper.querySelector(
        //           '.clip-after',
        //         ) as HTMLElement;

        //         const onMouseMove = (ev: MouseEvent) => {
        //           const rect = wrapper.getBoundingClientRect();
        //           let x = ev.clientX - rect.left;
        //           x = Math.max(0, Math.min(x, rect.width));
        //           const percent = (x / rect.width) * 100;

        //           afterVideo.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        //           handle.style.left = `${percent}%`;
        //         };

        //         const onMouseUp = () => {
        //           document.removeEventListener('mousemove', onMouseMove);
        //           document.removeEventListener('mouseup', onMouseUp);
        //         };

        //         document.addEventListener('mousemove', onMouseMove);
        //         document.addEventListener('mouseup', onMouseUp);
        //       }}
        //     />

        //     {/* Controls */}
        //     <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 px-4 py-2 flex items-center justify-between z-40">
        //       <button
        //         onClick={handlePlayPause}
        //         className="text-lg font-medium text-gray-700 dark:text-gray-100"
        //       >
        //         {isPlaying ? '⏸️' : '▶️'}
        //       </button>
        //       <input
        //         type="range"
        //         min={0}
        //         max={duration}
        //         step={0.1}
        //         value={currentTime}
        //         onChange={handleSeek}
        //         className="mx-4 flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
        //         style={
        //           {
        //             '--progress': `${(currentTime / duration) * 100}%`,
        //           } as React.CSSProperties
        //         }
        //       />
        //       <span className="text-sm text-gray-500 dark:text-gray-300">
        //         {remainingTime}
        //       </span>
        //     </div>
        //   </div>
        // </div>

        //   </div>
        // </div>
      )}
    </ComponentCard>
  );
};

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress/Progress';
import Image from 'next/image';
import { getById } from '@/services/api';
import { EnhanceJob } from '../_interfaces/EnhanceVideoProcess';
import LoadingForm from './LoadingForm';
import moment from 'moment-timezone';
import ErrorPage from '@/components/pages/ErrorPage';
import AvatarText from '@/components/ui/avatar/AvatarText';

export const EnhanceProcess: React.FunctionComponent<{
  id: number;
}> = ({ id }) => {
  const ability = useAbility();
  const router = useRouter();
  const STATUS_CHECK_INTERVAL = 5_000;

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<EnhanceJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('queue');

  const getStatus = (status: string) => {
    if (status == 'queue') return 'Dalam Antrian';
    if (status == 'failed') return 'Gagal Memproses';
    if (status == 'finish') return 'Berhasil Memproses';

    return 'Proses';
  };

  const setStatusText = (status: number) => {
    if (status === 0) setStatus('queue');
    if (status === 1) setStatus('process');
    if (status === -1 || status === -2) setStatus('failed');
  }

  const pollJobStatus = useCallback(async (id: number) => {
    try {
      while (true) {
        const res = await getById(`/api/v1/enhance`, id);
        const data: EnhanceJob | null = res.data ?? null;
  
        setData(data);
  
        if (data) {
          setIsLoading(false);
          setProgress(data.processingProgress * 100);
          setStatusText(data.status);
          if (data.status === 2) {
            setStatus('finish');
            return data;
          }
        }
        await new Promise((resolve) =>
          setTimeout(resolve, STATUS_CHECK_INTERVAL),
        );
      }
    } catch (error) {
      console.error('Error fetching job status:', error);
      return pollJobStatus(id);
    }
  }, [STATUS_CHECK_INTERVAL]);

  const getEnhanceProcess = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await pollJobStatus(id);

      router.replace(`/download-video`);

      setData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, pollJobStatus, router]);

  useEffect(() => {
    getEnhanceProcess();
  }, [getEnhanceProcess]);

  return (
    <>
      {ability.can('read', 'Worksheet') && (
        <>
          {isLoading && data ? (
            <LoadingForm />
          ) : (
            <ComponentCard className="w-full">
              <div className="flex flex-row">
                {data ? (
                  <Image
                    width={800}
                    height={600}
                    src={data.inputVideo.thumbnail}
                    alt="Video thumbnail"
                    className="w-52 h-36 object-cover rounded me-5"
                  />
                ) : (
                  <AvatarText name={'thumbnail'} />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start h-32">
                    <div className="my-auto">
                      <h3 className="font-semibold text-2xl text-gray-800">
                        {data?.inputVideo.name}
                      </h3>
                      <div className="text-md text-gray-500 flex flex-row gap-2 space-x-2 mt-1">
                        {data?.mlModels.map((model) => (
                          <div key={model.id} className="flex flex-row gap-2">
                            <Sparkles className="w-4 h-4 mt-1" />
                            <span>{model.name}</span>
                          </div>
                        ))}
                      </div>
                      <h3 className="font-semibold text-md text-blue-700 mt-1">
                        {getStatus(status)} ...{Math.round(progress)} %
                      </h3>
                    </div>
                    <Button
                      startIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                      size="sm"
                      tooltip="cancel"
                      className="py-2 px-4 rounded bg-red-50 hover:bg-red-100 transition-colors"
                    ></Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-700 mt-3">
                  {progress < 100
                    ? "We're reserving your private space on the video processing server. This can take a couple of minutes."
                    : 'Processing complete. Your video is ready.'}
                </div>
                <Progress value={progress} className="mt-2 h-2 bg-blue-200" />
                <div className="text-xs text-gray-400 mt-1">
                  Started:{' '}
                  {moment(data?.started)
                    .tz('Asia/Jakarta')
                    .format('DD MM yyyy, hh.mm z')}
                </div>
              </div>
            </ComponentCard>
          )}
          {error && <ErrorPage />}
        </>
      )}
    </>
  );
};

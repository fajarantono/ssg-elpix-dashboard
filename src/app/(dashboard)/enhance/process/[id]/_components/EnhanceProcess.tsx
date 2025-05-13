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

export const EnhanceProcess: React.FunctionComponent<{
  id: number;
}> = ({ id }) => {
  const ability = useAbility();
  const router = useRouter();
  const STATUS_CHECK_INTERVAL = 5_000;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<EnhanceJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatus = (status: number): string => {
    if (status === 0) return 'Dalam Antrian';
    if (status === 1) return 'Proses';
    if (status === -1 || status === -2) return 'Gagal Memproses';

    // status === 2
    return 'Berhasil Memproses';
  };

  const pollJobStatus = useCallback(
    async (id: number) => {
      try {
        while (true) {
          const res = await getById(`/api/v1/enhance`, id);
          const data: EnhanceJob | null = res.data ?? null;

          setData(data);

          if (data) {
            setIsLoading(false);
            if (data.status === 2) return data;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, STATUS_CHECK_INTERVAL),
          );
        }
      } catch (error) {
        console.error('Error fetching job status:', error);
        return pollJobStatus(id);
      }
    },
    [STATUS_CHECK_INTERVAL],
  );

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
          {!isLoading && data ? (
            <ComponentCard className="w-full dark:bg-gray-900 dark:border-gray-700">
              <div className="flex flex-row">
                <Image
                  width={800}
                  height={600}
                  src={data.inputVideo.thumbnail}
                  alt="Video thumbnail"
                  className="w-52 h-36 object-cover rounded me-5"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start h-32">
                    <div className="my-auto">
                      <h3 className="font-semibold text-2xl text-gray-800 dark:text-white">
                        {data.inputVideo.name}
                      </h3>
                      <div className="text-md text-gray-500 dark:text-gray-300 flex flex-row gap-2 space-x-2 mt-1">
                        {data?.mlModels.map((model) => (
                          <div key={model.id} className="flex flex-row gap-2">
                            <Sparkles className="w-4 h-4 mt-1 dark:text-yellow-300" />
                            <span>{model.name}</span>
                          </div>
                        ))}
                      </div>
                      <h3 className="font-semibold text-md text-blue-700 dark:text-blue-400 mt-1">
                        {getStatus(data.status ?? 0)} ...
                        {Math.round(data.processingProgress * 100)} %
                      </h3>
                    </div>
                    <Button
                      startIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                      size="sm"
                      tooltip="cancel"
                      className="py-2 px-4 rounded bg-red-50 hover:bg-red-100 transition-colors dark:bg-red-950 dark:hover:bg-red-900"
                    ></Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-blue-700 dark:text-blue-400 mt-3">
                  {data.processingProgress * 100 < 100
                    ? "We're reserving your private space on the video processing server. This can take a couple of minutes."
                    : 'Processing complete. Your video is ready.'}
                </div>
                <Progress
                  value={data.processingProgress * 100}
                  className="mt-2 h-2 bg-blue-200 dark:bg-blue-900"
                />
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Started:{' '}
                  {moment(data?.started)
                    .tz('Asia/Jakarta')
                    .format('DD MM yyyy, hh.mm z')}
                </div>
              </div>
            </ComponentCard>
          ) : (
            <LoadingForm />
          )}
          {error && <ErrorPage />}
        </>
      )}
    </>
  );
};

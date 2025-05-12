import ComponentCard from '@/components/common/ComponentCard';
import { Progress } from '@/components/ui/progress/Progress';
import { getAllData } from '@/services/api';
import { Sparkles } from 'lucide-react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { JobVideo } from '../_interfaces/WorksheetVideo';
import Link from 'next/link';

export default function EnhanceProcess() {
  const [data, setData] = useState<JobVideo[]>([]);

  const STATUS_CHECK_INTERVAL = 10_000;

  const pollJobStatus = useCallback(async () => {
    try {
      while (true) {
        const res = await getAllData(`/api/v1/enhance/process`);
        setData(Array.isArray(res.data) ? res.data : []);

        if (res.data.length === 0) return;

        if (res.data.length > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, STATUS_CHECK_INTERVAL),
          );
        }
      }
    } catch (error) {
      console.error('Error fetching job status:', error);
      return pollJobStatus();
    }
  }, []);

  const getStatus = (status: number): string => {
    if (status === 1) return 'Proses';
    if (status === 2) return 'Berhasil Memproses';
    if (status === -1 || status === -2) return 'Gagal Memproses';
    // status === 0
    return 'Dalam Antrian';
  };

  useEffect(() => {
    pollJobStatus();
  }, [pollJobStatus]);

  return (
    <>
      {data.length > 0 &&
        data.map((job) => (
          <Link href={`/enhance/process/${job.id}`} key={job.id}>
            <ComponentCard className="w-full my-2">
              <div>
                <div className="flex flex-row">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin me-4" />
                  <div className="row flex w-full gap-3 justify-between">
                    <div className="flex flex-col">
                      <h5 className="font-semibold text-lg text-gray-800">
                        {job?.inputVideo.name}
                      </h5>
                      <div className="text-md text-gray-500 flex flex-row gap-2 space-x-2 mt-1">
                        {job?.mlModels.map((model) => (
                          <div key={model.id} className="flex flex-row gap-2">
                            <Sparkles className="w-3 h-3 mt-0.5" />
                            <span className="text-xs">{model.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <h5 className="font-semibold text-md text-blue-700 mt-1">
                        {getStatus(job.status)} ...
                        {Math.round(job.processingProgress * 100)} %
                      </h5>
                      <div className="text-xs text-gray-400 mt-1">
                        Started:{' '}
                        {moment(job?.started)
                          .tz('Asia/Jakarta')
                          .format('DD MM yyyy, hh.mm z')}
                      </div>
                    </div>
                  </div>
                </div>
                <Progress
                  value={job.processingProgress * 100}
                  className="mt-2 h-2 bg-blue-200"
                />
              </div>
            </ComponentCard>
          </Link>
        ))}
    </>
  );
}

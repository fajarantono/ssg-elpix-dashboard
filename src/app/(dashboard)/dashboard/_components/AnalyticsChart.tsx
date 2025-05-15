import { BarChart } from '@/components/charts/BarChart';
import ComponentCard from '@/components/common/ComponentCard';
import { useCallback, useEffect, useState } from 'react';
import { Analytics, AnalyticsValue } from '../_interfaces/Dashboard';
import { getAllData } from '@/services/api';
import LoadingChart from './LoadingChart';
import ErrorPage from '@/components/pages/ErrorPage';

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export default function AnalyticsChart() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Analytics | null>(null);
  const [range, setRange] = useState<string | '7d' | '1m' | '3m' | '1y'>('1y');
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<
    { name: string; data: number[]; color: string }[]
  >([]);
  const [label, setLabel] = useState<string[]>([]);

  const ranges = [
    { label: '1 Week', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRange(val);
  };

  function transformToChartFormat(data: AnalyticsValue[]) {
    const labelSelector: string[] = [];
    const dataMap: Record<string, number[]> = {};

    data.forEach((row) => {
      labelSelector.push(row.label);

      Object.entries(row).forEach(([key, value]) => {
        if (key === 'label') return;

        if (!dataMap[key]) {
          dataMap[key] = [];
        }

        dataMap[key].push(value as number);
      });
    });

    const dataSeries = Object.entries(dataMap).map(([name, data]) => ({
      name: capitalizeWords(name),
      data,
      color: name === 'video' ? '#667085' : '#465fff',
    }));

    setLabel(labelSelector);
    setSeries(dataSeries);
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(
        `/api/v1/dashboard/analytics?range=${range}`,
      );

      const data = res.data ?? null;
      setData(data);
      if (data) transformToChartFormat(data.analytics);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {isLoading && <LoadingChart />}
      {error && <ErrorPage />}
      {!isLoading && !error && data && (
        <ComponentCard className="mb-5">
          <div className="flex flex-row items-end justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-md font-bold dark:text-gray-300">Activity</h4>
              <p className="text-gray-400 text-xs">
                Analityc activity in last month
              </p>
            </div>
            <div className="relative w-fit">
              <select
                value={range}
                onChange={handleChange}
                className="appearance-none px-4 pr-10 py-1.5 rounded-md border text-sm transition-colors
                   border-gray-300 bg-white text-gray-800
                   dark:border-gray-600 dark:bg-gray-800 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ranges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <BarChart categories={label} height={420} series={series} />
        </ComponentCard>
      )}
    </>
  );
}

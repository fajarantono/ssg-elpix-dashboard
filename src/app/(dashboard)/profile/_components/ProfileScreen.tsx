import { useCallback, useEffect, useState } from 'react';
import { getAllData } from '@/services/api';
import LoadingDashboard from '../../_components/LoadingDashboard';
import ErrorPage from '@/components/pages/ErrorPage';
import { UserMetaCard } from '@/components/user-profile/UserMetaCard';
import { Profile } from '../_interfaces/Profile';
import { UserInfoCard } from '@/components/user-profile/UserInfoCard';

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(`/api/v1/profile`);

      setData(res.data ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {isLoading && <LoadingDashboard />}
      {error && <ErrorPage />}
      {!isLoading && !error && data && (
        <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
              Profile
            </h3>
            <div className="space-y-6">
              <UserMetaCard profile={data} refresh={fetchData} />
              <UserInfoCard profile={data} refresh={fetchData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

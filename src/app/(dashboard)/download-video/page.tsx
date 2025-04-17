import { Metadata } from 'next';
import DownloadVideoPage from './DownloadVideoPage';

export const metadata: Metadata = {
  title: `Download Video - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <DownloadVideoPage />;
}

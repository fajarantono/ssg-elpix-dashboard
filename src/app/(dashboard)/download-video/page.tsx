import { Metadata } from 'next';
import DownloadVideoPage from './DownloadVideoPage';

export const metadata: Metadata = {
  title: `User - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Altavision Dashboard'}`,
};

export default function Page() {
  return <DownloadVideoPage />;
}

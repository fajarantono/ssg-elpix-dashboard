import { Metadata } from 'next';
import DownloadPreviewPage from './DownloadPreview';

export const metadata: Metadata = {
  title: `Video Preview - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <DownloadPreviewPage />;
}

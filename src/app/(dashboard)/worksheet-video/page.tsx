import { Metadata } from 'next';
import WorksheetVideoPage from './WorksheetVideoPage';

export const metadata: Metadata = {
  title: `Worksheet Video - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <WorksheetVideoPage />;
}

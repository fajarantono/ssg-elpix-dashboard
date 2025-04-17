import { Metadata } from 'next';
import EnhancePage from './EnhancePage';

export const metadata: Metadata = {
  title: `Enhance - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <EnhancePage />;
}

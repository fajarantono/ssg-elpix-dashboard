import { Metadata } from 'next';
import EnhanceProcessPage from './EnhanceProcessPage';

export const metadata: Metadata = {
  title: `Enhance Process - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <EnhanceProcessPage />;
}

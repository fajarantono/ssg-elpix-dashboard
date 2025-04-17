import { Metadata } from 'next';
import AccessPage from './AccessPage';

export const metadata: Metadata = {
  title: `Access - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <AccessPage />;
}

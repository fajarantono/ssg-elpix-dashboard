import { Metadata } from 'next';
import AccessPage from './AccessPage';

export const metadata: Metadata = {
  title: `Access - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Altavision Dashboard'}`,
};

export default function Page() {
  return <AccessPage />;
}

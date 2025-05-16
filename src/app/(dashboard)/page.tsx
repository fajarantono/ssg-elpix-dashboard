import { Metadata } from 'next';
import DashboardPage from './DashboardPage';

export const metadata: Metadata = {
  title: `Dashboard - ${
    process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'
  }`,
};

export default function Page() {
  return <DashboardPage />;
}

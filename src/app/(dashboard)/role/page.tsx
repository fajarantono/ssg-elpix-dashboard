import { Metadata } from 'next';
import RolesPage from './RolesPage';

export const metadata: Metadata = {
  title: `Role - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}`,
};

export default function Page() {
  return <RolesPage />;
}

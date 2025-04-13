import { Metadata } from 'next';
import RolesPage from './RolesPage';

export const metadata: Metadata = {
  title: `Role - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Altavision Dashboard'}`,
};

export default function Page() {
  return <RolesPage />;
}

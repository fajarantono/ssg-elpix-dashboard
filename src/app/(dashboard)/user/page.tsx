import { Metadata } from 'next';
import UserPage from './UserPage';

export const metadata: Metadata = {
  title: `User - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Altavision Dashboard'}`,
};

export default function Page() {
  return <UserPage />;
}

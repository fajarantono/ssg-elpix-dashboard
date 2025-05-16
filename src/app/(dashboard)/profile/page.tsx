import { Metadata } from 'next';
import ProfilePage from './ProfilePage';

export const metadata: Metadata = {
  title: `Profile - ${
    process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'
  }`,
};

export default function Page() {
  return <ProfilePage />;
}

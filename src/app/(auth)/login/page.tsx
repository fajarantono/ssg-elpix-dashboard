import { Metadata } from 'next';
import LoginPage from './LoginPage';

export const metadata: Metadata = {
  title: `Login - ${
    process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Altavision Dashboard'
  }`,
};

export default function Page() {
  return <LoginPage />;
}

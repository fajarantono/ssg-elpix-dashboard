import { Metadata } from 'next';
import MenusPage from './MenusPage';

export const metadata: Metadata = {
  title: `Menu - ${process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Altavision Dashboard'}`,
};

export default function Page() {
  return <MenusPage />;
}

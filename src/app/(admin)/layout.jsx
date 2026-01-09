import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Container } from 'react-bootstrap';

import TopNavigationBar from '@/components/layout/TopNavigationBar/page';

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

const VerticalNavigationBar = dynamic(
  () => import('@/components/layout/VerticalNavigationBar/page'),
  { ssr: false }
);

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signup');
  }

  if (session.user?.role !== 'ADMIN') {
    redirect('/no-access');
  }

  return (
    <div className="wrapper theme-dark" data-bs-theme="dark">
      <TopNavigationBar />

      <Suspense fallback={null}>
        <VerticalNavigationBar />
      </Suspense>

      <div className="page-content">
        <Container fluid>{children}</Container>
        <Footer />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Revsense Dashboard',
};
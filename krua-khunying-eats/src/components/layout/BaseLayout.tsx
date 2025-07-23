import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import SecretAdminButton from '@/components/admin/SecretAdminButton';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
      <SecretAdminButton />
    </div>
  );
};

export default BaseLayout;
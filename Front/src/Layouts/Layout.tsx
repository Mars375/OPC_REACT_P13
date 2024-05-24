import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, backgroundColor }) => {
  return (
    <>
      <Header />
      <main
        className={`flex flex-1 flex-col ${backgroundColor ? backgroundColor : ''}`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;

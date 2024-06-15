import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * LayoutProps interface defines the props for the Layout component.
 * @property {ReactNode} children - The content to be displayed within the layout.
 * @property {string} [backgroundColor] - Optional background color for the main content area.
 */
interface LayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

/**
 * Layout component provides a common structure for pages with a header, main content area, and footer.
 * It optionally accepts a background color for the main content area.
 *
 * @component
 * @example
 * return (
 *   <Layout backgroundColor="bg-gray-100">
 *     <div>Your content here</div>
 *   </Layout>
 * )
 */
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

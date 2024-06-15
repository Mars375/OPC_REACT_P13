import React from 'react';

/**
 * Footer component displays the footer section of the application.
 * It includes a copyright notice.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 */
const Footer: React.FC = () => {
  return (
    <footer className="flex justify-center border-t-2 border-gray-300 py-8">
      <p className="text-gray-600">Copyright 2020 Argent Bank</p>
    </footer>
  );
};

export default Footer;

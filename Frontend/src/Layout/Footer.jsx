import React from 'react';
import { useLocation } from 'react-router-dom';
function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation()
 
 if(location.pathname !== '/search')
  return (
      <footer className="bg-white border-t border-gray-200">
        <div className="border-t border-gray-200 py-2">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} HamroPasal. All rights reserved.
          </p>
        </div>
      </footer>
    );

  }

export default Footer;
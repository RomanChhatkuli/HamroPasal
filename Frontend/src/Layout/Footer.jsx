import React from 'react';
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="border-t border-gray-200 py-3">
        <p className="text-center text-sm text-gray-500">
          © {currentYear} HamroPasal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
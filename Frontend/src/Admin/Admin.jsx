import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Components/AdminSidebar';
import AdminHeader from './Components/AdminHeader';
import { Toaster } from 'react-hot-toast';

function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster />
      <div className=''>
      <AdminSidebar />
      </div>
      <div className="flex-1">
        <AdminHeader />
        <main className='p-4' >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin
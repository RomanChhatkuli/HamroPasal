import { Link, Outlet, useLocation } from 'react-router-dom';
import { User, ShoppingBag, LogOut, MapPinHouse } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

function Dashboard() {
  const { user, logout } = useUserStore();
  const location = useLocation()

  return (
    <div className="bg-gray-100 flex max-h-[82vh]">
      {/* Sidebar - Fixed on lg screens */}
      <aside className="hidden lg:flex flex-col w-96 bg-white border-r rounded-lg border-gray-200 h-[78vh] p-5 fixed top-24 left-0">
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {/* Individual menu items */}
          <Link
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${
              location.pathname === '/dashboard/profile'
              ? 'bg-gray-100 text-gray-900'
              : 'hover:bg-gray-50 text-gray-600'
            }`}
            to={'/dashboard/profile'}
            >
            <User className="w-6 h-6" />
            <span className="font-medium">Manage My Account</span>
          </Link>

          <Link
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${
                location.pathname === '/dashboard/order'
                ? 'bg-gray-100 text-gray-900'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            to={'/dashboard/order'}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="font-medium">My Orders</span>
          </Link>

          <Link
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${
                location.pathname === '/dashboard/address'
                ? 'bg-gray-100 text-gray-900'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            to={'/dashboard/address'}
          >
            <MapPinHouse className="w-6 h-6" />
            <span className="font-medium">My Address</span>
          </Link>

          <button
            className="flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
            onClick={() => {
              logout()
            }}
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Log out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-96 lg:px-4 p-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;

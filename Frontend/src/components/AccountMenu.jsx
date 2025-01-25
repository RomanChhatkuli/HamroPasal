import {
    User,
    ShoppingBag,
    LogOut,
    UserRoundCog
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';
import { Link } from 'react-router-dom';

function AccountMenu() {
    const { logout, setIsMenu } = useUserStore()
    return (
        <div className="absolute top-full left-0 w-64 mt-2 bg-white rounded-lg shadow-lg py-2 z-50 overflow-y-auto" >
            {/* Manage My Account */}
            <Link
                to={'/dashboard/profile'}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                onClick={() => {
                    setIsMenu()
                }}
            >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Manage My Account</span>
            </Link>

            {/* My Orders */}
            <Link
                to={'/dashboard/order'}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                onClick={() => {
                    setIsMenu()
                }}
            >
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">My Orders</span>
            </Link>

            {/* Admin */}
            <Link
                to={'/admin/dashboard'}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                onClick={() => {
                    setIsMenu()
                }}
            >
                <UserRoundCog className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Admin Panel</span>
            </Link>

            {/* Log Out */}
            <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                onClick={() => {
                    logout()
                    setIsMenu()
                    window.history.back();
                }}
            >
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Log out</span>
            </button>
        </div>
    );
}

export default AccountMenu;

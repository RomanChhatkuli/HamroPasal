import React, { useEffect } from 'react';
import {
    User,
    ShoppingBag,
    LogOut,
    Menu,
    X,
    UserRoundCog
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';
import { Link } from 'react-router-dom';

function MobileAccountMenu() {
    const { isMobileMenu, setIsMobileMenu, user, logout } = useUserStore();

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenu]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <span className="flex text-2xl">
                            <p className='blue-gradient_text font-bold'>Hamro</p>
                            <p className='text-yellow-500 font-semibold'>Pasal</p>
                        </span>
                        <button
                            onClick={() => setIsMobileMenu()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={isMobileMenu ? 'Close menu' : 'Open menu'}
                        >
                            {isMobileMenu ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Full Page Menu */}
            <div className={`fixed inset-0 bg-white z-30 transform transition-transform duration-300 pt-16 ${isMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.avatar ? (<img src={user.avatar} alt="userAvatar" className="rounded-full object-contain text-gray-500" />) : (<User className="w-8 h-8 text-gray-500" />)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="space-y-2">
                        {/* Manage My Account */}
                        <Link
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                            onClick={() => {
                                setIsMobileMenu();
                                // Handle "Manage My Account" action
                            }}
                            to={'/dashboard/profile'}
                        >
                            <User className="w-6 h-6 text-gray-600" />
                            <span className="text-gray-700 text-lg font-medium">Manage My Account</span>
                        </Link>

                        {/* Admin */}
                        <Link
                            to={'/admin/dashboard'}
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                            onClick={() => {
                                setIsMobileMenu()
                            }}
                        >
                            <UserRoundCog className="w-6 h-6 text-gray-600" />
                            <span className="text-gray-700 text-lg font-medium">Admin Panel</span>
                        </Link>

                        {/* My Orders */}
                        <Link
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                            onClick={() => {
                                setIsMobileMenu();
                                // Handle "My Orders" action
                            }}
                            to={'/dashboard/order'}
                        >
                            <ShoppingBag className="w-6 h-6 text-gray-600" />
                            <span className="text-gray-700 text-lg font-medium">My Orders</span>
                        </Link>

                        {/* Log Out */}
                        <button
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                            onClick={() => {
                                logout()
                                setIsMobileMenu();
                            }}
                        >
                            <LogOut className="w-6 h-6 text-gray-600" />
                            <span className="text-gray-700 text-lg font-medium">Log out</span>
                        </button>
                    </nav>

                    {/* Version Info */}
                    <div className="absolute bottom-8 left-4 right-4 text-center text-gray-400">
                        <p>Version 1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileAccountMenu;

import React, { useState } from 'react';
import { Lock, X, Loader } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';
import toast from 'react-hot-toast';

function ResetPassword() {
  const { setIsResetPassword, loading,resetPassword } = useUserStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      return toast.error('Both fields are required.');
    }
    
    if (password !== confirmPassword) {
        return toast.error('Passwords do not match.');
    }
    
    if (password.length < 6) {
        return toast.error('Password must be at least 6 characters long.');
    }

    resetPassword(password);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl"
          style={{ transform: 'scale(1)', transition: 'transform 0.2s ease-out' }}
        >
          <div className="relative p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h2>
            <button
              onClick={() => 
                setIsResetPassword(false)
              }
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Lock size={20} className="text-gray-500 mr-2" />
              <p className="text-gray-700">Enter your new password</p>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="New Password"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Confirm Password"
            />


            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-4 w-full p-3 rounded-lg text-white font-semibold ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

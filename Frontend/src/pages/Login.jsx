import React, { useState } from 'react';
import { Mail, Lock, User, X, Eye, EyeOff, Loader } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';

function Login() {
  const {login,setIsLogin, setIsSignup,loading,setIsForgotPassword} = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData)
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            <h2 className="text-2xl font-bold text-gray-800 text-center">Login to Your Account</h2>
            <button
              onClick={() => setIsLogin(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
            className="w-full flex justify-end pr-4 font-medium text-blue-600 hover:text-blue-500"
            onClick={() => {
              setIsForgotPassword(true)
              setIsLogin(false)
            }}
            type='button'
            >Forget Password ?</button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              {loading ? (
                <Loader className='flex justify-center items-center w-full animate-spin'/>
              ) : "Login"}
            </button>
          </form>

          <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsSignup(true)
                  setIsLogin(false)
                }}
                className="font-medium text-blue-600 hover:text-blue-500">
                Signup
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
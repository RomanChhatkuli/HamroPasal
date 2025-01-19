import React, { useState } from 'react';
import { Mail, X, Loader, ArrowLeft } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';
import toast from 'react-hot-toast';

function OTPVerification() {
  const { setIsOTP, loading,setIsForgotPassword,OTPVerify } = useUserStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleInputChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullOtp = otp.join('');
    if(fullOtp.length != 6){
        return toast.error("Enter the complete OTP ")
    }
    OTPVerify(fullOtp)
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
            <h2 className="text-2xl font-bold text-gray-800 text-center">Verify OTP</h2>
            <button
              onClick={() => setIsOTP(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => 
              {
                  setIsOTP(false)
                  setIsForgotPassword(true)
                }
            }
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Mail size={20} className="text-gray-500 mr-2" />
              <p className="text-gray-700">Enter the OTP sent to your email</p>
            </div>

            <div className="flex justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  maxLength={1}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-4 w-full p-3 rounded-lg text-white font-semibold ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;

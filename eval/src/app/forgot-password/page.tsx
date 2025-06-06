'use client';
//src/app/forgot-password/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    if (!username) {
      toast.error('Enter your email/username');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('OTP sent to your email');
        setOtpSent(true);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Error sending OTP');
      console.error(err);
    }
  };

  const resetPassword = async () => {
    if (!username || !otp || !newPassword) {
      toast.error('Fill all fields');
      return;
    }

    const response = await fetch('http://localhost:5000/api/users/reset-password-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, otp, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Password reset successful');
      router.push('/login');
    } else {
      toast.error(data.message || 'Reset failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#10074e] to-[#1E3C72]">
      <div className="bg-[#EDEDF3] p-6 rounded w-80 text-center">
        <h2 className="text-lg font-semibold text-[#f7b636]">Forgot Password</h2>
        <input
          type="text"
          placeholder="Email/Username"
          className="w-full p-2 my-2 border border-gray-400 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="bg-[#1e3c72] text-white px-4 py-2 rounded w-full mt-2"
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 my-2 border border-gray-400 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 my-2 border border-gray-400 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              className="bg-[#1e3c72] text-white px-4 py-2 rounded w-full mt-2"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

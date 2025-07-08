//UEPFINAL/src/app/login/page.tsx
'use client';

import toast from 'react-hot-toast';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username || !role) {
      toast.error('Please enter username and select role');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (data.requiresPasswordSetup) {
        toast('🔐 Please set your password');
        router.push(`/set-password?user=${encodeURIComponent(username)}`);
        return;
      }

      if (response.ok) {
        toast.success('Login successful!');
        localStorage.setItem('user', JSON.stringify(data.user));

        if (role === 'Admin') {
          router.push(`/admin/`);
        } else if (role === 'Dean') {
          router.push(`/dashboard/${username}`);
        } else {
          toast.error('Unknown role');
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Error connecting to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#10074e] to-[#1E3C72] text-blue-900">
      <div className="bg-[#EDEDF3] rounded-lg p-6 text-center w-80">
        <Image
          src="/images/logo1.jpg"
          alt="Logo"
          width={300}
          height={200}
          className="max-h-[85px] w-auto mx-auto"
        />
        <h2 className="text-[#f7b636] my-2 text-base font-semibold">
          UNIVERSITY EVALUATION PORTAL
        </h2>

        <form onSubmit={handleLogin}>
          <div className="my-5 space-y-2 text-left text-gray-800 text-sm flex gap-4">
            <label className="block">
              <input
                type="radio"
                name="evaluation"
                value="Dean"
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <span className="text-xs">Dean</span>
            </label>
            <label className="block">
              <input
                type="radio"
                name="evaluation"
                value="Admin"
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <span className="text-xs">Admin</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 my-2 border border-gray-400 rounded placeholder:text-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 my-2 border border-gray-400 rounded placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link
            href="/forgot-password"
            className="block text-right text-xs text-gray-500 hover:underline"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className={`bg-[#1e3c72] hover:bg-[#4c4d85] text-white p-2 rounded w-full mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

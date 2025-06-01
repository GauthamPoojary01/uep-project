'use client';

import { useState } from 'react';

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    school: '',
  });

  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setPopupMessage('✅ User added successfully.');
        setFormData({ email: '', name: '', password: '', school: '' });
      } else {
        setPopupMessage('❌ Failed to add user.');
      }
    } catch (err) {
      console.error(err);
      setPopupMessage('❌ Server error while adding user.');
    }

    setTimeout(() => setPopupMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-blue-50 rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-blue-900 text-center">Add User</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-1">
              Email/Username
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-800 mb-1">
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-blue-800 mb-1">
              Department
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              placeholder="School of Science/Engineering/etc."
              className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-blue-900 font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition"
            >
              Add User
            </button>
          </div>
        </form>

        {/* Popup Message */}
        {popupMessage && (
          <div className="text-center mt-4 bg-yellow-100 border border-yellow-300 text-yellow-900 py-2 px-4 rounded-lg font-medium">
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
}
//UEPFINAL/eval/src/app/addUser/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    school: '',
    role: '',
  });

  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [unassignedSchools, setUnassignedSchools] = useState<{ school_id: number; school_name: string }[]>([]);

  useEffect(() => {
    if (formData.role === 'Dean') {
      fetch('http://localhost:5000/api/users/unassigned-schools')
        .then(res => res.json())
        .then(data => setUnassignedSchools(data))
        .catch(err => console.error('Failed to fetch schools', err));
    }
  }, [formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      school: formData.role === 'Admin' ? 'Administration' : formData.school,
    };

    try {
      const res = await fetch('http://localhost:5000/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();

      if (res.ok) {
        setPopupMessage('✅ User added successfully.');
      } else {
        setPopupMessage(`❌ ${result.error || 'Failed to add user.'}`);
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
              className="w-full px-4 py-2 border border-blue-200 rounded-md"
            />
          </div>

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
              className="w-full px-4 py-2 border border-blue-200 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-blue-800 mb-1">Role</label>
            <label className="block">
              <input
                type="radio"
                name="role"
                value="Dean"
                onChange={handleChange}
                className="mr-2"
                checked={formData.role === 'Dean'}
              />
              <span className="text-xs">Dean</span>
            </label>
            <label className="block">
              <input
                type="radio"
                name="role"
                value="Admin"
                onChange={handleChange}
                className="mr-2"
                checked={formData.role === 'Admin'}
              />
              <span className="text-xs">Admin</span>
            </label>
          </div>

          {formData.role === 'Dean' && (
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-blue-800 mb-1">
                Assign School (Unassigned only)
              </label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-md"
              >
                <option value="" disabled>Select school</option>
                {unassignedSchools.map(school => (
                  <option key={school.school_id} value={school.school_name}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-blue-900 font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition"
            >
              Add User
            </button>
          </div>
        </form>

        {popupMessage && (
          <div className="text-center mt-4 bg-yellow-100 border border-yellow-300 text-yellow-900 py-2 px-4 rounded-lg font-medium">
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  schoolName: string;
}

export default function EditUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // Fetch user data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/users'); // Replace with your actual endpoint
        const data = await res.json();
        setUsers(data);
        setOriginalUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (id: number, field: keyof User, value: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, [field]: value } : user
      )
    );
  };

  const hasChanges = JSON.stringify(users) !== JSON.stringify(originalUsers);

  const handleSave = async () => {
    if (!hasChanges) {
      setPopupMessage('ℹ No changes were made.');
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setOriginalUsers(updatedData);
        setUsers(updatedData);
        setPopupMessage('✅ Changes saved successfully.');
      } else {
        setPopupMessage('❌ Failed to save changes.');
      }
    } catch (error) {
      console.error(error);
      setPopupMessage('❌ Error saving changes.');
    }

    setTimeout(() => setPopupMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto bg-blue-50 shadow-lg rounded-xl p-4 border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Edit User Information</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-blue-300 rounded-md">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Password</th>
                <th className="px-4 py-2 border">School Name</th>
              </tr>
            </thead>
            <tbody className="bg-white text-blue-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-yellow-50">
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={user.name}
                      onChange={e => handleInputChange(user.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={user.username}
                      onChange={e => handleInputChange(user.id, 'username', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={user.password}
                      onChange={e => handleInputChange(user.id, 'password', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={user.schoolName}
                      onChange={e => handleInputChange(user.id, 'schoolName', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {popupMessage && (
          <div className="mt-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-900 font-medium py-2 px-4 rounded-lg">
            {popupMessage}
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-2 px-6 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
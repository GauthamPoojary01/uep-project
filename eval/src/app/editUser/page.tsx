//eval/src/app/editUser/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface User {
  username: string;
  role: string;
  name: string;
  department: string;
}

export default function EditUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/get');
        const data = await res.json();
        const sanitized = data.map((user: User) => ({
          username: user.username,
          role: user.role,
          name: user.name,
          department: user.department,
        }));
        setUsers(sanitized);
        setOriginalUsers(sanitized);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (username: string, field: keyof User, value: string) => {
    const updatedUsers = users.map(user => {
      if (user.username === username) {
        let updatedUser = { ...user, [field]: value };
        if (field === 'role') {
          const roleLower = value.toLowerCase();
          if (roleLower === 'admin') {
            updatedUser.department = 'administration';
          } else if (roleLower !== 'dean') {
            setPopupMessage("Role must be either 'Dean' or 'Admin'");
            setTimeout(() => setPopupMessage(null), 3000);
            return user;
          }
        }
        if (field === 'username' && !/\S+@\S+\.\S+/.test(value)) {
          setPopupMessage("Username must be a valid email address.");
          setTimeout(() => setPopupMessage(null), 3000);
          return user;
        }
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const hasChanges = JSON.stringify(users) !== JSON.stringify(originalUsers);

  const handleSave = async () => {
    if (!hasChanges) {
      setPopupMessage('No changes were made.');
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    if (!users.every(user => ['admin', 'dean'].includes(user.role.toLowerCase()))) {
      setPopupMessage("Roles must be either 'Dean' or 'Admin'.");
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    if (!users.every(user => /\S+@\S+\.\S+/.test(user.username))) {
      setPopupMessage("All usernames must be valid email addresses.");
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });

      if (res.ok) {
        const updatedData = await res.json();
        const sanitizedData = updatedData.map((user: User) => ({
          username: user.username ?? '',
          name: user.name ?? '',
          role: user.role ?? '',
          department: user.department ?? '',
        }));
        setOriginalUsers(sanitizedData);
        setUsers(sanitizedData);
        setPopupMessage('Changes saved successfully.');
      } else {
        setPopupMessage('Failed to save changes.');
      }
    } catch (error) {
      console.error(error);
      setPopupMessage('Error saving changes.');
    }
    setTimeout(() => setPopupMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto bg-blue-50 shadow-lg rounded-xl p-4 border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Edit User Information</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-blue-300 rounded-md">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Username (Email)</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">School</th>
              </tr>
            </thead>
            <tbody className="bg-white text-blue-800">
              {users.map(user => (
                <tr key={user.username} className="hover:bg-yellow-50">
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={user.name}
                      onChange={e => handleInputChange(user.username, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="email"
                      value={user.username}
                      onChange={e => handleInputChange(user.username, 'username', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={user.role.toLowerCase()}
                      onChange={e => handleInputChange(user.username, 'role', e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="dean">Dean</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={user.department}
                      onChange={e =>
                        user.role.toLowerCase() !== 'admin'
                          ? handleInputChange(user.username, 'department', e.target.value)
                          : null
                      }
                      readOnly={user.role.toLowerCase() === 'admin'}
                      className={`w-full ${
                        user.role.toLowerCase() === 'admin' ? 'bg-gray-100 text-gray-500' : 'bg-transparent'
                      } border-none focus:outline-none`}
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

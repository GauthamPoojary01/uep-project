'use client';
// src/app/removeUser/page.tsx

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Ideally avoid this in UI
  school: string;
}

export default function RemoveUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [toDelete, setToDelete] = useState<Set<string>>(new Set());
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const toggleDelete = (userId: string) => {
    setToDelete(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      return newSet;
    });
  };

  const handleSave = async () => {
    if (toDelete.size === 0) {
      setPopupMessage('No users selected for deletion.');
      return;
    }

    try {
      const results = await Promise.all(
        Array.from(toDelete).map(id =>
          fetch(`/api/users/remove/${id}`, { method: 'DELETE' }) // use relative URL or environment variable
        )
      );

      const anyFailed = results.some(res => !res.ok);

      if (anyFailed) throw new Error('One or more deletions failed.');

      setUsers(users.filter(user => !toDelete.has(user.id)));
      setToDelete(new Set());
      setPopupMessage('Selected users have been deleted.');
    } catch (error) {
      console.error('Error deleting users:', error);
      setPopupMessage('An error occurred while deleting users.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Remove User</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg border border-blue-100">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Delete</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              {/* Remove password for security */}
              {/* <th className="px-4 py-3 text-left">Password</th> */}
              <th className="px-4 py-3 text-left">School</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-t hover:bg-blue-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={toDelete.has(user.id)}
                      onChange={() => toggleDelete(user.id)}
                      className="accent-yellow-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-blue-900">{user.name}</td>
                  <td className="px-4 py-2 text-blue-900">{user.email}</td>
                  {/* <td className="px-4 py-2 text-blue-900">{user.password}</td> */}
                  <td className="px-4 py-2 text-blue-900">{user.school}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition"
      >
        Save Changes
      </button>

      {popupMessage && (
        <div className="mt-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-900 py-2 px-4 rounded-lg">
          {popupMessage}
        </div>
      )}
    </div>
  );
}

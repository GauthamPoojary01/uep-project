'use client';
//eval/src/app/addSchools/page.tsx

import { useState, useEffect } from "react";

const SchoolsPage = () => {
  const [schoolName, setSchoolName] = useState('');
  const [message, setMessage] = useState('');
  const [existingSchools, setExistingSchools] = useState<{ sid: number; school_name: string }[]>([]);

  const addSchool = async () => {
    if (!schoolName.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/schools/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_name: schoolName })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ School added successfully');
        setSchoolName('');
        fetchExistingSchools();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error adding school');
    }
  };

  const deleteSchool = async (sid: number) => {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/schools/delete/${sid}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ School deleted successfully');
        fetchExistingSchools();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error deleting school');
    }
  };

  const fetchExistingSchools = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schools/metadata');
      const data = await res.json();
      setExistingSchools(data);
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  useEffect(() => {
    fetchExistingSchools();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add School</h1>
      <input
        type="text"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder="Enter school name"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <button
        onClick={addSchool}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}

      <h2 className="mt-6 text-lg font-semibold">All Existing Schools</h2>
      <ul className="text-sm text-gray-700 mt-2 space-y-2">
        {existingSchools.length === 0 ? (
          <li>No schools found.</li>
        ) : (
          existingSchools.map((school) => (
            <li key={school.sid} className="flex justify-between items-center">
              <span>{school.school_name}</span>
              <button
                onClick={() => deleteSchool(school.sid)}
                className="text-red-600 text-xs hover:underline"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SchoolsPage;

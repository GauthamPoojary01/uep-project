'use client';

import { useState, useEffect } from "react";

const SchoolsPage = () => {
  const [schoolName, setSchoolName] = useState('');
  const [message, setMessage] = useState('');
  const [existingSchools, setExistingSchools] = useState<{ school_name: string }[]>([]);

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

  const fetchExistingSchools = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/schools');
      const data = await res.json();
      console.log("Fetched schools:", data);
      setExistingSchools(data);
    } catch (err) {
      console.error('Error fetching existing schools:', err);
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

      <h2 className="mt-6 text-lg font-semibold">Existing Schools Assigned to Deans</h2>
      <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
        {existingSchools.length === 0 ? (
          <li>No schools assigned yet.</li>
        ) : (
          existingSchools.map((school, idx) => (
            <li key={idx}>{school.school_name}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SchoolsPage;

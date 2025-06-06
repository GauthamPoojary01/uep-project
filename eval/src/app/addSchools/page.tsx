// src/app/addSchools/page.tsx
'use client';

import { useState } from "react";

const SchoolsPage = () => {
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [newSchool, setNewSchool] = useState("");
  const [lastId, setLastId] = useState(0);

  const addSchool = () => {
    if (newSchool.trim()) {
      const nextId = lastId + 1;
      setSchools([...schools, { id: nextId, name: newSchool }]);
      setLastId(nextId);
      setNewSchool("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Schools / Departments</h1>

      <div className="mb-4 flex gap-2">
        <input
          value={newSchool}
          onChange={(e) => setNewSchool(e.target.value)}
          placeholder="New school name"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addSchool}
          className="bg-[#f7b636] text-white px-4 py-2 rounded hover:bg-[#e0a72d]"
        >
          Add
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              <td className="border px-4 py-2">{school.id}</td>
              <td className="border px-4 py-2">{school.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolsPage;
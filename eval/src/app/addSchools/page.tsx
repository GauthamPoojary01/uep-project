'use client';
//src/app/addSchools/page.tsx

import { useParams } from "next/navigation";
import Headings from "@/components/heading";
import Aside from "@/components/bside";
import Link from "next/link";

import { useState } from "react";


export default function AdminDashboard() {
  const { username } = useParams();

const SchoolsPage = () => {
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [newSchool, setNewSchool] = useState("");
  const [lastId, setLastId] = useState(0);

  const addSchool = async () => {
    if (!newSchool.trim()) return;

    try {
      const sid = lastId + 1;
      const res = await fetch('http://localhost:5000/schools/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sid,
          school_name: newSchool,
          no_of_faculties: 0,
          current_year: new Date().getFullYear()
        }),
      });

      if (res.ok) {
        setSchools([...schools, { id: sid, name: newSchool }]);
        setLastId(sid);
        setNewSchool('');
      } else {
        alert('Failed to add school');
      }
    } catch (err) {
      console.error('Error adding school', err);
      alert('Server error');
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
};

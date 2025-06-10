// Updated: eval/src/app/admin/page.tsx
'use client';

import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Bside from '@/components/bside';

interface School {
  school_name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schools/get-all');
        const data = await res.json();

        if (Array.isArray(data)) {
          setSchools(data);
        } else {
          console.error('Unexpected response format:', data);
          setSchools([]);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return (
    <div className="bg-[#1e3c72] p-5 font-sans text-white">
      <Head>
        <title>University Evaluation Portal</title>
      </Head>

      <main className="flex gap-4 justify-center min-h-[90vh]">
        <Bside />

        <div className="flex-[2] bg-[#EDEDF3] rounded-lg p-5 text-black">
          <h3 className="text-2xl text-[#30579f] font-bold mb-5 text-center">
            Select from schools
          </h3>

          {loading ? (
            <p className="text-center">Loading schools...</p>
          ) : schools.length === 0 ? (
            <p className="text-center text-gray-500">No schools found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {schools.map((school, index) => (
                <button
                  key={index}
                  className="bg-[#30579f] text-white rounded-lg px-4 py-2 flex justify-between items-center hover:bg-[#244a7a] transition"
                  onClick={() => router.push(`/admin/${encodeURIComponent(school.school_name)}`)}
                >
                  <span>{school.school_name}</span>
                  <span className="underline text-sm cursor-pointer">Click to Open</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

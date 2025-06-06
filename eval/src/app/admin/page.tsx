//eval/src/app/admin/page.tsx
'use client';

import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Bside from '@/components/bside';

export default function AdminDashboard() {
  const router = useRouter();

  const schools = [
    'SCHOOL OF LIFE SCIENCES',
    'SCHOOL OF ARTS AND HUMANITIES',
    'SCHOOL OF INFORMATION SCIENCE AND TECHNOLOGY',
    'SCHOOL OF PHYSICAL SCIENCES',
    'SCHOOL OF COMMERCE , FINANCE AND ACCOUNTANCY',
    'SCHOOL OF BUSINESS AND MANAGEMENT',
    'SCHOOL OF VOCATIONAL STUDIES',
    'SCHOOL OF LANGUAGES AND CULTURAL STUDIES',
  ];

  return (
    <div className=" bg-[#1e3c72] p-5 font-sans text-white">
      <Head>
        <title>University Evaluation Portal</title>
      </Head>

      <main className="flex gap-4 justify-center min-h-[90vh]">
        <Bside />

        {/* Right Panel */}
        <div className="flex-[2] bg-[#EDEDF3] rounded-lg p-5  text-black">
          <h3 className="text-2xl text-[#30579f] font-bold mb-5 text-center">
            Select from schools
          </h3>
          <div className="flex flex-col gap-4">
            {schools.map((school, index) => (
              <button
                key={index}
                className="bg-[#30579f] text-white rounded-lg px-4 py-2 flex justify-between items-center hover:bg-[#244a7a] transition"
                onClick={() => router.push(`/admin/${encodeURIComponent(school)}`)}
              >
                <span>{school}</span>
                <span className="underline text-sm cursor-pointer">Click to Open</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
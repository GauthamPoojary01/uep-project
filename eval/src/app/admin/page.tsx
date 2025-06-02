'use client';

import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Bside from '@/components/bside';

export default function AdminDashboard() {
  const schools = [
    'SCHOOL OF LIFE SCIENCES',
    'SCHOOL OF ARTS AND HUMANITIES',
    'SCHOOL OF INFORMATION SCIENCE AND TECHNOLOGY',
    'SCHOOL OF PHYSICAL SCIENCES',
    'SCHOOL OF COMMERCE , FINANCE AND ACCOUNTANCY',
    'SCHOOL OF BUSINESS AND MANAGEMENT',
   'SCHOOL OF VOCATIONAL STUDIES',
   'SCHOOL OF LANGUAGES AND CULTURAL STUDIES'
  ];

  return (
    <div className="min-h-screen bg-[#1e3c72] p-5 font-sans text-white">
      <Head>
        <title>University Evaluation Portal</title>
      </Head>

      <main className="flex gap-4 items-center justify-center min-h-[90vh]">
        {/* Left Panel */}
        <div className="flex-1 bg-[#EDEDF3] rounded-lg p-5 flex flex-col items-center text-black max-w-md">
          <Image
            src="/images/logo1.jpg"
            alt="University Logo"
            width={300}
            height={200}
            className="max-h-[85px] w-auto mb-2"
            priority
          />
          <h1 className="text-[#f7b636] text-base font-semibold mb-2 text-center uppercase">
            University Evaluation Portal
          </h1>
          <Image
            src="/images/college.jpg"
            alt="College"
            width={300}
            height={200}
            className="w-full h-auto my-3 rounded"
            priority
          />
        </div>

        <Bside />

        {/* Right Panel */}
        <div className="flex-[2] bg-[#EDEDF3] rounded-lg p-5 max-w-lg text-black">
          <h3 className="text-2xl text-[#30579f] font-bold mb-5 text-center">
            Select from schools
          </h3>
          <div className="flex flex-col gap-4">
            {schools.map((school, index) => (
              <button
                key={index}
                className="bg-[#30579f] text-white rounded-lg px-4 py-2 flex justify-between items-center hover:bg-[#244a7a] transition"
                onClick={() => alert(`You clicked ${school}`)} // replace with real navigation
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

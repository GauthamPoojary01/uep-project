'use client';

import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import Bside from '@/components/bside'; 

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";



export default function Home() {
  const router = useRouter();

  const schools = [
    'School of life science',
    'School of arts and humanities',
    'School of Computer science',
    'School of Business',
    'School of Medicine',
  ];

  
  return (
    <div className="min-h-screen bg-[#1e3c72] p-5 font-sans">
      <Head>
        <title>University Evaluation Portal</title>
      </Head>

      <main className="gap-4 flex items-center justify-center h-screen">
        {/* Left Panel */}
        <div className="flex-1 bg-[#EDEDF3] rounded-lg p-5 flex flex-col items-center">
          <Image
            src="/images/logo1.png"
            alt="University Logo"
            width={300}
            height={200}
            className="max-h-[85px] w-auto mb-2"
          />
          <h1 className="text-[#f7b636] text-base font-semibold mb-2 text-center">
            UNIVERSITY EVALUATION PORTAL
          </h1>
          <Image
            src="/images/college.jpg"
            alt="College"
            width={300}
            height={200}
            className="w-full h-auto my-3 rounded"
          />
        </div>
        <Bside />

        {/* Right Panel */}
        <div className="flex-2 bg-[#EDEDF3] rounded-lg p-5 w-full">
          <h3 className="text-2xl text-[#30579f] font-bold mb-5 text-center">Select from schools</h3>
          <div className="flex flex-col gap-4">
            {schools.map((school, index) => (
              <div
                key={index}
                className="bg-[#30579f] text-white rounded-lg px-4 py-2 flex justify-between items-center"
              >
                <span>{school}</span>
                <a href="#" className="underline text-sm">Click to Open</a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
//eval/src/components/ui/form3.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button"

const questions = [
  "a. Total Number of Associate Professor:",
  "b. Total Number of Assistant Professor:",
  "c. Total Number of Professor in Practice:",
];

const Form3 = () => {
  const [formData, setFormData] = useState(Array(questions.length).fill(''));
  const [isSaved, setIsSaved] = useState(false);

  const allFilled = formData.every(val => val !== "" && val !== null && val !== undefined);

  const handleChange = (index: number, value: string) => {
  const updated = [...formData];
  updated[index] = value;
  setFormData(updated);
  setIsSaved(false);
    }
  

  const handleSave = () => setIsSaved(true);

  const totalProfessors = formData.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Block: e, E, +, -, .
  if (["e", "E", "+", "-", "."].includes(e.key)) {
    e.preventDefault();
  }
};


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 3: STAFF PROFILE</h1>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
        {questions.map((q, i) => (
          <div key={i}>
            <label className="block mb-1">{q}</label>
            <input
              type="numeric"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              maxLength={2}
              value={formData[i]}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <label className='block mb-1'>d. Total Number of Professor:</label>
        <input
          className='w-full border border-gray-400 px-3 py-2 rounded focus:outline-none focus:border-blue-500'
          type='number'
          maxLength={3}
          value={totalProfessors}
          readOnly
          tabIndex={-1}
        />
        <div className="flex gap-4 mt-6 items-center">
          <Link href="/schl_prg" className="flex">
            <Button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Previous
            </Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="submit"
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-opacity duration-200 relative ${
                (!isSaved ||
                  formData.some(val => val === "" || val === null || val === undefined))
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              disabled={
                !isSaved ||
                formData.some(val => val === "" || val === null || val === undefined)
              }
              title={
                !isSaved ||
                formData.some(val => val === "" || val === null || val === undefined)
                  ? "Fill out all fields and save"
                  : ""
              }
            >
              Submit
            </button>
          </div>
          <Link href="/research" className="flex">
            <Button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Next
            </Button>
          </Link>
        </div>
        {!isSaved && (
          <p className="text-purple-600 mt-2">Please save your data before submitting or leaving the page.</p>
        )}
      </form>
    </div>
  );
};
export default Form3;
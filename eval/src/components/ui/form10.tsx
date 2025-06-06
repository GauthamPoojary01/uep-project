//eval/src/components/ui/form10.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button"

const questions = [
"1. Resource person:",
"2. Total number of faculties that attended seminar:",
"3. Total number of faculties:",
"4. Total number of faculties who have attended workshop:",
"5. Total number of faculties who have  KSET/NET:",
"6. Total number of faculties who have completed Ph.d:",
"7. Total number of faculties FDP:",
"8. Total number of faculties EDP:",
"9. Total number of faculties MMTP:",
"10. Total number of faculties staff inducation:",
"11. Total number of faculties MOOC:",
"12. Link of  document:"
];

const Form10 = () => {
  const [formData, setFormData] = useState(Array(questions.length).fill(''));
  const [isSaved, setIsSaved] = useState(false);

  const allFilled = formData.every(val => val !== "" && val !== null && val !== undefined);


  const handleChange = (index:number, value:string) => {
    const updated = [...formData];
    updated[index] = value;
    setFormData(updated);
    setIsSaved(false);
  };

  const handleSave = () => setIsSaved(true);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 10: STAFF ACHIEVEMENTS</h1>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
        <div className="flex flex-col gap-4 font-normal mt-1 mb-1 ml-5  h-120 overflow-y-scroll"> 
        {questions.map((q, i) => (
          <div key={i}>
            <label className="block mb-1">{q}</label>
            <input
              type="number"
              value={formData[i]}
              onChange={e => handleChange(i, e.target.value)}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        </div>
        <div className="flex gap-4 mt-6 items-center">
          <Link href="/schl_act">
          <Button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            // Add your Previous logic here
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
          <Link href="/cert_course">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            // Add your Next logic here
          >
            Next
          </button>
          </Link>
        </div>
        {!isSaved && (
          <p className="text-purple-600 mt-2">Please save your data before submitting or leaving the page.</p>
        )}
      </form>
    </div>
  );
};

export default Form10;
//eval/src/components/ui/form6.tsx
'use client';

import Link from 'next/link';
import { useState,useEffect } from 'react';
import { Button } from "@/components/ui/button"

const questions = [
  "a. Number of Faculties Involved:",
  "b. Total Number of Projects under Government Category:",
  "c. Total Number of Projects under Non-Government Category:",
  "d. Total Number of Projects under MJES Category:",
  "e. Total Amount Allocated to Government Category:",
  "f. Total Amount Allocated to Non-Government Category:",
  "g.Total Amount Allocated to MJES Category:",
  "h. Toatl Number of Projects:",
  "i. Total Amount Allocated to All Categories:",

];

const Form6 = () => {
  const [formData, setFormData] = useState(Array(questions.length).fill(''));
  const [isSaved, setIsSaved] = useState(false);
  //const allFilled = formData.every(val => val !== "" && val !== null && val !== undefined);
  useEffect(() => {
    const b = parseInt(formData[1]) || 0;
    const c = parseInt(formData[2]) || 0;
    const d = parseInt(formData[3]) || 0;
    const e = parseInt(formData[4]) || 0;
    const f = parseInt(formData[5]) || 0;
    const g = parseInt(formData[6]) || 0;
    const summ= e + f + g;
    const sum = b + c + d;

    const updated = [...formData];
    updated[8]= summ.toString();
    updated[7] = sum.toString(); // index 7 = "h"
    setFormData(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData[1], formData[2], formData[3], formData[4],formData[5], formData[6]]);
  

  const allFilled = formData.every(val => val !== "" && val !== null && val !== undefined);

  const handleChange = (index: number, value: string) => {
  const updated = [...formData];
  updated[index] = value;
  setFormData(updated);
  setIsSaved(false);
  };

  const handleSave = () => setIsSaved(true);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 6: RESEARCH PROJECTS</h1>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
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
        <div className="flex gap-4 mt-6 items-center">
          <Link href="/phd">
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
          <Link href="/consult">
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

export default Form6;
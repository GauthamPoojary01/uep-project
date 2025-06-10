//eval/src/components/ui/form1.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button"

const questions = [
  "b. Number of Faculties:",
  "c. Number of Faculties with PhD Holders:",
  "d. Number of Faculties with NET/KSET :",
  "e. Number of Faculties without PhD/NET/KSET:",
  "f. Number of Faculties Pursuing PhD:"
];

const Form1 = () => {
  const [formData, setFormData] = useState(Array(questions.length).fill(''));
  const [isSaved, setIsSaved] = useState(false);

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
      <h1 className="text-2xl font-bold mb-4"> 1. SCHOOL PROFILE</h1>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
        <label className="block mb-1">a. Year of Establishment:</label>
        <input
          type="numeric"
          maxLength={4}
          min={1900}
          max={new Date().getFullYear()}
          value={formData[0]}
          onChange={e => handleChange(0, e.target.value)}
          required
          className="w-full border border-gray-400 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
        />
        {questions.map((q, i) => (
          <div key={i}>
            <label className="block mb-1">{q}</label>
            <input
              type="number"
              value={formData[i+1]}
              onChange={e => handleChange(i+1, e.target.value)}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <div className="flex gap-4 mt-6 items-center">
          <Button
            type="button"
            variant="outline"
            className="px-4 py-2 border border-blue-400 rounded hover:bg-blue-200 bg-blue-500 text-white"
          >
            Previous
          </Button>
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
          <Link href="/schl_prg" className="flex">
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2 border border-blue-400 rounded hover:bg-blue-200 bg-blue-500 text-white"
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

export default Form1;
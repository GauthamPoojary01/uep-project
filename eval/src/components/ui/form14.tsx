'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

const Form14 = () => {
  const [formData, setFormData] = useState({
    intake: '',
    admitted: '',
    graduating: '',
    placements: '',
    higher_studies: '',
    details_link: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.sid) {
      fetch(`http://localhost:5000/api/forms/form14/${user.sid}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData(data);
            if (["submitted", "approved"].includes(data.status)) {
              setReadOnly(true);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/forms/form14", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form14", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 14: PLACEMENT AND HIGHER EDUCATION</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <label>a. Total number of intake in year:</label>
        <input type="number" name="intake" value={formData.intake} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>b. Total number of students admitted:</label>
        <input type="number" name="admitted" value={formData.admitted} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>c. Total number of students graduating this year:</label>
        <input type="number" name="graduating" value={formData.graduating} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>d. Total number of placements:</label>
        <input type="number" name="placements" value={formData.placements} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>e. Total number of students who opted for higher studies:</label>
        <input type="number" name="higher_studies" value={formData.higher_studies} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>f. Link of the details:</label>
        <input type="text" name="details_link" value={formData.details_link} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/stu_intake">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(!isSaved || !allFilled) ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!isSaved || !allFilled}
              title={!isSaved || !allFilled ? "Fill and save before submitting" : ""}
            >
              Submit
            </button>
          </div>
          <Link href="/research">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form14;

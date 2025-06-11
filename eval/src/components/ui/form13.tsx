'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

const Form13 = () => {
  const [formData, setFormData] = useState({
    total_intake: '',
    total_admitted: '',
    dropout_this_year: '',
    male_admitted: '',
    female_admitted: '',
    outside_state_admissions: '',
    inside_state_admissions: '',
    foreign_students_admitted: '',
    details_link: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.sid) {
      fetch(`http://localhost:5000/api/forms/form13/${user.sid}`)
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
    fetch("http://localhost:5000/api/forms/form13", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form13", {
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
      <h1 className="text-2xl font-bold mb-4">CRITERIA 13: STUDENT INTAKE</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <label>a. Total intake:</label>
        <input type="number" name="total_intake" value={formData.total_intake} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>b. Total number of students admitted:</label>
        <input type="number" name="total_admitted" value={formData.total_admitted} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>c. Total number of students who dropped out this year:</label>
        <input type="number" name="dropout_this_year" value={formData.dropout_this_year} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>d. Total number of male students admitted:</label>
        <input type="number" name="male_admitted" value={formData.male_admitted} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>e. Total number of female students admitted:</label>
        <input type="number" name="female_admitted" value={formData.female_admitted} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>f. Total number of admissions from outside the state:</label>
        <input type="number" name="outside_state_admissions" value={formData.outside_state_admissions} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>g. Total number of admissions from inside the state:</label>
        <input type="number" name="inside_state_admissions" value={formData.inside_state_admissions} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>h. Total number of foreign students admitted:</label>
        <input type="number" name="foreign_students_admitted" value={formData.foreign_students_admitted} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>i. Link of the details:</label>
        <input type="text" name="details_link" value={formData.details_link} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/stu_achieve">
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
          <Link href="/placement">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form13;
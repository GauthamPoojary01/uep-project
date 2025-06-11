'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

const Form5 = () => {
  const [formData, setFormData] = useState({
    sid: '',
    intake: '',
    admitted: '',
    phd_part_time: '',
    phd_full_time: '',
    phd_completed: '',
    research_guides: '',
    currennt_year: new Date().getFullYear(),
    status: 'draft',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.sid) {
      setFormData(prev => ({ ...prev, sid: user.sid }));

      fetch(`http://localhost:5000/api/forms/form5/${user.sid}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              sid: data.sid,
              intake: data.intake || '',
              admitted: data.admitted || '',
              phd_part_time: data.phd_part_time || '',
              phd_full_time: data.phd_full_time || '',
              phd_completed: data.phd_completed || '',
              research_guides: data.research_guides || '',
              currennt_year: data.currennt_year,
              status: data.status,
            });

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') e.preventDefault();
  };

  const handleSave = () => {
    fetch('http://localhost:5000/api/forms/form5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch('http://localhost:5000/api/forms/form5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 5: PHD</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        {[{
          label: 'a. Total Number of Intake:', name: 'intake'
        }, {
          label: 'b. Total Admitted:', name: 'admitted'
        }, {
          label: 'c. Total Number Pursuing PhD in Part Time:', name: 'phd_part_time'
        }, {
          label: 'd. Total Number Pursuing PhD in Full Time:', name: 'phd_full_time'
        }, {
          label: 'e. Total Number Completed PhD:', name: 'phd_completed'
        }, {
          label: 'f. Number of Research Guides:', name: 'research_guides'
        }].map(({ label, name }) => (
          <div key={name}>
            <label>{label}</label>
            <input
              type="number"
              name={name}
              value={formData[name as keyof typeof formData] as string}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
              className="w-full border px-3 py-2 rounded mb-3"
            />
          </div>
        ))}

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/research">
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
          <Link href="/research_proj">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form5;

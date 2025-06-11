'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const Form7 = () => {
  const [formData, setFormData] = useState({
    sid: '',
    total_faculty: '',
    total_consultancies: '',
    total_beneficiaries: '',
    total_revenue: '',
    current_year: new Date().getFullYear(),
    status: 'draft'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.sid) {
      setFormData(prev => ({ ...prev, sid: user.sid }));

      fetch(`http://localhost:5000/api/forms/form7/${user.sid}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              sid: data.sid,
              total_faculty: data.total_faculty || '',
              total_consultancies: data.total_consultancies || '',
              total_beneficiaries: data.total_beneficiaries || '',
              total_revenue: data.total_revenue || '',
              current_year: data.current_year,
              status: data.status
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

  const handleSave = () => {
    fetch('http://localhost:5000/api/forms/form7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch('http://localhost:5000/api/forms/form7', {
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
      <h1 className="text-2xl font-bold mb-4">CRITERIA 7: CONSULTANCY</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div>
          <label>a. Number of Faculties:</label>
          <input
            type="number"
            name="total_faculty"
            value={formData.total_faculty}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border px-3 py-2 rounded mb-3"
          />
        </div>
        <div>
          <label>b. Number of Consultancies:</label>
          <input
            type="number"
            name="total_consultancies"
            value={formData.total_consultancies}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border px-3 py-2 rounded mb-3"
          />
        </div>
        <div>
          <label>c. Number of Beneficiaries:</label>
          <input
            type="number"
            name="total_beneficiaries"
            value={formData.total_beneficiaries}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border px-3 py-2 rounded mb-3"
          />
        </div>
        <div>
          <label>d. Revenue Generated:</label>
          <input
            type="number"
            name="total_revenue"
            value={formData.total_revenue}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border px-3 py-2 rounded mb-3"
          />
        </div>

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/research_proj">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
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
              onClick={handleSubmit}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(!isSaved || !allFilled) ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!isSaved || !allFilled}
              title={!isSaved || !allFilled ? "Fill and save before submitting" : ""}
            >
              Submit
            </button>
          </div>
          <Link href="/mous">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form7;

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Form8 = () => {
  const [formData, setFormData] = useState({
    sid: '',
    total_departments: '',
    total_institutions: '',
    total_corporate: '',
    total_national: '',
    total_international: '',
    total_mous: '',
    total_mou_activities: '',
    current_year: new Date().getFullYear(),
    status: 'draft'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.sid) {
      setFormData(prev => ({ ...prev, sid: user.sid }));

      fetch(`http://localhost:5000/api/forms/form8/${user.sid}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              sid: data.sid,
              total_departments: data.total_departments || '',
              total_institutions: data.total_institutions || '',
              total_corporate: data.total_corporate || '',
              total_national: data.total_national || '',
              total_international: data.total_international || '',
              total_mous: data.total_mous || '',
              total_mou_activities: data.total_mou_activities || '',
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

  useEffect(() => {
    const b = parseInt(formData.total_institutions) || 0;
    const c = parseInt(formData.total_corporate) || 0;
    const d = parseInt(formData.total_national) || 0;
    const e = parseInt(formData.total_international) || 0;
    const sum = b + c + d + e;
    setFormData(prev => ({ ...prev, total_mous: sum.toString() }));
  }, [formData.total_institutions, formData.total_corporate, formData.total_national, formData.total_international]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    fetch('http://localhost:5000/api/forms/form8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch('http://localhost:5000/api/forms/form8', {
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
      <h1 className="text-2xl font-bold mb-4">CRITERIA 8: MOU's</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <label>a. Total Number of Departments:</label>
        <input type="number" name="total_departments" value={formData.total_departments} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>b. Total Number of Institutions:</label>
        <input type="number" name="total_institutions" value={formData.total_institutions} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>c. Total Number of Corporate Houses:</label>
        <input type="number" name="total_corporate" value={formData.total_corporate} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>d. Total Number of National:</label>
        <input type="number" name="total_national" value={formData.total_national} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>e. Total Number of International:</label>
        <input type="number" name="total_international" value={formData.total_international} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>f. Total Number of MOUs (Auto calculated):</label>
        <input type="number" name="total_mous" value={formData.total_mous} readOnly disabled className="w-full border px-3 py-2 rounded mb-3 bg-gray-100" />

        <label>g. Total Number of Activities in MOUs:</label>
        <input type="number" name="total_mou_activities" value={formData.total_mou_activities} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/consult">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            <button type="submit" onClick={handleSubmit} className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(!isSaved || !allFilled) ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isSaved || !allFilled} title={!isSaved || !allFilled ? "Fill and save before submitting" : ""}>Submit</button>
          </div>
          <Link href="/schl_act">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form8;

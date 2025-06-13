'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const Form6 = () => {
  const [formData, setFormData] = useState({
    sid: '',
    total_faculty: '',
    gov_projects: '',
    non_gov_projects: '',
    mjes_projects: '',
    gov_amount: '',
    non_gov_amount: '',
    mjes_amount: '',
    total_projects: '',
    total_amount: '',
    currennt_year: new Date().getFullYear(),
    status: 'draft'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.sid) {
      setFormData(prev => ({ ...prev, sid: user.sid }));

      fetch(`http://localhost:5000/api/forms/form6/${user.sid}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              sid: data.sid,
              total_faculty: data.total_faculty || '',
              gov_projects: data.gov_projects || '',
              non_gov_projects: data.non_gov_projects || '',
              mjes_projects: data.mjes_projects || '',
              gov_amount: data.gov_amount || '',
              non_gov_amount: data.non_gov_amount || '',
              mjes_amount: data.mjes_amount || '',
              total_projects: data.total_projects || '',
              total_amount: data.total_amount || '',
              currennt_year: data.currennt_year,
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
    const total_projects =
      (parseInt(formData.gov_projects) || 0) +
      (parseInt(formData.non_gov_projects) || 0) +
      (parseInt(formData.mjes_projects) || 0);

    const total_amount =
      (parseInt(formData.gov_amount) || 0) +
      (parseInt(formData.non_gov_amount) || 0) +
      (parseInt(formData.mjes_amount) || 0);

    setFormData(prev => ({
      ...prev,
      total_projects: total_projects.toString(),
      total_amount: total_amount.toString()
    }));
  }, [formData.gov_projects, formData.non_gov_projects, formData.mjes_projects, formData.gov_amount, formData.non_gov_amount, formData.mjes_amount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    fetch('http://localhost:5000/api/forms/form6', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch('http://localhost:5000/api/forms/form6', {
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
      <h1 className="text-2xl font-bold mb-4">CRITERIA 6: RESEARCH PROJECTS</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-4 font-normal mt-1 mb-1 ml-1 max-h-[500px] overflow-y-scroll pr-2">
          {[{
            label: 'a. Number of Faculties Involved:', name: 'total_faculty'
          }, {
            label: 'b. Total Number of Projects under Government Category:', name: 'gov_projects'
          }, {
            label: 'c. Total Number of Projects under Non-Government Category:', name: 'non_gov_projects'
          }, {
            label: 'd. Total Number of Projects under MJES Category:', name: 'mjes_projects'
          }, {
            label: 'e. Total Amount Allocated to Government Category:', name: 'gov_amount'
          }, {
            label: 'f. Total Amount Allocated to Non-Government Category:', name: 'non_gov_amount'
          }, {
            label: 'g. Total Amount Allocated to MJES Category:', name: 'mjes_amount'
          }, {
            label: 'h. Total Number of Projects:', name: 'total_projects'
          }, {
            label: 'i. Total Amount Allocated to All Categories:', name: 'total_amount'
          }].map(({ label, name }) => (
            <div key={name}>
              <label>{label}</label>
              <input
                type="number"
                name={name}
                value={formData[name as keyof typeof formData] as string}
                onChange={handleChange}
                disabled={readOnly || name === 'total_projects' || name === 'total_amount'}
                className="w-full border px-3 py-2 rounded mb-3"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/phd">
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
          <Link href="/consult">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form6;

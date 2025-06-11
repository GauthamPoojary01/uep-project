'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

const Form10 = () => {
  const [formData, setFormData] = useState({
    resource_person: '',
    total_faculty_attended_seminar: '',
    total_faculty: '',
    total_faculty_attended_workshop: '',
    faculty_kset_net: '',
    faculty_completed_phd: '',
    faculty_fdp: '',
    faculty_edp: '',
    faculty_mmtp: '',
    faculty_staff_induction: '',
    faculty_mooc: '',
    document_link: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.sid) {
      fetch(`http://localhost:5000/api/forms/form10/${user.sid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setFormData(data);
            if (["submitted", "approved"].includes(data.status)) {
              setReadOnly(true);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  setIsSaved(false);
};


  const handleSave = () => {
    fetch("http://localhost:5000/api/forms/form10", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => setIsSaved(true))
      .catch((err) => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form10", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => setIsSaved(true))
      .catch((err) => console.error(err));
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 10: STAFF ACHIEVEMENTS</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label>a. Resource person:</label>
        <input type="number" name="resource_person" value={formData.resource_person} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>b. Total number of faculties that attended seminar:</label>
        <input type="number" name="total_faculty_attended_seminar" value={formData.total_faculty_attended_seminar} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>c. Total number of faculties:</label>
        <input type="number" name="total_faculty" value={formData.total_faculty} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>d. Total number of faculties who have attended workshop:</label>
        <input type="number" name="total_faculty_attended_workshop" value={formData.total_faculty_attended_workshop} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>e. Total number of faculties who have KSET/NET:</label>
        <input type="number" name="faculty_kset_net" value={formData.faculty_kset_net} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>f. Total number of faculties who have completed Ph.D.:</label>
        <input type="number" name="faculty_completed_phd" value={formData.faculty_completed_phd} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>g. Total number of faculties FDP:</label>
        <input type="number" name="faculty_fdp" value={formData.faculty_fdp} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>h. Total number of faculties EDP:</label>
        <input type="number" name="faculty_edp" value={formData.faculty_edp} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>i. Total number of faculties MMTP:</label>
        <input type="number" name="faculty_mmtp" value={formData.faculty_mmtp} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>j. Total number of faculties staff induction:</label>
        <input type="number" name="faculty_staff_induction" value={formData.faculty_staff_induction} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>k. Total number of faculties MOOC:</label>
        <input type="number" name="faculty_mooc" value={formData.faculty_mooc} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>l. Link of document:</label>
        <input type="text" name="document_link" value={formData.document_link} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/schl_act">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            <button type="submit" onClick={handleSubmit} className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(!isSaved || !allFilled) ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isSaved || !allFilled} title={!isSaved || !allFilled ? "Fill and save before submitting" : ""}>Submit</button>
          </div>
          <Link href="/cert_course">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form10;

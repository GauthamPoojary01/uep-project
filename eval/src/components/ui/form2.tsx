///UEPFINAL/eval/src/components/ui/form2.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from 'next/link';

const Form2 = () => {
  const [formData, setFormData] = useState({
    programmes_4_year: '',
    programmes_3_year: '',
    pg_programmes: '',
    certificate_courses: '',
    diploma_courses: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [status, setStatus] = useState('');
  const [readOnly, setReadOnly] = useState(false);

  const fetchSavedData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (!user?.sid) return;

    try {
      const res = await fetch("http://localhost:5000/api/forms/form2?sid=" + user.sid);
      if (!res.ok) return;
      const data = await res.json();
      setFormData(data);
      setStatus(data.status);
      if (data.status === 'submitted' || data.status === 'approved') setReadOnly(true);
      if (data.status === 'rejected') toast.error("Your previous submission was rejected. Please correct it.");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSavedData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    try {
      const res = await fetch("http://localhost:5000/api/forms/form2/save", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sid: user.sid })
      });
      if (res.ok) {
        toast.success("Saved successfully");
        setIsSaved(true);
        setStatus('draft');
      } else {
        toast.error("Failed to save");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleSubmit = async () => {
    if (!isSaved) return toast("Save before submitting");
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    try {
      const res = await fetch("http://localhost:5000/api/forms/form2/submit", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid: user.sid })
      });
      if (res.ok) {
        toast.success("Submitted successfully");
        setStatus("submitted");
        setReadOnly(true);
      } else {
        toast.error("Submission failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">2. SCHOOL PROGRAMMES</h1>

      <label>a. Total Number of 4 Year Programmes:</label>
      <input
        type="number"
        name="programmes_4_year"
        value={formData.programmes_4_year}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>b. Total Number of 3 Year Programmes:</label>
      <input
        type="number"
        name="programmes_3_year"
        value={formData.programmes_3_year}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>c. Total Number of Programmes PG:</label>
      <input
        type="number"
        name="pg_programmes"
        value={formData.pg_programmes}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>d. Total Number of Certificate Courses:</label>
      <input
        type="number"
        name="certificate_courses"
        value={formData.certificate_courses}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>e. Total Number of Diploma Courses:</label>
      <input
        type="number"
        name="diploma_courses"
        value={formData.diploma_courses}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={readOnly}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isSaved || readOnly}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        <Link href="/staff_pf" className="flex">
            <Button
              type="button"
              className="bg-gray-500 text-white px-5 py-5 rounded hover:bg-gray-700"
            >
              Next
            </Button>
          </Link>
      </div>

      {status === 'rejected' && (
        <p className="mt-2 text-sm text-red-600">This form was rejected. Please update and resubmit.</p>
      )}
    </div>
  );
};

export default Form2;

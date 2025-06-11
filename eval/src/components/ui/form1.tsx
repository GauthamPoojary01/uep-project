// eval/src/components/ui/form1.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from 'next/link';

const Form1 = () => {
  const [formData, setFormData] = useState({
    year: '',
    total_faculty: '',
    phd_holders: '',
    net_kset: '',
    without_phd_kset: '',
    pursuing_phd: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [status, setStatus] = useState('');
  const [readOnly, setReadOnly] = useState(false);

  const fetchSavedData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (!user?.sid) return;

    try {
      const res = await fetch("http://localhost:5000/api/forms/form1?sid=" + user.sid);
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
      const res = await fetch("http://localhost:5000/api/forms/form1/save", {
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
      const res = await fetch("http://localhost:5000/api/forms/form1/submit", {
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
      <h1 className="text-2xl font-bold mb-4">1. SCHOOL PROFILE</h1>

      <label>a. Year of Establishment:</label>
      <input
        type="number"
        name="year"
        value={formData.year}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>b. Number of Faculties:</label>
      <input
        type="number"
        name="total_faculty"
        value={formData.total_faculty}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>c. Number of PhD Holders:</label>
      <input
        type="number"
        name="phd_holders"
        value={formData.phd_holders}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>d. Number of NET/KSET:</label>
      <input
        type="number"
        name="net_kset"
        value={formData.net_kset}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>e. Without PhD/NET/KSET:</label>
      <input
        type="number"
        name="without_phd_kset"
        value={formData.without_phd_kset}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>f. Pursuing PhD:</label>
      <input
        type="number"
        name="pursuing_phd"
        value={formData.pursuing_phd}
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
      </div>
<Link href="/staff_pf" className="flex">
            <Button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Next
            </Button>
          </Link>
      {status === 'rejected' && (
        <p className="mt-2 text-sm text-red-600">This form was rejected. Please update and resubmit.</p>
      )}
    </div>
  );
};

export default Form1;

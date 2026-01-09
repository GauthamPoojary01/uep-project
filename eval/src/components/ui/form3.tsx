//UEPFINAL/eval/src/components/ui/form3.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import toast from "react-hot-toast";

const Form3 = () => {
  const [formData, setFormData] = useState({
    associate_professors: '',
    assistant_professors: '',
    professors_in_practice: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [status, setStatus] = useState('');
  const [readOnly, setReadOnly] = useState(false);

  const fetchSavedData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (!user?.sid) return;

    try {
      const res = await fetch("http://localhost:5000/api/forms/form3?sid=" + user.sid);
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
    const res = await fetch("http://localhost:5000/api/forms/form3/save", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sid: user.sid,
        data: {
          total_no_of_associate_professor: parseInt(formData.associate_professors) || 0,
          total_no_of_assistant_professor: parseInt(formData.assistant_professors) || 0,
          total_no_of_professor_of_practice: parseInt(formData.professors_in_practice) || 0,
          total_no_of_professor: totalProfessors,
          status: 'draft',
          rejection_reason: null
        }
      })
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
      const res = await fetch("http://localhost:5000/api/forms/form3/submit", {
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

  const totalProfessors =
    (parseInt(formData.associate_professors) || 0) +
    (parseInt(formData.assistant_professors) || 0) +
    (parseInt(formData.professors_in_practice) || 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3. STAFF PROFILE</h1>

      <label>a. Total Number of Associate Professor:</label>
      <input
        type="number"
        name="associate_professors"
        value={formData.associate_professors}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>b. Total Number of Assistant Professor:</label>
      <input
        type="number"
        name="assistant_professors"
        value={formData.assistant_professors}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>c. Total Number of Professor in Practice:</label>
      <input
        type="number"
        name="professors_in_practice"
        value={formData.professors_in_practice}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={readOnly}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <label>d. Total Number of Professor:</label>
      <input
        type="number"
        value={totalProfessors}
        readOnly
        tabIndex={-1}
        className="w-full border px-3 py-2 rounded mb-3 bg-gray-100"
      />
<<<<<<< HEAD

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
      
      <Link href="/research" className="flex">
            <Button
              type="button"
              className="bg-gray-500 text-white px-4 py-5 rounded hover:bg-gray-700"
            >
              Next
            </Button>
          </Link>
        </div>
      {status === 'rejected' && (
        <p className="mt-2 text-sm text-red-600">This form was rejected. Please update and resubmit.</p>
      )}
=======
      <div className="flex gap-4 mt-6 items-center">
          <Link href="/schl_prg">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} disabled={readOnly} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isSaved || readOnly || !allFilled}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
          <Link href="/research">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
>>>>>>> d60485548ae6d26a711e98baadd56ea71c7a5d55
    </div>
  );
};

export default Form3;

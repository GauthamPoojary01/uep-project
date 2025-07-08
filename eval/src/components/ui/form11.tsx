//UEPFINAL/eval/src/components/ui/form11.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

const Form11 = () => {
  const [formData, setFormData] = useState({
    total_certificate_courses: '',
    total_students_enrolled: '',
    total_faculties_offering: '',
    total_faculty: '',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.sid) {
      fetch(`http://localhost:5000/api/forms/form11/${user.sid}`)
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!res.ok || !contentType?.includes("application/json")) {
            throw new Error("Invalid JSON response");
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setFormData({
              total_certificate_courses: data.total_certificate_courses ?? '',
              total_students_enrolled: data.total_students_enrolled ?? '',
              total_faculties_offering: data.total_faculties_offering ?? '',
              total_faculty: data.total_faculty ?? '',
            });
            if (["submitted", "approved"].includes(data.status)) {
              setReadOnly(true);
            }
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    fetch("http://localhost:5000/api/forms/form11", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user": JSON.stringify(user),
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save data");
        setIsSaved(true);
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedData = { ...formData, status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form11", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user": JSON.stringify(user),
      },
      body: JSON.stringify(updatedData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit data");
        setIsSaved(true);
      })
      .catch((err) => console.error(err));
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 11: CERTIFICATE COURSES</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label>a. Total number of certificate courses:</label>
        <input type="number" name="total_certificate_courses" value={formData.total_certificate_courses} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>b. Total number of students enrolled:</label>
        <input type="number" name="total_students_enrolled" value={formData.total_students_enrolled} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>c. Total number of faculties offering:</label>
        <input type="number" name="total_faculties_offering" value={formData.total_faculties_offering} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>d. Total number of faculties:</label>
        <input type="number" name="total_faculty" value={formData.total_faculty} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/staff_achive">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            <button type="submit" onClick={handleSubmit} className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(!isSaved || !allFilled) ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isSaved || !allFilled} title={!isSaved || !allFilled ? "Fill and save before submitting" : ""}>Submit</button>
          </div>
          <Link href="/stu_achieve">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form11;

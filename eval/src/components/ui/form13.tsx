//UEPFINAL/eval/src/components/ui/form13.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";

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
    details_link: '',
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
            setFormData({
              total_intake: data.total_intake ?? '',
              total_admitted: data.total_admitted ?? '',
              dropout_this_year: data.dropout_this_year ?? '',
              male_admitted: data.male_admitted ?? '',
              female_admitted: data.female_admitted ?? '',
              outside_state_admissions: data.outside_state_admissions ?? '',
              inside_state_admissions: data.inside_state_admissions ?? '',
              foreign_students_admitted: data.foreign_students_admitted ?? '',
              details_link: data.details_link ?? '',
            });
            if (["submitted", "approved"].includes(data.status)) {
              setReadOnly(true);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/forms/form13", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user": localStorage.getItem("user") || "{}"
      },
      body: JSON.stringify(formData),
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form13", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user": localStorage.getItem("user") || "{}"
      },
      body: JSON.stringify(updatedData),
    })
      .then(() => setIsSaved(true))
      .catch(err => console.error(err));
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto ">
      <h1 className="text-2xl font-bold mb-5">CRITERIA 13: STUDENT INTAKE</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-2 font-normal  ml-1 max-h-[410px] overflow-y-scroll pr-2">
          {[
          { label: "a. Total intake:", name: "total_intake" },
          { label: "b. Total number of students admitted:", name: "total_admitted" },
          { label: "c. Total number of students who dropped out this year:", name: "dropout_this_year" },
          { label: "d. Total number of male students admitted:", name: "male_admitted" },
          { label: "e. Total number of female students admitted:", name: "female_admitted" },
          { label: "f. Total number of admissions from outside the state:", name: "outside_state_admissions" },
          { label: "g. Total number of admissions from inside the state:", name: "inside_state_admissions" },
          { label: "h. Total number of foreign students admitted:", name: "foreign_students_admitted" },
          { label: "i. Link of the details:", name: "details_link", type: "text" }
        ].map(({ label, name, type = "number" }) => (
          <div key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border px-3 py-2 rounded mb-3"
            />
          </div>
        ))}
        </div>
        

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/stu_achieve">
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

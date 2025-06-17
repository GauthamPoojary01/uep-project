// src/components/ui/form9.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const defaultFormData = {
  total_guest_talks: '',
  total_alumni_interactions: '',
  total_industrial_visits: '',
  total_study_tours: '',
  total_fests: '',
  total_fdps: '',
  total_edps: '',
  total_mdps: '',
  total_conferences: '',
  total_workshops: '',
  total_national_seminars: '',
  total_ipr_events: '',
  total_research_methodology_events: '',
  total_entrepreneurship_events: '',
  total_skill_development_events: ''
};

const Form9 = () => {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.sid) {
      fetch(`http://localhost:5000/api/forms/form9/${user.sid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const safeData: typeof defaultFormData = { ...defaultFormData };
            (Object.keys(defaultFormData) as (keyof typeof defaultFormData)[]).forEach((key) => {
              safeData[key] = data[key] ?? '';
            });
            setFormData(safeData);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { sid: user.sid, ...formData, current_year: new Date().getFullYear(), status: 'saved' };
    fetch("http://localhost:5000/api/forms/form9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => setIsSaved(true))
      .catch((err) => console.error(err));
  };

  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { sid: user.sid, ...formData, current_year: new Date().getFullYear(), status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => setIsSaved(true))
      .catch((err) => console.error(err));
  };

  const allFilled = Object.values(formData).every((val) => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 9: SCHOOL ACTIVITIES</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-4 font-normal mt-1 mb-1 ml-5 max-h-[500px] overflow-y-scroll pr-2">
          {Object.entries({
            'a. Total number of guest talks:': 'total_guest_talks',
            'b. Total number of alumni interaction:': 'total_alumni_interactions',
            'c. Total number of industrial visits:': 'total_industrial_visits',
            'd. Total number of study tours:': 'total_study_tours',
            'e. Total number of fests:': 'total_fests',
            'f. Total number of FDP:': 'total_fdps',
            'g. Total number of EDP:': 'total_edps',
            'h. Total number of MDP:': 'total_mdps',
            'i. Total number of conferences:': 'total_conferences',
            'j. Total number of workshops:': 'total_workshops',
            'k. Total number of national seminars:': 'total_national_seminars',
            'l. Total number of IPR related events:': 'total_ipr_events',
            'm. Total number of Research Methodology events:': 'total_research_methodology_events',
            'n. Total number of Entrepreneurship events:': 'total_entrepreneurship_events',
            'o. Total number of Skill Development events:': 'total_skill_development_events'
          }).map(([label, name]) => (
            <div key={name}>
              <label>{label}</label>
              <input
                type="number"
                name={name}
                value={formData[name as keyof typeof formData] ?? ''}
                onChange={handleChange}
                disabled={readOnly}
                className="w-full border px-3 py-2 rounded mb-3 bg-white disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/mous">
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
          <Link href="/staff_achieve">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form9;

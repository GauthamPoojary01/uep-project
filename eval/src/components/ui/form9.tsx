'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Form9 = () => {
  const [formData, setFormData] = useState({
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
  });

  const [isSaved, setIsSaved] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.sid) {
      fetch(`http://localhost:5000/api/forms/form9/${user.sid}`)
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/forms/form9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => setIsSaved(true))
      .catch((err) => console.error(err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    fetch("http://localhost:5000/api/forms/form9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => setIsSaved(true))
      .catch((err) => console.error(err));
  };

  const allFilled = Object.values(formData).every((val) => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 9: SCHOOL ACTIVITIES</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label>a. Total number of guest talks:</label>
        <input type="number" name="total_guest_talks" value={formData.total_guest_talks} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>b. Total number of alumni interaction:</label>
        <input type="number" name="total_alumni_interactions" value={formData.total_alumni_interactions} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>c. Total number of industrial visits:</label>
        <input type="number" name="total_industrial_visits" value={formData.total_industrial_visits} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>d. Total number of study tours:</label>
        <input type="number" name="total_study_tours" value={formData.total_study_tours} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>e. Total number of fests:</label>
        <input type="number" name="total_fests" value={formData.total_fests} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>f. Total number of FDP:</label>
        <input type="number" name="total_fdps" value={formData.total_fdps} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>g. Total number of EDP:</label>
        <input type="number" name="total_edps" value={formData.total_edps} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>h. Total number of MDP:</label>
        <input type="number" name="total_mdps" value={formData.total_mdps} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>i. Total number of conferences:</label>
        <input type="number" name="total_conferences" value={formData.total_conferences} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>j. Total number of workshops:</label>
        <input type="number" name="total_workshops" value={formData.total_workshops} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>k. Total number of national seminars:</label>
        <input type="number" name="total_national_seminars" value={formData.total_national_seminars} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>l. Total number of IPR related events:</label>
        <input type="number" name="total_ipr_events" value={formData.total_ipr_events} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>m. Total number of Research Methodology events:</label>
        <input type="number" name="total_research_methodology_events" value={formData.total_research_methodology_events} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>n. Total number of Entrepreneurship events:</label>
        <input type="number" name="total_entrepreneurship_events" value={formData.total_entrepreneurship_events} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <label>o. Total number of Skill Development events:</label>
        <input type="number" name="total_skill_development_events" value={formData.total_skill_development_events} onChange={handleChange} disabled={readOnly} className="w-full border px-3 py-2 rounded mb-3" />

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/mous">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            <button type="submit" onClick={handleSubmit} className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(!isSaved || !allFilled) ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isSaved || !allFilled} title={!isSaved || !allFilled ? "Fill and save before submitting" : ""}>Submit</button>
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

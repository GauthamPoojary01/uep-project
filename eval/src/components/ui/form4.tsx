//UEPFINAL/eval/src/components/ui/form4.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Form4 = () => {
  const [formData, setFormData] = useState({
    sid: '',
    scopus: '',
    wos: '',
    ugc_care: '',
    h_index: '',
    citation: '',
    awards: '',
    books: '',
    chapters_published: '',
    paper_presented: '',
    currennt_year: new Date().getFullYear(),
    status: 'draft',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [status, setStatus] = useState('');
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.sid) return;

    setFormData(prev => ({ ...prev, sid: user.sid }));

    fetch(`http://localhost:5000/api/forms/form4/${user.sid}`)
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setFormData({
          sid: data.sid,
          scopus: data.scopus || '',
          wos: data.wos || '',
          ugc_care: data.total_no_of_ugc_care || '',
          h_index: data.total_no_of_h_index || '',
          citation: data.total_no_of_citation || '',
          awards: data.total_no_of_awards || '',
          books: data.total_no_of_books_chapter_published || '',
          chapters_published: data.total_no_of_link_research || '',
          paper_presented: data.total_no_of_paper_published || '',
          currennt_year: data.currennt_year || new Date().getFullYear(),
          status: data.status || 'draft',
        });

        if (["submitted", "approved"].includes(data.status)) {
          setReadOnly(true);
        }

        if (data.status === 'rejected') toast.error("Previous submission was rejected. Please correct and resubmit.");
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') e.preventDefault();
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/forms/form4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Saved successfully");
        setIsSaved(true);
      } else {
        toast.error("Save failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleSubmit = async () => {
    if (!isSaved) return toast("Save before submitting");

    try {
      const res = await fetch('http://localhost:5000/api/forms/form4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'submitted' })
      });

      if (res.ok) {
        toast.success("Submitted successfully");
        setIsSaved(true);
        setReadOnly(true);
      } else {
        toast.error("Submit failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 4: RESEARCH</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-4 font-normal mt-1 mb-8 ml-5 h-110 max-h-[400px] overflow-y-scroll pr-2">
          {[ 
            { label: 'a. Total Number of Scopus', name: 'scopus' },
            { label: 'b. Total Number of WOS', name: 'wos' },
            { label: 'c. Total Number of UGC Care', name: 'ugc_care' },
            { label: 'd. Total Number of H-Index', name: 'h_index' },
            { label: 'e. Total Number of Citation', name: 'citation' },
            { label: 'f. Total Number of Awards', name: 'awards' },
            { label: 'g. Total Number of Books', name: 'books' },
            { label: 'h. Total Number of Chapters Published', name: 'chapters_published' },
            { label: 'i. Total Number of Paper Presented', name: 'paper_presented' }
          ].map(({ label, name }) => (
            <div key={name}>
              <label>{label}:</label>
              <input
                type="number"
                name={name}
                value={formData[name as keyof typeof formData] as string}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={readOnly}
                className="w-full border px-3 py-2 rounded "
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4 items-center">
          <Link href="/staff_pf">
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
          <Link href="/phd">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 ml-6 ">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form4;

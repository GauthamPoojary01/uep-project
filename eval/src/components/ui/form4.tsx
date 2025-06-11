'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

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
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.sid) {
      setFormData(prev => ({ ...prev, sid: user.sid }));

      axios.get(`http://localhost:5000/api/forms/form4/${user.sid}`)
        .then(res => {
          if (res.data) {
            const data = res.data;
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
              currennt_year: data.currennt_year,
              status: data.status,
            });

            if (['submitted', 'approved'].includes(data.status)) {
              setReadOnly(true);
            }
          }
        })
        .catch(err => console.error('Fetch error:', err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') e.preventDefault();
  };

  const handleSave = () => {
    axios.post('http://localhost:5000/api/forms/form4', formData)
      .then(() => setIsSaved(true))
      .catch(err => console.error('Save error:', err));
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, status: 'submitted' };
    axios.post('http://localhost:5000/api/forms/form4', updatedData)
      .then(() => setIsSaved(true))
      .catch(err => console.error('Submit error:', err));
  };

  const allFilled = Object.values(formData).every(val => val !== '');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRITERIA 4: RESEARCH</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
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
              className="w-full border px-3 py-2 rounded mb-3"
            />
          </div>
        ))}

        <div className="flex gap-4 mt-6 items-center">
          <Link href="/staff_pf">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Previous</Button>
          </Link>
          <div className="flex-1 flex justify-center gap-4">
            <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
          <Link href="/phd">
            <Button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Next</Button>
          </Link>
        </div>
        {!isSaved && <p className="text-purple-600 mt-2">Please save before submitting or leaving.</p>}
      </form>
    </div>
  );
};

export default Form4;
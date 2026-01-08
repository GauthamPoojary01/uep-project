"use client";
// evaal/src/app/schl_porf/page.tsx
import Headings from "@/components/heading";
import Form1 from "@/components/ui/form1";
import Aside from "@/components/aside";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || 'Guest';

  const [department, setDepartment] = useState('');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.department) {
          setDepartment(user.department);
        } else {
          setDepartment("Unknown Department");
        }
      } else {
        setDepartment("No user data found");
      }
    } catch (error) {
      console.error("Failed to fetch department from localStorage", error);
      setDepartment("Error fetching department");
    }
  }, []);

  return (
    <div className="rounded-[10px] min-h-screen bg-gradient-to-b from-[#10074e] to-[#1E3C72] text-blue-900 p-5 relative">
      <Headings />
      <div>
        <p
          className="text-left text-white text-[25px] font-bold justify-center items-center font-sans ml-[35vw] mb-1 mt-3 tracking-wide relative"
          style={{
            textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          {department ? department.toUpperCase() : "Loading Department..."}
        </p>
        <div className="flex justify-center items-center ">
          <Aside username={username} />
          <div
            
            style={{
              width: "calc(100vw - 7vw - 30vw)",
              marginLeft: "2vw",
              marginRight: "1vw",
              border: "1.5px solid #e0e7ef",
              transform: "translateY(15px) scale(1)",
              transition: "box-shadow 0.3s, transform 0.3s",
              zIndex: 2,
              position: "relative",
              maxWidth: "none",
            }}
          >
            <Form1 />
          </div>
        </div>
      </div>
    </div>
  );
}

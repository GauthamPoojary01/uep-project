"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Headings from "@/components/heading";
import Aside from "@/components/aside";
import Link from "next/link";

export default function Dashboard() {
  const { username } = useParams();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name);
      setDepartment(user.department);
    }
  }, []);

  const parameters = [
    { label: "1. SCHOOL PROFILE", href: "/schl_porf" },
    { label: "2. SCHOOL PROGRAMME", href: "/schl_prg" },
    { label: "3. STAFF PROFILE", href: "/staff_pf" },
    { label: "4. RESEARCH", href: "/research" },
    { label: "5. PHD", href: "/phd" },
    { label: "6. RESEARCH PROJECTS", href: "/research_proj" },
    { label: "7. CONSULTANCY", href: "/consult" },
    { label: "8. MOU'S", href: "/mous" },
    { label: "9. SCHOOL ACTIVITIES", href: "/schl_act" },
    { label: "10. STAFF ACHIEVEMENTS", href: "/staff_achieve" },
    { label: "11. CERTIFICATE COURSES", href: "/cert_course" },
    { label: "12. STUDENT ACHIEVEMENTS", href: "/stu_achieve" },
    { label: "13. STUDENT INTAKE", href: "/stu_intake" },
    { label: "14. PLACEMENTS", href: "/placement" },
  ];

  return (
    <div className="rounded-[10px] min-h-screen bg-gradient-to-b from-[#10074e] to-[#1E3C72] text-blue-900 p-5 relative">
      <Headings />
      <div>
        <p
          className="text-left text-white text-[20px] font-bold justify-center items-center font-sans ml-[35vw] mt-2 tracking-wide relative"
          style={{ textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" }}
        >
          {department || "Loading..."}
        </p>
        <div className="flex justify-center items-center gap-4">
          <Aside username={username as string} />
          <div className="flex-2 bg-gray-50 rounded-lg p-5 w-150 h-160 mb-4">
            <h1 className="text-[25px] text-[#0f0163] font-bold mb-3">Home</h1>
            <div className="flex flex-col gap-4 font-medium mt-1 mb-1 ml-5 mr-15 h-110 overflow-y-scroll">
              {parameters.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#293481] text-white rounded-lg px-4 py-2 flex justify-between items-center mr-4"
                >
                  <span>{item.label}</span>
                  <Link href={item.href} className="underline text-sm font-medium">
                    Click to Open
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

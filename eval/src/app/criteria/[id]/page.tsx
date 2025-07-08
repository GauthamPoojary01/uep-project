// UEPFINAL/eval/src/app/criteria/[id]/page.tsx 
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Headings from "@/components/heading";
import Aside from "@/components/aside";
import dynamic from "next/dynamic";

const formMap: Record<string, any> = {
  "1": dynamic(() => import("@/components/ui/form1")),
  "2": dynamic(() => import("@/components/ui/form2")),
  "3": dynamic(() => import("@/components/ui/form3")),
  "4": dynamic(() => import("@/components/ui/form4")),
  "5": dynamic(() => import("@/components/ui/form5")),
  "6": dynamic(() => import("@/components/ui/form6")),
  "7": dynamic(() => import("@/components/ui/form7")),
  "8": dynamic(() => import("@/components/ui/form8")),
  "9": dynamic(() => import("@/components/ui/form9")),
  "10": dynamic(() => import("@/components/ui/form10")),
  "11": dynamic(() => import("@/components/ui/form11")),
  "12": dynamic(() => import("@/components/ui/form12")),
  "13": dynamic(() => import("@/components/ui/form13")),
  "14": dynamic(() => import("@/components/ui/form14")),
};

export default function CriteriaPage() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const FormComponent = formMap[id as string];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.username) setUsername(encodeURIComponent(user.username));
        if (user.department) setDepartment(user.department);
      } catch (err) {
        console.error("Failed to parse user info", err);
      }
    }
  }, []);

  if (!FormComponent) {
    return <div className="text-white text-center mt-10">Invalid criteria page</div>;
  }

  return (
    <div className="rounded-[10px] min-h-screen bg-gradient-to-b from-[#10074e] to-[#1E3C72] text-blue-900 p-5 relative">
      <Headings />
      <div>
        <p
          className="text-left text-white text-[25px] font-bold justify-center items-center font-sans ml-[35vw] mb-1 mt-3 tracking-wide relative"
          style={{ textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" }}
        >
          {department.toUpperCase()} 
        </p>
        <div className="flex justify-center items-center">
          {username && <Aside username={username} />}
          <div
            className="bg-white rounded-[15px] shadow-2xl px-10 py-10"
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
            <FormComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

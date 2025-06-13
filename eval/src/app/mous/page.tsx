"use client";
import { useEffect, useState } from "react";
import Headings from "@/components/heading";
import Form8 from "@/components/ui/form8";
import Aside from "@/components/aside";

export default function Home() {
  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("SCHOOL NAME");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.username) {
      setUsername(encodeURIComponent(user.username));
    }
    if (user.department) {
      setDepartment(user.department);
    }
  }, []);

  return (
    <div className="rounded-[10px] min-h-screen bg-gradient-to-b from-[#10074e] to-[#1E3C72] text-blue-900 p-5 relative">
      <Headings />
      <div>
        <p
          className="text-left text-white text-[25px] font-bold justify-center items-center font-sans ml-[35vw] mb-1 mt-3 tracking-wide  relative"
          style={{
            textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          {department ? department.toUpperCase() : "Loading Department..."}
        </p>
        <div className="flex justify-center items-center ">
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
            <Form8 />
          </div>
        </div>
      </div>
    </div>
  );
}

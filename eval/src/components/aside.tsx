//UEPFINAL/eval/src/components/aside.tsx
"use client";


import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AsideProps = {
  username: string;
};

export default function Aside({ username }: AsideProps) {
  
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const decodedUsername = decodeURIComponent(username);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    setName(user.name || "");
    setDepartment(user.department || "");
  }, []);

  return (
    <aside className="w-3/8 h-165 bg-gray-50 text-gray-800 p-[15px] rounded-[10px] flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-7">
          <Image
            className="rounded-[5px]"
            src="/images/college.jpg"
            alt="University Logo"
            width={600}
            height={300}
          />
        </div>

        <h2 className="text-center text-blue-800 font-extrabold font-serif text-lg text-[20px] mt-4">
          University Evaluation Portal
        </h2>

        <hr className="my-2" />

        <div className="w-full text-left text-s text-[#2d2525] space-y-3 mb-3 mt-5">
          <Link className="block" href="/">
            Home
          </Link>
          <hr className="border-t border-[#f7b636]" />

          <Link className="block" href="/year">
            Year
          </Link>
          <hr className="border-t border-[#f7b636]" />

          <Link className="block" href="/notification">
            Notification
          </Link>

          <div className="mt-5 text-sm">
            <p>
  <strong>Email:</strong> {decodedUsername}
</p>

            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>School:</strong> {department}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[20px] text-[#606060] mt-10 text-center">
        developed by{" "}
        <Link href="../images/theteam.jpg" className="text-[#5a45f3]">
          theteam
        </Link>
      </p>

      <div className="flex flex-wrap justify-center text-[10px] gap-x-2 w-full max-w-screen-sm">
        <a href="#" className="text-[#3C29d0] px-2 text-[15px]">Privacy Policy</a>
        <a href="#" className="text-[#3C29d0] px-2 text-[15px]">Contact Us</a>
        <a href="#" className="text-[#3C29d0] px-2 text-[15px]">About Us</a>
        <a href="#" className="text-[#3C29d0] px-2 text-[15px]">Admissions</a>
        <a href="#" className="text-[#3C29d0] px-2 text-[15px]">T&C</a>
      </div>
    </aside>
  );
}

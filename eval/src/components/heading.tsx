"use client"
//UEPFINAL/eval/src/components/heading.tsx
import Image from "next/image";
import logo from "../../public/images/logo1.jpg"; 
import { Autour_One } from "next/font/google";
export default function Headings() {
  return ( 
       <div className="bg-white h-[18vh] w-screen flex justify-start items-center" >
      <Image 
        src={logo}
        alt="College Logo"
        width={350}
        height={50}
        className="rounded-none inline-flex"
      />
    </div>
  );}
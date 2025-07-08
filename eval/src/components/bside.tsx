// UEPFINAL/eval/src/components/bside.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function Bside() {
  const router = useRouter();

  return (
    <aside className="w-1/3 h-[750px] bg-gray-50 text-gray-800 p-4 rounded-lg flex flex-col ">
      <div>
        <div className="flex justify-center mb-7">
          <Image
            className="rounded-20px"
            src="/images/logo1.jpg"
            alt="University Logo"
            width={300}
            height={200}
            priority
          />
        </div>
        <div className="flex justify-center mb-7">
          <Image
            className="rounded-md"
            src="/images/college.jpg"
            alt="University Logo"
            width={500}
            height={300}
            priority
          />
        </div>
        
        <h2 className="text-center text-blue-800 font-extrabold font-serif text-lg mt-4">
          University Evaluation Portal
        </h2>
        <hr className="my-2 border-gray-300" />
        <nav className="text-xs text-[#463737] space-y-3 mb-3">
          <Link href="/" className="block hover:underline">
            Home
          </Link>
          <hr className="border-t border-[#f7b636]" />

          <div className="space-y-2">
            <span className="block text-[#463737]">Year</span>
            <hr className="border-t border-[#f7b636]" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="block w-full text-left text-[#463737] hover:underline">
                User info
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 backdrop-blur-lg border-gray-300 text-[#2c2121] text-xs">
              <DropdownMenuItem onSelect={() => router.push('/addUser')}>
                Add User
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/editUser')}>
                Edit User Info
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/removeUser')}>
                Remove User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <hr className="border-t border-[#f7b636]" />

          <Link href="/addSchools" className="block hover:underline">
            Add schools
          </Link>

          <hr className="border-t border-[#f7b636]" />

          <span className="block">Notification</span>
        </nav>
      

      <footer className="text-center text-[10px] text-[#606060] mt-10">
        Developed by{' '}
        <Link href="../images/final.jpg" className="text-[#5a45f3] hover:underline">
          theteam
        </Link>
      </footer>

      <div className="flex flex-wrap justify-center text-[10px] gap-x-2 w-full max-w-screen-sm mt-2">
        <a href="#" className="text-[#3C29d0] px-2 hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="text-[#3C29d0] px-2 hover:underline">
          Contact Us
        </a>
        <a href="#" className="text-[#3C29d0] px-2 hover:underline">
          About Us
        </a>
        <a href="#" className="text-[#3C29d0] px-2 hover:underline">
          Admissions
        </a>
        <a href="#" className="text-[#3C29d0] px-2 hover:underline">
          T&amp;C
        </a>
        </div>
      </div>
    </aside>
  );
}
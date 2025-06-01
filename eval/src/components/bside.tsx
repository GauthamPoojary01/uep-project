"use client"
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
export default function Bside() {
    const router = useRouter();
    return (
      <aside className="w-3/9 h-170 bg-gray-50 text-gray-800 p-[15px] p-1-+6 rounded-[10px] flex flex-col justify-between">
          <div >
            <div className="flex justify-center mb-7">
               <Image
                          className="rounded-[5px]"
                          src="/images/college.jpg"
                          alt="University Logo"
                          width={600}
                          height={300}
                        />

            </div>
            <h2 className="text-center text-blue-800. font-extrabold font-serif text-lg text-[20px] mt-4 ">University Evaluation Portal</h2>
            <hr className="my-02" />
            <div className="w-full text-left text-xs text-[#2d2525] space-y-3 mb-5 mt-5">
            <Link className="block" href="/">Home</Link>
           <div className="w-full text-left text-xs text-[#606060] space-y-1 mb-3">
  <br />
  <a href="#" className="block">Year</a>
  <hr className="border-t border-[#f7b636]" />

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="block w-full text-left text-[#606060] text-xs">User info</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-48">
      <DropdownMenuItem onSelect={() => router.push("@/app/addUser")}>
        Add User
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push("@/app/editUser")}>
        Edit User Info
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push("@/app/removeUser")}>
        Remove User
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <hr className="border-t border-[#f7b636]" />
  <a href="#" className="block">Add schools</a>
  <hr className="border-t border-[#f7b636]" />
  <a href="#" className="block">Notification</a>
</div>
          </div>
            </div>
            <p className="text-[10px] text-[#606060] mt-30 justify-center items-center text-center">
            developed by  <Link href="../images/final.jpg" className="text-[#5a45f3]"> theteam</Link>
          </p>
          <div className="flex flex-wrap justify-center text-[10px] gap-x-2 w-full max-w-screen-sm">
            <a href="#" className="text-[#3C29d0] px-2">Privacy Policy</a>
            <a href="#" className="text-[#3C29d0] px-2">Contact Us</a>
            <a href="#" className="text-[#3C29d0] px-2">About Us</a>
            <a href="#" className="text-[#3C29d0] px-2">Admissions</a>
            <a href="#" className="text-[#3C29d0] px-2">T&C</a>
          </div>
          
        </aside>
    );
}
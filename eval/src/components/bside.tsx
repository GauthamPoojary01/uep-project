"use client"
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
export default function Bside() {
    const router = useRouter();
    return (
      <aside className="w-3/9 h-150 bg-gray-50 text-gray-800 p-[15px] p-1-+6 rounded-[10px] flex flex-col justify-between">
          
          <div  >
            <div className="flex justify-center mb-7">
              <Image className="rounded-[5px]" src="/images/college.jpg" alt="University Logo" width={600} height={300} />

            </div>
            <h2 className="text-center text-blue-800. font-extrabold font-serif text-lg text-[20px] mt-4 ">University Evaluation Portal</h2>
            <hr className="my-02" />
            <div className="w-full text-left text-xs text-[#463737] space-y-2 mb-5 mt-5">
            <Link className="block" href="/">Home</Link>
              <hr className="border-t border-[#f7b636]" />
           <div className="w-full text-left text-xs text-[#463737] space-y-2 mb-5 ">
  <a href="#" className="block">Year</a>
  <hr className="border-t border-[#f7b636]" />

  <DropdownMenu >
    <DropdownMenuTrigger asChild>
      <button className="block w-full text-left text-[#463737] text-xs">User info</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-38 backdrop-blur-lg border-gray-300 text-[#2c2121] text-xs">
      <DropdownMenuItem onSelect={() => router.push("/login_user/add_user")}>
        Add User
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push("/login_user/edit_user")}>
        Edit User Info
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push("/login_user/remove_user")}>
        Remove User
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <hr className="border-t border-[#f7b636]" />
  <Link href="/add_schl" className="block">Add schools</Link>
  <hr className="border-t border-[#f7b636]" />
  <a href="#" className="block">Notification</a>
</div>
          </div>
            </div>
            <p className="text-[10px] text-[#606060] mt-20 justify-center items-center text-center">
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
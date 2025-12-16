"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-center w-full h-16 md:h-[70px] px-4 py-2 bg-color1">
      <div className="flex items-center h-full w-full justify-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="md:hidden">
            <Image
              src="/assets/signup/caelum_logo_white.png"
              alt="Caelum Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-cover"
            />
          </Link>
          <span className="font-bold md:hidden">×</span>
          <div className="w-full h-full font-bold sm:text-xl md:text-2xl lg:text-3xl text-color3 py-2 rounded-md">
            Caelum High School
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-color3">
            <FaUserCircle size={24} />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        )}
        <button
          onClick={() => logout()}
          className="p-2 text-color3 hover:opacity-80 transition-opacity"
          title="Logout"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>
    </nav>
  );
}

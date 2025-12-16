"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { IoClose } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import {
  MdDashboard,
  MdMenuBook,
  MdPerson,
  MdCalculate,
  MdChat,
  MdArticle,
} from "react-icons/md";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

const teacherNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    href: "/lesson-planner",
    label: "Lesson Planner",
    icon: <MdMenuBook size={24} />,
  },
];

const investorNavItems: NavItem[] = [
  {
    href: "/investor/dashboard",
    label: "Dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    href: "/investor/calculator",
    label: "Calculator",
    icon: <MdCalculate size={24} />,
  },
  {
    href: "/investor/chat",
    label: "AI Chat",
    icon: <MdChat size={24} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isBubbleVisible, setBubbleVisible] = useState(true);

  const isActive = (path: string) => pathname.includes(path);
  const isInvestor = user?.userType === "Investor";
  const navItems = isInvestor ? investorNavItems : teacherNavItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white w-24 z-40 sidebar-shadow">
        <div className="p-4 flex justify-center items-center mb-20">
          <Link href="/">
            <Image
              src="/assets/sidebar/caelum_logo.png"
              alt="Caelum Logo"
              width={54}
              height={54}
              className="h-[54px] w-auto object-cover"
            />
          </Link>
        </div>

        <div className="flex-grow p-2">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col gap-2 items-center p-2 rounded-md w-full text-xs font-bold transition-colors",
                  isActive(item.href)
                    ? "text-color1"
                    : "text-color3 hover:text-color1"
                )}
              >
                <span
                  className={
                    isActive(item.href) ? "text-color1" : "text-color3"
                  }
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "px-2 rounded-sm text-center",
                    isActive(item.href)
                      ? "bg-color1 text-color3"
                      : "bg-white text-color4"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Monica AI Chat Button (for teachers) */}
        {!isInvestor && (
          <div className="flex flex-col items-center mt-4 pt-6 pb-6">
            <Link href="/monica-chat">
              <div
                className={cn(
                  "w-16 h-16 bg-color6 rounded-full shadow-lg cursor-pointer flex items-center justify-center",
                  isActive("/monica-chat") && "ring-2 ring-color1"
                )}
              >
                <MdPerson size={32} className="text-color3" />
              </div>
            </Link>
            {isBubbleVisible && pathname !== "/monica-chat" && (
              <div className="relative mt-2">
                <div className="absolute bottom-10 left-8 bg-white w-28 rounded-3xl px-2 pt-5 pb-7 text-xs max-w-xs card-shadow">
                  <button
                    onClick={() => setBubbleVisible(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    <IoClose className="w-4 h-4" />
                  </button>
                  <span className="text-color3">
                    Hi! I&apos;m Monica, your AI teaching assistant!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => logout()}
            className="flex flex-col items-center gap-1 w-full text-color3 hover:text-red-500 transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2",
                isActive(item.href) ? "text-color1" : "text-color3"
              )}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
          {!isInvestor && (
            <Link
              href="/monica-chat"
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2",
                isActive("/monica-chat") ? "text-color1" : "text-color3"
              )}
            >
              <MdPerson size={24} />
              <span className="text-[10px]">Monica</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

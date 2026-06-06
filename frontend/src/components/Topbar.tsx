"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, ChevronDown, LayoutGrid, LogOut, UserCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useProfileStore } from "@/store/useProfileStore";
import Image from "next/image";

export const Topbar = () => {
  const { data: session } = useSession();
  const setIsEditModalOpen = useProfileStore((state) => state.setIsEditModalOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-gray-200/60 shrink-0 relative z-40 print:hidden">
      <Link href="/dashboard" className="flex items-center gap-4 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold">Dashboard</span>
        </div>
      </Link>

      <div className="flex items-center gap-6 relative">
        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 py-1.5 px-2 rounded-lg transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 overflow-hidden shadow-sm shrink-0 border border-gray-100 relative">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <UserCircle className="w-full h-full text-white bg-gray-400" />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
              {session?.user?.name || "Loading..."}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsEditModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                Edit Profile
              </button>
              <div className="h-px bg-gray-100 my-1 mx-2"></div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

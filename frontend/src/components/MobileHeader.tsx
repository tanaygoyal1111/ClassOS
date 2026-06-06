"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { UserCircle, LogOut } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';

export const MobileHeader = () => {
  const { data: session } = useSession();
  const setIsEditModalOpen = useProfileStore((state) => state.setIsEditModalOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click/touch
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex md:hidden items-center justify-between bg-white px-6 py-4 rounded-b-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] fixed top-0 left-0 w-full z-50 border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#18181B] rounded-lg flex items-center justify-center shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20V20H4V4Z" fill="white"/>
          </svg>
        </div>
        <span className="font-bold text-[19px] tracking-tight text-gray-900">ClassOS</span>
      </div>
      
      {/* Profile Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 overflow-hidden border-2 border-white shadow-sm shrink-0 relative cursor-pointer active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          aria-label="Open user menu"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User Avatar"}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <UserCircle className="w-full h-full text-white bg-gray-400" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900 truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {session?.user?.email || ""}
              </p>
            </div>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setIsEditModalOpen(true);
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-2.5"
            >
              <UserCircle className="w-4 h-4" />
              Edit Profile
            </button>
            <div className="h-px bg-gray-100 my-1 mx-3"></div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors flex items-center gap-2.5"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

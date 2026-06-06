"use client";

import React from 'react';
import { LayoutGrid, Folder, FilePlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:hidden bg-[#18181B] rounded-[2rem] px-6 pt-4 pb-4 pb-safe z-50 shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex justify-between items-center text-gray-400">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1.5 transition-colors w-[4.5rem] ${pathname === '/dashboard' ? 'text-white' : 'hover:text-white'}`}>
        <LayoutGrid className="w-5 h-5" fill="currentColor" fillOpacity={pathname === '/dashboard' ? 1 : 0.2} />
        <span className="text-[11px] font-medium">Home</span>
      </Link>
      
      <Link href="/groups" className={`flex flex-col items-center gap-1.5 transition-colors w-[4.5rem] ${pathname.includes('/groups') ? 'text-white' : 'hover:text-white'}`}>
        <div className="relative">
          <Folder className="w-5 h-5" fill="currentColor" fillOpacity={pathname.includes('/groups') ? 1 : 0.2} />
        </div>
        <span className="text-[11px] font-medium">My Groups</span>
      </Link>
      
      <Link href="/library" className={`flex flex-col items-center gap-1.5 transition-colors w-[4.5rem] ${pathname.startsWith('/library') ? 'text-white' : 'hover:text-white'}`}>
        <FilePlus className="w-5 h-5" fill="currentColor" fillOpacity={pathname.startsWith('/library') ? 1 : 0.2} />
        <span className="text-[11px] font-medium">Library</span>
      </Link>
      
      <Link href="/toolkit" className={`flex flex-col items-center gap-1.5 transition-colors w-[4.5rem] ${pathname.startsWith('/toolkit') ? 'text-[#FF5A36]' : 'hover:text-white'}`}>
        <Sparkles className="w-5 h-5" fill="currentColor" fillOpacity={pathname.startsWith('/toolkit') ? 1 : 0.2} />
        <span className="text-[11px] font-medium">AI Toolkit</span>
      </Link>
    </div>
  );
};

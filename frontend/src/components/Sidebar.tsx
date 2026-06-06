"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LayoutGrid, Folder, FileText, Smartphone, Clock, Settings, Shield, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useProfileStore } from '@/store/useProfileStore';
import { useAssignmentsStore } from '@/store/useAssignmentsStore';

const NavItem = ({ icon: Icon, label, href, active = false, badge = null }: { icon: any, label: string, href: string, active?: boolean, badge?: string | null }) => {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${active ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? 'text-gray-900' : 'text-gray-400'}`} />
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="bg-[#FF5A36] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export const Sidebar = () => {
  const { data: session } = useSession();
  const setIsEditModalOpen = useProfileStore((state) => state.setIsEditModalOpen);
  const assignments = useAssignmentsStore((state) => state.assignments);
  const assignmentCount = assignments.length;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const schoolName = (session?.user as any)?.schoolName;
  const location = (session?.user as any)?.location;

  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[260px] bg-white h-screen border-r border-gray-200/60 flex-col px-4 py-6 shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10 shrink-0 relative print:hidden">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-[#18181B] text-white flex items-center justify-center rounded-lg font-bold text-xl shadow-sm">
          C
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">ClassOS</span>
      </Link>

      {/* Primary Toolkit Button */}
      <Link href="/toolkit" className="w-full bg-[#27272A] hover:bg-[#18181B] transition-colors text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 mb-8 shadow-sm border border-gray-700">
        <Sparkles className="w-4 h-4 text-[#FF5A36]" />
        <span className="text-sm font-semibold">AI Teacher's Toolkit</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        <NavItem 
          icon={LayoutGrid} 
          label="Home" 
          href="/dashboard"
          active={pathname === '/dashboard'}
        />
        <NavItem 
          icon={Folder} 
          label="My Groups" 
          href="/groups"
          active={pathname.includes('/groups')}
        />
        <NavItem 
          icon={FileText} 
          label="Assignments" 
          href="/assignments"
          active={pathname.includes('/assignments')} 
          badge={mounted ? assignmentCount.toString() : "..."} 
        />
        <NavItem 
          icon={Smartphone} 
          label="AI Teacher's Toolkit" 
          href="/toolkit" 
          active={pathname.startsWith('/toolkit')}
        />
        <NavItem 
          icon={Clock} 
          label="My Library" 
          href="/library" 
          active={pathname.startsWith('/library')}
        />
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col gap-4">

        {/* Profile / School Card */}
        {schoolName ? (
          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-gray-50/80 rounded-2xl p-3 flex items-center gap-3 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 border border-gray-200 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">{schoolName}</span>
              <span className="text-xs text-gray-500 truncate mt-0.5">{location || "Location not set"}</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 hover:text-gray-900"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-bold tracking-tight">Setup Institution</span>
          </button>
        )}
      </div>
    </aside>
  );
};

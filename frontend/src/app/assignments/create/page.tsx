import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { CreateAssignment } from "@/components/CreateAssignment";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function CreateAssignmentPage() {
  return (
    <div className="h-screen w-full flex bg-[#EAECEF] overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 w-full md:w-auto flex flex-col min-w-0">
        <div className="hidden md:block">
          <Topbar />
        </div>
        <MobileHeader />
        
        <main className="flex-1 overflow-x-hidden p-0 pb-32 md:p-8 md:pb-8 overflow-y-auto relative bg-gradient-to-br from-[#EAECEF] to-[#E2E4E8]">
          <CreateAssignment />
        </main>
        
        <MobileBottomNav />
      </div>
    </div>
  );
}

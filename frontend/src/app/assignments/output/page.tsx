import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { AssignmentOutput } from "@/components/AssignmentOutput";

export default function OutputPage() {
  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-8 overflow-hidden relative flex flex-col items-center">
          <div className="w-full max-w-5xl h-full">
            <AssignmentOutput />
          </div>
        </main>
      </div>
    </div>
  );
}

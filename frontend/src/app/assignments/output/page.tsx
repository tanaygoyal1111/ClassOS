import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { AssignmentOutput } from "@/components/AssignmentOutput";

export default function OutputPage() {
  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900 print:h-auto print:block print:bg-white print:overflow-visible">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 print:block print:overflow-visible">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 p-8 overflow-hidden relative flex flex-col items-center print:p-0 print:overflow-visible print:block print:h-auto">
          <div className="w-full max-w-5xl h-full print:m-0 print:max-w-none print:h-auto print:block print:overflow-visible">
            <AssignmentOutput />
          </div>
        </main>
      </div>
    </div>
  );
}

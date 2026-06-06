import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Assignment } from "@/models/Assignment";
import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import { PaperRenderer } from "@/components/shared/PaperRenderer";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { PrintActionCard } from "@/components/PrintActionCard";

export default async function InternalAssignmentView({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).id) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();

  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    notFound();
  }

  // STRICT OWNERSHIP CHECK: Only the creator can view this internal detailed version
  if (assignment.userId !== (session.user as any).id) {
    notFound(); // Alternatively, throw 403 Forbidden
  }

  // Prepare full paper data (including answers) for the teacher's internal view
  const fetchedDbDoc = assignment as any;
  const paperContent = fetchedDbDoc.paperContent || {};

  const fullPaperData = {
    institutionName: fetchedDbDoc.institutionName || "",
    subject: fetchedDbDoc.subject || "",
    classLevel: fetchedDbDoc.classLevel || "",
    studentFields: Array.isArray(fetchedDbDoc.studentFieldsSnapshot) 
      ? fetchedDbDoc.studentFieldsSnapshot 
      : [],
    paperTitle: paperContent.paperTitle || "Untitled Paper",
    totalMarks: paperContent.totalMarks || 0,
    timeAllowed: paperContent.timeAllowed || "N/A",
    sections: paperContent.sections || [],
    answerKey: paperContent.answerKey || [] // Deliberately kept for teacher view
  };

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900 print:h-auto print:block print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 print:block">
        <div className="print:hidden">
          <Topbar />
        </div>
        
        <main className="flex-1 p-8 overflow-y-auto relative flex flex-col items-center print:p-0 print:overflow-visible">
          <div className="w-full max-w-[850px] mx-auto space-y-6">
            
            <PrintActionCard paperTitle={fullPaperData.paperTitle} />

            <div id="paper-pdf-container" className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-12 md:px-20 md:py-16 text-gray-900 border border-gray-200 print:shadow-none print:border-none print:m-0 print:max-w-none print:p-0">
              <PaperRenderer paperData={fullPaperData} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

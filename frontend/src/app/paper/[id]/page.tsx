import { Assignment } from "@/models/Assignment";
import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { PaperRenderer } from "@/components/shared/PaperRenderer";

// TASK 1: STRICT SERVER-SIDE DATA SANITIZATION UTILITY
// We perform an explicit, surgical mapping from the raw DB document to the
// safe rendering object. We never use spread syntax (...) to prevent data leakage.
function sanitizeSectionsSecurely(sectionsData: any) {
  if (!Array.isArray(sectionsData)) return [];
  
  return sectionsData.map((section: any) => {
    return {
      sectionName: section.sectionName || "Section",
      instructions: section.instructions || "",
      questions: Array.isArray(section.questions) ? section.questions.map((q: any) => {
        // EXPLICIT WHITELIST: Only these fields survive the sanitization process.
        // We do not use spread operators (`...q`) which could inadvertently copy injected answers.
        return {
          questionType: q.questionType,
          questionText: q.questionText,
          options: Array.isArray(q.options) ? q.options : undefined,
          orQuestionText: q.orQuestionText || undefined,
          marks: q.marks,
          difficulty: q.difficulty,
          isOrChoice: !!q.isOrChoice
        };
      }) : []
    };
  });
}

export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();

  // Fetch directly from DB via Server Component (bypassing Client APIs)
  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    notFound();
  }

  // --------------------------------------------------------------------------
  // EXECUTING SECURITY MEASURE: STRICT EXPLICIT DB DATA MAPPING
  // --------------------------------------------------------------------------
  // We explicitly construct the sanitized object field by field. 
  // We extract metadata headers directly from the root DB document,
  // and we securely sanitize the nested AI paper content to physically drop
  // 'answerKey' or any inline hallucinated answers before JSX hydration.
  
  const fetchedDbDoc = assignment as any;
  const paperContent = fetchedDbDoc.paperContent || {};

  const sanitizedPaperDataForRenderer = {
    // 1. Explicitly Map Metadata Headers (Image 5 Parity)
    institutionName: fetchedDbDoc.institutionName || "", // Safely maps the explicit DB field
    subject: fetchedDbDoc.subject || "",
    classLevel: fetchedDbDoc.classLevel || "",
    // Correctly map studentFields to generate the fill-in-the-blank lines (Name, Roll No)
    studentFields: Array.isArray(fetchedDbDoc.studentFieldsSnapshot) 
      ? fetchedDbDoc.studentFieldsSnapshot 
      : [],

    // 2. Map Core Content securely
    paperTitle: paperContent.paperTitle || "Untitled Paper",
    totalMarks: paperContent.totalMarks || 0,
    timeAllowed: paperContent.timeAllowed || "N/A",
    sections: sanitizeSectionsSecurely(paperContent.sections) // Answers strictly stripped
  };

  if (!sanitizedPaperDataForRenderer || !sanitizedPaperDataForRenderer.paperTitle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] py-12 px-4 font-sans text-gray-900 selection:bg-blue-100">
      <div className="max-w-[850px] mx-auto bg-white rounded-none md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 p-12 md:px-20 md:py-16">
        <PaperRenderer paperData={sanitizedPaperDataForRenderer} />
      </div>
    </div>
  );
}

import React from 'react';

export interface PaperData {
  paperTitle?: string;
  subject?: string;
  classLevel?: string;
  timeAllowed?: string;
  totalMarks?: number;
  institutionName?: string;
  studentFields?: string[];
  sections?: Array<{
    sectionName?: string;
    instructions?: string;
    questions?: Array<{
      difficulty?: string;
      questionText?: string;
      marks?: number;
      options?: string[];
      isOrChoice?: boolean;
      orQuestionText?: string;
    }>;
  }>;
  answerKey?: Array<{
    questionText?: string;
    answer?: string;
  }>;
}

interface PaperRendererProps {
  paperData: PaperData;
}

export const PaperRenderer: React.FC<PaperRendererProps> = ({ paperData }) => {
  if (!paperData) return null;

  return (
    <>
      {/* Paper Header */}
      <div className="text-center mb-10 flex flex-col gap-2">
        <h1 className="text-[28px] font-bold tracking-tight text-black">
          {paperData.institutionName || "Institution Name"}
        </h1>
        <h2 className="text-[20px] font-bold text-black">
          Subject: {paperData.subject}
        </h2>
        <h3 className="text-[20px] font-bold text-black">
          Class: {paperData.classLevel}
        </h3>
      </div>

      {/* Time and Marks Row */}
      <div className="flex justify-between items-center font-bold text-[15.5px] mb-6">
        <span>Time Allowed: {paperData.timeAllowed}</span>
        <span>Maximum Marks: {paperData.totalMarks}</span>
      </div>

      <p className="font-bold text-[15px] mb-8">
        All questions are compulsory unless stated otherwise.
      </p>

      {/* Student Fields */}
      {paperData.studentFields && paperData.studentFields.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-14 font-semibold text-[15px]">
          {paperData.studentFields.map((field: string) => (
            <p key={field}>{field}: _____________________________________</p>
          ))}
        </div>
      )}

      {/* Sections */}
      {paperData.sections?.map((section, sIdx) => (
        <div key={sIdx} className="mb-16">
          <div className="break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h3 className="text-center text-[22px] font-bold mb-6">
              {section.sectionName}
            </h3>
            {section.instructions && (
              <div className="mb-8">
                <p className="text-[14px] italic text-gray-700 mt-0.5">
                  {section.instructions}
                </p>
              </div>
            )}
          </div>
          
          <ol className="list-decimal pl-5 space-y-6 text-[15px] font-medium text-gray-900">
            {section.questions?.map((q, qIdx) => (
              <li key={qIdx} className="pl-3 leading-relaxed break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div>
                  {q.difficulty && (
                    <span className="text-gray-500 font-normal">[{q.difficulty}]</span>
                  )}{" "}
                  {q.questionText}{" "}
                  {q.marks ? (
                    <span className="text-gray-600 font-normal">[{q.marks} Marks]</span>
                  ) : null}
                </div>
                
                {/* Render MCQ Options if present */}
                {q.options && q.options.length > 0 && (
                  <ul className="list-[lower-alpha] pl-6 mt-3 space-y-1.5 text-gray-800">
                    {q.options.map((opt: string, oIdx: number) => (
                      <li key={oIdx}>{opt}</li>
                    ))}
                  </ul>
                )}

                {/* Render Internal Choice (OR) if present */}
                {q.isOrChoice && q.orQuestionText && (
                  <div className="my-4">
                    <span className="font-bold text-center text-gray-500 italic block mb-2">OR</span>
                    <div className="text-gray-900">{q.orQuestionText}</div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}

      <p className="font-bold text-[13px] mt-12 text-gray-800 text-center">
        End of Question Paper
      </p>

      {/* Answer Key (Only renders if it exists in the payload) */}
      {paperData.answerKey && paperData.answerKey.length > 0 && (
        <div className="mt-16 pt-10 border-t-2 border-dashed border-gray-300 break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h3 className="text-[20px] font-bold mb-6">Answer Key:</h3>
          <ol className="list-decimal pl-5 space-y-6 text-[14.5px] font-medium text-gray-800">
            {paperData.answerKey.map((ans, aIdx) => (
              <li key={aIdx} className="pl-3 leading-relaxed whitespace-pre-line break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <span className="font-bold block mb-1 text-gray-600">
                  {ans.questionText}
                </span>
                {ans.answer}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
};

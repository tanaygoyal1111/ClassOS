import { useFormStore } from '../store/useFormStore';
import { useAssignmentsStore } from '../store/useAssignmentsStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useGenerateAssignment = () => {
  const {
    basicInfo,
    sections,
    setIsGenerating,
    setGenerationStatus,
    setGeneratedPaper,
  } = useFormStore();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const generate = async () => {
    try {
      setIsGenerating(true);
      setGenerationStatus("Parsing document...");

      let extractedText = "";

      // 1. Parse Step
      if (basicInfo.uploadedFile) {
        const formData = new FormData();
        formData.append('file', basicInfo.uploadedFile);

        const parseRes = await fetch(`${API_URL}/api/v1/parse-document`, {
          method: 'POST',
          body: formData,
        });

        if (!parseRes.ok) {
          const errData = await parseRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to parse document");
        }
        const parseData = await parseRes.json();
        extractedText = parseData.text || "";
      }

      setGenerationStatus("Initializing AI Brain...");

      // 2. Queue Step
      const generateRes = await fetch(`${API_URL}/api/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            classLevel: basicInfo.classLevel,
            subject: basicInfo.subject,
            timeAllowed: basicInfo.timeAllowed,
            additionalInfo: basicInfo.instructions,
            totalMarks: sections.reduce((total, section) => 
              total + section.questions.reduce((sum, q) => sum + (Number(q.count || 0) * Number(q.marks || 0)), 0), 
            0),
            sections
          },
          extractedText
        })
      });

      if (!generateRes.ok) {
        const errData = await generateRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to queue generation job");
      }
      
      const generateData = await generateRes.json();
      const jobId = generateData.jobId;

      setGenerationStatus("AI is crafting your assignment...");

      // 3. Polling Step
      const MAX_ATTEMPTS = 30; // 90 seconds timeout (30 * 3s)
      let pollingAttempts = 0;

      const poll = setInterval(async () => {
        pollingAttempts++;

        if (pollingAttempts >= MAX_ATTEMPTS) {
          clearInterval(poll);
          toast.error("Request timed out. The AI took too long.");
          setIsGenerating(false);
          return;
        }

        try {
          const statusRes = await fetch(`${API_URL}/api/v1/job-status/${jobId}`);
          if (!statusRes.ok) {
             const errData = await statusRes.json().catch(() => ({}));
             throw new Error(errData.error || "Failed to fetch job status");
          }
          const statusData = await statusRes.json();

          if (statusData.status === 'completed') {
            clearInterval(poll);
            
            // Save to Zustand
            setGeneratedPaper(statusData.result);
            
            // Save to persistent Assignments Store
            const newAssignment = {
              id: Date.now().toString(),
              title: statusData.result.paperTitle || "AI Generated Assignment",
              classLevel: basicInfo.classLevel,
              subject: basicInfo.subject,
              assignedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
              dueDate: basicInfo.dueDate || new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
              paperData: statusData.result,
              basicInfoSnapshot: basicInfo
            };

            // Save to MongoDB
            try {
              const saveRes = await fetch('/api/assignments', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: newAssignment.title,
                  classLevel: newAssignment.classLevel,
                  subject: newAssignment.subject,
                  paperContent: statusData.result,
                  groupId: basicInfo.groupId,
                  institutionName: basicInfo.institutionName,
                  studentFieldsSnapshot: basicInfo.studentFields
                })
              });

              if (!saveRes.ok) {
                const errorText = await saveRes.text();
                console.error(`Failed to save to MongoDB [${saveRes.status}]:`, errorText);
                
                if (saveRes.status === 401) {
                  toast.error("Session expired. Please log in again and retry.");
                } else if (saveRes.status === 413) {
                  toast.error("Assignment data too large to save. Try reducing content.");
                } else {
                  toast.error("Generated successfully, but failed to save to database.");
                }
                setIsGenerating(false);
                return; // Stop execution, do not push
              } 
              
              const saveData = await saveRes.json();
              if (saveData.success && saveData.assignmentId) {
                newAssignment.id = saveData.assignmentId;
              }

              // Only save to Zustand and Route if DB save succeeds
              useAssignmentsStore.getState().addAssignment(newAssignment);
              setIsGenerating(false);
              toast.success("Assignment generated successfully!");
              router.push('/assignments/output');

            } catch (saveErr: any) {
              console.error('MongoDB save error:', saveErr);
              toast.error(saveErr?.message === 'Failed to fetch'
                ? "Network error while saving. Check your connection."
                : "Failed to connect to database for saving."
              );
              setIsGenerating(false);
            }
          } else if (statusData.status === 'failed') {
            clearInterval(poll);
            toast.error(statusData.error || statusData.failedReason || "Generation failed.");
            setIsGenerating(false);
          }
          // if processing, continue polling
        } catch (err: any) {
          clearInterval(poll);
          toast.error(err.message || "An error occurred during polling.");
          setIsGenerating(false);
        }
      }, 3000);

    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
      setIsGenerating(false);
    }
  };

  return { generate };
};

'use client';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FileText, X } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';
import { toast } from 'sonner';

export const FileUploadZone = () => {
  const uploadedFile = useFormStore(state => state.basicInfo.uploadedFile);
  const setUploadedFile = useFormStore(state => state.setUploadedFile);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-too-large') {
        toast.error("File is too large. Max size is 5MB.");
      } else if (error.code === 'file-invalid-type') {
        toast.error("Invalid file format. Please upload PDF, DOCX, or TXT.");
      } else {
        toast.error(`Upload error: ${error.message}`);
      }
      return;
    }

    // Secondary safety net: manually reject oversized files
    // (guards against browsers where dropzone's maxSize is unreliable)
    if (acceptedFiles.length > 0 && acceptedFiles[0].size > MAX_FILE_SIZE) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, [setUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5242880, // 5MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        {...getRootProps()} 
        className={`w-full border-[1.5px] border-dashed rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center transition-colors cursor-pointer shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] ${
          isDragActive ? 'border-[#FF5A36] bg-gray-50' : 'border-gray-200/80 bg-white hover:bg-gray-50/50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploadedFile ? (
          <div className="flex flex-col items-center">
            <div className="bg-white p-3.5 rounded-full shadow-sm border border-gray-100 mb-4 flex relative animate-in zoom-in duration-200">
              <FileText className="w-7 h-7 text-gray-800" />
              <button 
                onClick={handleClearFile}
                className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-0.5 hover:bg-red-200 transition-colors shadow-sm"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1 tracking-tight truncate max-w-[280px]">{uploadedFile.name}</h3>
            <p className="text-[13px] text-gray-400 font-medium">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center group">
            <div className={`bg-white p-3.5 rounded-full shadow-sm border mb-4 transition-transform ${isDragActive ? 'border-[#FF5A36]/30' : 'border-gray-100 group-hover:-translate-y-1'}`}>
              <CloudUpload className={`w-5 h-5 ${isDragActive ? 'text-[#FF5A36]' : 'text-gray-800'}`} />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1.5 tracking-tight">
              {isDragActive ? "Drop the file here..." : "Choose a file or drag & drop it here"}
            </h3>
            <p className="text-[13px] text-gray-400 mb-5 font-medium">Upload PDF, DOCX, or TXT (Max 5MB)</p>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors px-5 py-2 rounded-full text-xs font-bold border border-gray-200/80 shadow-sm pointer-events-none">
              Browse Files
            </button>
          </div>
        )}
      </div>
      <p className="text-[13px] text-gray-500 mt-4 font-medium text-center max-w-[300px]">
        Upload reference material or syllabus documents for AI processing
      </p>
    </div>
  );
};

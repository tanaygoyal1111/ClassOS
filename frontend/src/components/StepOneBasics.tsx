'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';
import { useFormStore } from '@/store/useFormStore';
import { useGroupsStore } from '@/store/useGroupsStore';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const PREDEFINED_STUDENT_FIELDS = ['Name', 'Roll Number', 'Section', 'Date'];

export const StepOneBasics = () => {
  // High-performance granular atomic selectors to prevent unnecessary re-renders
  const classLevel = useFormStore(state => state.basicInfo.classLevel);
  const subject = useFormStore(state => state.basicInfo.subject);
  const institutionName = useFormStore(state => state.basicInfo.institutionName);
  const studentFields = useFormStore(state => state.basicInfo.studentFields);
  const dueDate = useFormStore(state => state.basicInfo.dueDate);
  const timeAllowed = useFormStore(state => state.basicInfo.timeAllowed);
  const groupId = useFormStore(state => state.basicInfo.groupId);
  const updateBasicInfo = useFormStore(state => state.updateBasicInfo);

  const { groups, fetchGroups } = useGroupsStore();

  useEffect(() => {
    if (groups.length === 0) {
      fetchGroups();
    }
  }, [groups.length, fetchGroups]);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let selectedDate: Date | undefined;
  if (dueDate) {
    try {
      const [d, m, y] = dueDate.split('-');
      if (d && m && y) {
         selectedDate = new Date(Number(y), Number(m) - 1, Number(d));
      }
    } catch (e) {}
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, 'dd-MM-yyyy');
      updateBasicInfo('dueDate', formatted);
      setIsDatePickerOpen(false);
    }
  };

  const formattedDisplayDate = selectedDate ? format(selectedDate, 'dd MMMM yyyy') : '';

  return (
    <div className="flex flex-col gap-7 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Class/Grade</label>
          <input 
            type="text" 
            placeholder="e.g., Grade 10"
            value={classLevel || ""}
            onChange={(e) => updateBasicInfo('classLevel', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Subject</label>
          <input 
            type="text" 
            placeholder="e.g., Science"
            value={subject || ""}
            onChange={(e) => updateBasicInfo('subject', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
        </div>
      </div>

      {/* NEW: Institution Name Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Institution/School Name (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g., Delhi Public School"
            value={institutionName || ""}
            onChange={(e) => updateBasicInfo('institutionName', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Assign to Group (Optional)</label>
          <div className="relative">
            <select
              value={groupId || ""}
              onChange={(e) => updateBasicInfo('groupId', e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">None / Unassigned</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Student Detail Fields (Pill Toggles) */}
      <div>
        <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Required Student Fields on Paper</label>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {PREDEFINED_STUDENT_FIELDS.map(field => {
            const isSelected = studentFields?.includes(field);
            return (
              <button
                key={field}
                onClick={() => updateBasicInfo('studentFields', field)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${isSelected ? 'bg-[#18181B] text-white shadow-md hover:bg-black hover:scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {field}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Due Date</label>
          <div className="relative" ref={datePickerRef}>
            <div 
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-sm cursor-pointer flex items-center justify-between"
            >
              <span className={formattedDisplayDate ? 'text-gray-900 font-bold' : 'text-gray-400 font-semibold'}>
                {formattedDisplayDate || 'Select Due Date'}
              </span>
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>

            {isDatePickerOpen && (
              <div className="absolute top-14 left-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-[20px] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="font-sans"
                  classNames={{
                    selected: "bg-[#18181B] text-white hover:bg-black hover:text-white rounded-xl font-bold",
                    today: "font-bold text-[#FF5A36]",
                    day_button: "hover:bg-gray-100 rounded-xl transition-colors w-9 h-9 flex items-center justify-center",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Time Allowed</label>
          <input 
            type="text" 
            placeholder="e.g., 45 minutes"
            value={timeAllowed || ""}
            onChange={(e) => updateBasicInfo('timeAllowed', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
        </div>
      </div>

      <FileUploadZone />
    </div>
  );
};

"use client";

import React, { useState, useEffect } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const EditProfileModal = () => {
  const { isEditModalOpen, setIsEditModalOpen } = useProfileStore();
  const { data: session, update } = useSession();
  const router = useRouter();

  const [schoolName, setSchoolName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setSchoolName((session.user as any).schoolName || '');
      setLocation((session.user as any).location || '');
    }
  }, [session]);

  if (!isEditModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolName, location }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      // Update the NextAuth session locally to reflect changes immediately
      await update({
        schoolName,
        location,
      });

      toast.success('Profile updated successfully');
      setIsEditModalOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while updating your profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Edit Profile</h2>
          <button 
            onClick={() => setIsEditModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Read-only Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm font-medium cursor-not-allowed">
              {session?.user?.name || 'Loading...'}
            </div>
            <p className="text-xs text-gray-400 font-medium">Name is synced with your Google account.</p>
          </div>

          {/* Institution Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Institution Name</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Delhi Public School"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">City / Location</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bokaro Steel City"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

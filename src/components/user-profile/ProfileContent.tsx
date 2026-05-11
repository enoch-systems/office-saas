"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfileContent() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isClient] = useState(true);
  
  const { data: userData, loading, error } = useUserProfile();

  useEffect(() => {
    if (isEditingPersonal) {
      const timer = setTimeout(() => {
        setIsEditingPersonal(false);
        setShowComingSoon(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isEditingPersonal]);

  if (loading) {
    return (
      <div className="w-full px-2">
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-2">
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="text-red-500 text-center">
            Error loading profile: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full px-2">
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="text-gray-500 text-center">
            No profile data found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4">
      {/* Main Profile Card */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Profile Header */}
        <div className="p-4 sm:p-6 pb-4">
          <h1 className="text-gray-900 dark:text-white text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Profile</h1>
          
          {/* User Info Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Image
                width={64}
                height={64}
                src={userData.profile?.profile_image_url || "/belo.png"}
                alt="Profile"
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-gray-900 dark:text-white text-base sm:text-lg font-semibold truncate">
                  {userData.profile?.first_name} {userData.profile?.last_name}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  <span className="truncate">{userData.profile?.location || 'No location set'}</span>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                {isClient && showComingSoon && (
                  <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    This feature would be available soon
                    <div className="absolute bottom-0 right-2 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setIsEditingPersonal(true);
                    setShowComingSoon(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#2a3142] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800"></div>

        {/* Personal Information Section */}
        <div className="p-4 sm:p-6">
          <h3 className="text-gray-900 dark:text-white text-base sm:text-lg font-semibold mb-4 sm:mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
            <div>
              <label className="block text-gray-500 text-xs mb-1">First Name</label>
              <p className="text-gray-900 dark:text-white font-medium">{userData.profile?.first_name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Last Name</label>
              <p className="text-gray-900 dark:text-white font-medium">{userData.profile?.last_name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Email address</label>
              <p className="text-gray-900 dark:text-white font-medium break-all">{userData.email}</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Phone</label>
              <p className="text-gray-900 dark:text-white font-medium">{userData.profile?.phone || 'Not set'}</p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-gray-500 text-xs mb-1">Bio</label>
              <p className="text-gray-900 dark:text-white font-medium">{userData.profile?.bio || 'No bio set'}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800"></div>

        {/* Manage My Business Section */}
        <div className="p-4 sm:p-6">
          <h3 className="text-gray-900 dark:text-white text-base sm:text-lg font-semibold mb-4 sm:mb-6">Manage My Business</h3>
          
          <div className="space-y-3">
            {userData.business_links?.map((businessLink) => (
              <a
                key={businessLink.id}
                href={businessLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image
                      width={20}
                      height={20}
                      src={businessLink.icon_url || '/icons/default.png'}
                      alt={businessLink.platform}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium truncate">{businessLink.display_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{businessLink.description}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
            {(!userData.business_links || userData.business_links.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                No business links configured
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

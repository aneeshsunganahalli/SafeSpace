'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface UpdateStatus {
  type: 'success' | 'error' | '';
  message: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, logout, isLoading: authLoading, initialized } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch user profile data
  useEffect(() => {
    // Only proceed if auth has been initialized
    if (!initialized) {
      return;
    }
    
    // If no token after initialization, redirect to login
    if (!token && initialized) {
      router.push('/auth/login');
      return;
    }
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(
          `${backendUrl}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const userData = response.data.user;
        setProfile(userData);
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchUserProfile();
    }
  }, [token, router, initialized]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus({ type: '', message: '' });
    
    if (newPassword && newPassword !== confirmPassword) {
      setUpdateStatus({
        type: 'error',
        message: 'New passwords do not match'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the update data
      const updateData: {
        username?: string;
        email?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {};
      
      // Only include fields that have been changed
      if (username !== profile?.username) updateData.username = username;
      if (email !== profile?.email) updateData.email = email;
      
      // Add password data if user is changing password
      if (isChangingPassword && newPassword) {
        if (!currentPassword) {
          setUpdateStatus({
            type: 'error',
            message: 'Current password is required'
          });
          setIsSubmitting(false);
          return;
        }
        
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      
      // Check if anything is being updated
      if (Object.keys(updateData).length === 0) {
        setUpdateStatus({
          type: 'error',
          message: 'No changes to update'
        });
        setIsSubmitting(false);
        return;
      }
      
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setProfile(response.data.user);
      setUpdateStatus({
        type: 'success',
        message: 'Profile updated successfully'
      });
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setUpdateStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state during auth initialization or profile fetch
  if (authLoading || (loading && !error)) {
    return (
      <main className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm flex justify-center">
          <p className="text-gray-500">Loading profile data...</p>
        </div>
      </main>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <main className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen p-6 bg-gray-50 flex flex-col items-center pt-30">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-black mb-6">User Profile</h1>
        
        {/* Status message */}
        {updateStatus.message && (
          <div 
            className={`p-3 mb-4 rounded text-sm ${
              updateStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {updateStatus.message}
          </div>
        )}
        
        {/* Profile View/Edit Mode */}
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              {isEditing ? (
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-700">
                  {profile?.username}
                </div>
              )}
            </div>
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              {isEditing ? (
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-700">
                  {profile?.email}
                </div>
              )}
            </div>
            
            {/* Member Since */}
            {!isEditing && profile?.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-700">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
            
            {/* Password Change Section */}
            {isEditing && (
              <div className="pt-4">
                <div className="flex items-center mb-4">
                  <input
                    id="change-password-toggle"
                    type="checkbox"
                    checked={isChangingPassword}
                    onChange={() => setIsChangingPassword(!isChangingPassword)}
                    className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                  />
                  <label
                    htmlFor="change-password-toggle"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Change Password
                  </label>
                </div>
                
                {isChangingPassword && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label 
                        htmlFor="currentPassword" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="newPassword" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="confirmPassword" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setIsChangingPassword(false);
                    setUsername(profile?.username || '');
                    setEmail(profile?.email || '');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </form>
        
        {/* Logout button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
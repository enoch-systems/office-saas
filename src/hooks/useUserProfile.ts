import { useState, useEffect } from 'react';
import type { UserWithProfile, BusinessLink, SocialLink, User } from '@/types/database';

// Mock user for offline mode - this replaces Supabase auth
const getMockUser = (): User => ({
  id: 'offline-user-1',
  email: 'offline@localhost',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export function useUserProfile(userId?: string) {
  const [data, setData] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        setError(null);

        // For offline mode, use a mock user
        const mockUser = getMockUser();
        const currentUserId = userId || mockUser.id;

        // Mock profile data
        const profile = {
          id: 'profile-1',
          user_id: currentUserId,
          first_name: 'Offline',
          last_name: 'User',
          bio: 'Offline mode user',
          profile_image_url: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Mock business links
        const businessLinks: BusinessLink[] = [
          {
            id: 'business-1',
            user_id: currentUserId,
            platform: 'website',
            url: 'https://localhost',
            display_name: 'Website',
            description: 'Local website',
            icon_url: '/icons/globe.png',
            sort_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        // Mock social links
        const socialLinks: SocialLink[] = [
          {
            id: 'social-1',
            user_id: currentUserId,
            platform: 'github',
            url: 'https://github.com/offline',
            icon_url: '/icons/github.png',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        setData({
          id: mockUser.id,
          email: mockUser.email,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at,
          profile,
          business_links: businessLinks,
          social_links: socialLinks
        });

      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);

  return { data, loading, error };
}

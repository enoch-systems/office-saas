import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserWithProfile, BusinessLink, SocialLink, User } from '@/types/database';

export function useUserProfile(userId?: string) {
  const [data, setData] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          // Get current user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (!user) throw new Error('No user found');
          userId = user.id;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Fetch business links
        const { data: businessLinks, error: businessError } = await supabase
          .from('business_links')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('sort_order');

        if (businessError) throw businessError;

        // Fetch social links
        const { data: socialLinks, error: socialError } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (socialError) throw socialError;

        // Get user info
        const { data: userInfo, error: userInfoError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userInfoError) throw userInfoError;
        if (!userInfo) throw new Error('User info not found');

        setData({
          id: (userInfo as User).id,
          email: (userInfo as User).email,
          created_at: (userInfo as User).created_at,
          updated_at: (userInfo as User).updated_at,
          profile,
          business_links: businessLinks || [],
          social_links: socialLinks || []
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

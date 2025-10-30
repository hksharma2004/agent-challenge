import { supabase } from './supabase';

export const handleAuthRedirect = async () => {
  try {
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const expiresIn = hashParams.get('expires_in');

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          throw error;
        }


        const { user } = data.session;
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') { 
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                username: user.user_metadata.user_name || user.email?.split('@')[0],
                avatar_url: user.user_metadata.avatar_url,
                email: user.email,
                reputation: 0,
                level: 'Bronze Tier',
                creditsAvailable: 0,
                creditsStaked: 0,
                stakingtier: 'BRONZE',
                totalReviewsGiven: 0,
                totalReviewsReceived: 0,
                averageReviewScore: 0,
                joinedDate: new Date().toISOString(),
              });

            if (insertError) {
              console.error('Error creating user profile:', insertError);
            }
          } else if (profileError) {
            console.error('Error checking user profile:', profileError);
          }
        }

        return data.session;
      }
    }
    return null;
  } catch (error) {
    console.error('Auth redirect error:', error);
    return null;
  }
};

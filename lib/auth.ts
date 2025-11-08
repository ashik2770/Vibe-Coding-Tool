import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export async function signUp(email: string, password: string, name: string, referralCode?: string) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Generate referral code for new user
    const userReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          referral_code: userReferralCode,
          referred_by: referralCode,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
      },
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      // Create user profile in database
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        name,
        credits: 100, // Free credits for new users
        plan: 'free',
        api_key_enabled: false,
        referral_code: userReferralCode,
        referred_by: referralCode,
      });

      if (profileError) {
        throw profileError;
      }

      // Handle referral if code was provided
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (referrer) {
          // Create referral record
          await supabase.from('referrals').insert({
            referrer_id: referrer.id,
            referee_id: authData.user.id,
            status: 'pending',
          });

          // Award bonus credits to both users
          await supabase.rpc('increment_credits', {
            user_id: referrer.id,
            amount: 100,
          });

          await supabase.rpc('increment_credits', {
            user_id: authData.user.id,
            amount: 200,
          });
        }
      }
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function updateUserProfile(updates: Partial<User>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updatePassword(password: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
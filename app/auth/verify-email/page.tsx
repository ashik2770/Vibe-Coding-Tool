'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

import { supabase } from '@/lib/supabase';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    } else {
      setStatus('loading');
      setMessage('Please check your email for the verification link.');
    }
  }, [token]);

  const verifyEmailToken = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) {
        setStatus('error');
        setMessage('Invalid or expired verification link. Please try again.');
        toast.error('Email verification failed');
      } else {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        toast.success('Email verified successfully!');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
      toast.error('Verification error');
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        });

        if (error) {
          toast.error('Failed to resend verification email');
        } else {
          toast.success('Verification email sent! Please check your inbox.');
        }
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card text-center">
          {status === 'loading' && (
            <div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Verifying Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Email Verified!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Redirecting to dashboard in 3 seconds...
              </p>
              <Link href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-4">
                <button
                  onClick={resendVerificationEmail}
                  className="btn btn-primary w-full"
                >
                  Resend Verification Email
                </button>
                <Link href="/auth/signup" className="btn btn-secondary w-full block text-center">
                  Create New Account
                </Link>
              </div>
            </div>
          )}

          {status === 'loading' && !token && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We've sent you a verification email. Please click the link in the email to verify your account.
              </p>
              <button
                onClick={resendVerificationEmail}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Didn't receive the email? Resend
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
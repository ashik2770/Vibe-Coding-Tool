'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Gift,
  Trophy,
  Share2,
  Copy,
  Twitter,
  Facebook,
  Link,
  TrendingUp,
  Award,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';
import { Referral } from '@/types';
import { copyToClipboard } from '@/lib/utils';

export default function ReferralsPage() {
  const { user } = useUserStore();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    totalRewards: 0,
  });

  const referralLink = user ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/signup?ref=${user.referral_code}` : '';

  useEffect(() => {
    if (user) {
      fetchReferrals();
      fetchReferralStats();
    }
  }, [user]);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referee:users!referee_id(id, name, email, created_at)
        `)
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const fetchReferralStats = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('status')
        .eq('referrer_id', user?.id);

      if (error) {
        throw error;
      }

      const successfulReferrals = data?.filter(r => r.status === 'completed').length || 0;
      const totalReferrals = data?.length || 0;
      const totalRewards = successfulReferrals * 100; // 100 credits per successful referral

      setReferralStats({
        totalReferrals,
        successfulReferrals,
        totalRewards,
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
  };

  const copyReferralLink = async () => {
    try {
      await copyToClipboard(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy referral link');
    }
  };

  const shareOnTwitter = () => {
    const text = `Build web apps with AI! 🚀 Join me on AI WebApp Builder and get 200 bonus credits. ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const rewards = [
    { referrals: 1, reward: '100 Credits', icon: Gift },
    { referrals: 5, reward: '15-day Premium', icon: Trophy },
    { referrals: 10, reward: '20% Lifetime Discount', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Referrals</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Invite friends and earn rewards for every successful referral
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats.totalReferrals}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats.successfulReferrals}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rewards Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats.totalRewards} Credits
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Referral Link
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share this link with friends to earn rewards
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="input pr-10"
                />
                <button
                  onClick={copyReferralLink}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={copyReferralLink}
                className="btn btn-primary flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </button>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Share on:</span>
              <button
                onClick={shareOnTwitter}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4 text-blue-500" />
              </button>
              <button
                onClick={shareOnFacebook}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Referral History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Referral History
            </h3>
            
            {referrals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No referrals yet. Start sharing your link!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {referral.referee?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {referral.referee?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {referral.referee?.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        }`}
                      >
                        {referral.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rewards */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rewards Program
            </h3>
            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    referralStats.successfulReferrals >= reward.referrals
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <reward.icon
                      className={`w-5 h-5 ${
                        referralStats.successfulReferrals >= reward.referrals
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400'
                      }`}
                    />
                    <div>
                      <p className={`font-medium ${
                        referralStats.successfulReferrals >= reward.referrals
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {reward.referrals} Referrals
                      </p>
                      <p className={`text-sm ${
                        referralStats.successfulReferrals >= reward.referrals
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {reward.reward}
                      </p>
                    </div>
                    {referralStats.successfulReferrals >= reward.referrals && (
                      <Star className="w-4 h-4 text-yellow-500 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How it Works
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                  1
                </span>
                <p>Share your unique referral link with friends</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                  2
                </span>
                <p>They sign up and get 200 bonus credits</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                  3
                </span>
                <p>You earn 100 credits for each successful referral</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                  4
                </span>
                <p>Unlock premium rewards at milestones</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Referrers
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      rank === 1
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        : rank === 2
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
                    }`}
                  >
                    {rank}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">U</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      User {rank}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {25 - rank * 3} referrals
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Your rank: #{Math.floor(Math.random() * 50) + 10}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
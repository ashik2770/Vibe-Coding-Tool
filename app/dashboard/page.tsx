'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCode,
  Zap,
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';
import { Project } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useUserStore();
  const { projects, fetchProjects } = useProjectStore();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    thisWeek: 0,
    sharedProjects: 0,
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      // Get recent projects
      const recent = projects
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);
      setRecentProjects(recent);

      // Calculate stats
      const thisWeek = projects.filter((project) => {
        const projectDate = new Date(project.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return projectDate > weekAgo;
      }).length;

      const sharedProjects = projects.filter((project) => project.visibility === 'public').length;

      setStats({
        totalProjects: projects.length,
        thisWeek,
        sharedProjects,
      });
    }
  }, [projects]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ready to build something amazing today?
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalProjects}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.thisWeek}
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
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Shared</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.sharedProjects}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.credits || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Projects
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="card text-center py-12">
              <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your first AI-powered application
              </p>
              <Link href="/dashboard/new" className="btn btn-primary">
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FileCode className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {project.type} • {project.visibility}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatRelativeTime(project.updated_at)}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/editor/${project.id}`}
                        className="btn btn-ghost p-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/new"
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                New Project
              </Link>
              <Link
                href="/dashboard/referrals"
                className="btn btn-secondary w-full flex items-center justify-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Invite Friends
              </Link>
            </div>
          </div>

          {/* Getting Started */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Getting Started
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Create Your First Project
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Start with a React, Next.js, or Tailwind template
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Chat with AI
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Describe what you want to build
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Deploy & Share
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Get a live URL instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <div className="space-y-2">
              <Link
                href="/blog"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                📚 Blog & Tutorials
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                ❓ Frequently Asked Questions
              </Link>
              <Link
                href="/support"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                💬 Get Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
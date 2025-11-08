'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock blog posts data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Your First AI-Powered Web Application',
    slug: 'building-first-ai-powered-web-app',
    excerpt: 'Learn how to create stunning web applications using AI assistance. From concept to deployment in minutes.',
    content: 'Full content would go here...',
    author_id: '1',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      credits: 1000,
      plan: 'premium',
      api_key_enabled: true,
      referral_code: 'ABC123',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    published_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    seo_meta: {
      title: 'Building Your First AI-Powered Web Application',
      description: 'Learn how to create stunning web applications using AI assistance',
      keywords: ['AI', 'web development', 'React', 'Next.js'],
    },
  },
  {
    id: '2',
    title: '10 Tips for Better AI Prompt Engineering',
    slug: '10-tips-better-ai-prompt-engineering',
    excerpt: 'Master the art of communicating with AI to get better code generation results.',
    content: 'Full content would go here...',
    author_id: '2',
    author: {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      credits: 500,
      plan: 'free',
      api_key_enabled: false,
      referral_code: 'DEF456',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    published_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    seo_meta: {
      title: '10 Tips for Better AI Prompt Engineering',
      description: 'Master the art of communicating with AI',
      keywords: ['AI', 'prompt engineering', 'tips'],
    },
  },
  {
    id: '3',
    title: 'The Future of Web Development with AI',
    slug: 'future-web-development-ai',
    excerpt: 'Exploring how artificial intelligence is reshaping the landscape of web development.',
    content: 'Full content would go here...',
    author_id: '3',
    author: {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      credits: 750,
      plan: 'premium',
      api_key_enabled: true,
      referral_code: 'GHI789',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    published_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z',
    seo_meta: {
      title: 'The Future of Web Development with AI',
      description: 'How AI is reshaping web development',
      keywords: ['AI', 'future', 'web development'],
    },
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'tutorial', name: 'Tutorials' },
    { id: 'tips', name: 'Tips & Tricks' },
    { id: 'news', name: 'News & Updates' },
    { id: 'case-study', name: 'Case Studies' },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.seo_meta?.keywords?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              AI WebApp Builder Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Stay updated with the latest in AI-powered web development, tutorials, and industry insights
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-12 pr-4 py-3 text-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Posts */}
            <div className="lg:flex-1">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Blog Posts Grid */}
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No posts found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-8">
                  {filteredPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                            Tutorial
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            5 min read
                          </span>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mb-3 transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {post.author?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {post.author?.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(post.published_at)}
                            </span>
                          </div>
                          
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-12 flex items-center justify-center space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  1
                </span>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Next
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 space-y-6">
              {/* Newsletter */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Stay Updated
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get the latest articles and tutorials delivered to your inbox
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input w-full"
                  />
                  <button className="btn btn-primary w-full">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Popular Posts */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(post.published_at)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${selectedCategory === category.id
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 20) + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
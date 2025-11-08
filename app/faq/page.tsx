'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I create my first project?',
        answer: 'To create your first project, click on "New Project" in your dashboard, choose your preferred framework (React, Next.js, or Tailwind CSS), select a template, and start building with AI assistance.',
      },
      {
        question: 'What frameworks does AI WebApp Builder support?',
        answer: 'We currently support React + Vite, Next.js, and Tailwind CSS projects. React Native support is coming soon!',
      },
      {
        question: 'Do I need coding experience to use this platform?',
        answer: 'No coding experience is required! Our AI assistant can help you build applications using natural language prompts. However, basic understanding of web development concepts can be helpful.',
      },
    ],
  },
  {
    category: 'AI Features',
    questions: [
      {
        question: 'How does the AI code generation work?',
        answer: 'Our AI understands your requirements through natural language prompts and generates production-ready code using best practices. You can iterate on the code by providing additional instructions.',
      },
      {
        question: 'Can I modify the AI-generated code?',
        answer: 'Absolutely! You have full access to the generated code and can modify it manually or ask the AI to make changes through additional prompts.',
      },
      {
        question: 'What AI models do you use?',
        answer: 'We use state-of-the-art AI models including GPT-4 and Claude for code generation, ensuring high-quality, production-ready output.',
      },
    ],
  },
  {
    category: 'Pricing & Credits',
    questions: [
      {
        question: 'How does the credit system work?',
        answer: 'Each AI generation request consumes credits. Free users get 100 credits monthly, while premium users get unlimited credits. You can purchase additional credits anytime.',
      },
      {
        question: 'What happens when I run out of credits?',
        answer: 'You can purchase additional credits or upgrade to our premium plan for unlimited AI generations. Your existing projects remain accessible.',
      },
      {
        question: 'Can I use my own API keys?',
        answer: 'Yes! Premium users can configure their own API keys for AI services, which allows them to bypass our credit system entirely.',
      },
    ],
  },
  {
    category: 'Projects & Export',
    questions: [
      {
        question: 'Can I export my projects?',
        answer: 'Yes! You can export your projects as ZIP files, deploy directly to Vercel, or push to GitHub repositories.',
      },
      {
        question: 'Are my projects private?',
        answer: 'Free users\' projects are public by default. Premium users can make their projects private and control access permissions.',
      },
      {
        question: 'Can I collaborate with team members?',
        answer: 'Team collaboration features are available for premium users. You can invite team members to work on projects together.',
      },
    ],
  },
  {
    category: 'Technical Support',
    questions: [
      {
        question: 'What browsers are supported?',
        answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version.',
      },
      {
        question: 'Is there a limit to project size?',
        answer: 'Free users can create up to 5 projects. Premium users have unlimited projects with generous file size limits.',
      },
      {
        question: 'How do I get support if I need help?',
        answer: 'You can create a support ticket from your dashboard, check our documentation, or browse our community forum for answers.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleQuestion = (questionId: string) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about AI WebApp Builder
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12 pr-4 py-3 text-lg w-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              All Categories
            </button>
            {faqData.map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No questions found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQ.map((category) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {category.category}
                  </h2>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => {
                      const questionId = `${category.category}-${index}`;
                      const isOpen = openQuestions.has(questionId);
                      
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleQuestion(questionId)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {faq.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-6 pb-4"
                            >
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-12 text-center">
            <div className="card max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/support" className="btn btn-primary">
                  Create Support Ticket
                </a>
                <a href="mailto:support@aiwebappbuilder.com" className="btn btn-secondary">
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
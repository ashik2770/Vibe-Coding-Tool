'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Zap,
  Palette,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';
import { Project } from '@/types';
import { generateId } from '@/lib/utils';

const projectTypes = [
  {
    id: 'react-vite',
    name: 'React + Vite',
    description: 'Modern React application with Vite build tool',
    icon: Code,
    features: ['React 18', 'Vite', 'TypeScript', 'Hot Reload'],
    comingSoon: false,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Full-stack React framework with SSR/SSG',
    icon: Zap,
    features: ['Next.js 15', 'App Router', 'SSR/SSG', 'API Routes'],
    comingSoon: false,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    icon: Palette,
    features: ['Tailwind CSS', 'Responsive Design', 'Customizable', 'JIT Compilation'],
    comingSoon: false,
  },
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile app development',
    icon: Sparkles,
    features: ['iOS & Android', 'Native Performance', 'Hot Reload', 'Expo'],
    comingSoon: true,
  },
];

const templates = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with a clean slate',
    preview: 'A minimal starting point for your project',
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Modern landing page with hero section',
    preview: 'Perfect for SaaS, products, or services',
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Analytics dashboard with charts and tables',
    preview: 'Great for admin panels and analytics',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Online store with cart and checkout',
    preview: 'Complete shopping experience',
  },
  {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Content-focused blog with markdown support',
    preview: 'Perfect for content creators',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Site',
    description: 'Showcase your work and skills',
    preview: 'Professional portfolio template',
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { createProject } = useProjectStore();
  
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep(2);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a project');
      return;
    }

    setIsCreating(true);

    try {
      const projectData = {
        user_id: user.id,
        name: projectName.trim(),
        type: selectedType as Project['type'],
        code: generateInitialCode(selectedType, selectedTemplate),
        visibility: 'private' as const,
      };

      const newProject = await createProject(projectData);

      if (newProject) {
        toast.success('Project created successfully!');
        router.push(`/dashboard/editor/${newProject.id}`);
      } else {
        toast.error('Failed to create project');
      }
    } catch (error) {
      toast.error('An error occurred while creating the project');
    } finally {
      setIsCreating(false);
    }
  };

  const generateInitialCode = (type: string, template: string): string => {
    // This would generate initial boilerplate code based on the selected type and template
    // For now, returning a basic React component
    return `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ${projectName || 'Your Project'}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Start building your amazing application with AI assistance.
        </p>
        <div className="space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Project
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a project type and template to get started with AI-powered development
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                1
              </div>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                2
              </div>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                3
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2 space-x-12">
            <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Template</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Details</span>
          </div>
        </div>

        {/* Step 1: Project Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Choose Your Project Type
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projectTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => !type.comingSoon && handleTypeSelect(type.id)}
                  className={`
                    card cursor-pointer transition-all duration-200 relative
                    ${type.comingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'}
                    ${selectedType === type.id ? 'ring-2 ring-primary-500 shadow-lg' : ''}
                  `}
                >
                  {type.comingSoon && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg">
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {type.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedType === type.id && (
                      <div className="flex-shrink-0">
                        <Check className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Choose a Template
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`
                    card cursor-pointer transition-all duration-200
                    ${selectedTemplate === template.id ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'}
                  `}
                >
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {template.preview}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="btn btn-primary flex items-center"
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Project Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Project Details
            </h2>
            <div className="max-w-2xl">
              <div className="card">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="input"
                      placeholder="My Awesome App"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Describe what you're building..."
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Project Summary
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p><span className="font-medium">Type:</span> {selectedType}</p>
                      <p><span className="font-medium">Template:</span> {selectedTemplate}</p>
                      <p><span className="font-medium">Visibility:</span> Private</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateProject}
                      disabled={isCreating || !projectName.trim()}
                      className="btn btn-primary flex items-center"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Project...
                        </>
                      ) : (
                        <>
                          Create Project
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
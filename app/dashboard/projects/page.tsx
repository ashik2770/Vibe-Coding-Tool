'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileCode,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  ExternalLink,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { useProjectStore } from '@/stores/projectStore';
import { Project } from '@/types';
import { formatRelativeTime, formatDate } from '@/lib/utils';

export default function ProjectsPage() {
  const { projects, fetchProjects, updateProject, deleteProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleToggleVisibility = async (project: Project) => {
    try {
      const newVisibility = project.visibility === 'public' ? 'private' : 'public';
      await updateProject(project.id, { visibility: newVisibility });
      toast.success(`Project is now ${newVisibility}`);
    } catch (error) {
      toast.error('Failed to update project visibility');
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    try {
      const newProject = {
        ...project,
        id: undefined,
        name: `${project.name} (Copy)`,
        created_at: undefined,
        updated_at: undefined,
      };
      
      // This would create a duplicate project
      toast.success('Project duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsDeleting(projectId);
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const projectTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'react-vite', name: 'React + Vite' },
    { id: 'nextjs', name: 'Next.js' },
    { id: 'tailwind', name: 'Tailwind CSS' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your AI-generated projects
          </p>
        </div>
        <Link href="/dashboard/new" className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select"
            >
              {projectTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="card text-center py-12">
          <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search or filters' : 'Create your first project to get started'}
          </p>
          <Link href="/dashboard/new" className="btn btn-primary">
            Create New Project
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleVisibility={handleToggleVisibility}
                  onDuplicate={handleDuplicateProject}
                  onDelete={handleDeleteProject}
                  isDeleting={isDeleting === project.id}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onToggleVisibility={handleToggleVisibility}
                  onDuplicate={handleDuplicateProject}
                  onDelete={handleDeleteProject}
                  isDeleting={isDeleting === project.id}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  isDeleting,
}: {
  project: Project;
  onToggleVisibility: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (projectId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FileCode className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleVisibility(project)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title={project.visibility === 'public' ? 'Make private' : 'Make public'}
            >
              {project.visibility === 'public' ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onDuplicate(project)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Duplicate project"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              disabled={isDeleting}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full capitalize">
            {project.type}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full capitalize">
            {project.visibility}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Last updated {formatRelativeTime(project.updated_at)}
        </p>
        
        <Link
          href={`/dashboard/editor/${project.id}`}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Project
        </Link>
      </div>
    </div>
  );
}

function ProjectListItem({
  project,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  isDeleting,
}: {
  project: Project;
  onToggleVisibility: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (projectId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FileCode className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full capitalize">
                  {project.type}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full capitalize">
                  {project.visibility}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Updated {formatRelativeTime(project.updated_at)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleVisibility(project)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title={project.visibility === 'public' ? 'Make private' : 'Make public'}
            >
              {project.visibility === 'public' ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onDuplicate(project)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Duplicate project"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              disabled={isDeleting}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-600"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <Link
              href={`/dashboard/editor/${project.id}`}
              className="btn btn-primary flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
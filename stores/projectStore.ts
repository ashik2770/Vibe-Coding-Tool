import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Project } from '@/types';
import { supabase } from '@/lib/supabase';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isLoading: false,

      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            set({ projects: [], isLoading: false });
            return;
          }

          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) {
            throw error;
          }

          set({ projects: data || [], isLoading: false });
        } catch (error) {
          console.error('Error fetching projects:', error);
          set({ projects: [], isLoading: false });
        }
      },

      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project });
      },

      createProject: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
        try {
          const { data, error } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            set((state) => ({
              projects: [data, ...state.projects],
            }));
            return data;
          }

          return null;
        } catch (error) {
          console.error('Error creating project:', error);
          return null;
        }
      },

      updateProject: async (id: string, updates: Partial<Project>) => {
        try {
          const { error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id);

          if (error) {
            throw error;
          }

          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updates } : project
            ),
            currentProject: state.currentProject?.id === id 
              ? { ...state.currentProject, ...updates } 
              : state.currentProject,
          }));
        } catch (error) {
          console.error('Error updating project:', error);
        }
      },

      deleteProject: async (id: string) => {
        try {
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

          if (error) {
            throw error;
          }

          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
          }));
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({ 
        projects: state.projects,
        currentProject: state.currentProject 
      }),
    }
  )
);
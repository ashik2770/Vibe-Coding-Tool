'use client';

import React, { useState } from 'react';
import { FileCode, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

interface FileTreeProps {
  activeFile: string;
  onFileSelect: (filePath: string) => void;
  projectType: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
}

export default function FileTree({ activeFile, onFileSelect, projectType }: FileTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src']));

  // Generate file tree based on project type
  const getFileTree = (): FileNode[] => {
    const baseStructure: FileNode[] = [
      {
        name: 'src',
        type: 'directory',
        path: 'src',
        children: [
          {
            name: 'App.tsx',
            type: 'file',
            path: 'src/App.tsx',
          },
          {
            name: 'index.css',
            type: 'file',
            path: 'src/index.css',
          },
          {
            name: 'main.tsx',
            type: 'file',
            path: 'src/main.tsx',
          },
        ],
      },
      {
        name: 'package.json',
        type: 'file',
        path: 'package.json',
      },
      {
        name: 'README.md',
        type: 'file',
        path: 'README.md',
      },
    ];

    if (projectType === 'nextjs') {
      return [
        {
          name: 'app',
          type: 'directory',
          path: 'app',
          children: [
            {
              name: 'page.tsx',
              type: 'file',
              path: 'app/page.tsx',
            },
            {
              name: 'layout.tsx',
              type: 'file',
              path: 'app/layout.tsx',
            },
            {
              name: 'globals.css',
              type: 'file',
              path: 'app/globals.css',
            },
          ],
        },
        {
          name: 'package.json',
          type: 'file',
          path: 'package.json',
        },
        {
          name: 'next.config.js',
          type: 'file',
          path: 'next.config.js',
        },
        {
          name: 'README.md',
          type: 'file',
          path: 'README.md',
        },
      ];
    }

    return baseStructure;
  };

  const toggleDirectory = (dirPath: string) => {
    setExpandedDirs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dirPath)) {
        newSet.delete(dirPath);
      } else {
        newSet.add(dirPath);
      }
      return newSet;
    });
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedDirs.has(node.path);
    const isActive = activeFile === node.path;

    if (node.type === 'directory') {
      return (
        <div key={node.path}>
          <div
            className={`flex items-center px-2 py-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isActive ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : ''
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => toggleDirectory(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            )}
            <span className="text-sm truncate">{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map((child) => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={`flex items-center px-2 py-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : ''
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onFileSelect(node.path)}
      >
        <FileCode className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
        <span className="text-sm truncate">{node.name}</span>
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {getFileTree().map((node) => renderFileNode(node))}
    </div>
  );
}
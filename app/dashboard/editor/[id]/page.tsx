'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Send,
  Code,
  Eye,
  Download,
  Share2,
  Settings,
  Save,
  Loader,
  Bot,
  User,
  FileCode,
  Folder,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';
import { Project, AIMessage } from '@/types';
import { generateId, debounce } from '@/lib/utils';
import CodeEditor from '@/components/CodeEditor';
import FileTree from '@/components/FileTree';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const { projects, fetchProjects, updateProject, setCurrentProject } = useProjectStore();
  
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeFile, setActiveFile] = useState('src/App.tsx');
  const [code, setCode] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId) {
      fetchProjects();
    }
  }, [projectId, fetchProjects]);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setCurrentProject(foundProject);
      setCode(foundProject.code);
      
      // Load existing messages if any
      if (foundProject.ai_messages) {
        setMessages(foundProject.ai_messages);
      } else {
        // Add welcome message
        setMessages([
          {
            id: generateId(),
            role: 'assistant',
            content: `Welcome to ${foundProject.name}! I'm your AI assistant. Describe what you want to build, and I'll help you create it.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
  }, [projects, projectId, setCurrentProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !project || isLoading) return;

    const userMessage: AIMessage = {
      id: generateId(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (in real implementation, this would call your AI API)
      const aiResponse = await simulateAIResponse(inputMessage.trim(), project, code);
      
      const assistantMessage: AIMessage = {
        id: generateId(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update code if AI generated new code
      if (aiResponse.code) {
        setCode(aiResponse.code);
        // Auto-save the updated code
        debouncedSaveCode(aiResponse.code);
      }
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message: string, project: Project, currentCode: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple AI response simulation based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('button') || lowerMessage.includes('add button')) {
      return {
        message: "I've added a button component to your application. The button includes hover effects and is fully responsive.",
        code: currentCode.replace(
          '</div>\n    </div>',
          `        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4">
          Get Started
        </button>\n      </div>\n    </div>`
        ),
      };
    } else if (lowerMessage.includes('form') || lowerMessage.includes('input')) {
      return {
        message: "I've created a contact form with proper validation and styling. The form includes name, email, and message fields.",
        code: currentCode.replace(
          '</div>\n    </div>',
          `        <form className="mt-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>\n      </div>\n    </div>`
        ),
      };
    } else if (lowerMessage.includes('dark mode') || lowerMessage.includes('dark theme')) {
      return {
        message: "I've implemented a dark mode toggle for your application. Users can now switch between light and dark themes.",
        code: currentCode.replace(
          'export default function App() {',
          `export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };`
        ).replace(
          '<div className="min-h-screen bg-gray-50 flex items-center justify-center">',
          `<div className=\`min-h-screen \${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center\`}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>`
        ).replace(
          '<h1 className="text-4xl font-bold text-gray-900 mb-4">',
          '<h1 className=\`text-4xl font-bold \${darkMode ? "text-white" : "text-gray-900"} mb-4\">'
        ),
      };
    } else {
      return {
        message: "I understand you want to modify your application. Could you be more specific about what you'd like to add or change? For example, you could ask me to 'add a button', 'create a form', or 'implement dark mode'.",
        code: currentCode,
      };
    }
  };

  const debouncedSaveCode = debounce(async (newCode: string) => {
    if (project && newCode !== project.code) {
      try {
        await updateProject(project.id, { code: newCode });
      } catch (error) {
        console.error('Failed to save code:', error);
      }
    }
  }, 1000);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    debouncedSaveCode(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - File Tree */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Project Files</h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <FileTree
            activeFile={activeFile}
            onFileSelect={setActiveFile}
            projectType={project.type}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {project.type} • {activeFile}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`btn ${showPreview ? 'btn-primary' : 'btn-secondary'} flex items-center`}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button className="btn btn-secondary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-secondary flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </header>

        {/* Editor and Preview */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <div className="flex-1">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language="typescript"
                theme="vs-dark"
              />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-1/2 border-l border-gray-200 dark:border-gray-700">
              <div className="h-full bg-white">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                        <script src="https://cdn.tailwindcss.com"></script>
                      </head>
                      <body>
                        <div id="root"></div>
                        <script type="text/babel">
                          ${code}
                          
                          const root = ReactDOM.createRoot(document.getElementById('root'));
                          root.render(React.createElement(App));
                        </script>
                      </body>
                    </html>
                  `}
                  className="w-full h-full border-0"
                  title="Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ask me to modify your code</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="btn btn-primary p-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
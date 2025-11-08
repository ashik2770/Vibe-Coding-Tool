'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Paperclip,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useUserStore } from '@/stores/userStore';
import { SupportTicket } from '@/types';
import { generateId, formatRelativeTime } from '@/lib/utils';

export default function SupportPage() {
  const { user } = useUserStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const mockTickets: SupportTicket[] = [
    {
      id: '1',
      user_id: user?.id || '1',
      subject: 'How to export my project?',
      message: 'I need help exporting my React project to deploy on Vercel.',
      status: 'open',
      priority: 'medium',
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
    },
    {
      id: '2',
      user_id: user?.id || '1',
      subject: 'AI generation not working',
      message: 'The AI assistant is not generating code as expected.',
      status: 'in_progress',
      priority: 'high',
      created_at: '2024-01-09T14:30:00Z',
      updated_at: '2024-01-09T16:45:00Z',
    },
    {
      id: '3',
      user_id: user?.id || '1',
      subject: 'Billing question',
      message: 'I have a question about my premium subscription billing.',
      status: 'resolved',
      priority: 'low',
      created_at: '2024-01-08T09:15:00Z',
      updated_at: '2024-01-09T11:20:00Z',
      responses: [
        {
          id: '1',
          ticket_id: '3',
          user_id: 'support',
          message: 'Your premium subscription is active and will renew on February 1st, 2024.',
          created_at: '2024-01-09T11:20:00Z',
        },
      ],
    },
  ];

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const ticket: SupportTicket = {
      id: generateId(),
      user_id: user?.id || '1',
      subject: newTicket.subject,
      message: newTicket.message,
      status: 'open',
      priority: newTicket.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', message: '', priority: 'medium' });
    setShowNewTicket(false);
    toast.success('Support ticket created successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Support Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Get help with your projects and account
              </p>
            </div>
            <button
              onClick={() => setShowNewTicket(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              {showNewTicket && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Create New Ticket
                    </h3>
                    <button
                      onClick={() => setShowNewTicket(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                        className="input"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        id="priority"
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={newTicket.message}
                        onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                        className="input"
                        rows={5}
                        placeholder="Describe your issue in detail..."
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="btn btn-secondary flex items-center">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </button>
                      <div className="space-x-3">
                        <button
                          onClick={() => setShowNewTicket(false)}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateTicket}
                          className="btn btn-primary flex items-center"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedTicket ? (
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedTicket.subject}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                          {getStatusIcon(selectedTicket.status)}
                          <span className="ml-1 capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority} priority
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="btn btn-ghost"
                    >
                      Back to Tickets
                    </button>
                  </div>

                  {/* Original Message */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">You</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(selectedTicket.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedTicket.message}
                    </p>
                  </div>

                  {/* Responses */}
                  {selectedTicket.responses?.map((response) => (
                    <div key={response.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">S</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Support Team</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(response.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {response.message}
                      </p>
                    </div>
                  ))}

                  {selectedTicket.status === 'resolved' && (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        This ticket has been resolved
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {ticket.subject}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {ticket.message}
                            </p>
                            <div className="flex items-center space-x-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                              </span>
                              <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority} priority
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(ticket.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Help */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Help
                </h3>
                <div className="space-y-3 text-sm">
                  <Link href="/faq" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Frequently Asked Questions
                  </Link>
                  <Link href="/docs" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Documentation
                  </Link>
                  <Link href="/blog" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Blog & Tutorials
                  </Link>
                </div>
              </div>

              {/* Response Times */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Response Times
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">2-4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">6-12 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">1-2 days</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Support Hours: 9 AM - 6 PM EST</p>
                  <p>Email: support@aiwebappbuilder.com</p>
                  <p>Response time: Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
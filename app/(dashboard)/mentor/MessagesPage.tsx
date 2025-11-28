"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Search, Star, Send, Archive, Trash2, Bot, ThumbsUp, Clock, Info } from 'lucide-react';
import svgPaths from './svg-3mb6vvij3v';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

type MessageType = {
  id: number;
  sender: string;
  senderIcon: 'bot' | 'system';
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  priority?: 'high' | 'medium' | 'low';
  category: 'feedback' | 'achievement' | 'reminder' | 'tip';
  fullContent: string;
};

const messages: MessageType[] = [
  {
    id: 1,
    sender: 'AI Coach Sarah',
    senderIcon: 'bot',
    subject: 'Great Progress on Technical Interview!',
    preview: "You've shown excellent improvement in your technical interview skills...",
    time: '2 hours ago',
    unread: true,
    starred: true,
    priority: 'high',
    category: 'feedback',
    fullContent: `Hi Yamamah,

Congratulations on your recent technical interview performance! You scored 9.2/10, which is a significant improvement from your previous sessions.

Key Strengths:
• Excellent problem-solving approach
• Clear communication of your thought process
• Strong understanding of data structures

Areas for Growth:
• Consider optimizing time complexity further
• Practice edge case identification

Keep up the great work!

Best regards,
AI Coach Sarah`
  },
  {
    id: 2,
    sender: 'Minterviewer System',
    senderIcon: 'system',
    subject: 'New Achievement Unlocked: Top Performer',
    preview: "Congratulations! You've unlocked a new achievement...",
    time: '5 hours ago',
    unread: true,
    starred: false,
    category: 'achievement',
    fullContent: `Congratulations!

You've unlocked the "Top Performer" achievement for maintaining consistent high scores across your last 10 interview sessions.

Your dedication to improvement is remarkable. Keep up the excellent work!

Best,
Minterviewer Team`
  },
  {
    id: 3,
    sender: 'AI Coach Mike',
    senderIcon: 'bot',
    subject: 'System Design Session Feedback',
    preview: 'Your system design session showed strong architectural thinking...',
    time: '1 day ago',
    unread: false,
    starred: false,
    category: 'feedback',
    fullContent: `Hi there,

Your system design session demonstrated strong architectural thinking. Here's my detailed feedback:

Strengths:
• Great scalability considerations
• Well-structured approach
• Good database design choices

Improvements:
• Consider discussing trade-offs more explicitly
• Add more detail on caching strategies

Overall score: 8.5/10

Keep practicing!
AI Coach Mike`
  },
  {
    id: 4,
    sender: 'Minterviewer System',
    senderIcon: 'system',
    subject: 'Reminder: Scheduled Interview Today',
    preview: 'You have a technical interview scheduled for today at 10:00 AM...',
    time: '1 day ago',
    unread: false,
    starred: false,
    category: 'reminder',
    fullContent: `Reminder

You have a technical interview scheduled for today at 10:00 AM with AI Coach Sarah.

Topic: Advanced Data Structures
Duration: 60 minutes

Please make sure you're ready 5 minutes before the session starts.

Good luck!`
  },
  {
    id: 5,
    sender: 'AI Coach Emma',
    senderIcon: 'bot',
    subject: 'Behavioral Interview Tips',
    preview: 'Here are some tips to improve your STAR method responses...',
    time: '2 days ago',
    unread: false,
    starred: true,
    category: 'tip',
    fullContent: `Hi there,

Here are some valuable tips to enhance your behavioral interview responses:

STAR Method Best Practices:
• Situation: Set clear context
• Task: Define your specific responsibility
• Action: Detail the steps you took
• Result: Quantify the outcome

Practice these regularly for best results!

Best,
AI Coach Emma`
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'feedback':
      return <ThumbsUp className="w-3 h-3" />;
    case 'achievement':
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
          <path d={svgPaths.p295e8380} fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'reminder':
      return <Clock className="w-3 h-3" />;
    case 'tip':
      return <Info className="w-3 h-3" />;
    default:
      return null;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'feedback':
      return 'text-cyan-400';
    case 'achievement':
      return 'text-yellow-400';
    case 'reminder':
      return 'text-purple-400';
    case 'tip':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};

export const MessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<MessageType>(messages[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'unread') return matchesSearch && msg.unread;
    if (activeTab === 'starred') return matchesSearch && msg.starred;
    return matchesSearch;
  });

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Messages & Feedback</h1>
        <p className="text-[var(--foreground-muted)]">Communication from AI coaches and system updates</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-purple-500/30"
          style={{ background: 'var(--card)' }}
        >
          {/* Search */}
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--border)' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-transparent border-0 rounded-none h-9 p-0 grid grid-cols-3">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                  style={{ color: 'var(--foreground)' }}
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread"
                  className="rounded-none data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                  style={{ color: 'var(--foreground)' }}
                >
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="starred"
                  className="rounded-none data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                  style={{ color: 'var(--foreground)' }}
                >
                  Starred
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Message Items */}
          <div className="max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left p-4 transition-all ${
                  selectedMessage.id === message.id
                    ? 'bg-purple-500/10'
                    : message.unread
                    ? 'bg-purple-500/5'
                    : ''
                } hover:bg-purple-500/5`}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    {message.senderIcon === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white">S</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`truncate text-sm ${message.unread ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`} style={message.unread ? { fontWeight: 600 } : {}}>
                        {message.sender}
                      </h4>
                      {message.starred && (
                        <svg className="w-3.5 h-3.5 flex-shrink-0 ml-2" fill="none" viewBox="0 0 14 14">
                          <path d={svgPaths.p6932200} fill="#FFB900" stroke="#FFB900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                        </svg>
                      )}
                    </div>

                    {/* Subject */}
                    <p className={`mb-1 truncate text-sm ${message.unread ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`} style={message.unread ? { fontWeight: 500 } : {}}>
                      {message.subject}
                    </p>

                    {/* Preview */}
                    <p className="text-[var(--foreground-subtle)] text-xs truncate mb-2">
                      {message.preview}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`${getCategoryColor(message.category)} flex items-center gap-1`}>
                        {getCategoryIcon(message.category)}
                      </span>
                      <span className="text-[var(--foreground-subtle)]">{message.time}</span>
                      {message.unread && (
                        <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Message Detail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-purple-500/30 flex flex-col h-[715px]"
          style={{ background: 'var(--card)' }}
        >
          {/* Header */}
          <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-4">
              {/* Sender Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  {selectedMessage.senderIcon === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white">S</span>
                  )}
                </div>
                <div>
                  <h3 className="text-[var(--foreground)]">{selectedMessage.sender}</h3>
                  <p className="text-[var(--foreground-muted)] text-sm">{selectedMessage.time}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 w-9 h-9"
                >
                  <Star className="w-4 h-4" fill={selectedMessage.starred ? 'currentColor' : 'none'} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 w-9 h-9"
                >
                  <Archive className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 w-9 h-9"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Subject */}
            <h2 className="text-[var(--foreground)] mb-3">{selectedMessage.subject}</h2>

            {/* Badges */}
            <div className="flex gap-2">
              {selectedMessage.priority && (
                <Badge className={`${
                  selectedMessage.priority === 'high' 
                    ? 'bg-red-500/20 border-red-500/30 text-red-300'
                    : 'bg-gray-500/20 border-gray-500/30 text-gray-300'
                }`}>
                  {selectedMessage.priority}
                </Badge>
              )}
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">
                {selectedMessage.category}
              </Badge>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <pre className="text-[var(--foreground)] whitespace-pre-wrap font-sans leading-relaxed">
              {selectedMessage.fullContent}
            </pre>
          </div>

          {/* Reply Section */}
          <div className="p-6" style={{ borderTop: '1px solid var(--border)' }}>
            <Textarea
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="resize-none min-h-[100px] mb-3"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setReplyText('')}
              >
                Cancel
              </Button>
              <Button
                disabled={!replyText.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

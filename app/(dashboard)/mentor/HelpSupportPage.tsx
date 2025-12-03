"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  Video, 
  FileText,
  Clock,
  CheckCircle,
  ExternalLink,
  Headphones,
  Send
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Badge } from '../../components/ui/badge';
import { useState } from 'react';

export function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I set up my mentor profile?',
          a: 'Navigate to Settings > Profile tab. Upload your photo, fill in your personal information, expertise areas, and bio. Make sure to add your credentials and years of experience to attract more mentees.'
        },
        {
          q: 'How do I set my availability for sessions?',
          a: 'Go to the Availability page from the sidebar. Toggle days on/off and add time slots for each day. You can set buffer times between sessions and enable auto-accept for bookings.'
        },
        {
          q: 'How do pricing and payments work?',
          a: 'Set your session rates in the Earnings page. Payments are processed automatically after each completed session. Funds are transferred to your bank account weekly. You can track all earnings and transactions in real-time.'
        }
      ]
    },
    {
      category: 'Sessions & Mentees',
      questions: [
        {
          q: 'How do I conduct a mock interview session?',
          a: 'When it\'s time for your session, click "Start Session" from the Overview or Sessions page. You\'ll be connected via video call with your mentee. Use the AI-powered tools to assess performance in real-time.'
        },
        {
          q: 'Can I reschedule or cancel a session?',
          a: 'Yes, go to Sessions page, find the booking, and click "Reschedule". Notify your mentee at least 24 hours in advance to avoid penalties. Emergency cancellations should be reported to support.'
        },
        {
          q: 'How do I provide feedback to mentees?',
          a: 'After each session, visit the Feedbacks page. Select the mentee, rate the session, and provide detailed written feedback. Your feedback helps mentees improve and affects your mentor rating.'
        }
      ]
    },
    {
      category: 'Earnings & Payments',
      questions: [
        {
          q: 'When do I receive my payments?',
          a: 'Payments are processed weekly every Monday for the previous week\'s completed sessions. Funds typically arrive within 2-3 business days depending on your bank.'
        },
        {
          q: 'What is the commission structure?',
          a: 'Minterviewer takes a 15% platform fee on all earnings. This covers payment processing, AI tools, platform maintenance, and marketing. Your earnings dashboard shows net amounts after fees.'
        },
        {
          q: 'How can I increase my earnings?',
          a: 'Maintain high ratings (4.5+), complete your profile, offer multiple session types, keep your availability updated, respond quickly to messages, and collect positive reviews.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'What if I have video call issues during a session?',
          a: 'First, check your internet connection and browser permissions for camera/microphone. Try refreshing the page. If issues persist, contact support immediately via live chat or call the emergency hotline.'
        },
        {
          q: 'My dashboard is not loading properly',
          a: 'Clear your browser cache and cookies, then refresh the page. Ensure you\'re using a supported browser (Chrome, Firefox, Safari, or Edge). If the issue continues, contact technical support.'
        },
        {
          q: 'How do I update my payment information?',
          a: 'Go to Settings > Payment Details. You can update your bank account information, tax details, and payment preferences. Changes may take 24-48 hours to process.'
        }
      ]
    }
  ];

  const quickLinks = [
    { icon: BookOpen, title: 'Mentor Guide', desc: 'Complete guide to becoming a successful mentor', link: '#' },
    { icon: Video, title: 'Video Tutorials', desc: 'Watch step-by-step tutorial videos', link: '#' },
    { icon: FileText, title: 'Documentation', desc: 'Full platform documentation and API reference', link: '#' },
    { icon: HelpCircle, title: 'Community Forum', desc: 'Connect with other mentors and share tips', link: '#' }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      desc: 'Get instant help from our support team',
      action: 'Start Chat',
      availability: 'Available 24/7',
      color: 'cyan'
    },
    {
      icon: Mail,
      title: 'Email Support',
      desc: 'support@minterviewer.com',
      action: 'Send Email',
      availability: 'Response in 24 hours',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      desc: '+1 (555) 123-4567',
      action: 'Call Now',
      availability: 'Mon-Fri, 9AM-6PM EST',
      color: 'green'
    },
    {
      icon: Headphones,
      title: 'Emergency Hotline',
      desc: 'For urgent session issues',
      action: '+1 (555) 999-8888',
      availability: 'Available 24/7',
      color: 'red'
    }
  ];

  const recentUpdates = [
    {
      date: 'Jan 10, 2025',
      title: 'New AI Insights Dashboard',
      desc: 'Enhanced analytics with predictive performance metrics'
    },
    {
      date: 'Dec 28, 2024',
      title: 'Improved Video Quality',
      desc: 'Upgraded to HD video calls with better stability'
    },
    {
      date: 'Dec 15, 2024',
      title: 'Mobile App Released',
      desc: 'Conduct sessions on-the-go with our new mobile app'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Help & Support</h1>
        <p className="text-[var(--foreground-muted)]">Get help and find answers to your questions</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--foreground-muted)] w-5 h-5" />
          <Input
            placeholder="Search for help articles, guides, FAQs..."
            className="pl-12 h-14 text-lg shadow-[0_0_20px_rgba(168,85,247,0.1)] focus:shadow-[0_0_24px_rgba(168,85,247,0.2)] transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-[var(--foreground)] mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6 cursor-pointer group hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                  <link.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-[var(--foreground)] text-sm mb-1">{link.title}</h3>
                  <p className="text-[var(--foreground-muted)] text-xs">{link.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--foreground-subtle)] group-hover:text-purple-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - FAQs and Guides */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="w-full shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <TabsTrigger value="faq" className="flex-1">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Guides
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </TabsTrigger>
              </TabsList>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="mt-6">
                <div className="space-y-6">
                  {faqs.map((category, catIndex) => (
                    <motion.div 
                      key={catIndex} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                      className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      <h3 className="text-[var(--foreground)] mb-4">{category.category}</h3>
                      <Accordion type="single" collapsible className="space-y-3">
                        {category.questions.map((item, qIndex) => (
                          <AccordionItem 
                            key={qIndex} 
                            value={`item-${catIndex}-${qIndex}`}
                            className="border rounded-lg px-4 hover:border-purple-500/40 transition-all"
                            style={{ borderColor: 'var(--border)', background: 'var(--background-muted)' }}
                          >
                            <AccordionTrigger className="hover:text-purple-400 text-left transition-colors" style={{ color: 'var(--foreground)' }}>
                              {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4" style={{ color: 'var(--foreground-muted)' }}>
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Guides Tab */}
              <TabsContent value="guides" className="mt-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="space-y-4">
                    {[
                      { title: 'Getting Started as a Mentor', time: '5 min read', level: 'Beginner' },
                      { title: 'Conducting Effective Mock Interviews', time: '8 min read', level: 'Intermediate' },
                      { title: 'Maximizing Your Mentor Earnings', time: '6 min read', level: 'Advanced' },
                      { title: 'Providing Quality Feedback', time: '7 min read', level: 'Intermediate' },
                      { title: 'Using AI Insights for Better Mentoring', time: '10 min read', level: 'Advanced' },
                      { title: 'CV Review Best Practices', time: '5 min read', level: 'Beginner' }
                    ].map((guide, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ x: 8, scale: 1.01 }}
                        className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:border-purple-500/60 hover:shadow-[0_0_16px_rgba(168,85,247,0.15)] transition-all"
                        style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                            <FileText className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-[var(--foreground)] text-sm">{guide.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-[var(--foreground-subtle)]" />
                              <span className="text-[var(--foreground-subtle)] text-xs">{guide.time}</span>
                              <Badge variant="outline" className="text-xs">{guide.level}</Badge>
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[var(--foreground-subtle)]" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="mt-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <h3 className="text-[var(--foreground)] mb-4">Send us a message</h3>
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <label className="text-[var(--foreground)] text-sm mb-2 block">Subject</label>
                      <Input 
                        placeholder="What do you need help with?"
                        className="transition-shadow focus:shadow-[0_0_16px_rgba(168,85,247,0.15)]"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <label className="text-[var(--foreground)] text-sm mb-2 block">Message</label>
                      <Textarea
                        placeholder="Describe your issue or question in detail..."
                        className="min-h-32 transition-shadow focus:shadow-[0_0_16px_rgba(168,85,247,0.15)]"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <label className="text-[var(--foreground)] text-sm mb-2 block">Attach Screenshots (Optional)</label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-purple-500/60 hover:bg-purple-500/5 transition-all" style={{ borderColor: 'var(--border)' }}>
                        <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--foreground-subtle)' }} />
                        <p className="text-[var(--foreground-muted)] text-sm">Click to upload or drag and drop</p>
                        <p className="text-[var(--foreground-subtle)] text-xs mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Right - Contact Options & Updates */}
        <div className="space-y-6">
          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-[var(--foreground)] mb-4">Contact Support</h3>
            <div className="space-y-4">
              {contactOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-${option.color}-500/15 to-${option.color}-600/15 backdrop-blur-xl border border-${option.color}-500/40 p-4 shadow-[0_0_16px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br from-${option.color}-500/30 to-${option.color}-600/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.2)]`}>
                      <option.icon className={`w-5 h-5 text-${option.color}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[var(--foreground)] text-sm mb-1">{option.title}</h4>
                      <p className="text-[var(--foreground-muted)] text-xs mb-2 break-words">{option.desc}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-[var(--foreground-subtle)]" />
                        <span className="text-[var(--foreground-subtle)] text-xs">{option.availability}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:shadow-[0_0_16px_rgba(168,85,247,0.5)] transition-all"
                      >
                        {option.action}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Updates */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h3 className="text-[var(--foreground)] mb-4">Recent Updates</h3>
            <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-4 shadow-[0_0_16px_rgba(168,85,247,0.1)]" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex gap-3 pb-4 last:border-b-0 last:pb-0 cursor-pointer transition-all" 
                    style={{ borderBottom: index !== recentUpdates.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[var(--foreground-subtle)] text-xs mb-1">{update.date}</div>
                      <h4 className="text-[var(--foreground)] text-sm mb-1">{update.title}</h4>
                      <p className="text-[var(--foreground-muted)] text-xs">{update.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4, type: "spring", stiffness: 200 }}
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-500/40 p-4 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                />
                <div>
                  <h4 className="text-[var(--foreground)] text-sm">All Systems Operational</h4>
                  <p className="text-[var(--foreground-muted)] text-xs">Last checked: 2 mins ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

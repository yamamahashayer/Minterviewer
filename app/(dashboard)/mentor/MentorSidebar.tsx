"use client";

import { motion, AnimatePresence } from 'framer-motion';

import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Star,
  DollarSign,
  Clock,
  FileText,
  HelpCircle,
  Bell,
  User,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type PageType = 'overview' | 'profile' | 'mentees' | 'sessions' | 'feedbacks' | 'messages' | 'earnings' | 'availability' | 'cv-review' | 'notifications' | 'help' | 'settings';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, isCollapsed }: SidebarItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showTooltip && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width / 2
      });
    }
  }, [showTooltip]);

  return (
    <div className="relative" ref={itemRef}>
      <motion.div
        whileHover={{ x: isCollapsed ? 0 : 4 }}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
          active
            ? 'border border-[var(--accent-purple)]/30'
            : 'hover:bg-[var(--sidebar-accent)] border border-transparent'
        }`}
        style={active ? {
          background: 'linear-gradient(to right, var(--accent-purple-subtle), var(--accent-pink-subtle))',
          boxShadow: '0 0 20px var(--glow-purple)'
        } : {}}
      >
        <Icon className={`w-4 h-4 ${active ? 'text-[var(--accent-purple)]' : 'text-[var(--foreground-muted)]'}`} />
        {!isCollapsed && (
          <span className={`text-sm ${active ? 'text-[var(--accent-purple)]' : 'text-[var(--foreground-muted)]'}`}>{label}</span>
        )}
      </motion.div>

      {/* Tooltip with Arrow - Portal Style */}
      <AnimatePresence>
        {isCollapsed && showTooltip && (
          <div 
            className="fixed pointer-events-none"
            style={{ 
              zIndex: 999999,
              left: `${tooltipPosition.left}px`,
              top: `${tooltipPosition.top}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center mb-2"
            >
              <div 
                className="px-4 py-2 rounded-lg whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)'
                }}
              >
                <span className="text-sm text-white font-medium">{label}</span>
              </div>
              {/* Arrow pointing down */}
              <div 
                className="w-0 h-0 -mt-[1px]"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid #7c3aed',
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MentorSidebarProps {
  currentPage?: PageType;
  onPageChange?: (page: PageType) => void;
}

export const MentorSidebar = ({ currentPage = 'overview', onPageChange }: MentorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen border-r border-[var(--sidebar-border)] p-4 flex flex-col sticky top-0 relative" 
      style={{
        background: 'var(--sidebar)'
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 p-1.5 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          zIndex: 40,
          background: 'var(--background-elevated)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px var(--shadow-sm)'
        }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
        ) : (
          <ChevronLeft className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
        )}
      </button>

      {/* Logo */}
      <div className={`mb-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <div className="relative size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center shrink-0">
            <span className="text-[18px]">🎯</span>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div className="relative size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center shrink-0">
              <span className="text-[18px]">🎯</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] bg-clip-text text-transparent leading-5 text-sm whitespace-nowrap">
                Minterviewer
              </h2>
              <p className="text-[var(--foreground-muted)] text-[10px] leading-3 whitespace-nowrap">Your AI Career Coach</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-visible pr-1" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--accent-purple) transparent'
      }}>
        {/* Search Box */}
        {!isCollapsed && (
          <div className="mb-2 pb-2 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
            <div className="relative">
              <Search 
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5" 
                style={{ color: 'var(--foreground-muted)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-2 py-1.5 rounded-lg text-xs transition-all outline-none"
                style={{
                  background: 'var(--sidebar-accent)',
                  borderColor: 'var(--sidebar-border)',
                  color: 'var(--sidebar-foreground)',
                  border: '1px solid var(--sidebar-border)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-purple)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--sidebar-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mb-2 pb-2 border-b flex justify-center" style={{ borderColor: 'var(--sidebar-border)' }}>
            <Search className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
          </div>
        )}

        <SidebarItem 
          icon={LayoutDashboard} 
          label="Overview" 
          active={currentPage === 'overview'}
          onClick={() => onPageChange?.('overview')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={User} 
          label="My Profile" 
          active={currentPage === 'profile'}
          onClick={() => onPageChange?.('profile')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Users} 
          label="My Mentees" 
          active={currentPage === 'mentees'}
          onClick={() => onPageChange?.('mentees')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Calendar} 
          label="Sessions" 
          active={currentPage === 'sessions'}
          onClick={() => onPageChange?.('sessions')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Clock} 
          label="Availability" 
          active={currentPage === 'availability'}
          onClick={() => onPageChange?.('availability')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={FileText} 
          label="CV Review" 
          active={currentPage === 'cv-review'}
          onClick={() => onPageChange?.('cv-review')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Star} 
          label="Feedbacks" 
          active={currentPage === 'feedbacks'}
          onClick={() => onPageChange?.('feedbacks')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={DollarSign} 
          label="Earnings" 
          active={currentPage === 'earnings'}
          onClick={() => onPageChange?.('earnings')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Mail} 
          label="Messages" 
          active={currentPage === 'messages'}
          onClick={() => onPageChange?.('messages')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Bell} 
          label="Notifications" 
          active={currentPage === 'notifications'}
          onClick={() => onPageChange?.('notifications')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={HelpCircle} 
          label="Help & Support" 
          active={currentPage === 'help'}
          onClick={() => onPageChange?.('help')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          active={currentPage === 'settings'}
          onClick={() => onPageChange?.('settings')}
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-3 border-t border-[var(--sidebar-border)]">
        <SidebarItem 
          icon={LogOut} 
          label="Logout" 
          isCollapsed={isCollapsed}
        />
      </div>
    </motion.div>
  );
};

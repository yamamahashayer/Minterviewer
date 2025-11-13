'use client';

// components/nav/DashboardSidebar.tsx
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Building2,
  ShieldCheck
} from 'lucide-react';

// Define menu items based on user role
const roleMenus = {
  mentee: [
    { name: 'Dashboard', href: '/mentee', icon: LayoutDashboard },
    { name: 'Interviews', href: '/mentee/interviews', icon: ClipboardList },
    { name: 'Profile', href: '/mentee/profile', icon: UserCircle },
  ],
  mentor: [
    { name: 'Dashboard', href: '/mentor', icon: LayoutDashboard },
    { name: 'Sessions', href: '/mentor/sessions', icon: Calendar },
    { name: 'Availability', href: '/mentor/availability', icon: Clock },
    { name: 'Profile', href: '/mentor/profile', icon: UserCircle },
  ],
  company: [
    { name: 'Dashboard', href: '/company', icon: LayoutDashboard },
    { name: 'Jobs', href: '/company/jobs', icon: Briefcase },
    { name: 'Profile', href: '/company/profile', icon: Building2 },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Detect user role from pathname
  const getUserRole = () => {
    if (pathname.startsWith('/mentee')) return 'mentee';
    if (pathname.startsWith('/mentor')) return 'mentor';
    if (pathname.startsWith('/company')) return 'company';
    if (pathname.startsWith('/admin')) return 'admin';
    return 'mentee'; // default
  };

  const role = getUserRole();
  const menuItems = roleMenus[role];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <Link href="/" className="text-xl font-bold text-blue-600">
            Minterviewer
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role Badge (Optional) */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 capitalize">{role}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { User, Bell, Lock, Globe, Palette, Save, Mail, Phone, Calendar, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ImageWithFallback } from './ImageWithFallback';

export const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Settings</h1>
        <p className="text-[var(--foreground-muted)]">Manage your account settings and preferences</p>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            <Palette className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-[var(--foreground)] mb-6">Profile Information</h3>

            {/* Profile Picture */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-4" style={{ borderColor: 'var(--background)' }}>
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <Button variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 mb-2">
                  Change Photo
                </Button>
                <p className="text-[var(--foreground-muted)] text-sm">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2">Full Name</Label>
                <Input
                  defaultValue="Dr. Michael Chen"
                />
              </div>

              <div>
                <Label className="mb-2">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                  <Input
                    defaultValue="michael.chen@minterviewer.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                  <Input
                    defaultValue="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2">Specialization</Label>
                <Input
                  defaultValue="Senior Software Architect"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="mb-2">Bio</Label>
                <Input
                  defaultValue="Experienced software engineer with 10+ years in the tech industry. Specialized in system design, algorithms, and helping aspiring engineers land their dream jobs at top tech companies."
                />
              </div>

              <div>
                <Label className="mb-2">Time Zone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end gap-3">
              <Button variant="outline">
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-[var(--foreground)] mb-6">Notification Preferences</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-[var(--foreground)]">Email Notifications</h4>
                    <p className="text-[var(--foreground-muted)] text-sm">Receive email updates about your mentees</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-pink-400" />
                  <div>
                    <h4 className="text-[var(--foreground)]">Push Notifications</h4>
                    <p className="text-[var(--foreground-muted)] text-sm">Get notified about new messages and updates</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-[var(--foreground)]">Session Reminders</h4>
                    <p className="text-[var(--foreground-muted)] text-sm">Receive reminders 1 hour before sessions</p>
                  </div>
                </div>
                <Switch
                  checked={sessionReminders}
                  onCheckedChange={setSessionReminders}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h4 className="text-[var(--foreground)]">Weekly Reports</h4>
                    <p className="text-[var(--foreground-muted)] text-sm">Get weekly summary of mentee progress</p>
                  </div>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-[var(--foreground)] mb-6">Security Settings</h3>

            <div className="space-y-6">
              <div>
                <Label className="mb-2">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label className="mb-2">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label className="mb-2">Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>

              <Separator />

              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[var(--foreground)] mb-1">Two-Factor Authentication</h4>
                    <p className="text-[var(--foreground-muted)] text-sm mb-3">Add an extra layer of security to your account</p>
                    <Button variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end gap-3">
              <Button variant="outline">
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white">
                Update Password
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-[var(--foreground)] mb-6">Display Preferences</h3>

            <div className="space-y-6">
              <div>
                <Label className="mb-2">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Default Session Duration</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Calendar View</Label>
                <Select defaultValue="week">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

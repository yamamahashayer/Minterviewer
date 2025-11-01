import { useState } from "react";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Database,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Check
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";

export default function SettingsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    practiceReminders: true,
    achievementAlerts: true,
    weeklyReport: true,
    messageNotifications: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    timezone: "UTC-8",
    dateFormat: "MM/DD/YYYY",
  });

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Settings ⚙️</h1>
        <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Manage your account preferences and settings</p>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      <div className="max-w-4xl">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className={`${isDark ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)]" : "bg-white border-2 border-[#ddd6fe] shadow-sm"} mb-6`}>
            <TabsTrigger value="account" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
              <User size={16} className="mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
              <Bell size={16} className="mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
              <Palette size={16} className="mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
              <Lock size={16} className="mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="data" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
              <Database size={16} className="mr-2" />
              Data & Privacy
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account">
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Account Information</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="Yamamah"
                      className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue="Ashayer"
                      className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="yamamah.ashayer@example.com"
                    className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>

                <div>
                  <Label htmlFor="location" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Location</Label>
                  <Input
                    id="location"
                    defaultValue="San Francisco, CA"
                    className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Bio</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    defaultValue="Passionate about AI and machine learning. Experienced in building scalable web applications."
                    className={`w-full border rounded-md mt-2 p-3 text-sm focus:outline-none ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white focus:border-[rgba(94,234,212,0.5)]" : "bg-white border-[#ddd6fe] text-[#2e1065] focus:border-[#a855f7]"}`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" className={isDark ? "bg-[rgba(255,255,255,0.08)] border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(94,234,212,0.5)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}>
                    Cancel
                  </Button>
                  <Button className={`${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Email Notifications</h4>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Receive email updates about your activity</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                  />
                </div>

                <Separator className={isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"} />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Practice Reminders</h4>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Get reminded about scheduled practice sessions</p>
                  </div>
                  <Switch
                    checked={notifications.practiceReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, practiceReminders: checked})}
                  />
                </div>

                <Separator className={isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"} />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Achievement Alerts</h4>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Be notified when you unlock new achievements</p>
                  </div>
                  <Switch
                    checked={notifications.achievementAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, achievementAlerts: checked})}
                  />
                </div>

                <Separator className={isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"} />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Weekly Progress Report</h4>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Receive weekly summary of your progress</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                  />
                </div>

                <Separator className={isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"} />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Message Notifications</h4>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Get notified about new messages from AI coaches</p>
                  </div>
                  <Switch
                    checked={notifications.messageNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, messageNotifications: checked})}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button className={`${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}>
                    <Save size={16} className="mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences">
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Application Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="theme" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                    <SelectTrigger className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                      <SelectItem value="dark" className={isDark ? "text-white" : "text-[#2e1065]"}>Dark</SelectItem>
                      <SelectItem value="light" className={isDark ? "text-white" : "text-[#2e1065]"}>Light</SelectItem>
                      <SelectItem value="auto" className={isDark ? "text-white" : "text-[#2e1065]"}>Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                    <SelectTrigger className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                      <SelectItem value="en" className={isDark ? "text-white" : "text-[#2e1065]"}>English</SelectItem>
                      <SelectItem value="es" className={isDark ? "text-white" : "text-[#2e1065]"}>Spanish</SelectItem>
                      <SelectItem value="fr" className={isDark ? "text-white" : "text-[#2e1065]"}>French</SelectItem>
                      <SelectItem value="de" className={isDark ? "text-white" : "text-[#2e1065]"}>German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                    <SelectTrigger className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                      <SelectItem value="UTC-8" className={isDark ? "text-white" : "text-[#2e1065]"}>Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5" className={isDark ? "text-white" : "text-[#2e1065]"}>Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0" className={isDark ? "text-white" : "text-[#2e1065]"}>GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1" className={isDark ? "text-white" : "text-[#2e1065]"}>Central European (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                    <SelectTrigger className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                      <SelectItem value="MM/DD/YYYY" className={isDark ? "text-white" : "text-[#2e1065]"}>MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY" className={isDark ? "text-white" : "text-[#2e1065]"}>DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD" className={isDark ? "text-white" : "text-[#2e1065]"}>YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button className={`${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}>
                    <Save size={16} className="mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        className={`pr-10 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#99a1af] hover:text-white" : "text-purple-400 hover:text-purple-600"}`}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className={`mt-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button className={`${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}>
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Enable 2FA</h4>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Add an extra layer of security to your account</p>
                  </div>
                  <Button className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold"}>
                    Enable
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Data & Privacy Settings */}
          <TabsContent value="data">
            <div className="space-y-6">
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Export Data</h3>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-4`}>
                  Download a copy of your data including interview history, performance metrics, and achievements.
                </p>
                <Button className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold"}>
                  <Download size={16} className="mr-2" />
                  Export My Data
                </Button>
              </div>

              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Privacy Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Profile Visibility</h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Control who can see your profile</p>
                    </div>
                    <Select defaultValue="private">
                      <SelectTrigger className={`w-[180px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                        <SelectItem value="public" className={isDark ? "text-white" : "text-[#2e1065]"}>Public</SelectItem>
                        <SelectItem value="private" className={isDark ? "text-white" : "text-[#2e1065]"}>Private</SelectItem>
                        <SelectItem value="friends" className={isDark ? "text-white" : "text-[#2e1065]"}>Friends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className={isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"} />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Show Activity Status</h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Let others see when you're active</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator className={isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"} />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-medium`}>Anonymous Analytics</h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Help improve the platform with anonymous usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(220,38,38,0.1)] to-[rgba(255,255,255,0.02)] border-[rgba(220,38,38,0.3)]" : "bg-red-50 border-red-200"} border rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={isDark ? "text-red-400 mb-6 font-semibold" : "text-red-600 mb-6 font-semibold"}>Danger Zone</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-red-700"} mb-1 font-medium`}>Delete All Data</h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-red-600"} text-sm`}>Permanently delete all your interview data and progress</p>
                    </div>
                    <Button className={isDark ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-2 border-red-400/50 hover:border-red-400/70 shadow-md shadow-red-500/10" : "bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 hover:border-red-400 font-semibold"}>
                      <Trash2 size={16} className="mr-2" />
                      Delete Data
                    </Button>
                  </div>

                  <Separator className={isDark ? "bg-[rgba(220,38,38,0.2)]" : "bg-red-200"} />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-red-700"} mb-1 font-medium`}>Delete Account</h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-red-600"} text-sm`}>Permanently delete your account and all associated data</p>
                    </div>
                    <Button className={isDark ? "bg-red-500/30 hover:bg-red-500/40 text-red-100 border-2 border-red-400/60 hover:border-red-400/80 shadow-lg shadow-red-500/20" : "bg-red-200 hover:bg-red-300 text-red-800 border-2 border-red-400 hover:border-red-500 font-semibold shadow-md"}>
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

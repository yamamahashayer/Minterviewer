import { useState } from "react";
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  Filter,
  Eye,
  Share2,
  Printer,
  FileSpreadsheet,
  FileJson,
  File,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

export default function ReportsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReportType, setSelectedReportType] = useState("comprehensive");

  // Performance data for charts
  const monthlyData = [
    { month: "Jan", interviews: 18, avgScore: 7.8, hoursSpent: 32 },
    { month: "Feb", interviews: 22, avgScore: 8.1, hoursSpent: 38 },
    { month: "Mar", interviews: 25, avgScore: 8.4, hoursSpent: 42 },
    { month: "Apr", interviews: 28, avgScore: 8.6, hoursSpent: 45 },
    { month: "May", interviews: 30, avgScore: 8.7, hoursSpent: 48 },
    { month: "Jun", interviews: 32, avgScore: 8.9, hoursSpent: 52 },
  ];

  const categoryBreakdown = [
    { category: "Technical", count: 45, avgScore: 8.8 },
    { category: "Behavioral", count: 28, avgScore: 8.5 },
    { category: "System Design", count: 22, avgScore: 8.7 },
    { category: "Coding", count: 32, avgScore: 9.0 },
  ];

  const stats = [
    { label: "Total Interviews", value: "127", change: "+23 this month", icon: CheckCircle2, color: "text-teal-300" },
    { label: "Average Score", value: "8.7/10", change: "+0.5 improvement", icon: Award, color: "text-emerald-400" },
    { label: "Time Invested", value: "248h", change: "+42h this month", icon: Clock, color: "text-violet-400" },
    { label: "Completion Rate", value: "94%", change: "+6% increase", icon: TrendingUp, color: "text-amber-400" },
  ];

  const reportTemplates = [
    {
      id: 1,
      name: "Comprehensive Report",
      description: "Full analysis including all metrics, charts, and insights",
      icon: FileText,
      color: "text-teal-400",
      bgGradient: "from-teal-500/20 to-emerald-500/10"
    },
    {
      id: 2,
      name: "Performance Summary",
      description: "Quick overview of key performance indicators",
      icon: BarChart3,
      color: "text-violet-400",
      bgGradient: "from-violet-500/20 to-purple-500/10"
    },
    {
      id: 3,
      name: "Progress Report",
      description: "Detailed breakdown of improvement over time",
      icon: TrendingUp,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-teal-500/10"
    },
    {
      id: 4,
      name: "Skills Analysis",
      description: "In-depth analysis of technical and soft skills",
      icon: Target,
      color: "text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/10"
    }
  ];

  const previousReports = [
    {
      id: 1,
      name: "Monthly Performance Report - September 2025",
      type: "Comprehensive",
      generatedDate: "Oct 1, 2025",
      period: "September 2025",
      size: "2.4 MB",
      format: "PDF"
    },
    {
      id: 2,
      name: "Q3 2025 Quarterly Review",
      type: "Performance Summary",
      generatedDate: "Sep 30, 2025",
      period: "Jul - Sep 2025",
      size: "3.1 MB",
      format: "PDF"
    },
    {
      id: 3,
      name: "August Progress Report",
      type: "Progress Report",
      generatedDate: "Sep 1, 2025",
      period: "August 2025",
      size: "1.8 MB",
      format: "PDF"
    },
    {
      id: 4,
      name: "Technical Skills Assessment - H1 2025",
      type: "Skills Analysis",
      generatedDate: "Jul 15, 2025",
      period: "Jan - Jun 2025",
      size: "2.9 MB",
      format: "PDF"
    },
    {
      id: 5,
      name: "June Performance Data Export",
      type: "Data Export",
      generatedDate: "Jul 1, 2025",
      period: "June 2025",
      size: "856 KB",
      format: "CSV"
    }
  ];

  const exportFormats = [
    { id: "pdf", name: "PDF Document", icon: File, color: "text-red-400" },
    { id: "csv", name: "CSV Spreadsheet", icon: FileSpreadsheet, color: "text-emerald-400" },
    { id: "json", name: "JSON Data", icon: FileJson, color: "text-violet-400" },
  ];

  const insights = [
    {
      id: 1,
      title: "Strong Improvement Trend",
      description: "Your average score has improved by 12% over the last 3 months",
      type: "positive",
      icon: TrendingUp
    },
    {
      id: 2,
      title: "Coding Excellence",
      description: "Your coding interview scores are 15% above platform average",
      type: "positive",
      icon: Zap
    },
    {
      id: 3,
      title: "Consistent Practice",
      description: "You've maintained a 15-day practice streak",
      type: "positive",
      icon: Activity
    }
  ];

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Reports & Analytics 📊</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Generate comprehensive reports and export your data</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className={`w-[180px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                <SelectItem value="week" className={isDark ? "text-white" : "text-[#2e1065]"}>This Week</SelectItem>
                <SelectItem value="month" className={isDark ? "text-white" : "text-[#2e1065]"}>This Month</SelectItem>
                <SelectItem value="quarter" className={isDark ? "text-white" : "text-[#2e1065]"}>This Quarter</SelectItem>
                <SelectItem value="year" className={isDark ? "text-white" : "text-[#2e1065]"}>This Year</SelectItem>
                <SelectItem value="custom" className={isDark ? "text-white" : "text-[#2e1065]"}>Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={isDark ? stat.color : "text-purple-600"} size={24} />
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs mb-2`}>{stat.label}</p>
              <p className={`${isDark ? "text-emerald-400" : "text-green-600"} text-xs font-semibold`}>{stat.change}</p>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className={`${isDark ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)]" : "bg-white border-2 border-[#ddd6fe] shadow-sm"} mb-6`}>
          <TabsTrigger value="generate" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <FileText size={16} className="mr-2" />
            Generate Report
          </TabsTrigger>
          <TabsTrigger value="history" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <Clock size={16} className="mr-2" />
            Report History
          </TabsTrigger>
          <TabsTrigger value="analytics" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <BarChart3 size={16} className="mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Generate Report Tab */}
        <TabsContent value="generate">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Report Templates */}
            <div className="col-span-2 space-y-6">
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Select Report Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {reportTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedReportType(template.name)}
                        className={`${isDark ? `bg-gradient-to-br ${template.bgGradient}` : "bg-white"} border rounded-xl p-5 text-left transition-all ${
                          selectedReportType === template.name
                            ? (isDark ? 'border-[rgba(94,234,212,0.5)] shadow-lg shadow-teal-500/10' : 'border-[#a855f7] shadow-lg shadow-purple-500/20')
                            : (isDark ? 'border-[rgba(94,234,212,0.2)]' : 'border-[#ddd6fe] shadow-md')
                        } ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-lg"}`}
                      >
                        <Icon className={`${isDark ? template.color : "text-purple-600"} mb-3`} size={28} />
                        <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>{template.name}</h4>
                        <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{template.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Section */}
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Report Preview</h3>
                <div className="space-y-4">
                  {/* Monthly Performance Chart */}
                  <div>
                    <h4 className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-3 font-medium`}>Monthly Performance Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
                        <XAxis dataKey="month" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                        <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                            border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                            borderRadius: '8px',
                            color: isDark ? '#fff' : '#2e1065',
                            fontWeight: 600
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="avgScore" 
                          stroke={isDark ? "#5EEAD4" : "#7c3aed"} 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorScore)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <h4 className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-3 font-medium`}>Interview Category Breakdown</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={categoryBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
                        <XAxis dataKey="category" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                        <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                            border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                            borderRadius: '8px',
                            color: isDark ? '#fff' : '#2e1065',
                            fontWeight: 600
                          }} 
                        />
                        <Bar dataKey="count" fill={isDark ? "#5EEAD4" : "#7c3aed"} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options & Insights */}
            <div className="space-y-6">
              {/* Export Options */}
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Export Format</h3>
                <div className="space-y-3">
                  {exportFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.id}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)] hover:bg-[rgba(255,255,255,0.05)]" : "bg-white border-[#ddd6fe] hover:border-[#a855f7] hover:bg-purple-50 shadow-sm hover:shadow-md"}`}
                      >
                        <Icon className={isDark ? format.color : "text-purple-600"} size={20} />
                        <span className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-medium`}>{format.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3">
                  <Button className={`w-full ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}>
                    <Download size={16} className="mr-2" />
                    Generate Report
                  </Button>
                  <Button className={`w-full ${isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}`}>
                    <Eye size={16} className="mr-2" />
                    Preview Report
                  </Button>
                </div>
              </div>

              {/* Key Insights */}
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Key Insights</h3>
                <div className="space-y-3">
                  {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                      <div
                        key={insight.id}
                        className={`p-4 rounded-lg border ${isDark ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20" : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={isDark ? "text-emerald-400 shrink-0" : "text-purple-600 shrink-0"} size={20} />
                          <div>
                            <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm mb-1 font-semibold`}>{insight.title}</h4>
                            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Report History Tab */}
        <TabsContent value="history">
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>Previous Reports</h3>
              <Button className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold"}>
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="space-y-3">
              {previousReports.map((report) => (
                <div
                  key={report.id}
                  className={`flex items-center justify-between p-5 rounded-lg border transition-all ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe] hover:border-[#a855f7] shadow-sm hover:shadow-md"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${isDark ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/10" : "bg-gradient-to-br from-purple-100 to-pink-100"} flex items-center justify-center`}>
                      <FileText className={isDark ? "text-teal-300" : "text-purple-600"} size={24} />
                    </div>
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{report.name}</h4>
                      <div className={`flex items-center gap-3 text-xs ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}`}>
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.generatedDate}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <span>•</span>
                        <Badge className={isDark ? "bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs" : "bg-pink-100 text-pink-700 border-pink-300 text-xs font-medium"}>
                          {report.format}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`inline-flex items-center justify-center h-9 px-4 rounded-md border transition-colors ${isDark ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)] border-[rgba(94,234,212,0.3)]" : "text-purple-700 hover:bg-purple-50 border-[#ddd6fe] font-medium"}`}>
                      <Eye size={14} className="mr-2" />
                      View
                    </button>
                    <button className={`inline-flex items-center justify-center h-9 px-4 rounded-md border transition-colors ${isDark ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)] border-[rgba(94,234,212,0.3)]" : "text-purple-700 hover:bg-purple-50 border-[#ddd6fe] font-medium"}`}>
                      <Download size={14} className="mr-2" />
                      Download
                    </button>
                    <button className={`inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors ${isDark ? "text-[#99a1af] hover:text-white hover:bg-[rgba(255,255,255,0.05)]" : "text-purple-600 hover:bg-purple-100"}`}>
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-2 gap-6">
            {/* Interview Volume Over Time */}
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Interview Volume Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
                  <XAxis dataKey="month" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                  <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                      border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#2e1065',
                      fontWeight: 600
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke={isDark ? "#5EEAD4" : "#7c3aed"} 
                    strokeWidth={2}
                    name="Interviews"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Time Investment */}
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Time Investment Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
                  <XAxis dataKey="month" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                  <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                      border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#2e1065',
                      fontWeight: 600
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="hoursSpent" 
                    fill={isDark ? "#34D399" : "#7c3aed"} 
                    radius={[8, 8, 0, 0]}
                    name="Hours Spent"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Improvement */}
            <div className={`col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Average Score Improvement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
                  <XAxis dataKey="month" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                  <YAxis domain={[7, 10]} stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                      border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#2e1065',
                      fontWeight: 600
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke={isDark ? "#5EEAD4" : "#7c3aed"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#scoreGradient)"
                    name="Average Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

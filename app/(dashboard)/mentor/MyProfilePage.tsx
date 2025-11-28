"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import {
  User,
  Edit,
  Star,
  Calendar,
  DollarSign,
  Users,
  Award,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  CheckCircle,
  TrendingUp,
  Clock,
  MessageSquare,
  Camera
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

export function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Experienced software engineer with 10+ years in the tech industry. Specialized in system design, algorithms, and helping aspiring engineers land their dream jobs at top tech companies.");

  const mentorInfo = {
    name: "Dr. Michael Chen",
    title: "Senior Software Architect",
    level: "Level 3 Mentor",
    company: "Ex-Google, Ex-Meta",
    location: "San Francisco, CA",
    joinedDate: "Joined Jan 2023",
    email: "michael.chen@minterviewer.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  };

  const stats = {
    rating: 4.9,
    totalReviews: 127,
    totalSessions: 248,
    totalMentees: 32,
    totalEarnings: 18100,
    responseTime: "< 2 hours",
    completionRate: 98,
    successRate: 95
  };

  const expertise = [
    { name: "System Design", level: 95 },
    { name: "Data Structures & Algorithms", level: 92 },
    { name: "Behavioral Interviews", level: 88 },
    { name: "Career Guidance", level: 90 },
    { name: "Technical Leadership", level: 87 },
    { name: "Code Review", level: 93 }
  ];

  const certifications = [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: 2023 },
    { name: "Google Cloud Professional", issuer: "Google Cloud", year: 2022 },
    { name: "Certified Scrum Master", issuer: "Scrum Alliance", year: 2021 }
  ];

  const achievements = [
    { icon: Award, title: "Top Rated Mentor", desc: "Maintained 4.8+ rating for 6 months", color: "yellow" },
    { icon: Users, title: "100+ Sessions", desc: "Completed over 100 mentoring sessions", color: "cyan" },
    { icon: Star, title: "5-Star Expert", desc: "Received 50+ five-star reviews", color: "purple" },
    { icon: TrendingUp, title: "Success Rate Champion", desc: "95% mentee success rate", color: "green" }
  ];

  const sessionTypes = [
    { type: "Technical Interview", price: 120, duration: "60 min", sessions: 85 },
    { type: "System Design", price: 150, duration: "90 min", sessions: 62 },
    { type: "Behavioral Mock", price: 100, duration: "45 min", sessions: 48 },
    { type: "CV Review", price: 80, duration: "30 min", sessions: 35 },
    { type: "Career Guidance", price: 90, duration: "60 min", sessions: 18 }
  ];

  const languages = ["English (Native)", "Mandarin (Fluent)", "Spanish (Conversational)"];
  const industries = ["Technology", "E-commerce", "Fintech", "Healthcare", "AI/ML"];

  const recentReviews = [
    {
      name: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      date: "2 days ago",
      comment: "Michael is an outstanding mentor! His system design insights were incredibly valuable."
    },
    {
      name: "James Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5,
      date: "1 week ago",
      comment: "Very knowledgeable and patient. Helped me crack my Google interview!"
    },
    {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best investment I made for my career. Highly recommend!"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-[var(--foreground)]">My Profile</h1>
          <Dialog>
            <DialogTrigger className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </DialogTrigger>
            <DialogContent className="max-w-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--foreground)' }}>Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={mentorInfo.avatar} />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: 'var(--foreground)' }}>Full Name</label>
                    <Input defaultValue={mentorInfo.name} />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: 'var(--foreground)' }}>Title</label>
                    <Input defaultValue={mentorInfo.title} />
                  </div>
                </div>
                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--foreground)' }}>Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: 'var(--foreground)' }}>Location</label>
                    <Input defaultValue={mentorInfo.location} />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: 'var(--foreground)' }}>Phone</label>
                    <Input defaultValue={mentorInfo.phone} />
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl backdrop-blur-xl p-8 mb-6"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-cyan-500/30">
              <AvatarImage src={mentorInfo.avatar} />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-4" style={{ borderColor: 'var(--card)' }}>
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-[var(--foreground)] mb-1">{mentorInfo.name}</h2>
                <p className="text-[var(--foreground-muted)] mb-2">{mentorInfo.title}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/50 text-cyan-300">
                    {mentorInfo.level}
                  </Badge>
                  <Badge variant="outline" style={{ color: 'var(--foreground-muted)' }}>
                    <Briefcase className="w-3 h-3 mr-1" />
                    {mentorInfo.company}
                  </Badge>
                  <Badge variant="outline" style={{ color: 'var(--foreground-muted)' }}>
                    <MapPin className="w-3 h-3 mr-1" />
                    {mentorInfo.location}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-[var(--foreground)]">{stats.rating}</span>
                <span className="text-[var(--foreground-muted)] text-sm">({stats.totalReviews})</span>
              </div>
            </div>

            <p className="text-[var(--foreground)] mb-4">{bio}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[var(--foreground-muted)] text-xs">Sessions</p>
                  <p className="text-[var(--foreground)]">{stats.totalSessions}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-[var(--foreground-muted)] text-xs">Mentees</p>
                  <p className="text-[var(--foreground)]">{stats.totalMentees}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-[var(--foreground-muted)] text-xs">Earned</p>
                  <p className="text-[var(--foreground)]">${stats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-[var(--foreground-muted)] text-xs">Response</p>
                  <p className="text-[var(--foreground)]">{stats.responseTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6" style={{ 
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 6px var(--shadow-sm)'
              }}>
                <h3 className="text-[var(--foreground)] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
                    <div>
                      <p className="text-[var(--foreground-muted)] text-xs">Email</p>
                      <p className="text-[var(--foreground)]">{mentorInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" style={{ color: 'var(--success)' }} />
                    <div>
                      <p className="text-[var(--foreground-muted)] text-xs">Phone</p>
                      <p className="text-[var(--foreground)]">{mentorInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" style={{ color: 'var(--error)' }} />
                    <div>
                      <p className="text-[var(--foreground-muted)] text-xs">Location</p>
                      <p className="text-[var(--foreground)]">{mentorInfo.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <h4 className="text-[var(--foreground)] text-sm mb-3">Social Links</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="hover:border-cyan-500/50">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="hover:border-cyan-500/50">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="hover:border-cyan-500/50">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-[var(--foreground)] mb-4">Professional Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[var(--foreground-muted)] text-xs mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <Badge key={index} variant="outline" style={{ color: 'var(--foreground-muted)' }}>
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[var(--foreground-muted)] text-xs mb-2">Industries</p>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((industry, index) => (
                        <Badge key={index} variant="outline" style={{ color: 'var(--foreground-muted)' }}>
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[var(--foreground-muted)] text-xs mb-2">Member Since</p>
                    <p className="text-[var(--foreground)]">{mentorInfo.joinedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-[var(--foreground)] mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--background-muted)' }}>
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-[var(--foreground)] text-sm">{cert.name}</h4>
                      <p className="text-[var(--foreground-muted)] text-xs">{cert.issuer} • {cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-6">
            <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-[var(--foreground)] mb-6">Areas of Expertise</h3>
              <div className="space-y-6">
                {expertise.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--foreground)]">{skill.name}</span>
                      <span className="text-cyan-400">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-[var(--foreground-muted)]">Success Rate</span>
                </div>
                <p className="text-[var(--foreground)] text-3xl">{stats.successRate}%</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <span className="text-[var(--foreground-muted)]">Completion Rate</span>
                </div>
                <p className="text-[var(--foreground)] text-3xl">{stats.completionRate}%</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                  <span className="text-[var(--foreground-muted)]">Response Time</span>
                </div>
                <p className="text-[var(--foreground)] text-3xl">{stats.responseTime}</p>
              </div>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-[var(--foreground)] mb-4">Session Types & Pricing</h3>
              <div className="space-y-3">
                {sessionTypes.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg hover:border-cyan-500/50 transition-colors"
                    style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex-1">
                      <h4 className="text-[var(--foreground)] text-sm mb-1">{session.type}</h4>
                      <p className="text-[var(--foreground-muted)] text-xs">{session.duration} • {session.sessions} sessions completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400">${session.price}</p>
                      <p className="text-[var(--foreground-subtle)] text-xs">per session</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[var(--foreground)]">Recent Reviews</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[var(--foreground)]">{stats.rating}</span>
                  <span className="text-[var(--foreground-muted)]">({stats.totalReviews} reviews)</span>
                </div>
              </div>
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[var(--foreground)] text-sm">{review.name}</h4>
                          <span className="text-[var(--foreground-subtle)] text-xs">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[var(--foreground)] text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-${achievement.color}-500/10 to-${achievement.color}-600/10 backdrop-blur-xl border border-${achievement.color}-500/30 p-6`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${achievement.color}-500/20 to-${achievement.color}-600/20 rounded-lg flex items-center justify-center`}>
                      <achievement.icon className={`w-6 h-6 text-${achievement.color}-400`} />
                    </div>
                    <div>
                      <h4 className="text-[var(--foreground)] mb-1">{achievement.title}</h4>
                      <p className="text-[var(--foreground-muted)] text-sm">{achievement.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

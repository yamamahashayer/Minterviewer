// scripts/seed.js
import 'dotenv/config';
import mongoose from 'mongoose';

import { UserRole, NotificationType } from '../models/enums.js';

import User from '../models/User.js';
import Mentee from '../models/Mentee.js';
import Mentor from '../models/Mentor.js';
import MentorBackground from '../models/MentorBackground.js';
import Skill from '../models/Skill.js';
import Session from '../models/Session.js';
import Goal from '../models/Goal.js';
import PerformancePeriod from '../models/PerformancePeriod.js';
import AiReport from '../models/AiReport.js';
import AiInterview from '../models/AiInterview.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import MentorFeedback from '../models/MentorFeedback.js';
import MentorEarning from '../models/MentorEarning.js';
import Payment from '../models/Payment.js';
import Company from '../models/Company.js';
import JobPost from '../models/JobPost.js';
import JobApplication from '../models/JobApplication.js';

async function main() {
  // ملاحظة: إن واجهتِ مشكلة اختلاف حالة الاسم، احذفي dbName واتركي الاسم داخل الـ URI فقط.
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'Minterviewer' });

  // تنظيف (اختياري أثناء التطوير)
  await Promise.all([
    User.deleteMany({}),
    Mentee.deleteMany({}),
    Mentor.deleteMany({}),
    MentorBackground.deleteMany({}),
    Skill.deleteMany({}),
    Session.deleteMany({}),
    Goal.deleteMany({}),
    PerformancePeriod.deleteMany({}),
    AiReport.deleteMany({}),
    AiInterview.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    MentorFeedback.deleteMany({}),
    MentorEarning.deleteMany({}),
    Payment.deleteMany({}),
    Company.deleteMany({}),
    JobPost.deleteMany({}),
    JobApplication.deleteMany({}),
  ]);

  // Users
  const mentorUser = await User.create({
    email: 'mentor@example.com',
    password_hash: 'hashed_password_here',
    role: UserRole.mentor,
    full_name: 'Mentor One',
    area_of_expertise: 'Backend, System Design',
  });

  const menteeUser = await User.create({
    email: 'mentee@example.com',
    password_hash: 'hashed_password_here',
    role: UserRole.mentee,
    full_name: 'Mentee Star',
  });

  const companyUser = await User.create({
    email: 'company@example.com',
    password_hash: 'hashed_password_here',
    role: UserRole.company,
    full_name: 'Awesome Company HR',
  });

  // Mentor + background
  const mentor = await Mentor.create({
    user: mentorUser._id,
    rating: 4.8,
    totalSessions: 0,
    totalMentees: 0,
    feedback: [],
    availabilities: [new Date()],
    yearsOfExperience: 5,
    field: 'Software Engineering',
  });

  await MentorBackground.create({
    mentor: mentor._id,
    company_name: 'Tech Corp',
    position: 'Senior Engineer',
    start_date: new Date('2021-01-01'),
    description: 'Leading backend systems.',
  });

  // Mentee + Skill
  const mentee = await Mentee.create({
    user: menteeUser._id,
    overall_score: 0,
    total_interviews: 0,
    points_earned: 0,
    active: true,
  });

  await Skill.create({
    user: menteeUser._id,
    SkillName: 'JavaScript',
    level: 2,
  });

  // Company + JobPost + Application
  const company = await Company.create({
    user: companyUser._id,
    companyName: 'Awesome Company',
    field: 'FinTech',
    location: 'Remote',
    websiteurl: 'https://example.com',
  });

  const post = await JobPost.create({
    company: company._id,
    Title: 'Junior Backend Engineer',
    Description: 'Node.js, SQL, problem solving',
    Skills: 'Node.js, PostgreSQL',
    onsite: false,
    type: 'Full-time',
    Availabile: true,
    postTime: new Date(),
    viewers: 0,
  });

  await JobApplication.create({
    post: post._id,
    mentee: mentee._id,
    State: 'APPLIED',
    AdditionalNotes: 'Looking forward!',
  });

  // Session (ربط مباشر مع Mentor) + Feedback/Earning/Payment
  const session = await Session.create({
    mentee: mentee._id,
    mentor: mentor._id, // ✅ حسب السكيما الجديدة
    scaduledtime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    type: 'TECHNICAL',
    state: 'SCHEDULED',
    duration: 60,
    notes: 'Intro call',
  });

  await MentorFeedback.create({
    mentor: mentor._id,
    mentee: mentee._id,
    session: session._id,
  });

  await MentorEarning.create({
    mentor: mentor._id,
    session: session._id,
  });

  await Payment.create({
    mentee: mentee._id,
    session: session._id,
  });

  // AI report / interview
  await AiReport.create({
    mentee: mentee._id,
    report_type: 'COMPREHENSIVE',
    overall_score: 72.5,
    strengths: ['Communication', 'Data Structures'],
    weaknesses: ['System Design'],
    recommendations: ['Practice system design', 'Mock interviews weekly'],
    detailed_feedback: { notes: 'Solid fundamentals.' },
  });

  await AiInterview.create({
    mentee: mentee._id,
    finalized: false,
    questions: 'Q1: ... Q2: ...',
    role: 'Backend Engineer',
    techstack: 'Node.js, SQL',
    type: 'AI_MOCK',
  });

  // Notifications
  await Notification.insertMany([
    {
      user: menteeUser._id,
      title: 'Session Scheduled',
      message: 'Your session is scheduled for tomorrow.',
      type: NotificationType.SESSION,
    },
    {
      user: mentorUser._id,
      title: 'New Session',
      message: 'You have a new session assigned.',
      type: NotificationType.SESSION,
    },
    {
      user: companyUser._id,
      title: 'New Application',
      message: 'A mentee applied to your job post.',
      type: NotificationType.JOB,
    },
  ]);

  // رسالة مثال
  await Message.create({
    sender: menteeUser._id,
    receiver: mentorUser._id,
    content: 'Hello mentor!',
  });

  console.log('Mongo seed completed ✅');
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});

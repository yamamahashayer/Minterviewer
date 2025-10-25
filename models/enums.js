// models/enums.js
export const UserRole = Object.freeze({
  mentee: 'mentee',
  mentor: 'mentor',
  company: 'company',
  admin: 'admin',
});

export const NotificationType = Object.freeze({
  SYSTEM: 'SYSTEM',
  SESSION: 'SESSION',
  PAYMENT: 'PAYMENT',
  JOB: 'JOB',
});

export const SessionState = Object.freeze({
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

export const SessionType = Object.freeze({
  TECHNICAL: 'TECHNICAL',
  BEHAVIORAL: 'BEHAVIORAL',
  MIX: 'MIX',
});

export const ReportType = Object.freeze({
  COMPREHENSIVE: 'COMPREHENSIVE',
  PERFORMANCE_SUMMARY: 'PERFORMANCE_SUMMARY',
  PROGRESS: 'PROGRESS',
  SKILLS_ANALYSIS: 'SKILLS_ANALYSIS',
});

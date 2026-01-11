import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Mentee from "@/models/Mentee";
import User from "@/models/User";
import AiInterview from "@/models/AiInterview";
import AiReport from "@/models/AiReport";

/* ================= HELPERS ================= */

const normalize = (s = "") =>
  s.toString().toLowerCase().trim();

// Calculate general match score based on overall profile
function calculateGeneralMatch(mentee, interviews = [], reports = []) {
  const weights = {
    skills: 0.4,              // 40% weight for skills diversity and level
    interviewReadiness: 0.3,   // 30% weight for interview performance
    aiInsights: 0.2,          // 20% weight for AI report insights
    experience: 0.1,          // 10% weight for overall experience
  };
  
  let totalScore = 0;
  const components = {};
  
  if (!mentee) {
    return {
      totalScore: 0,
      components: { skills: 0, interviewReadiness: 0, aiInsights: 0, experience: 0 },
      matchedSkills: [],
      interviewReadiness: { readinessScore: 0, interviewCount: 0 },
      aiInsights: { aiInsightScore: 0, reportCount: 0 }
    };
  }
  
  // Skills scoring - based on diversity and level
  const menteeSkillNames = Array.isArray(mentee.skills)
    ? mentee.skills
        .map((s) => s && typeof s === 'object' ? s.name : s)
        .filter(Boolean)
    : [];
  
  let skillsScore = 0;
  if (menteeSkillNames.length > 0) {
    // More skills = higher score, with diminishing returns
    const skillCount = Math.min(menteeSkillNames.length, 10); // Cap at 10 skills
    skillsScore = Math.min(100, skillCount * 10);
    
    // Bonus for skill levels
    const avgSkillLevel = mentee.skills.reduce((sum, skill) => {
      const level = typeof skill === 'object' ? skill.level : 50;
      return sum + level;
    }, 0) / mentee.skills.length;
    
    skillsScore = Math.min(100, skillsScore * (avgSkillLevel / 100));
  }
  components.skills = Math.round(skillsScore);
  
  // Interview readiness scoring
  const validInterviews = interviews.filter(i => 
    i.finalized && i.overallScore !== null && i.overallScore !== undefined
  );
  
  let interviewReadinessScore = 0;
  if (validInterviews.length > 0) {
    const avgOverallScore = validInterviews.reduce((sum, i) => sum + i.overallScore, 0) / validInterviews.length;
    const recentInterviews = validInterviews.slice(0, 3);
    const recentPerformance = recentInterviews.length > 0 
      ? recentInterviews.reduce((sum, i) => sum + i.overallScore, 0) / recentInterviews.length 
      : 0;
    
    interviewReadinessScore = Math.min(100, Math.round(
      (avgOverallScore * 0.6) + (recentPerformance * 0.4)
    ));
  }
  components.interviewReadiness = interviewReadinessScore;
  
  // AI report insights scoring
  const reportsWithScores = reports.filter(r => r.overall_score !== null && r.overall_score !== undefined);
  let aiInsightScore = 0;
  if (reportsWithScores.length > 0) {
    const avgReportScore = reportsWithScores.reduce((sum, r) => sum + r.overall_score, 0) / reportsWithScores.length;
    aiInsightScore = Math.min(100, avgReportScore);
  }
  components.aiInsights = aiInsightScore;
  
  // Experience scoring based on interview count and performance
  let experienceScore = 0;
  if (typeof mentee.overall_score === 'number' && mentee.overall_score > 0) {
    experienceScore = Math.min(100, mentee.overall_score);
  } else if (typeof mentee.total_interviews === 'number' && mentee.total_interviews > 0) {
    experienceScore = Math.min(100, mentee.total_interviews * 10);
  }
  components.experience = experienceScore;
  
  // Calculate weighted total
  totalScore = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (components[key] * weight);
  }, 0);
  
  return {
    totalScore: Math.round(totalScore),
    components,
    matchedSkills: menteeSkillNames,
    interviewReadiness: {
      readinessScore: interviewReadinessScore,
      interviewCount: validInterviews.length,
      avgOverallScore: validInterviews.length > 0 ? Math.round(validInterviews.reduce((sum, i) => sum + i.overallScore, 0) / validInterviews.length) : 0
    },
    aiInsights: {
      aiInsightScore,
      reportCount: reportsWithScores.length
    }
  };
}

/* ================= GET ================= */

export async function GET(req, { params }) {
  try {
    console.log('=== GENERAL SUGGESTIONS API CALLED ===');
    
    await connectDB();

    const { companyId } = await params;

    console.log('Fetching general suggestions for company:', companyId);

    /* ================= GET MENTEES ================= */
    const mentees = await Mentee.find({
      active: true,
    })
      .populate("user", "full_name Country profile_photo area_of_expertise short_bio email phoneNumber")
      .lean();

    console.log('Found mentees:', mentees.length);

    /* ================= GET INTERVIEW DATA ================= */
    const menteeIds = mentees.map(m => m._id);
    const interviews = await AiInterview.find({
      mentee: { $in: menteeIds },
      finalized: true
    })
    .sort({ createdAt: -1 })
    .lean();

    console.log('Found interviews:', interviews.length);

    // Group interviews by mentee for efficient lookup
    const interviewsByMentee = interviews.reduce((acc, interview) => {
      const menteeId = interview.mentee.toString();
      if (!acc[menteeId]) acc[menteeId] = [];
      acc[menteeId].push(interview);
      return acc;
    }, {});

    /* ================= GET AI REPORT DATA ================= */
    const reports = await AiReport.find({
      mentee: { $in: menteeIds }
    })
    .sort({ created_at: -1 })
    .lean();

    console.log('Found AI reports:', reports.length);

    // Group reports by mentee for efficient lookup
    const reportsByMentee = reports.reduce((acc, report) => {
      const menteeId = report.mentee.toString();
      if (!acc[menteeId]) acc[menteeId] = [];
      acc[menteeId].push(report);
      return acc;
    }, {});

    /* ================= BUILD SUGGESTIONS ================= */
    console.log('Building general suggestions...');
    
    const suggestions = mentees
      .map((mentee) => {
        try {
          // Skip if no user data
          if (!mentee.user) return null;

          // Ensure skills is properly extracted and is an array
          const menteeSkillNames = Array.isArray(mentee.skills)
            ? mentee.skills
                .map((s) => s && typeof s === 'object' ? s.name : s)
                .filter(Boolean)
            : [];

          // Get interviews for this mentee
          const menteeInterviews = interviewsByMentee[mentee._id.toString()] || [];

          // Get AI reports for this mentee
          const menteeReports = reportsByMentee[mentee._id.toString()] || [];

          // Calculate general match score
          const matchResult = calculateGeneralMatch(mentee, menteeInterviews, menteeReports);

          // Only include if there's some meaningful match
          if (matchResult.totalScore < 20) return null;

          return {
            menteeId: mentee._id,
            userId: mentee.user._id,

            // User information
            full_name: mentee.user?.full_name || "Unknown",
            Country: mentee.user?.Country || "Not specified",
            profile_photo: mentee.user?.profile_photo || null,
            email: mentee.user?.email || null,
            phoneNumber: mentee.user?.phoneNumber || null,
            area_of_expertise: Array.isArray(mentee.user?.area_of_expertise) 
              ? mentee.user.area_of_expertise 
              : [],
            short_bio: mentee.user?.short_bio || "",

            // Skills and matching
            skills: menteeSkillNames,
            matchScore: matchResult.totalScore,
            matchedSkills: matchResult.matchedSkills || [],
            
            // Performance metrics
            performanceScore: typeof mentee.overall_score === 'number' ? mentee.overall_score : 0,
            totalInterviews: typeof mentee.total_interviews === 'number' ? mentee.total_interviews : 0,
            
            // Interview readiness data
            interviewReadiness: matchResult.interviewReadiness,
            
            // AI report insights data
            aiInsights: matchResult.aiInsights,
            
            // Detailed scoring components (for debugging/analysis)
            scoreBreakdown: matchResult.components || {},
          };
        } catch (error) {
          console.error('Error processing mentee:', mentee._id, error);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries

    console.log('Processed suggestions:', suggestions.length);

    // Sort by match score
    suggestions.sort((a, b) => b.matchScore - a.matchScore);

    console.log('Returning general suggestions for company:', companyId);

    return NextResponse.json({
      ok: true,
      company: {
        _id: companyId,
      },
      suggestions,
    });
  } catch (error) {
    console.error("General suggestions error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        ok: false, 
        message: error?.message || "Internal Server Error",
        error: error?.toString()
      },
      { status: 500 }
    );
  }
}

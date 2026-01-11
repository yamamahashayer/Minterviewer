import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import User from "@/models/User";
import AiInterview from "@/models/AiInterview";
import AiReport from "@/models/AiReport";

/* ================= HELPERS ================= */

const normalize = (s = "") =>
  s.toString().toLowerCase().trim();

// Text similarity using Jaccard similarity
function calculateTextSimilarity(text1 = "", text2 = "") {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(normalize(text1).split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(normalize(text2).split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return Math.round((intersection.size / union.size) * 100);
}

// Location matching
function calculateLocationMatch(jobLocation = "", menteeCountry = "") {
  if (!jobLocation || !menteeCountry) return 0;
  
  const normalizedJob = normalize(jobLocation);
  const normalizedMentee = normalize(menteeCountry);
  
  // Exact match
  if (normalizedJob === normalizedMentee) return 100;
  
  // Partial match (e.g., "United States" matches "US")
  if (normalizedJob.includes(normalizedMentee) || normalizedMentee.includes(normalizedJob)) return 70;
  
  // Check for common location keywords
  const jobWords = normalizedJob.split(/\s+/);
  const menteeWords = normalizedMentee.split(/\s+/);
  
  for (const jobWord of jobWords) {
    for (const menteeWord of menteeWords) {
      if (jobWord === menteeWord && jobWord.length > 2) {
        return 50;
      }
    }
  }
  
  return 0;
}

// Experience level matching
function calculateExperienceMatch(jobLevel = "", menteePerformance = 0, menteeInterviews = 0) {
  if (!jobLevel) return 50; // neutral score if no level specified
  
  const normalizedLevel = normalize(jobLevel);
  let experienceScore = 0;
  
  // Map mentee performance to experience level
  if (menteePerformance >= 80) experienceScore = 100; // Senior
  else if (menteePerformance >= 60) experienceScore = 75; // Mid-level
  else if (menteePerformance >= 40) experienceScore = 50; // Junior
  else experienceScore = 25; // Entry level
  
  // Bonus for interview experience
  if (menteeInterviews >= 10) experienceScore += 10;
  else if (menteeInterviews >= 5) experienceScore += 5;
  
  // Match with job level
  if (normalizedLevel.includes("senior") || normalizedLevel.includes("lead") || normalizedLevel.includes("principal")) {
    return Math.min(100, experienceScore >= 75 ? experienceScore : experienceScore * 0.5);
  } else if (normalizedLevel.includes("mid") || normalizedLevel.includes("intermediate")) {
    return Math.min(100, experienceScore >= 50 ? experienceScore : experienceScore * 0.7);
  } else if (normalizedLevel.includes("junior") || normalizedLevel.includes("entry") || normalizedLevel.includes("trainee")) {
    return Math.min(100, experienceScore <= 75 ? experienceScore : experienceScore * 0.8);
  }
  
  return 50; // default for unspecified levels
}

// Enhanced skill matching with normalization and synonyms
const DOMAIN_CATEGORIES = {
  FRONTEND: {
    keywords: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'webpack', 'next.js', 'nuxt.js', 'frontend', 'ui', 'ux', 'web', 'browser', 'dom', 'component', 'state', 'redux', 'mobx', 'styled-components', 'tailwind', 'bootstrap', 'jquery'],
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'SASS', 'Webpack', 'Next.js', 'UI/UX', 'Frontend Development']
  },
  BACKEND: {
    keywords: ['node', 'express', 'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel', 'ruby', 'rails', 'go', 'rust', 'api', 'rest', 'graphql', 'microservices', 'database', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'backend', 'server', 'cloud', 'aws', 'azure', 'gcp'],
    skills: ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Go', 'API Design', 'REST', 'GraphQL', 'Databases', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure']
  },
  DATA: {
    keywords: ['data', 'analytics', 'science', 'machine learning', 'ml', 'artificial intelligence', 'ai', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'spark', 'hadoop', 'tableau', 'power bi', 'sql', 'statistics', 'python', 'r', 'jupyter', 'notebook', 'visualization', 'etl', 'data engineering', 'big data'],
    skills: ['Data Science', 'Machine Learning', 'Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Analysis', 'Statistics', 'Tableau', 'Power BI', 'Spark', 'Big Data']
  },
  MOBILE: {
    keywords: ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'xamarin', 'cordova', 'ionic', 'native', 'app', 'smartphone', 'tablet'],
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development', 'Android Development', 'Mobile Development']
  },
  DEVOPS: {
    keywords: ['devops', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'puppet', 'chef', 'gitlab', 'github actions', 'aws', 'azure', 'gcp', 'cloud', 'infrastructure', 'deployment', 'monitoring', 'logging', 'container', 'containers', 'containerization', 'dockerfile', 'dockerfiles', 'containerized', 'container networking', 'docker networking', 'container orchestration'],
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible', 'AWS', 'Azure', 'Cloud Computing', 'DevOps']
  }
};

const SKILL_SYNONYMS = {
  'node.js': ['node', 'nodejs', 'node.js'],
  'javascript': ['javascript', 'js', 'ecmascript'],
  'typescript': ['typescript', 'ts'],
  'react': ['react', 'reactjs', 'react.js'],
  'python': ['python', 'py'],
  'java': ['java', 'jvm'],
  'sql': ['sql', 'structured query language'],
  'mongodb': ['mongodb', 'mongo'],
  'aws': ['aws', 'amazon web services', 'amazon'],
  'azure': ['azure', 'microsoft azure'],
  'docker': ['docker', 'containerization', 'docker fundamentals', 'dockerfile', 'dockerfiles', 'containerized', 'containers', 'container networking', 'docker networking', 'container orchestration'],
  'kubernetes': ['kubernetes', 'k8s', 'kube'],
  'machine learning': ['machine learning', 'ml'],
  'artificial intelligence': ['artificial intelligence', 'ai'],
  'data science': ['data science', 'ds'],
  'html': ['html', 'hypertext markup language'],
  'css': ['css', 'cascading style sheets', 'sass', 'scss'],
  'tailwind': ['tailwind', 'tailwind css'],
  'frontend': ['frontend', 'front-end', 'client side'],
  'backend': ['backend', 'back-end', 'server side'],
  'fullstack': ['fullstack', 'full stack', 'full-stack'],
  'devops': ['devops', 'dev ops'],
  'microservices': ['microservices', 'micro-service', 'micro service']
};

function normalizeSkill(skill) {
  if (!skill) return '';
  const normalized = normalize(skill);
  
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    if (synonyms.some(syn => normalized.includes(syn))) {
      return canonical;
    }
  }
  
  return normalized;
}

function extractNormalizedSkills(skills) {
  if (!Array.isArray(skills)) return [];
  
  return skills
    .map(skill => {
      if (typeof skill === 'object' && skill.name) {
        return normalizeSkill(skill.name);
      } else if (typeof skill === 'string') {
        return normalizeSkill(skill);
      }
      return null;
    })
    .filter(Boolean);
}

function calculateMatch(jobSkills = [], menteeSkills = []) {
  // Ensure both parameters are arrays
  const normalizedJobSkills = extractNormalizedSkills(jobSkills);
  const normalizedMenteeSkills = extractNormalizedSkills(menteeSkills);
  
  if (!normalizedJobSkills.length || !normalizedMenteeSkills.length) {
    return { score: 0, matched: [] };
  }

  const matched = [];
  normalizedJobSkills.forEach(jobSkill => {
    const menteeSkillIndex = normalizedMenteeSkills.findIndex(menteeSkill => 
      menteeSkill === jobSkill || 
      menteeSkill.includes(jobSkill) || 
      jobSkill.includes(menteeSkill)
    );
    
    if (menteeSkillIndex !== -1) {
      matched.push(jobSkill);
    }
  });

  const score = Math.round(
    (matched.length / normalizedJobSkills.length) * 100
  );

  return { score, matched };
}

// Calculate interview relevance score for a specific job
function calculateInterviewRelevance(interview, job) {
  if (!interview || !job) return 0;
  
  let relevanceScore = 0;
  
  // Role matching (40% weight) - Enhanced preprocessing
  if (job.title && interview.role) {
    const jobTitle = normalize(job.title);
    // Remove punctuation and extra spaces from interview role
    const interviewRole = normalize(interview.role.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim());
    
    if (jobTitle === interviewRole) relevanceScore += 40;
    else if (jobTitle.includes(interviewRole) || interviewRole.includes(jobTitle)) relevanceScore += 25;
    else {
      // Check for common keywords
      const jobWords = jobTitle.split(/\s+/).filter(w => w.length > 2);
      const roleWords = interviewRole.split(/\s+/).filter(w => w.length > 2);
      const commonWords = jobWords.filter(word => roleWords.includes(word));
      if (commonWords.length > 0) relevanceScore += commonWords.length * 5;
    }
  }
  
  // Tech stack matching (35% weight) - Enhanced preprocessing
  if (job.skills && job.skills.length > 0 && interview.techstack) {
    const jobSkills = job.skills.map(normalize);
    // Split interview techstack into individual skills, normalize each
    const interviewTechSkills = interview.techstack
      .split(',')
      .map(skill => normalize(skill.trim()))
      .filter(skill => skill.length > 0);
    
    const matchingSkills = jobSkills.filter(skill => 
      interviewTechSkills.some(interviewSkill => 
        interviewSkill.includes(skill) || skill.includes(interviewSkill)
      )
    );
    if (matchingSkills.length > 0) {
      relevanceScore += (matchingSkills.length / jobSkills.length) * 35;
    }
  }
  
  // Type matching (15% weight)
  if (job.type && interview.type) {
    const jobType = normalize(job.type);
    const interviewType = normalize(interview.type);
    
    if (jobType === interviewType) relevanceScore += 15;
    else if (jobType.includes(interviewType) || interviewType.includes(jobType)) relevanceScore += 8;
  }
  
  // Job application context bonus (10% weight)
  if (interview.isJobApplication) {
    relevanceScore += 10;
  }
  
  return Math.min(100, relevanceScore);
}

// Filter interviews by job relevance
function filterRelevantInterviews(interviews = [], job, minRelevanceScore = 30) {
  if (!interviews.length || !job) return [];
  
  return interviews.filter(interview => {
    const relevanceScore = calculateInterviewRelevance(interview, job);
    return relevanceScore >= minRelevanceScore;
  });
}

// Calculate interview readiness score based on relevant interviews only
function calculateInterviewReadiness(interviews = [], job = null) {
  if (!interviews.length) {
    return {
      readinessScore: 0,
      interviewCount: 0,
      avgOverallScore: 0,
      recentPerformance: 0,
      relevanceInfo: {
        totalInterviews: 0,
        relevantInterviews: 0,
        avgRelevanceScore: 0
      }
    };
  }

  // Filter interviews by job relevance if job is provided
  let relevantInterviews = interviews;
  let totalInterviews = interviews.length;
  let avgRelevanceScore = 0;
  
  if (job) {
    relevantInterviews = filterRelevantInterviews(interviews, job, 30);
    
    // Calculate average relevance score for all interviews
    const relevanceScores = interviews.map(i => calculateInterviewRelevance(i, job));
    avgRelevanceScore = relevanceScores.reduce((sum, score) => sum + score, 0) / relevanceScores.length;
  }

  const validInterviews = relevantInterviews.filter(i => 
    i.finalized && i.overallScore !== null && i.overallScore !== undefined
  );

  if (!validInterviews.length) return {
    readinessScore: 0,
    interviewCount: relevantInterviews.length,
    avgOverallScore: 0,
    recentPerformance: 0,
    relevanceInfo: {
      totalInterviews,
      relevantInterviews: relevantInterviews.length,
      avgRelevanceScore: Math.round(avgRelevanceScore)
    }
  };

  const avgOverallScore = validInterviews.reduce((sum, i) => sum + i.overallScore, 0) / validInterviews.length;
  
  // Recent performance (last 3 relevant interviews)
  const recentInterviews = validInterviews.slice(0, 3);
  const recentPerformance = recentInterviews.length > 0 
    ? recentInterviews.reduce((sum, i) => sum + i.overallScore, 0) / recentInterviews.length 
    : 0;

  // Boost score if interviews are highly relevant to the job
  let relevanceBonus = 0;
  if (job && avgRelevanceScore >= 70) relevanceBonus = 10;
  else if (job && avgRelevanceScore >= 50) relevanceBonus = 5;

  const readinessScore = Math.min(100, Math.round(
    (avgOverallScore * 0.6) + (recentPerformance * 0.4) + relevanceBonus
  ));

  return {
    readinessScore,
    interviewCount: validInterviews.length,
    avgOverallScore: Math.round(avgOverallScore),
    recentPerformance: Math.round(recentPerformance),
    relevanceInfo: {
      totalInterviews,
      relevantInterviews: relevantInterviews.length,
      avgRelevanceScore: Math.round(avgRelevanceScore)
    }
  };
}

// Calculate AI report insights for enhanced scoring
function calculateAiReportInsights(reports = []) {
  if (!reports.length) {
    return {
      aiInsightScore: 0,
      reportCount: 0,
      avgReportScore: 0,
      strengthAlignment: 0,
      skillAnalysisScore: 0,
      progressScore: 0
    };
  }

  // Sort by most recent
  const sortedReports = reports.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  // Calculate average report score
  const reportsWithScores = sortedReports.filter(r => r.overall_score !== null && r.overall_score !== undefined);
  const avgReportScore = reportsWithScores.length > 0 
    ? reportsWithScores.reduce((sum, r) => sum + r.overall_score, 0) / reportsWithScores.length
    : 0;

  // Analyze different report types
  const comprehensiveReports = sortedReports.filter(r => r.report_type === 'COMPREHENSIVE');
  const skillsReports = sortedReports.filter(r => r.report_type === 'SKILLS_ANALYSIS');
  const progressReports = sortedReports.filter(r => r.report_type === 'PROGRESS');
  const performanceReports = sortedReports.filter(r => r.report_type === 'PERFORMANCE_SUMMARY');

  // Strength alignment score (based on strengths mentioned in reports)
  const allStrengths = reportsWithScores.flatMap(r => r.strengths || []);
  const uniqueStrengths = [...new Set(allStrengths)];
  const strengthAlignment = Math.min(100, uniqueStrengths.length * 10); // Max 100 points

  // Skills analysis score
  let skillAnalysisScore = 0;
  if (skillsReports.length > 0) {
    const latestSkillsReport = skillsReports[0];
    if (latestSkillsReport.overall_score) {
      skillAnalysisScore = latestSkillsReport.overall_score;
    }
  }

  // Progress score (improvement over time)
  let progressScore = 0;
  if (progressReports.length >= 2) {
    const latest = progressReports[0];
    const earliest = progressReports[progressReports.length - 1];
    if (latest.overall_score && earliest.overall_score) {
      progressScore = Math.min(100, Math.max(0, latest.overall_score - earliest.overall_score + 50));
    }
  } else if (progressReports.length === 1) {
    progressScore = progressReports[0].overall_score || 0;
  }

  // Overall AI insight score (weighted combination)
  const aiInsightScore = Math.round(
    (avgReportScore * 0.4) +           // 40% weight for average performance
    (strengthAlignment * 0.2) +         // 20% weight for strengths
    (skillAnalysisScore * 0.25) +      // 25% weight for skills analysis
    (progressScore * 0.15)              // 15% weight for progress
  );

  return {
    aiInsightScore,
    reportCount: reportsWithScores.length,
    avgReportScore: Math.round(avgReportScore),
    strengthAlignment,
    skillAnalysisScore,
    progressScore
  };
}

// Calculate comprehensive similarity score
function calculateComprehensiveScore(job, mentee, user, interviews = [], reports = []) {
  const weights = {
    skills: 0.65,              // 65% weight for skills (increased from 25% to reflect importance)
    interviewReadiness: 0.15,  // 15% weight for interview performance (reduced from 20%)
    aiInsights: 0.1,           // 10% weight for AI report insights (reduced from 20%)
    experience: 0.05,          // 5% weight for experience level (reduced from 15%)
    location: 0.03,            // 3% weight for location (reduced from 10%)
    expertise: 0.01,           // 1% weight for area of expertise (reduced from 5%)
    bio: 0.01                  // 1% weight for bio similarity (reduced from 5%)
  };
  
  let totalScore = 0;
  const components = {};
  
  // Ensure job and mentee objects exist
  if (!job || !mentee || !user) {
    return {
      totalScore: 0,
      components: { skills: 0, interviewReadiness: 0, aiInsights: 0, experience: 0, location: 0, expertise: 0, bio: 0 },
      skillMatch: { score: 0, matched: [] },
      matchedSkills: [],
      interviewReadiness: { readinessScore: 0, interviewCount: 0 },
      aiInsights: { aiInsightScore: 0, reportCount: 0 }
    };
  }
  
  // Skills matching - use enhanced skill extraction
  const menteeSkillNames = extractNormalizedSkills(mentee.skills);
  
  const jobSkills = Array.isArray(job.skills) ? job.skills : [];
  const skillMatch = calculateMatch(jobSkills, menteeSkillNames);
  components.skills = skillMatch.score;
  
  // Interview readiness scoring (only relevant interviews)
  const interviewReadiness = calculateInterviewReadiness(interviews, job);
  components.interviewReadiness = interviewReadiness.readinessScore;
  
  // AI report insights scoring
  const aiInsights = calculateAiReportInsights(reports);
  components.aiInsights = aiInsights.aiInsightScore;
  
  // Experience level matching (adjusted based on interview performance and AI insights)
  const baseExperienceScore = calculateExperienceMatch(
    job.level || '',
    typeof mentee.overall_score === 'number' ? mentee.overall_score : 0,
    typeof mentee.total_interviews === 'number' ? mentee.total_interviews : 0
  );
  
  // Boost experience score if interview readiness or AI insights are high
  const performanceBoost = interviewReadiness.readinessScore >= 70 || aiInsights.aiInsightScore >= 70 ? 1.3 : 
                          interviewReadiness.readinessScore >= 50 || aiInsights.aiInsightScore >= 50 ? 1.15 : 1.0;
  components.experience = Math.min(100, baseExperienceScore * performanceBoost);
  
  // Location matching
  components.location = calculateLocationMatch(job.location || '', user.Country || '');
  
  // Area of expertise matching
  const jobAiFocus = Array.isArray(job.aiFocus) ? job.aiFocus : [];
  const userExpertise = Array.isArray(user.area_of_expertise) ? user.area_of_expertise : [];
  
  if (jobAiFocus.length > 0 && userExpertise.length > 0) {
    const expertiseMatch = calculateMatch(jobAiFocus, userExpertise);
    components.expertise = expertiseMatch.score;
  } else {
    components.expertise = 0;
  }
  
  // Bio/description similarity
  components.bio = calculateTextSimilarity(job.description || '', user.short_bio || '');
  
  // Calculate weighted total
  totalScore = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (components[key] * weight);
  }, 0);
  
  return {
    totalScore: Math.round(totalScore),
    components,
    skillMatch,
    matchedSkills: skillMatch.matched,
    interviewReadiness,
    aiInsights
  };
}

/* ================= GET ================= */

export async function GET(req, { params }) {
  try {
    console.log('=== SUGGESTIONS API CALLED ===');
    
    await connectDB();

    // ✅ IMPORTANT FIX
    const { companyId, jobId } = await params;

    console.log('Fetching suggestions for:', { companyId, jobId });

    /* ================= GET JOB ================= */
    const job = await Job.findOne({
      _id: jobId,
      companyId,
    }).lean();

    if (!job) {
      console.log('Job not found:', { jobId, companyId });
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    console.log('Job found:', job.title);

    const jobSkills = job.skills || [];

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
    console.log('Building suggestions...');
    
    const suggestions = mentees
      .map((mentee) => {
        try {
          // Skip if no user data
          if (!mentee.user) return null;

          // Skills matching - use enhanced skill extraction
          const menteeSkillNames = extractNormalizedSkills(mentee.skills);

          // Get interviews for this mentee
          const menteeInterviews = interviewsByMentee[mentee._id.toString()] || [];

          // Get AI reports for this mentee
          const menteeReports = reportsByMentee[mentee._id.toString()] || [];

          // Calculate comprehensive similarity score with interview and AI report data
          const similarityResult = calculateComprehensiveScore(job, mentee, mentee.user, menteeInterviews, menteeReports);

          // Only include if there's some meaningful match
          if (similarityResult.totalScore < 20) return null;

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
            matchScore: similarityResult.totalScore,
            matchedSkills: similarityResult.matchedSkills || [],
            
            // Performance metrics
            performanceScore: typeof mentee.overall_score === 'number' ? mentee.overall_score : 0,
            totalInterviews: typeof mentee.total_interviews === 'number' ? mentee.total_interviews : 0,
            
            // Interview readiness data
            interviewReadiness: similarityResult.interviewReadiness,
            
            // AI report insights data
            aiInsights: similarityResult.aiInsights,
            
            // Detailed scoring components (for debugging/analysis)
            scoreBreakdown: similarityResult.components || {},
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

    console.log('Returning suggestions for job:', job.title);

    return NextResponse.json({
      ok: true,
      job: {
        _id: job._id,
        title: job.title,
        skills: job.skills,
      },
      suggestions,
    });
  } catch (error) {
    console.error("Suggestions error:", error);
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

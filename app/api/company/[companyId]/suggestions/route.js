import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Mentee from "@/models/Mentee";
import User from "@/models/User";
import AiInterview from "@/models/AiInterview";
import AiReport from "@/models/AiReport";
import Job from "@/models/Job";

/* ================= HELPERS ================= */

const normalize = (s = "") =>
  s.toString().toLowerCase().trim();

// Domain categorization for skill-based matching
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

// Skill normalization and synonym mapping
const SKILL_SYNONYMS = {
  'javascript': ['javascript', 'js', 'ecmascript'],
  'typescript': ['typescript', 'ts'],
  'react': ['react', 'reactjs', 'react.js'],
  'node.js': ['node', 'nodejs', 'node.js'],
  'python': ['python', 'py'],
  'java': ['java', 'jvm'],
  'sql': ['sql', 'structured query language'],
  'aws': ['aws', 'amazon web services', 'amazon'],
  'azure': ['azure', 'microsoft azure'],
  'docker': ['docker', 'containerization', 'docker fundamentals', 'dockerfile', 'dockerfiles', 'containerized', 'containers', 'container networking', 'docker networking', 'container orchestration'],
  'kubernetes': ['kubernetes', 'k8s', 'kube'],
  'machine learning': ['machine learning', 'ml'],
  'artificial intelligence': ['artificial intelligence', 'ai'],
  'data science': ['data science', 'ds'],
  'frontend': ['frontend', 'front-end', 'client side'],
  'backend': ['backend', 'back-end', 'server side'],
  'fullstack': ['fullstack', 'full stack', 'full-stack'],
  'devops': ['devops', 'dev ops']
};

// Normalize skill names using synonym mapping
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

// Extract normalized skill array from mentee skills
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

// Categorize skills into domains
function categorizeSkills(skills) {
  const domains = {
    FRONTEND: [],
    BACKEND: [],
    DATA: [],
    MOBILE: [],
    DEVOPS: [],
    GENERAL: []
  };
  
  const normalizedSkills = extractNormalizedSkills(skills);
  
  normalizedSkills.forEach(skill => {
    let categorized = false;
    
    for (const [domain, config] of Object.entries(DOMAIN_CATEGORIES)) {
      if (config.keywords.some(keyword => skill.includes(keyword) || keyword.includes(skill))) {
        domains[domain].push(skill);
        categorized = true;
        break;
      }
    }
    
    if (!categorized) {
      domains.GENERAL.push(skill);
    }
  });
  
  return domains;
}

// Extract skills from interview data (role, techstack, type)
function extractSkillsFromInterviews(interviews = []) {
  if (!Array.isArray(interviews) || interviews.length === 0) {
    return [];
  }
  
  const extractedSkills = new Set(); // Use Set to avoid duplicates
  
  interviews.forEach(interview => {
    try {
      // Extract skills from role field
      if (interview.role) {
        const roleSkills = extractSkillsFromText(interview.role);
        roleSkills.forEach(skill => extractedSkills.add(skill));
      }
      
      // Extract skills from techstack field (comma-separated)
      if (interview.techstack) {
        const techSkills = interview.techstack
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0)
          .map(skill => normalizeSkill(skill));
        
        techSkills.forEach(skill => {
          if (skill) extractedSkills.add(skill);
        });
      }
      
      // Extract skills from type field
      if (interview.type) {
        const typeSkills = extractSkillsFromText(interview.type);
        typeSkills.forEach(skill => extractedSkills.add(skill));
      }
      
      // Extract skills from strengths (these might indicate domain expertise)
      if (Array.isArray(interview.strengths)) {
        interview.strengths.forEach(strength => {
          const strengthSkills = extractSkillsFromText(strength);
          strengthSkills.forEach(skill => extractedSkills.add(skill));
        });
      }
      
    } catch (error) {
      console.warn('Error extracting skills from interview:', interview._id, error);
    }
  });
  
  return Array.from(extractedSkills);
}

// Extract skills from free-form text using domain keywords
function extractSkillsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  
  const normalizedText = normalize(text);
  const foundSkills = new Set();
  
  // Check for domain keywords in the text
  for (const [domain, config] of Object.entries(DOMAIN_CATEGORIES)) {
    config.keywords.forEach(keyword => {
      if (normalizedText.includes(keyword)) {
        foundSkills.add(normalizeSkill(keyword));
      }
    });
  }
  
  // Check for skill synonyms
  Object.entries(SKILL_SYNONYMS).forEach(([canonical, synonyms]) => {
    synonyms.forEach(synonym => {
      if (normalizedText.includes(synonym)) {
        foundSkills.add(canonical);
      }
    });
  });
  
  // Enhanced Docker-specific extraction for compound terms
  if (normalizedText.includes('containerized') || normalizedText.includes('container')) {
    foundSkills.add('docker');
  }
  
  if (normalizedText.includes('dockerfile') || normalizedText.includes('dockerfiles')) {
    foundSkills.add('docker');
  }
  
  if (normalizedText.includes('container networking') || normalizedText.includes('docker networking')) {
    foundSkills.add('docker');
  }
  
  // Extract potential skill words (3+ characters, common tech terms)
  const potentialSkills = normalizedText
    .split(/\s+/)
    .filter(word => word.length >= 3)
    .filter(word => 
      // Common tech patterns
      /^[a-z]+(\.[a-z]+)*$/.test(word) || // dot notation (e.g., node.js)
      /^[a-z]+(\d+)?$/.test(word) || // alphanumeric
      word.includes('js') || word.includes('css') || word.includes('html') ||
      word.includes('api') || word.includes('sql') || word.includes('ui') ||
      word.includes('docker') || word.includes('container')
    )
    .map(word => normalizeSkill(word));
  
  potentialSkills.forEach(skill => {
    if (skill) foundSkills.add(skill);
  });
  
  return Array.from(foundSkills);
}

// Merge profile skills with interview-derived skills
function mergeProfileAndInterviewSkills(profileSkills = [], interviewSkills = []) {
  const normalizedProfileSkills = extractNormalizedSkills(profileSkills);
  const normalizedInterviewSkills = interviewSkills.map(skill => normalizeSkill(skill)).filter(Boolean);
  
  // Create skill objects with source information
  const mergedSkills = new Map();
  
  // Add profile skills with higher weight
  normalizedProfileSkills.forEach(skill => {
    mergedSkills.set(skill, {
      name: skill,
      source: 'profile',
      weight: 1.0, // Full weight for profile skills
      level: 50 // Default level
    });
  });
  
  // Add interview skills with lower weight
  normalizedInterviewSkills.forEach(skill => {
    if (mergedSkills.has(skill)) {
      // Skill exists in profile, boost its confidence
      const existing = mergedSkills.get(skill);
      existing.weight = Math.min(1.0, existing.weight + 0.3); // Boost but cap at 1.0
      existing.interviewDerived = true;
    } else {
      // New skill from interviews
      mergedSkills.set(skill, {
        name: skill,
        source: 'interview',
        weight: 0.7, // Lower weight for interview-only skills
        level: 40, // Slightly lower default level
        interviewDerived: true
      });
    }
  });
  
  return Array.from(mergedSkills.values());
}
// Calculate domain-aware skill match score with weighted skills
function calculateDomainAwareSkillMatch(jobSkills = [], menteeSkills = [], jobTitle = '') {
  const normalizedJobSkills = extractNormalizedSkills(jobSkills);
  
  // Handle both old format (array of strings) and new format (array of skill objects)
  let normalizedMenteeSkills;
  let skillWeights = new Map();
  
  if (menteeSkills.length > 0 && typeof menteeSkills[0] === 'object' && menteeSkills[0].name) {
    // New format: skill objects with weights
    normalizedMenteeSkills = menteeSkills.map(skill => skill.name);
    menteeSkills.forEach(skill => {
      skillWeights.set(skill.name, skill.weight || 1.0);
    });
  } else {
    // Old format: array of strings
    normalizedMenteeSkills = extractNormalizedSkills(menteeSkills);
    normalizedMenteeSkills.forEach(skill => {
      skillWeights.set(skill, 1.0); // Default weight
    });
  }
  
  if (!normalizedJobSkills.length) {
    return { score: 50, matched: [], domainBonus: 0, domainAnalysis: {} };
  }
  
  // Categorize both job and mentee skills
  const jobDomains = categorizeSkills(normalizedJobSkills);
  const menteeDomains = categorizeSkills(normalizedMenteeSkills);
  
  // Calculate weighted skill matches
  const weightedMatches = [];
  normalizedJobSkills.forEach(jobSkill => {
    const menteeSkillIndex = normalizedMenteeSkills.findIndex(menteeSkill => 
      menteeSkill === jobSkill || 
      menteeSkill.includes(jobSkill) || 
      jobSkill.includes(menteeSkill)
    );
    
    if (menteeSkillIndex !== -1) {
      const matchedSkill = normalizedMenteeSkills[menteeSkillIndex];
      const weight = skillWeights.get(matchedSkill) || 1.0;
      weightedMatches.push({
        skill: jobSkill,
        matchedSkill,
        weight
      });
    }
  });
  
  // Calculate base score using weights
  const totalWeight = weightedMatches.reduce((sum, match) => sum + match.weight, 0);
  const maxPossibleWeight = normalizedJobSkills.length; // Assume max weight of 1.0 per job skill
  let baseScore = maxPossibleWeight > 0 ? (totalWeight / maxPossibleWeight) * 100 : 0;
  
  // Domain alignment bonus with weights
  let domainBonus = 0;
  let domainAnalysis = {};
  
  // Analyze domain alignment
  for (const [domain, jobDomainSkills] of Object.entries(jobDomains)) {
    if (jobDomainSkills.length === 0) continue;
    
    const menteeDomainSkills = menteeDomains[domain] || [];
    const domainMatches = jobDomainSkills.filter(jobSkill => 
      menteeDomainSkills.some(menteeSkill => {
        const menteeSkillIndex = normalizedMenteeSkills.findIndex(ms => 
          ms === menteeSkill || ms.includes(jobSkill) || jobSkill.includes(ms)
        );
        return menteeSkillIndex !== -1;
      })
    );
    
    // Calculate weighted domain score
    let domainWeight = 0;
    domainMatches.forEach(jobSkill => {
      const menteeSkillIndex = normalizedMenteeSkills.findIndex(ms => 
        ms === jobSkill || ms.includes(jobSkill) || jobSkill.includes(ms)
      );
      if (menteeSkillIndex !== -1) {
        const matchedSkill = normalizedMenteeSkills[menteeSkillIndex];
        domainWeight += skillWeights.get(matchedSkill) || 1.0;
      }
    });
    
    const domainScore = jobDomainSkills.length > 0 ? (domainWeight / jobDomainSkills.length) * 100 : 0;
    domainAnalysis[domain] = {
      required: jobDomainSkills.length,
      available: menteeDomainSkills.length,
      matched: domainMatches.length,
      score: Math.round(domainScore),
      weightedScore: Math.round(domainWeight)
    };
    
    // Bonus for strong domain alignment (considering weights)
    if (domainScore >= 80) {
      domainBonus += 15;
    } else if (domainScore >= 60) {
      domainBonus += 10;
    } else if (domainScore >= 40) {
      domainBonus += 5;
    }
  }
  
  // Job title context bonus
  let titleBonus = 0;
  const normalizedTitle = normalize(jobTitle);
  
  if (normalizedTitle.includes('frontend') || normalizedTitle.includes('ui') || normalizedTitle.includes('react')) {
    const frontendScore = domainAnalysis.FRONTEND?.score || 0;
    titleBonus = frontendScore >= 60 ? 10 : frontendScore >= 40 ? 5 : 0;
  } else if (normalizedTitle.includes('backend') || normalizedTitle.includes('server') || normalizedTitle.includes('api')) {
    const backendScore = domainAnalysis.BACKEND?.score || 0;
    titleBonus = backendScore >= 60 ? 10 : backendScore >= 40 ? 5 : 0;
  } else if (normalizedTitle.includes('data') || normalizedTitle.includes('analytics') || normalizedTitle.includes('machine learning')) {
    const dataScore = domainAnalysis.DATA?.score || 0;
    titleBonus = dataScore >= 60 ? 10 : dataScore >= 40 ? 5 : 0;
  } else if (normalizedTitle.includes('mobile') || normalizedTitle.includes('ios') || normalizedTitle.includes('android')) {
    const mobileScore = domainAnalysis.MOBILE?.score || 0;
    titleBonus = mobileScore >= 60 ? 10 : mobileScore >= 40 ? 5 : 0;
  } else if (normalizedTitle.includes('devops') || normalizedTitle.includes('cloud') || normalizedTitle.includes('infrastructure') || normalizedTitle.includes('docker') || normalizedTitle.includes('container')) {
    const devopsScore = domainAnalysis.DEVOPS?.score || 0;
    titleBonus = devopsScore >= 60 ? 10 : devopsScore >= 40 ? 5 : 0;
  }
  
  const totalScore = Math.min(100, baseScore + domainBonus + titleBonus);
  
  return {
    score: Math.round(totalScore),
    matched: weightedMatches.map(m => m.skill),
    weightedMatches,
    domainBonus: Math.round(domainBonus),
    titleBonus: Math.round(titleBonus),
    domainAnalysis,
    baseScore: Math.round(baseScore)
  };
}

// Calculate skill-based, domain-aware match score
function calculateSkillBasedMatch(mentee, interviews = [], reports = [], jobContext = null) {
  const weights = {
    skills: 0.5,              // 50% weight for skills (increased emphasis)
    interviewReadiness: 0.25, // 25% weight for interview performance
    aiInsights: 0.15,         // 15% weight for AI report insights
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
      aiInsights: { aiInsightScore: 0, reportCount: 0 },
      skillAnalysis: {}
    };
  }
  
  // Extract skills from interviews
  const interviewSkills = extractSkillsFromInterviews(interviews);
  
  // Merge profile skills with interview-derived skills
  const mergedSkills = mergeProfileAndInterviewSkills(mentee.skills, interviewSkills);
  
  // Extract normalized skill names for compatibility
  const menteeSkillNames = mergedSkills.map(skill => skill.name);
  const menteeSkillDomains = categorizeSkills(menteeSkillNames);
  
  // Skills scoring with domain awareness
  let skillsScore = 0;
  let skillAnalysis = {};
  
  if (jobContext && jobContext.skills) {
    // Job-aware skill matching using merged skills
    const skillMatchResult = calculateDomainAwareSkillMatch(
      jobContext.skills, 
      mergedSkills, // Use weighted merged skills
      jobContext.title || ''
    );
    skillsScore = skillMatchResult.score;
    skillAnalysis = {
      type: 'job_aware',
      domainAnalysis: skillMatchResult.domainAnalysis,
      matchedSkills: skillMatchResult.matched,
      weightedMatches: skillMatchResult.weightedMatches || [],
      domainBonus: skillMatchResult.domainBonus,
      titleBonus: skillMatchResult.titleBonus,
      baseScore: skillMatchResult.baseScore,
      interviewSkillsExtracted: interviewSkills.length,
      totalSkillsAfterMerge: mergedSkills.length,
      profileSkills: mentee.skills?.length || 0,
      skillBreakdown: {
        profileOnly: mergedSkills.filter(s => s.source === 'profile').length,
        interviewOnly: mergedSkills.filter(s => s.source === 'interview').length,
        both: mergedSkills.filter(s => s.interviewDerived).length
      }
    };
  } else {
    // General skill diversity scoring (fallback) using merged skills
    if (menteeSkillNames.length > 0) {
      // Weighted skill count calculation
      const totalWeight = mergedSkills.reduce((sum, skill) => sum + (skill.weight || 1.0), 0);
      const skillCount = Math.min(menteeSkillNames.length, 10); // Cap at 10 skills
      skillsScore = Math.min(100, (totalWeight / skillCount) * 10);
      
      // Bonus for skill levels (average weighted by skill weight)
      const avgSkillLevel = mergedSkills.reduce((sum, skill) => {
        const level = skill.level || 50;
        const weight = skill.weight || 1.0;
        return sum + (level * weight);
      }, 0) / mergedSkills.reduce((sum, skill) => sum + (skill.weight || 1.0), 0);
      
      skillsScore = Math.min(100, skillsScore * (avgSkillLevel / 100));
      
      // Domain diversity bonus
      const domainCount = Object.values(menteeSkillDomains).filter(domainSkills => domainSkills.length > 0).length;
      const diversityBonus = Math.min(20, domainCount * 4);
      skillsScore = Math.min(100, skillsScore + diversityBonus);
      
      skillAnalysis = {
        type: 'general',
        skillCount: menteeSkillNames.length,
        avgSkillLevel: Math.round(avgSkillLevel),
        domainCount,
        domains: Object.fromEntries(
          Object.entries(menteeSkillDomains).map(([domain, skills]) => [domain, skills.length])
        ),
        diversityBonus,
        interviewSkillsExtracted: interviewSkills.length,
        totalSkillsAfterMerge: mergedSkills.length,
        profileSkills: mentee.skills?.length || 0,
        skillBreakdown: {
          profileOnly: mergedSkills.filter(s => s.source === 'profile').length,
          interviewOnly: mergedSkills.filter(s => s.source === 'interview').length,
          both: mergedSkills.filter(s => s.interviewDerived).length
        }
      };
    }
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
    },
    skillAnalysis
  };
}

/* ================= GET ================= */

export async function GET(req, { params }) {
  try {
    console.log('=== GENERAL SUGGESTIONS API CALLED ===');
    
    await connectDB();

    const { companyId } = await params;
    const { searchParams } = new URL(req.url);
    
    // Extract optional job context from query parameters (for specific job matching)
    const jobId = searchParams.get('jobId') || '';
    const jobTitle = searchParams.get('jobTitle') || '';
    const jobLevel = searchParams.get('jobLevel') || '';
    const jobType = searchParams.get('jobType') || '';
    
    console.log('Fetching suggestions for company:', companyId);

    /* ================= GET COMPANY JOBS FOR SKILL CONTEXT ================= */
    let jobContext = null;
    
    if (jobId) {
      // If specific jobId provided, fetch that job
      const job = await Job.findOne({
        _id: jobId,
        companyId,
        status: 'active'
      }).lean();
      
      if (job) {
        jobContext = {
          id: job._id,
          title: job.title,
          skills: job.skills || [],
          level: job.level,
          type: job.type,
          description: job.description,
          aiFocus: job.aiFocus || []
        };
        console.log('Using specific job context:', job.title);
      }
    } else {
      // Otherwise, fetch all active jobs to create aggregated skill context
      const activeJobs = await Job.find({
        companyId,
        status: 'active'
      })
      .select('title skills level type description aiFocus')
      .lean();
      
      if (activeJobs.length > 0) {
        // Aggregate all skills from active jobs
        const allJobSkills = new Set();
        const jobTitles = [];
        
        activeJobs.forEach(job => {
          if (job.skills && Array.isArray(job.skills)) {
            job.skills.forEach(skill => allJobSkills.add(skill));
          }
          if (job.title) {
            jobTitles.push(job.title);
          }
        });
        
        // Use the most recent job as primary context, but include all skills
        const primaryJob = activeJobs[0]; // Assuming sorted by creation date
        
        jobContext = {
          id: null, // Aggregated context
          title: jobTitle || primaryJob.title || 'Active Jobs',
          skills: Array.from(allJobSkills),
          level: jobLevel || primaryJob.level,
          type: jobType || primaryJob.type,
          description: primaryJob.description,
          aiFocus: primaryJob.aiFocus || [],
          aggregatedFrom: activeJobs.length,
          availableJobs: activeJobs.length,
          jobTitles: jobTitles.slice(0, 5) // Include up to 5 job titles for context
        };
        
        console.log(`Using aggregated job context from ${activeJobs.length} active jobs`);
        console.log('Total skills extracted:', allJobSkills.size);
      }
    }
    
    // Fallback to query parameters only if no jobs found in database
    if (!jobContext && (jobTitle || searchParams.get('jobSkills'))) {
      const querySkills = searchParams.get('jobSkills') ? 
        searchParams.get('jobSkills').split(',').map(s => s.trim()).filter(Boolean) : [];
      
      jobContext = {
        title: jobTitle,
        skills: querySkills,
        level: jobLevel,
        type: jobType,
        source: 'query_parameters' // Mark as fallback
      };
      console.log('Using query parameter fallback (no jobs found in database)');
    }

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
          const menteeSkillNames = extractNormalizedSkills(mentee.skills);

          // Get interviews for this mentee
          const menteeInterviews = interviewsByMentee[mentee._id.toString()] || [];

          // Get AI reports for this mentee
          const menteeReports = reportsByMentee[mentee._id.toString()] || [];

          // Calculate skill-based, domain-aware match score
          const matchResult = calculateSkillBasedMatch(mentee, menteeInterviews, menteeReports, jobContext);

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
            classified_skills: mentee.classified_skills || null,
            matchScore: matchResult.totalScore,
            matchedSkills: matchResult.matchedSkills || [],
            
            // Enhanced skill analysis for debugging and insights
            skillAnalysis: matchResult.skillAnalysis || {},
            
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

    console.log('Returning suggestions for company:', companyId);
    console.log('Matching mode:', jobContext ? 'skill-based with job context' : 'general skill diversity');

    return NextResponse.json({
      ok: true,
      company: {
        _id: companyId,
      },
      jobContext: jobContext ? {
        id: jobContext.id,
        title: jobContext.title,
        skills: jobContext.skills,
        level: jobContext.level,
        type: jobContext.type,
        description: jobContext.description,
        aiFocus: jobContext.aiFocus,
        matchingMode: 'skill_based_domain_aware',
        source: jobContext.source || 'database',
        ...(jobContext.aggregatedFrom && {
          aggregatedFrom: jobContext.aggregatedFrom,
          availableJobs: jobContext.availableJobs,
          jobTitles: jobContext.jobTitles
        })
      } : {
        matchingMode: 'general_skill_diversity'
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

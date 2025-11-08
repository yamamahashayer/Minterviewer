// src/lib/cvAnalysis/schema.ts

//
export type CvAnalysis = {
  score: number;                
  atsScore: number;             
  strengths: string[];          
  weaknesses: string[];         
  improvements: string[];       
  redFlags: string[];           
  recommendedJobTitles: string[]; 
  keywordCoverage: {
    matched: string[];          
    missing: string[];         
  };
};

export type RoleSpec = {
  title: string;
  mustHaveKeywords: string[];
  niceToHaveKeywords?: string[];
};

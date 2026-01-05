import { BaseService } from './baseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../constants/config';
import api from './api';

// Define file interface since expo-document-picker may not be available
export interface DocumentFile {
  uri: string;
  name: string;
  mimeType?: string;
}

export interface CVUploadResponse {
  resumeId: string;
  parsed?: any;
  message?: string;
}

export interface CVParsedResponse {
  parsed: any;
  resumeId: string;
}

export interface CVAnalysisRequest {
  resumeId: string;
  affindaJson: any;
  userNotes?: string;
}

export interface CVAnalysisResponse {
  ok: boolean;
  analysis: {
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
    categories: {
      formatting: {
        title: string;
        score: number;
        insights: string[];
      };
      content: {
        title: string;
        score: number;
        insights: string[];
      };
      keywords: {
        title: string;
        score: number;
        insights: string[];
      };
      experience: {
        title: string;
        score: number;
        insights: string[];
      };
    };
  };
  savedId: string;
}

export interface ParsedCVData {
  name?: string;
  summary?: string;
  skills?: string[];
  workExperience?: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    github?: string;
    link?: string;
  }>;
}

export interface CVCreateRequest {
  html: string;
  parsed?: any;
}

export interface CVCreateResponse {
  ok: boolean;
  resume: {
    _id: string;
    mentee: string;
    user?: string;
    html: string;
    parsed: any;
    source: string;
    createdAt: string;
  };
}

export class CVService extends BaseService {
  /**
   * Upload CV file to Affinda for parsing
   */
  async uploadCV(menteeId: string, file: DocumentFile): Promise<CVUploadResponse> {
    if (!file) {
      throw new Error('No file selected');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.mimeType || 'application/pdf',
      name: file.name,
    } as any);

    return this.post(`/api/mentees/${menteeId}/cv/upload`, formData);
  }

  /**
   * Get parsed CV data from Affinda
   */
  async getParsedCV(menteeId: string, resumeId: string): Promise<CVParsedResponse> {
    return this.get(`/api/mentees/${menteeId}/cv/parsed?resumeId=${resumeId}`);
  }

  /**
   * Run Gemini AI analysis on parsed CV data
   */
  async analyzeCV(menteeId: string, request: CVAnalysisRequest): Promise<CVAnalysisResponse> {
    return this.post(`/api/mentees/${menteeId}/cv/analyze`, request);
  }

  /**
   * Save created CV to database
   */
  async saveCV(menteeId: string, html: string, parsed?: any): Promise<CVCreateResponse> {
    return this.post(`/api/mentees/${menteeId}/cv/create`, {
      html,
      parsed: parsed || {},
    });
  }

  /**
   * Export CV as PDF or DOCX
   */
  async exportCV(menteeId: string, resumeId: string, format: 'pdf' | 'docx'): Promise<Blob> {
    const url = `/api/mentees/${menteeId}/cv/create?format=${format === 'pdf' ? 'pdf' : 'word'}&resumeId=${resumeId}`;
    
    // Use direct fetch for blob response to avoid axios responseType issues
    const token = await AsyncStorage.getItem('auth_token');
    
    const response = await fetch(`${CONFIG.API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Export failed: ${response.status} - ${errorText}`);
    }

    return response.blob();
  }

  /**
   * Complete CV pipeline: Upload → Parse → Analyze
   */
  async processCV(menteeId: string, file: DocumentFile, userNotes?: string): Promise<CVAnalysisResponse> {
    try {
      // Step 1: Upload to Affinda
      const uploadResult = await this.uploadCV(menteeId, file);
      
      // Step 2: Get parsed data
      const parsedResult = await this.getParsedCV(menteeId, uploadResult.resumeId);
      
      // Step 3: Run AI analysis
      const analysisResult = await this.analyzeCV(menteeId, {
        resumeId: uploadResult.resumeId,
        affindaJson: parsedResult.parsed,
        userNotes,
      });

      return analysisResult;
    } catch (error) {
      console.error('CV processing pipeline error:', error);
      throw error;
    }
  }

  /**
   * Build resume HTML (same as Web version)
   */
  static buildResumeHtml(data: any): string {
    const safe = (t?: string) =>
      (t ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

    const short = (s?: string, n = 160) => {
      if (!s) return "";
      const t = s.replace(/\s+/g, " ").trim();
      return t.length > n ? t.slice(0, n - 1) + "…" : t;
    };

    return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.45;padding:40px;max-width:760px;margin:auto;">

  <!-- NAME -->
  <h1 style="margin:0;font-size:28px;font-weight:700;text-align:center;">
    ${safe(data.personal.fullName || "Your Name")}
  </h1>

  <!-- CONTACTS -->
  <div style="font-size:13px;color:#333;margin-top:8px;margin-bottom:22px;text-align:center;line-height:1.45;">
    ${[
      data.personal.email ? safe(data.personal.email) : "",
      data.personal.phone ? safe(data.personal.phone) : "",
      data.personal.location ? safe(data.personal.location) : "",
      data.personal.linkedin ? safe(data.personal.linkedin) : "",
      data.personal.github ? safe(data.personal.github) : "",
    ]
      .filter(Boolean)
      .join(" • ")}
  </div>

  <!-- SUMMARY -->
  ${data.personal.summary ? `
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:#1a1a1a;border-bottom:2px solid #e1e1e1;padding-bottom:4px;">
      Professional Summary
    </h2>
    <p style="margin:0;font-size:14px;line-height:1.5;">
      ${safe(short(data.personal.summary, 300))}
    </p>
  </div>
  ` : ""}

  <!-- EXPERIENCE -->
  ${data.experience && data.experience.length > 0 && data.experience.some((exp: any) => exp.title) ? `
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a1a1a;border-bottom:2px solid #e1e1e1;padding-bottom:4px;">
      Work Experience
    </h2>
    ${data.experience
      .filter((exp: any) => exp.title)
      .map((exp: any) => `
        <div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
            <div>
              <div style="font-size:15px;font-weight:600;color:#1a1a1a;">
                ${safe(exp.title)}
              </div>
              <div style="font-size:14px;color:#444;">
                ${safe(exp.company)}${exp.location ? `, ${safe(exp.location)}` : ""}
              </div>
            </div>
            <div style="font-size:13px;color:#666;white-space:nowrap;">
              ${safe(exp.startDate)} ${exp.endDate && !exp.current ? `- ${safe(exp.endDate)}` : exp.current ? "- Present" : ""}
            </div>
          </div>
          ${exp.description ? `
            <p style="margin:4px 0 0 0;font-size:13px;line-height:1.5;color:#333;">
              ${safe(exp.description)}
            </p>
          ` : ""}
        </div>
      `)
      .join("")}
  </div>
  ` : ""}

  <!-- EDUCATION -->
  ${data.education && data.education.length > 0 && data.education.some((edu: any) => edu.degree) ? `
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a1a1a;border-bottom:2px solid #e1e1e1;padding-bottom:4px;">
      Education
    </h2>
    ${data.education
      .filter((edu: any) => edu.degree)
      .map((edu: any) => `
        <div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
            <div>
              <div style="font-size:15px;font-weight:600;color:#1a1a1a;">
                ${safe(edu.degree)}
              </div>
              <div style="font-size:14px;color:#444;">
                ${safe(edu.institution)}${edu.location ? `, ${safe(edu.location)}` : ""}
              </div>
            </div>
            <div style="font-size:13px;color:#666;white-space:nowrap;">
              ${safe(edu.graduationDate)}${edu.gpa ? ` • GPA: ${safe(edu.gpa)}` : ""}
            </div>
          </div>
        </div>
      `)
      .join("")}
  </div>
  ` : ""}

  <!-- SKILLS -->
  ${data.skills && (data.skills.technical || data.skills.soft || data.skills.languages) ? `
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a1a1a;border-bottom:2px solid #e1e1e1;padding-bottom:4px;">
      Skills
    </h2>
    ${data.skills.technical ? `
      <div style="margin-bottom:8px;">
        <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">Technical Skills:</div>
        <div style="font-size:13px;color:#333;">${safe(data.skills.technical)}</div>
      </div>
    ` : ""}
    ${data.skills.soft ? `
      <div style="margin-bottom:8px;">
        <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">Soft Skills:</div>
        <div style="font-size:13px;color:#333;">${safe(data.skills.soft)}</div>
      </div>
    ` : ""}
    ${data.skills.languages ? `
      <div style="margin-bottom:8px;">
        <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">Languages:</div>
        <div style="font-size:13px;color:#333;">${safe(data.skills.languages)}</div>
      </div>
    ` : ""}
  </div>
  ` : ""}

  <!-- PROJECTS -->
  ${data.projects && data.projects.length > 0 && data.projects.some((proj: any) => proj.name) ? `
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a1a1a;border-bottom:2px solid #e1e1e1;padding-bottom:4px;">
      Projects
    </h2>
    ${data.projects
      .filter((proj: any) => proj.name)
      .map((proj: any) => `
        <div style="margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">
            ${safe(proj.name)}
          </div>
          ${proj.description ? `
            <p style="margin:4px 0 0 0;font-size:13px;line-height:1.5;color:#333;">
              ${safe(proj.description)}
            </p>
          ` : ""}
          ${proj.github || proj.link ? `
            <div style="margin-top:4px;font-size:12px;color:#666;">
              ${proj.github ? `GitHub: ${safe(proj.github)}` : ""}
              ${proj.github && proj.link ? " • " : ""}
              ${proj.link ? `Live: ${safe(proj.link)}` : ""}
            </div>
          ` : ""}
        </div>
      `)
      .join("")}
  </div>
  ` : ""}

</div>`.trim();
  }
  static convertAffindaToCVData(parsedData: any): {
    personal?: {
      fullName: string;
      summary: string;
    };
    experience?: Array<{
      id: number;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>;
    education?: Array<{
      id: number;
      degree: string;
      institution: string;
      location: string;
      graduationDate: string;
      gpa?: string;
    }>;
    skills?: {
      technical: string;
      soft: string;
      languages: string;
    };
    projects?: Array<{
      id: number;
      name: string;
      description: string;
      github?: string;
      link?: string;
    }>;
  } {
    const result: any = {};

    // Personal info
    if (parsedData.name) {
      result.personal = {
        fullName: parsedData.name,
        summary: parsedData.summary || '',
      };
    }

    // Work experience
    if (parsedData.workExperience && parsedData.workExperience.length > 0) {
      result.experience = parsedData.workExperience.map((exp: any, index: number) => ({
        id: index + 1,
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: exp.description || '',
      }));
    }

    // Education
    if (parsedData.education && parsedData.education.length > 0) {
      result.education = parsedData.education.map((edu: any, index: number) => ({
        id: index + 1,
        degree: edu.degree || '',
        institution: edu.institution || '',
        location: edu.location || '',
        graduationDate: edu.graduationDate || '',
        gpa: edu.gpa || '',
      }));
    }

    // Skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      const technicalSkills = parsedData.skills.filter((skill: string) => 
        skill.toLowerCase().includes('javascript') || 
        skill.toLowerCase().includes('python') || 
        skill.toLowerCase().includes('react') || 
        skill.toLowerCase().includes('node') || 
        skill.toLowerCase().includes('java') || 
        skill.toLowerCase().includes('sql') ||
        skill.toLowerCase().includes('aws') ||
        skill.toLowerCase().includes('docker') ||
        skill.toLowerCase().includes('git')
      ).join(', ');

      const softSkills = parsedData.skills.filter((skill: string) => 
        skill.toLowerCase().includes('communication') || 
        skill.toLowerCase().includes('leadership') || 
        skill.toLowerCase().includes('teamwork') || 
        skill.toLowerCase().includes('problem') ||
        skill.toLowerCase().includes('management')
      ).join(', ');

      result.skills = {
        technical: technicalSkills,
        soft: softSkills,
        languages: parsedData.skills.filter((skill: string) => 
          skill.toLowerCase().includes('english') || 
          skill.toLowerCase().includes('spanish') || 
          skill.toLowerCase().includes('french') ||
          skill.toLowerCase().includes('german') ||
          skill.toLowerCase().includes('chinese')
        ).join(', '),
      };
    }

    // Projects
    if (parsedData.projects && parsedData.projects.length > 0) {
      result.projects = parsedData.projects.map((project: any, index: number) => ({
        id: index + 1,
        name: project.name || '',
        description: project.description || '',
        github: project.github || '',
        link: project.link || '',
      }));
    }

    return result;
  }
}

export const cvService = new CVService();

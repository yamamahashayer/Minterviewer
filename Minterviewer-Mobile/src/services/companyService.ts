import { BaseService } from './baseService';

export interface CompanyProfile {
  name?: string;
  logo?: string;
  workEmail?: string;
  industry?: string;
  website?: string;
  location?: string;
  isVerified?: boolean;
  hiringStatus?: string;
  description?: string;
  size?: string;
  founded?: string;
}

export interface Job {
  _id: string;
  title: string;
  location?: string;
  type: string;
  level: string;
  status: string;
  description?: string;
  skills?: string[];
  salary?: string;
  postedAt?: string;
  companyId?: {
    _id: string;
    name: string;
    logo?: string;
    industry?: string;
  };
}

export interface Candidate {
  _id: string;
  user: {
    full_name: string;
    email: string;
  };
  skills: string[];
  experience: string;
  education: string;
  appliedAt: string;
  status: 'applied' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
}

export class CompanyService extends BaseService {
  async getProfile(companyId: string): Promise<{ user: any; company: CompanyProfile }> {
    return this.get(`/api/company/${companyId}/profile`);
  }

  async updateProfile(companyId: string, data: Partial<CompanyProfile>): Promise<{ ok: boolean; user: any; company: CompanyProfile }> {
    return this.put(`/api/company/${companyId}/profile`, data);
  }

  async getJobs(companyId: string): Promise<{ jobs: Job[] }> {
    return this.get(`/api/company/jobs`);
  }

  async createJob(companyId: string, jobData: Partial<Job>): Promise<{ ok: boolean; job: Job }> {
    return this.post('/api/company/jobs', jobData);
  }

  async updateJob(jobId: string, jobData: Partial<Job>): Promise<{ ok: boolean; job: Job }> {
    return this.put(`/api/company/jobs/${jobId}`, jobData);
  }

  async deleteJob(jobId: string): Promise<{ ok: boolean }> {
    return this.delete(`/api/company/jobs/${jobId}`);
  }

  async getCandidates(companyId: string): Promise<{ candidates: Candidate[] }> {
    return this.get(`/api/company/candidates`);
  }

  async getAnalytics(companyId: string): Promise<{ analytics: any }> {
    return this.get(`/api/company/analytics`);
  }
}

export const companyService = new CompanyService();

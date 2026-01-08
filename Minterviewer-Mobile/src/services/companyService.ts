import { BaseService } from './baseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    return this.get(`/api/company/${companyId}`);
  }

  async updateProfile(companyId: string, data: Partial<CompanyProfile>): Promise<{ ok: boolean; user: any; company: CompanyProfile }> {
    return this.put(`/api/company/${companyId}`, data);
  }

  async getJobs(companyId: string): Promise<{ jobs: Job[] }> {
    return this.get(`/api/company/${companyId}/jobs`);
  }

  async createJob(companyId: string, jobData: Partial<Job>): Promise<{ ok: boolean; job: Job }> {
    return this.post(`/api/company/${companyId}/jobs`, jobData);
  }

  async updateJob(companyId: string, jobId: string, jobData: Partial<Job>): Promise<{ ok: boolean; job: Job }> {
    return this.put(`/api/company/${companyId}/jobs/${jobId}`, jobData);
  }

  async deleteJob(companyId: string, jobId: string): Promise<{ ok: boolean }> {
    return this.delete(`/api/company/${companyId}/jobs/${jobId}`);
  }

  async getCandidates(companyId: string): Promise<{ candidates: Candidate[] }> {
    return this.get(`/api/company/${companyId}/candidates`);
  }

  async getJobApplicants(companyId: string, jobId: string): Promise<{ applicants: Candidate[] }> {
    return this.get(`/api/company/${companyId}/jobs/${jobId}/applicants`);
  }

  async getAnalytics(companyId: string): Promise<{ analytics: any }> {
    console.log('CompanyService: Getting analytics for companyId:', companyId);
    console.log('CompanyService: API URL:', `/api/company/overview`);
    console.log('CompanyService: Headers:', { 'x-company-id': companyId });
    
    try {
      const result = await this.get(`/api/company/overview`, {}, { 'x-company-id': companyId });
      console.log('CompanyService: Analytics result:', result);
      return result as { analytics: any };
    } catch (error) {
      console.error('CompanyService: Analytics error:', error);
      throw error;
    }
  }

  async getMessages(companyId: string): Promise<{ conversations: any[] }> {
    // This endpoint might not exist yet, return empty for now
    console.log('Messages endpoint not implemented yet');
    return { conversations: [] };
  }

  async getNotifications(companyId: string): Promise<{ notifications: any[] }> {
    // Get user data to extract userId - same pattern as web version
    const userStr = await AsyncStorage.getItem('user_data');
    if (!userStr) throw new Error('User not found');
    
    const user = JSON.parse(userStr);
    console.log('CompanyService getNotifications: User data:', { userId: user._id, companyId });
    return this.get(`/api/notifications?userId=${user._id}`);
  }
}

export const companyService = new CompanyService();

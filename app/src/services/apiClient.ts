// Complete API Client with Real Backend Integration
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const API_TIMEOUT = 10000;

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'employer';
  isAuthenticated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  benefits: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  employerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
  tags?: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  zkProofHash?: string;
  privacyScore?: number;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  candidate?: User;
}

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  benefits: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'job_seeker' | 'employer';
}

export interface ZKProofData {
  eligibilityProof: string;
  privacyScore: number;
  proofHash: string;
  metadata?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Client Class
class APIClient {
  private client: any;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: any) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load auth token from localStorage
    this.loadAuthToken();
  }

  private loadAuthToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authToken = token;
    }
  }

  private setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  private clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.client.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      if (token) {
        this.setAuthToken(token);
      }
      
      return {
        success: true,
        data: { user, token },
        message: 'Login successful'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.client.post('/auth/register', userData);
      const { user, token } = response.data;
      
      if (token) {
        this.setAuthToken(token);
      }
      
      return {
        success: true,
        data: { user, token },
        message: 'Registration successful'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.client.post('/auth/logout');
      this.clearAuthToken();
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error: any) {
      this.clearAuthToken(); // Clear token anyway
      return {
        success: true,
        message: 'Logout completed'
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get('/auth/me');
      return {
        success: true,
        data: response.data.user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user data'
      };
    }
  }

  // Job Methods
  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    type?: string;
    company?: string;
  }): Promise<ApiResponse<{ jobs: Job[]; total: number; page: number; limit: number }>> {
    try {
      const response = await this.client.get('/jobs', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch jobs'
      };
    }
  }

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    try {
      const response = await this.client.get(`/jobs/${id}`);
      return {
        success: true,
        data: response.data.job
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch job'
      };
    }
  }

  async createJob(jobData: CreateJobData): Promise<ApiResponse<Job>> {
    try {
      const response = await this.client.post('/jobs', jobData);
      return {
        success: true,
        data: response.data.job,
        message: 'Job created successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create job'
      };
    }
  }

  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<ApiResponse<Job>> {
    try {
      const response = await this.client.put(`/jobs/${id}`, jobData);
      return {
        success: true,
        data: response.data.job,
        message: 'Job updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update job'
      };
    }
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(`/jobs/${id}`);
      return {
        success: true,
        message: 'Job deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete job'
      };
    }
  }

  // Application Methods
  async getApplications(params?: {
    jobId?: string;
    candidateId?: string;
    status?: string;
  }): Promise<ApiResponse<JobApplication[]>> {
    try {
      const response = await this.client.get('/applications', { params });
      return {
        success: true,
        data: response.data.applications
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch applications'
      };
    }
  }

  async applyToJob(jobId: string, applicationData: {
    coverLetter?: string;
    zkProof?: ZKProofData;
  }): Promise<ApiResponse<JobApplication>> {
    try {
      const response = await this.client.post(`/applications/${jobId}`, applicationData);
      return {
        success: true,
        data: response.data.application,
        message: 'Application submitted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit application'
      };
    }
  }

  async updateApplicationStatus(
    applicationId: string,
    status: 'accepted' | 'rejected'
  ): Promise<ApiResponse<JobApplication>> {
    try {
      const response = await this.client.patch(`/applications/${applicationId}/status`, {
        status
      });
      return {
        success: true,
        data: response.data.application,
        message: 'Application status updated'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update application status'
      };
    }
  }

  async withdrawApplication(applicationId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(`/applications/${applicationId}`);
      return {
        success: true,
        message: 'Application withdrawn successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to withdraw application'
      };
    }
  }

  // ZK Proof Methods
  async generateEligibilityProof(jobId: string, userData: any): Promise<ApiResponse<ZKProofData>> {
    try {
      const response = await this.client.post('/zk/generate-proof', {
        jobId,
        userData
      });
      return {
        success: true,
        data: response.data.proof,
        message: 'ZK proof generated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate ZK proof'
      };
    }
  }

  async verifyEligibilityProof(
    jobId: string,
    proof: string,
    publicSignals: any[]
  ): Promise<ApiResponse<{ valid: boolean; privacyScore: number }>> {
    try {
      const response = await this.client.post('/zk/verify-proof', {
        jobId,
        proof,
        publicSignals
      });
      return {
        success: true,
        data: response.data,
        message: 'ZK proof verified successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify ZK proof'
      };
    }
  }

  async getPrivacyScore(candidateId: string): Promise<ApiResponse<{ score: number; breakdown: any }>> {
    try {
      const response = await this.client.get(`/zk/privacy-score/${candidateId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get privacy score'
      };
    }
  }

  // Analytics Methods
  async getJobAnalytics(jobId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/analytics/jobs/${jobId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get job analytics'
      };
    }
  }

  async getApplicationAnalytics(candidateId?: string): Promise<ApiResponse<any>> {
    try {
      const params = candidateId ? { candidateId } : {};
      const response = await this.client.get('/analytics/applications', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get application analytics'
      };
    }
  }

  // Notification Methods
  async getNotifications(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get('/notifications');
      return {
        success: true,
        data: response.data.notifications
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get notifications'
      };
    }
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.patch(`/notifications/${notificationId}/read`);
      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  }

  // User Profile Methods
  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.put('/users/profile', profileData);
      return {
        success: true,
        data: response.data.user,
        message: 'Profile updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      await this.client.put('/users/change-password', {
        oldPassword,
        newPassword
      });
      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password'
      };
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await this.client.get('/health');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'API server is not responding'
      };
    }
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient();

// Export for testing
export { APIClient };

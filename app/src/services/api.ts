// API Client for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  message: string;
  status?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  proofs: {
    educationProof?: string;
    salaryProof?: string;
    experienceProof?: string;
    clearanceProof?: string;
  };
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salaryRange?: string;
  requirements: string[];
  zkRequirements?: {
    requiresEducationProof: boolean;
    requiresSalaryProof: boolean;
    requiresExperienceProof: boolean;
    requiresClearanceProof: boolean;
  };
  postedAt: string;
  employerId: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  description: string;
  skillRequirements: Record<string, number>; // skill -> threshold mapping
  salaryMin: number;
  salaryMax: number;
  allowedRegions: string[];
  tags?: string[];
  remote?: boolean;
  experience?: 'JUNIOR' | 'MID' | 'SENIOR';
  department?: string;
  deadline?: string;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: await response.text() || 'An error occurred',
        status: response.status,
      };
      throw error;
    }
    return response.json();
  }

  // Job endpoints
  async getJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getJob(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createJob(jobData: CreateJobData): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(jobData),
    });
    return this.handleResponse(response);
  }

  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(jobData),
    });
    return this.handleResponse(response);
  }

  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
  }

  // Application endpoints
  async getApplications(): Promise<JobApplication[]> {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getApplication(id: string): Promise<JobApplication> {
    const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async submitApplication(applicationData: {
    jobId: string;
    personalInfo: JobApplication['personalInfo'];
    proofs: JobApplication['proofs'];
  }): Promise<JobApplication> {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(applicationData),
    });
    return this.handleResponse(response);
  }

  async updateApplicationStatus(
    id: string,
    status: JobApplication['status']
  ): Promise<JobApplication> {
    const response = await fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: { id: string; email: string; role: 'employer' | 'jobseeker' };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async register(userData: {
    email: string;
    password: string;
    role: 'employer' | 'jobseeker';
    firstName?: string;
    lastName?: string;
    company?: string;
  }): Promise<{
    token: string;
    user: { id: string; email: string; role: 'employer' | 'jobseeker' };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async verifyToken(): Promise<{
    user: { id: string; email: string; role: 'employer' | 'jobseeker' };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getProfile(): Promise<{
    id: string;
    email: string;
    role: 'employer' | 'jobseeker';
    firstName?: string;
    lastName?: string;
    company?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    company?: string;
  }): Promise<{
    id: string;
    email: string;
    role: 'employer' | 'jobseeker';
    firstName?: string;
    lastName?: string;
    company?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

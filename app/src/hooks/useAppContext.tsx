// Enhanced App Context with Real API Integration
import React, { useState, createContext, useContext, useEffect } from "react";
import { apiClient, type Job, type JobApplication } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  isAuthenticated: boolean;
}

interface AppState {
  user: User | null;
  jobs: Job[];
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addJob: (job: any) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  loadJobs: () => Promise<void>;
  loadApplications: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize app - check for existing auth
  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { user: userData } = await apiClient.verifyToken();
          setUser({
            ...userData,
            name: userData.email.split('@')[0], // Fallback name
            isAuthenticated: true
          });
          await loadJobs();
          if (userData.role === 'jobseeker') {
            await loadApplications();
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('authToken');
        }
      } else {
        // Load public jobs even when not authenticated
        await loadJobs();
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { token, user: userData } = await apiClient.login({ email, password });
      
      localStorage.setItem('authToken', token);
      setUser({
        ...userData,
        name: userData.email.split('@')[0],
        isAuthenticated: true
      });
      
      // Load user-specific data
      await loadJobs();
      if (userData.role === 'jobseeker') {
        await loadApplications();
      }
      
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setApplications([]);
    // Keep jobs loaded for public browsing
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await apiClient.getJobs();
      setJobs(jobsData);
    } catch (error: any) {
      console.error('Failed to load jobs:', error);
      setError(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    if (!user || user.role !== 'jobseeker') return;
    
    try {
      setLoading(true);
      const applicationsData = await apiClient.getApplications();
      setApplications(applicationsData);
    } catch (error: any) {
      console.error('Failed to load applications:', error);
      setError(error.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const newJob = await apiClient.createJob({
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        skillRequirements: jobData.skills.split(',').reduce((acc: any, skill: string) => {
          acc[skill.trim()] = 70; // Default threshold
          return acc;
        }, {}),
        salaryMin: parseInt(jobData.minSalary),
        salaryMax: parseInt(jobData.maxSalary),
        allowedRegions: ['US', 'CA', 'EU'], // Default regions
        tags: jobData.skills.split(',').map((s: string) => s.trim()),
        remote: true
      });
      
      setJobs(prev => [newJob, ...prev]);
    } catch (error: any) {
      console.error('Failed to create job:', error);
      setError(error.message || 'Failed to create job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!user || user.role !== 'jobseeker') {
      throw new Error('Must be logged in as job seeker to apply');
    }

    try {
      setLoading(true);
      setError(null);

      // In a real app, this would collect more user data
      const applicationData = {
        jobId,
        personalInfo: {
          firstName: user.name,
          lastName: '',
          email: user.email
        },
        proofs: {
          // This would be generated by ZK proof system
          experienceProof: `zk_proof_${Date.now()}`,
          salaryProof: `zk_salary_${Date.now()}`
        }
      };

      const newApplication = await apiClient.submitApplication(applicationData);
      setApplications(prev => [newApplication, ...prev]);
    } catch (error: any) {
      console.error('Failed to apply to job:', error);
      setError(error.message || 'Failed to apply to job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      jobs,
      applications,
      loading,
      error,
      login,
      logout,
      addJob,
      applyToJob,
      loadJobs,
      loadApplications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

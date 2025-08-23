// Complete App Context with Real API Integration
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient, type User, type Job, type JobApplication, type ApiResponse } from '../services/apiClient';

// State Types
interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  // Jobs
  jobs: Job[];
  currentJob: Job | null;
  jobsLoading: boolean;
  jobsError: string | null;
  jobFilters: {
    search: string;
    location: string;
    type: string;
    company: string;
    page: number;
    limit: number;
  };
  totalJobs: number;

  // Applications
  applications: JobApplication[];
  applicationsLoading: boolean;
  applicationsError: string | null;

  // Notifications
  notifications: any[];
  unreadCount: number;

  // UI State
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  modals: {
    login: boolean;
    register: boolean;
    jobDetails: boolean;
    applyJob: boolean;
  };
}

// Action Types
type AppAction =
  // Auth Actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_AUTH_ERROR' }
  
  // Jobs Actions
  | { type: 'SET_JOBS_LOADING'; payload: boolean }
  | { type: 'SET_JOBS'; payload: { jobs: Job[]; total: number } }
  | { type: 'SET_CURRENT_JOB'; payload: Job | null }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'SET_JOBS_ERROR'; payload: string }
  | { type: 'SET_JOB_FILTERS'; payload: Partial<AppState['jobFilters']> }
  | { type: 'CLEAR_JOBS_ERROR' }
  
  // Applications Actions
  | { type: 'SET_APPLICATIONS_LOADING'; payload: boolean }
  | { type: 'SET_APPLICATIONS'; payload: JobApplication[] }
  | { type: 'ADD_APPLICATION'; payload: JobApplication }
  | { type: 'UPDATE_APPLICATION'; payload: JobApplication }
  | { type: 'DELETE_APPLICATION'; payload: string }
  | { type: 'SET_APPLICATIONS_ERROR'; payload: string }
  | { type: 'CLEAR_APPLICATIONS_ERROR' }
  
  // Notifications Actions
  | { type: 'SET_NOTIFICATIONS'; payload: any[] }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  
  // UI Actions
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'warning' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'TOGGLE_MODAL'; payload: { modal: keyof AppState['modals']; show: boolean } };

// Initial State
const initialState: AppState = {
  // User & Auth
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,

  // Jobs
  jobs: [],
  currentJob: null,
  jobsLoading: false,
  jobsError: null,
  jobFilters: {
    search: '',
    location: '',
    type: '',
    company: '',
    page: 1,
    limit: 10
  },
  totalJobs: 0,

  // Applications
  applications: [],
  applicationsLoading: false,
  applicationsError: null,

  // Notifications
  notifications: [],
  unreadCount: 0,

  // UI State
  toast: {
    show: false,
    message: '',
    type: 'info'
  },
  modals: {
    login: false,
    register: false,
    jobDetails: false,
    applyJob: false
  }
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Auth Cases
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        authError: null
      };
      
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authError: action.payload
      };
      
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authError: null,
        applications: [],
        notifications: []
      };
      
    case 'CLEAR_AUTH_ERROR':
      return { ...state, authError: null };

    // Jobs Cases
    case 'SET_JOBS_LOADING':
      return { ...state, jobsLoading: action.payload };
      
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload.jobs,
        totalJobs: action.payload.total,
        jobsLoading: false,
        jobsError: null
      };
      
    case 'SET_CURRENT_JOB':
      return { ...state, currentJob: action.payload };
      
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
        totalJobs: state.totalJobs + 1
      };
      
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? action.payload : job
        ),
        currentJob: state.currentJob?.id === action.payload.id ? action.payload : state.currentJob
      };
      
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
        totalJobs: state.totalJobs - 1,
        currentJob: state.currentJob?.id === action.payload ? null : state.currentJob
      };
      
    case 'SET_JOBS_ERROR':
      return { ...state, jobsError: action.payload, jobsLoading: false };
      
    case 'SET_JOB_FILTERS':
      return {
        ...state,
        jobFilters: { ...state.jobFilters, ...action.payload }
      };
      
    case 'CLEAR_JOBS_ERROR':
      return { ...state, jobsError: null };

    // Applications Cases
    case 'SET_APPLICATIONS_LOADING':
      return { ...state, applicationsLoading: action.payload };
      
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload,
        applicationsLoading: false,
        applicationsError: null
      };
      
    case 'ADD_APPLICATION':
      return {
        ...state,
        applications: [action.payload, ...state.applications]
      };
      
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? action.payload : app
        )
      };
      
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(app => app.id !== action.payload)
      };
      
    case 'SET_APPLICATIONS_ERROR':
      return { ...state, applicationsError: action.payload, applicationsLoading: false };
      
    case 'CLEAR_APPLICATIONS_ERROR':
      return { ...state, applicationsError: null };

    // Notifications Cases
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    // UI Cases
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          show: true,
          message: action.payload.message,
          type: action.payload.type
        }
      };
      
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: { ...state.toast, show: false }
      };
      
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.show
        }
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  
  // Auth Methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
  
  // Jobs Methods
  loadJobs: (filters?: Partial<AppState['jobFilters']>) => Promise<void>;
  loadJobById: (id: string) => Promise<void>;
  createJob: (jobData: any) => Promise<boolean>;
  updateJob: (id: string, jobData: any) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
  setJobFilters: (filters: Partial<AppState['jobFilters']>) => void;
  clearJobsError: () => void;
  
  // Applications Methods
  loadApplications: (filters?: any) => Promise<void>;
  applyToJob: (jobId: string, applicationData: any) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: string) => Promise<boolean>;
  withdrawApplication: (applicationId: string) => Promise<boolean>;
  clearApplicationsError: () => void;
  
  // Notifications Methods
  loadNotifications: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  
  // UI Methods
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
  toggleModal: (modal: keyof AppState['modals'], show: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider Component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Check if user is already authenticated
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
        
        // Load initial data for authenticated user
        await Promise.all([
          loadJobs(),
          loadApplications(),
          loadNotifications()
        ]);
      }
    } catch (error) {
      console.log('No existing authentication found');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Auth Methods
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_AUTH_ERROR' });
    
    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        showToast('Login successful!', 'success');
        
        // Load user data after login
        await Promise.all([
          loadJobs(),
          loadApplications(),
          loadNotifications()
        ]);
        
        return true;
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: response.error || 'Login failed' });
        showToast(response.error || 'Login failed', 'error');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      showToast(errorMessage, 'error');
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_AUTH_ERROR' });
    
    try {
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        showToast('Registration successful! Welcome to GhostHire!', 'success');
        
        // Load initial data for new user
        await loadJobs();
        
        return true;
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: response.error || 'Registration failed' });
        showToast(response.error || 'Registration failed', 'error');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      showToast(errorMessage, 'error');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
      dispatch({ type: 'LOGOUT' });
      showToast('Logged out successfully', 'info');
    } catch (error) {
      // Log out locally even if API call fails
      dispatch({ type: 'LOGOUT' });
      showToast('Logged out', 'info');
    }
  };

  const clearAuthError = () => {
    dispatch({ type: 'CLEAR_AUTH_ERROR' });
  };

  // Jobs Methods
  const loadJobs = async (filters?: Partial<AppState['jobFilters']>): Promise<void> => {
    dispatch({ type: 'SET_JOBS_LOADING', payload: true });
    
    if (filters) {
      dispatch({ type: 'SET_JOB_FILTERS', payload: filters });
    }
    
    try {
      const finalFilters = { ...state.jobFilters, ...filters };
      const response = await apiClient.getJobs(finalFilters);
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'SET_JOBS', 
          payload: { 
            jobs: response.data.jobs, 
            total: response.data.total 
          } 
        });
      } else {
        dispatch({ type: 'SET_JOBS_ERROR', payload: response.error || 'Failed to load jobs' });
        showToast(response.error || 'Failed to load jobs', 'error');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load jobs';
      dispatch({ type: 'SET_JOBS_ERROR', payload: errorMessage });
      showToast(errorMessage, 'error');
    }
  };

  const loadJobById = async (id: string): Promise<void> => {
    try {
      const response = await apiClient.getJobById(id);
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_CURRENT_JOB', payload: response.data });
      } else {
        showToast(response.error || 'Failed to load job details', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load job details', 'error');
    }
  };

  const createJob = async (jobData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createJob(jobData);
      
      if (response.success && response.data) {
        dispatch({ type: 'ADD_JOB', payload: response.data });
        showToast('Job created successfully!', 'success');
        return true;
      } else {
        showToast(response.error || 'Failed to create job', 'error');
        return false;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to create job', 'error');
      return false;
    }
  };

  const updateJob = async (id: string, jobData: any): Promise<boolean> => {
    try {
      const response = await apiClient.updateJob(id, jobData);
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_JOB', payload: response.data });
        showToast('Job updated successfully!', 'success');
        return true;
      } else {
        showToast(response.error || 'Failed to update job', 'error');
        return false;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to update job', 'error');
      return false;
    }
  };

  const deleteJob = async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteJob(id);
      
      if (response.success) {
        dispatch({ type: 'DELETE_JOB', payload: id });
        showToast('Job deleted successfully!', 'success');
        return true;
      } else {
        showToast(response.error || 'Failed to delete job', 'error');
        return false;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to delete job', 'error');
      return false;
    }
  };

  const setJobFilters = (filters: Partial<AppState['jobFilters']>) => {
    dispatch({ type: 'SET_JOB_FILTERS', payload: filters });
  };

  const clearJobsError = () => {
    dispatch({ type: 'CLEAR_JOBS_ERROR' });
  };

  // Applications Methods
  const loadApplications = async (filters?: any): Promise<void> => {
    dispatch({ type: 'SET_APPLICATIONS_LOADING', payload: true });
    
    try {
      const response = await apiClient.getApplications(filters);
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_APPLICATIONS', payload: response.data });
      } else {
        dispatch({ type: 'SET_APPLICATIONS_ERROR', payload: response.error || 'Failed to load applications' });
        showToast(response.error || 'Failed to load applications', 'error');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load applications';
      dispatch({ type: 'SET_APPLICATIONS_ERROR', payload: errorMessage });
      showToast(errorMessage, 'error');
    }
  };

  const applyToJob = async (jobId: string, applicationData: any): Promise<boolean> => {
    try {
      const response = await apiClient.applyToJob(jobId, applicationData);
      
      if (response.success && response.data) {
        dispatch({ type: 'ADD_APPLICATION', payload: response.data });
        showToast('Application submitted successfully!', 'success');
        return true;
      } else {
        showToast(response.error || 'Failed to submit application', 'error');
        return false;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to submit application', 'error');
      return false;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string): Promise<boolean> => {
    try {
      const response = await apiClient.updateApplicationStatus(applicationId, status as any);
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_APPLICATION', payload: response.data });
        showToast('Application status updated!', 'success');
        return true;
      } else {
        showToast(response.error || 'Failed to update application status', 'error');
        return false;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to update application status', 'error');
      return false;
    }
  };

  const withdrawApplication = async (applicationId: string): Promise<boolean> => {
    try {
      const response = await apiClient.withdrawApplication(applicationId);
      
      if (response.success) {
        dispatch({ type: 'DELETE_APPLICATION', payload: applicationId });
        showToast('Application withdrawn successfully!', 'success');
        return true;
      } else {
        showToast(response.error || 'Failed to withdraw application', 'error');
        return false;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to withdraw application', 'error');
      return false;
    }
  };

  const clearApplicationsError = () => {
    dispatch({ type: 'CLEAR_APPLICATIONS_ERROR' });
  };

  // Notifications Methods
  const loadNotifications = async (): Promise<void> => {
    try {
      const response = await apiClient.getNotifications();
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markNotificationRead = async (notificationId: string): Promise<void> => {
    try {
      const response = await apiClient.markNotificationRead(notificationId);
      
      if (response.success) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // UI Methods
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 5000);
  };

  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };

  const toggleModal = (modal: keyof AppState['modals'], show: boolean) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal, show } });
  };

  const contextValue: AppContextType = {
    state,
    
    // Auth Methods
    login,
    register,
    logout,
    clearAuthError,
    
    // Jobs Methods
    loadJobs,
    loadJobById,
    createJob,
    updateJob,
    deleteJob,
    setJobFilters,
    clearJobsError,
    
    // Applications Methods
    loadApplications,
    applyToJob,
    updateApplicationStatus,
    withdrawApplication,
    clearApplicationsError,
    
    // Notifications Methods
    loadNotifications,
    markNotificationRead,
    
    // UI Methods
    showToast,
    hideToast,
    toggleModal
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export type { AppState, AppContextType };

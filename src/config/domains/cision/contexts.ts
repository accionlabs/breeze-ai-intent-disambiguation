// Sample user contexts representing different personas
import { UserContext } from '../../../types';

export const SAMPLE_CONTEXTS: Record<string, UserContext> = {
  'marketing-manager': {
    profile: {
      role: 'Marketing Manager',
      department: 'Marketing',
      seniority: 'Mid-level'
    },
    history: [],
    patterns: {
      workflowStage: 'Campaign Execution',
      productPreferences: {},  // Will be populated dynamically from recent actions
      domainFocus: ['Social Media', 'Content Marketing']
    }
  },
  'research-analyst': {
    profile: {
      role: 'Research Analyst',
      department: 'Market Research',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      workflowStage: 'Research & Analysis',
      productPreferences: {},  // Will be populated dynamically from recent actions
      domainFocus: ['Market Research', 'Consumer Insights']
    }
  },
  'pr-director': {
    profile: {
      role: 'PR Director',
      department: 'Public Relations',
      seniority: 'Executive'
    },
    history: [],
    patterns: {
      workflowStage: 'Media Relations',
      productPreferences: {},  // Will be populated dynamically from recent actions
      domainFocus: ['Media Relations', 'Press Coverage']
    }
  },
  'new-user': {
    profile: {
      role: 'New User',
      department: 'General', 
      seniority: 'Entry'
    },
    history: [],
    patterns: {
      workflowStage: 'Onboarding',
      productPreferences: {},  // Empty for new users
      domainFocus: []
    }
  }
};

// Level colors for visualization (kept for backward compatibility)

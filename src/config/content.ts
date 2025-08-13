// Content configuration for products, functions, and outcomes

import { Product, Intent } from '../types';

// Product definitions with their functions/outcomes
export const PRODUCTS_CONTENT: Record<string, Omit<Product, 'position'>> = {
  BCR: {
    id: 'bcr',
    name: 'BCR (Brandwatch)',
    color: '#f9a825',
    bgColor: '#fff9c4',
    functions: ['Monitor Social', 'Deep Sentiment', 'Trend Analysis', 'Consumer Research'],
  },
  SMM: {
    id: 'smm',
    name: 'SMM',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    functions: ['Monitor Social', 'Real-time Track', 'Engagement Metrics', 'Content Publishing'],
  },
  CISION: {
    id: 'cision',
    name: 'Cision One',
    color: '#ef6c00',
    bgColor: '#ffe0b2',
    functions: ['Monitor Social', 'Journalist Activity', 'Media Correlation', 'PR Distribution'],
  },
  PRN: {
    id: 'prn',
    name: 'PR Newswire',
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
    functions: ['Press Releases', 'Wide Distribution', 'Media Networks', 'Track Pickup'],
  },
  TRENDKITE: {
    id: 'trendkite',
    name: 'Trendkite',
    color: '#00695c',
    bgColor: '#e0f2f1',
    functions: ['Analytics', 'Attribution', 'Reporting', 'Impact Analysis'],
  }
};

// Composite outcomes for Stage 5
export const COMPOSITE_OUTCOMES = [
  {
    name: 'Crisis Response',
    fullName: 'Crisis Response Orchestration',
    components: ['Monitor Social', 'Real-time Track', 'Analytics'],
    description: 'Unified crisis detection and response across all channels',
  },
  {
    name: 'Campaign Intel',
    fullName: 'Integrated Campaign Intelligence',
    components: ['Deep Sentiment', 'Trend Analysis', 'Attribution'],
    description: 'Comprehensive campaign performance insights',
  },
  {
    name: 'Brand Protection',
    fullName: 'Predictive Brand Protection',
    components: ['Journalist Activity', 'Media Correlation', 'Impact Analysis'],
    description: 'Proactive brand reputation management',
  }
];

// User intents mapped to capabilities
export const INTENTS_CONTENT: Record<string, Intent> = {
  block: {
    id: 'block',
    text: 'Block that post',
    color: '#6a1b9a',
    bgColor: '#f3e5f5',
    minStage: 1,
    description: 'Simple action - SMM can handle'
  },
  publish: {
    id: 'publish',
    text: 'Publish press release',
    color: '#ff6f00',
    bgColor: '#ffe0b2',
    minStage: 1,
    description: 'Simple action - PRN can handle'
  },
  monitor: {
    id: 'monitor',
    text: 'Monitor social media',
    color: '#1565c0',
    bgColor: '#e3f2fd',
    minStage: 2,
    description: 'Ambiguous - multiple products claim this'
  },
  analyze: {
    id: 'analyze',
    text: 'Analyze sentiment',
    color: '#00897b',
    bgColor: '#e0f2f1',
    minStage: 2,
    description: 'Overlapping capability'
  },
  crisis: {
    id: 'crisis',
    text: 'Handle the crisis',
    color: '#c62828',
    bgColor: '#ffebee',
    minStage: 4,
    description: 'Requires scenario understanding'
  },
  campaign: {
    id: 'campaign',
    text: 'Launch campaign',
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
    minStage: 4,
    description: 'Requires coordinated actions'
  },
  protect: {
    id: 'protect',
    text: 'Protect our brand',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    minStage: 5,
    description: 'Requires full orchestration'
  }
};

// Stage evolution data
export const STAGE_CONTENT = {
  1: {
    title: 'Existing Products with Siloed Functionality',
    subtitle: '5 powerful products, functions hidden inside',
    description: 'Each product operates independently with hidden capabilities',
  },
  2: {
    title: 'Individual Functional Graphs Extracted',
    subtitle: 'Functions visible but overlaps apparent',
    description: 'Functions are exposed, revealing overlapping capabilities',
  },
  3: {
    title: 'Rationalization of Overlapping Functions',
    subtitle: 'Duplicates merged, unique functions preserved',
    description: 'Common functions are unified while preserving unique capabilities',
  },
  4: {
    title: 'Unified Virtual Product',
    subtitle: 'Nexus orchestrates all products',
    description: 'NEXUS provides unified interface to all capabilities',
  },
  5: {
    title: 'Cross-Product New Outcomes',
    subtitle: 'Compound intelligence emerges',
    description: 'New composite outcomes emerge from unified capabilities',
  }
};

// NEXUS platform branding
export const NEXUS_BRANDING = {
  name: 'NEXUS',
  fullName: 'NEXUS - Unified Intelligence Platform',
  tagline: 'Unifying Cision\'s Intelligence Ecosystem',
  color: {
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
};

// Composite outcome styling
export const COMPOSITE_OUTCOME_STYLE = {
  color: {
    primary: '#9333ea',
    secondary: '#ec4899',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
  }
};
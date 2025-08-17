// Domain-specific configuration for Cision's Nexus platform
// This file contains all domain-specific constants that would need to be changed
// when adapting this system to a different domain

// Domain information
export const DOMAIN_NAME = "Cision Nexus";
export const DOMAIN_DESCRIPTION = "Unified PR and Communications Intelligence Platform";
export const COMPANY_NAME = "Cision";

// Product-specific colors for better visual distinction
// Standard product codes used throughout the application
export const PRODUCT_CODES = ['cision', 'prn', 'brandwatch', 'smm', 'trendkite'] as const;
export type ProductCode = typeof PRODUCT_CODES[number];

export const PRODUCT_COLORS = {
  'cision': '#ef6c00',      // Deep Orange - CisionOne
  'prn': '#7b1fa2',         // Purple - PRNewswire
  'brandwatch': '#e91e63',  // Pink - Brandwatch (includes BCR)
  'smm': '#1976d2',         // Blue - Social Media Management
  'trendkite': '#00897b',   // Teal - TrendKite
  'n/a': '#999'             // Gray - Not applicable
};

// Product names and descriptions
export const PRODUCTS = {
  'cision': {
    name: 'CisionOne',
    description: 'Comprehensive PR platform for media monitoring and outreach',
    abbreviation: 'C1'
  },
  'prn': {
    name: 'PR Newswire',
    description: 'Press release distribution and visibility',
    abbreviation: 'PRN'
  },
  'brandwatch': {
    name: 'Brandwatch',
    description: 'Social media monitoring and consumer intelligence',
    abbreviation: 'BW',
    alternateNames: ['BCR', 'Brandwatch Consumer Research']
  },
  'smm': {
    name: 'Social Media Management',
    description: 'Social content planning and engagement',
    abbreviation: 'SMM'
  },
  'trendkite': {
    name: 'TrendKite',
    description: 'PR analytics and attribution',
    abbreviation: 'TK'
  }
};

// Helper function to get product color with fallback
export const getProductColor = (product: string): string => {
  const normalizedProduct = product.toLowerCase();
  // Special handling for 'n/a' case
  if (normalizedProduct === 'n/a') {
    return PRODUCT_COLORS['n/a'];
  }
  return PRODUCT_COLORS[normalizedProduct as keyof typeof PRODUCT_COLORS] || PRODUCT_COLORS['n/a'];
};

// Domain-specific capabilities/features
export const DOMAIN_CAPABILITIES = [
  'Media Monitoring',
  'Social Listening',
  'Press Release Distribution',
  'Influencer Identification',
  'Crisis Management',
  'Campaign Analytics',
  'Competitive Intelligence',
  'Journalist Outreach'
];

// Industry focus areas
export const INDUSTRY_VERTICALS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Retail',
  'Government',
  'Non-Profit',
  'Entertainment',
  'Education'
];

// Domain-specific synonyms for PR/marketing context
export const DOMAIN_SYNONYMS: Record<string, string[]> = {
  'monitor': ['track', 'watch', 'observe', 'follow', 'check', 'survey', 'scan'],
  'analyze': ['examine', 'study', 'review', 'assess', 'evaluate', 'investigate', 'measure'],
  'media': ['press', 'news', 'coverage', 'publications', 'outlets', 'journalists'],
  'social': ['social media', 'networks', 'platforms', 'channels'],
  'sentiment': ['opinion', 'perception', 'attitude', 'mood', 'feeling', 'tone'],
  'crisis': ['emergency', 'issue', 'problem', 'incident', 'threat', 'disaster'],
  'brand': ['reputation', 'image', 'company', 'organization', 'business'],
  'report': ['dashboard', 'analytics', 'insights', 'metrics', 'data', 'statistics'],
  'content': ['posts', 'articles', 'stories', 'material', 'copy'],
  'engagement': ['interaction', 'participation', 'involvement'],
  'response': ['reply', 'answer', 'feedback', 'reaction'],
  'influence': ['impact', 'reach', 'authority', 'clout'],
  'campaign': ['initiative', 'program', 'effort', 'push'],
  'distribution': ['sharing', 'syndication', 'dissemination', 'broadcast'],
  'conversation': ['discussion', 'dialogue', 'talk', 'chatter'],
  'trend': ['pattern', 'movement', 'tendency', 'direction'],
  'coverage': ['exposure', 'publicity', 'attention', 'mention'],
  'track': ['monitor', 'follow', 'trace', 'watch'],
  'create': ['make', 'build', 'develop', 'generate', 'produce'],
  'manage': ['handle', 'control', 'oversee', 'administer', 'coordinate'],
  'share': ['distribute', 'post', 'publish', 'broadcast'],
  'identify': ['find', 'discover', 'detect', 'spot', 'recognize'],
  'protect': ['defend', 'safeguard', 'shield', 'preserve'],
  'improve': ['enhance', 'boost', 'optimize', 'strengthen', 'upgrade'],
  'measure': ['track', 'quantify', 'assess', 'evaluate', 'gauge']
};

// Special cases for common word forms (stemming)
export const WORD_FORMS: Record<string, string> = {
  'creation': 'create',
  'creating': 'create',
  'created': 'create',
  'creates': 'create',
  'monitoring': 'monitor',
  'monitored': 'monitor',
  'monitors': 'monitor',
  'tracking': 'track',
  'tracked': 'track',
  'tracks': 'track',
  'analyzing': 'analyze',
  'analyzed': 'analyze',
  'analyzes': 'analyze',
  'analysis': 'analyze',
  'reporting': 'report',
  'reported': 'report',
  'reports': 'report',
  'managing': 'manage',
  'managed': 'manage',
  'manages': 'manage',
  'management': 'manage',
  'identifying': 'identify',
  'identified': 'identify',
  'identifies': 'identify',
  'identification': 'identify'
};
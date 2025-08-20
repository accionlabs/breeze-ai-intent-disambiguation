// Query definitions for cision domain
// Generated with comprehensive coverage for clear, ambiguous, and workflow querys
// Generated on: 2025-08-20T10:42:40.991Z

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ============================================
  // CLEAR QUERYS (10)
  // Unambiguous, single function mapping
  // ============================================
  {
    id: 'query-cision-action',
    text: 'How do I basic sentiment?',
    entryNode: 'action-basic-sentiment-cision',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-smm-action',
    text: 'Help me monitor mentions',
    entryNode: 'action-mention-monitoring',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-trendkite-action',
    text: 'Help me calculate reach',
    entryNode: 'action-calculate-reach',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-brandwatch-action',
    text: 'How do I track conversations?',
    entryNode: 'action-conversation-tracking',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-prn-action',
    text: 'How do I draft statement?',
    entryNode: 'action-draft-statement',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-influencer-tr',
    text: 'Help me track influencers',
    entryNode: 'action-influencer-tracking',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-trend-detecti',
    text: 'Help me detect trends',
    entryNode: 'action-trend-detection',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-analyze-media-s',
    text: 'Analyze Sentiment',
    entryNode: 'step-analyze-media-sentiment-cision',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-track-social-br',
    text: 'I need to track social conversations',
    entryNode: 'step-track-social-brandwatch',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scenario-scenario-journalist-',
    text: 'Journalist Outreach',
    entryNode: 'scenario-journalist-outreach',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },

  // ============================================
  // AMBIGUOUS QUERYS (3)
  // Require context for proper resolution
  // ============================================
  {
    id: 'query-ambiguous-media-monitoring-1',
    text: 'media monitoring',
    entryNode: 'scenario-media-monitoring-cision',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-media-monitoring-2',
    text: 'media monitoring now',
    entryNode: 'scenario-media-monitoring-brandwatch',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-monitor-social-media-1',
    text: 'monitor social media',
    entryNode: 'step-social-monitoring-cision',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  },

  // ============================================
  // WORKFLOW QUERYS (3)
  // Cross-product orchestration workflows
  // ============================================
  {
    id: 'query-workflow-workflow-crisis-response',
    text: 'Execute crisis response orchestration workflow',
    entryNode: 'workflow-crisis-response',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-workflow-campaign-intelligence',
    text: 'Execute integrated campaign intelligence workflow',
    entryNode: 'workflow-campaign-intelligence',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-workflow-brand-protection',
    text: 'Execute predictive brand protection workflow',
    entryNode: 'workflow-brand-protection',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  }
];

// ============================================
// QUERY STATISTICS
// ============================================
export const QUERY_CATEGORIES = {
  clear: 10,
  ambiguous: 3,
  workflow: 3,
  total: 16
};

// Coverage meets requirements:
// ✅ Clear querys: Yes (10/5-10)
// ✅ Ambiguous querys: Yes (3/3-5)
// ✅ Workflow querys: Yes (3/1-3)

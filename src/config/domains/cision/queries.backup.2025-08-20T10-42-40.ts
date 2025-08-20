// Query definitions for cision domain
// Auto-categorized with proper flags for clear, ambiguous, and workflow querys

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // Clear Querys - Unambiguous, single product/function mapping
  {
    id: 'query-find-journalists',
    text: 'Find journalists to pitch our story',
    entryNode: 'scenario-journalist-outreach',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-handle-crisis',
    text: 'Respond to a brewing crisis quickly',
    entryNode: 'scenario-crisis-management',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-create-content',
    text: 'Create content about our latest product launch',
    entryNode: 'step-schedule-posts',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-measure-campaign',
    text: 'Measure the success of our campaign',
    entryNode: 'scenario-campaign-analytics',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-understand-audience',
    text: 'Understand our target audience better',
    entryNode: 'scenario-audience-insights',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-track-coverage',
    text: 'Track media coverage for intelligence',
    entryNode: 'step-track-coverage-media',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-track-reputation',
    text: 'Track coverage affecting our reputation',
    entryNode: 'step-track-coverage-reputation',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-distribute-release',
    text: 'Distribute press release',
    entryNode: 'scenario-press-release',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitor-alerts-reputation',
    text: 'Monitor alerts for reputation issues',
    entryNode: 'step-monitor-alerts-reputation',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitor-alerts-crisis',
    text: 'Set up crisis alert monitoring',
    entryNode: 'step-monitor-alerts-crisis',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitor-brand',
    text: 'Monitor what people are saying about our brand',
    entryNode: 'outcome-consumer-intelligence',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitor-social',
    text: 'Monitor social media conversations',
    entryNode: 'step-social-monitoring-shared',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-media-monitoring',
    text: 'Set up comprehensive media monitoring',
    entryNode: 'scenario-media-monitoring-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },

  // Ambiguous Querys - Require context for resolution
  {
    id: 'query-track-social-cision',
    text: 'Track social mentions in news outlets',
    entryNode: 'step-social-monitoring-cision',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-track-social-brandwatch',
    text: 'Analyze social conversations for insights',
    entryNode: 'step-social-monitoring-brandwatch',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-track-social-smm',
    text: 'Monitor real-time social engagement',
    entryNode: 'step-social-monitoring-smm',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  },

  // Workflow Querys - Cross-product orchestration
  {
    id: 'query-crisis-orchestration',
    text: 'Coordinate multi-channel crisis response',
    entryNode: 'workflow-crisis-response',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-campaign-intelligence',
    text: 'Get integrated campaign intelligence across all channels',
    entryNode: 'workflow-campaign-intelligence',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-brand-protection',
    text: 'Set up predictive brand protection system',
    entryNode: 'workflow-brand-protection',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  }
];

// Query categorization summary
export const QUERY_CATEGORIES = {
  clear: 13,
  ambiguous: 3,
  workflow: 3,
  total: 19
};

// Rationalization mappings for overlapping functionality across products
// Maps shared/unified nodes to their product-specific alternatives

export const RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>> = {
  'step-social-monitoring-shared': {
    'cision': 'step-social-monitoring-cision',
    'brandwatch': 'step-social-monitoring-brandwatch',
    'smm': 'step-social-monitoring-smm'
  },
  'scenario-media-monitoring-shared': {
    'cision': 'scenario-media-monitoring-cision',
    'brandwatch': 'scenario-media-monitoring-brandwatch',
    'smm': 'scenario-media-monitoring-smm'
  },
  'step-track-coverage-shared': {
    'cision': 'step-track-coverage-cision',
    'prn': 'step-track-coverage',  // Note: PRN uses the non-suffixed version
    'trendkite': 'step-track-coverage'  // Trendkite also uses this
  },
  'step-analyze-sentiment-shared': {
    'cision': 'step-analyze-media-sentiment-cision',
    'brandwatch': 'step-analyze-trends-brandwatch',
    'smm': 'step-monitor-engagement-smm'
  },
  'step-analytics-reporting-shared': {
    'cision': 'step-compile-metrics',
    'brandwatch': 'step-generate-reports',
    'trendkite': 'step-analyze-performance'
  }
};

// Lists of duplicate nodes (product-specific implementations) and shared nodes (rationalized/unified versions)
// Used for overlap visualization and filtering in HierarchyVisualization

export const DUPLICATE_NODES = [
  'scenario-media-monitoring-cision',
  'scenario-media-monitoring-brandwatch', 
  'scenario-media-monitoring-smm',
  'step-social-monitoring-cision',
  'step-social-monitoring-brandwatch',
  'step-social-monitoring-smm',
  'step-track-coverage-cision',
  'step-analyze-media-sentiment-cision',
  'step-track-social-brandwatch',
  'step-analyze-trends-brandwatch',
  'step-track-mentions-smm',
  'step-monitor-engagement-smm',
  'action-track-social-cision',
  'action-basic-sentiment-cision',
  'action-track-social-brandwatch',
  'action-deep-sentiment-brandwatch',
  'action-trend-analysis-brandwatch',
  'action-track-social-smm',
  'action-realtime-track-smm',
  'action-engagement-metrics-smm',
  'action-conversation-tracking',
  'action-influencer-tracking',
  'action-trend-detection',
  'action-pattern-analysis',
  'action-mention-monitoring',
  'action-hashtag-tracking',
  'action-engagement-tracking',
  'action-response-metrics'
];

export const SHARED_NODES = [
  'scenario-media-monitoring-shared',
  'step-social-monitoring-shared'
];

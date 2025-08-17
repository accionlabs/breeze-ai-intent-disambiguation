// Functional hierarchy node definitions for the Cision domain
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level (Top Level in visualization)
  'product-cision': {
    id: 'product-cision',
    level: 'product',
    label: 'CisionOne',
    children: ['workflow-crisis-response', 'workflow-brand-protection', 'outcome-media-intelligence', 'outcome-protect-brand'],
    parents: [],
    description: 'Media monitoring and journalist database'
  },
  'product-prn': {
    id: 'product-prn',
    level: 'product',
    label: 'PRNewswire',
    children: ['workflow-campaign-intelligence', 'outcome-content-distribution'],
    parents: [],
    description: 'Press release distribution and amplification'
  },
  'product-brandwatch': {
    id: 'product-brandwatch',
    level: 'product',
    label: 'Brandwatch',
    children: ['workflow-campaign-intelligence', 'outcome-consumer-intelligence'],
    parents: [],
    description: 'Consumer insights and sentiment analysis'
  },
  'product-smm': {
    id: 'product-smm',
    level: 'product',
    label: 'Social Media Management',
    children: ['workflow-crisis-response', 'outcome-social-engagement'],
    parents: [],
    description: 'Social media management and engagement'
  },
  'product-trendkite': {
    id: 'product-trendkite',
    level: 'product',
    label: 'TrendKite',
    children: ['workflow-crisis-response', 'workflow-campaign-intelligence', 'workflow-brand-protection', 'outcome-performance-measurement'],
    parents: [],
    description: 'Analytics and performance reporting'
  },
  
  // Workflow Level - Cross-product outcomes
  'workflow-crisis-response': {
    id: 'workflow-crisis-response',
    level: 'workflow',
    label: 'Crisis Response Orchestration',
    children: ['outcome-media-intelligence', 'outcome-social-engagement', 'outcome-performance-measurement'],
    parents: ['product-cision', 'product-smm', 'product-trendkite'],
    products: ['cision', 'smm', 'trendkite'],
    description: 'Unified crisis detection and response across all channels'
  },
  'workflow-campaign-intelligence': {
    id: 'workflow-campaign-intelligence',
    level: 'workflow',
    label: 'Integrated Campaign Intelligence',
    children: ['outcome-consumer-intelligence', 'outcome-performance-measurement', 'outcome-content-distribution'],
    parents: ['product-brandwatch', 'product-trendkite', 'product-prn'],
    products: ['brandwatch', 'trendkite', 'prn'],
    description: 'Comprehensive campaign performance insights'
  },
  'workflow-brand-protection': {
    id: 'workflow-brand-protection',
    level: 'workflow',
    label: 'Predictive Brand Protection',
    children: ['outcome-protect-brand', 'outcome-media-intelligence', 'outcome-performance-measurement'],
    parents: ['product-cision', 'product-trendkite'],
    products: ['cision', 'trendkite'],
    description: 'Proactive brand reputation management'
  },

  // Outcome Level
  'outcome-media-intelligence': {
    id: 'outcome-media-intelligence',
    level: 'outcome',
    label: 'Media Intelligence',
    children: ['scenario-media-monitoring-cision', 'scenario-media-monitoring-shared', 'scenario-journalist-outreach'],
    parents: ['product-cision', 'workflow-crisis-response', 'workflow-brand-protection'],
    description: 'Track and analyze media coverage'
  },
  'outcome-protect-brand': {
    id: 'outcome-protect-brand',
    level: 'outcome',
    label: 'Protect Brand',
    children: ['scenario-reputation-monitoring', 'scenario-crisis-management'],
    parents: ['product-cision', 'workflow-brand-protection'],
    description: 'Safeguard brand reputation through media monitoring'
  },
  'outcome-consumer-intelligence': {
    id: 'outcome-consumer-intelligence',
    level: 'outcome',
    label: 'Consumer Intelligence',
    children: ['scenario-media-monitoring-brandwatch', 'scenario-media-monitoring-shared', 'scenario-sentiment-analysis', 'scenario-audience-insights'],
    parents: ['product-brandwatch', 'workflow-campaign-intelligence'],
    description: 'Deep consumer insights and sentiment analysis'
  },
  'outcome-social-engagement': {
    id: 'outcome-social-engagement',
    level: 'outcome',
    label: 'Social Engagement',
    children: ['scenario-media-monitoring-smm', 'scenario-media-monitoring-shared', 'scenario-content-management', 'scenario-community-engagement'],
    parents: ['product-smm', 'workflow-crisis-response'],
    description: 'Manage social media presence and engagement'
  },
  'outcome-content-distribution': {
    id: 'outcome-content-distribution',
    level: 'outcome',
    label: 'Content Distribution',
    children: ['scenario-press-release', 'scenario-media-amplification'],
    parents: ['product-prn', 'workflow-campaign-intelligence'],
    description: 'Distribute and amplify content through press channels'
  },
  'outcome-performance-measurement': {
    id: 'outcome-performance-measurement',
    level: 'outcome',
    label: 'Performance Measurement',
    children: ['scenario-campaign-analytics', 'scenario-roi-reporting'],
    parents: ['product-trendkite', 'workflow-crisis-response', 'workflow-campaign-intelligence', 'workflow-brand-protection'],
    description: 'Measure and report on PR and marketing performance'
  },
  
  // Scenario Level
  // Pre-rationalized Scenarios (duplicate functionality in each product)
  'scenario-media-monitoring-cision': {
    id: 'scenario-media-monitoring-cision',
    level: 'scenario',
    label: 'Media Monitoring',
    children: ['step-track-coverage-cision', 'step-analyze-media-sentiment-cision', 'step-social-monitoring-cision'],
    parents: ['outcome-media-intelligence'],
    products: ['cision'],
    description: 'CisionOne media monitoring implementation'
  },
  'scenario-media-monitoring-brandwatch': {
    id: 'scenario-media-monitoring-brandwatch',
    level: 'scenario',
    label: 'Media Monitoring',
    children: ['step-track-social-brandwatch', 'step-analyze-trends-brandwatch', 'step-social-monitoring-brandwatch'],
    parents: ['outcome-consumer-intelligence'],
    products: ['brandwatch'],
    description: 'Brandwatch media monitoring with consumer focus'
  },
  'scenario-media-monitoring-smm': {
    id: 'scenario-media-monitoring-smm',
    level: 'scenario',
    label: 'Media Monitoring',
    children: ['step-track-mentions-smm', 'step-monitor-engagement-smm', 'step-social-monitoring-smm'],
    parents: ['outcome-social-engagement'],
    products: ['smm'],
    description: 'SMM media monitoring for social engagement'
  },
  
  // Shared Scenario (after rationalization - includes union of all children)
  'scenario-media-monitoring-shared': {
    id: 'scenario-media-monitoring-shared',
    level: 'scenario',
    label: 'Media Monitoring',
    children: [
      // Union of all steps from the three products
      'step-track-coverage-cision',
      'step-analyze-media-sentiment-cision',
      'step-track-social-brandwatch',
      'step-analyze-trends-brandwatch',
      'step-track-mentions-smm',
      'step-monitor-engagement-smm',
      // Unified social monitoring (contains union of social monitoring actions)
      'step-social-monitoring-shared'
    ],
    parents: ['outcome-media-intelligence', 'outcome-consumer-intelligence', 'outcome-social-engagement'],
    products: ['cision', 'brandwatch', 'smm'],
    description: 'Unified media monitoring with all capabilities from all products'
  },
  'scenario-journalist-outreach': {
    id: 'scenario-journalist-outreach',
    level: 'scenario',
    label: 'Journalist Outreach',
    children: ['step-find-journalists', 'step-pitch-story'],
    parents: ['outcome-media-intelligence'],
    description: 'Connect with relevant journalists'
  },
  'scenario-reputation-monitoring': {
    id: 'scenario-reputation-monitoring',
    level: 'scenario',
    label: 'Reputation Monitoring',
    children: ['step-track-coverage', 'step-monitor-alerts'],
    parents: ['outcome-protect-brand'],
    description: 'Monitor brand reputation in media'
  },
  'scenario-crisis-management': {
    id: 'scenario-crisis-management',
    level: 'scenario',
    label: 'Crisis Management',
    children: ['step-monitor-alerts', 'step-rapid-response'],
    parents: ['outcome-protect-brand'],
    description: 'Rapid response to media crises'
  },
  'scenario-sentiment-analysis': {
    id: 'scenario-sentiment-analysis',
    level: 'scenario',
    label: 'Sentiment Analysis',
    children: ['step-analyze-conversations', 'step-identify-drivers'],
    parents: ['outcome-consumer-intelligence'],
    description: 'Analyze consumer sentiment and drivers'
  },
  'scenario-audience-insights': {
    id: 'scenario-audience-insights',
    level: 'scenario',
    label: 'Audience Insights',
    children: ['step-demographic-analysis', 'step-behavior-patterns'],
    parents: ['outcome-consumer-intelligence'],
    description: 'Understand audience demographics and behavior'
  },
  'scenario-content-management': {
    id: 'scenario-content-management',
    level: 'scenario',
    label: 'Content Management',
    children: ['step-schedule-posts', 'step-manage-calendar'],
    parents: ['outcome-social-engagement'],
    description: 'Manage social media content'
  },
  'scenario-community-engagement': {
    id: 'scenario-community-engagement',
    level: 'scenario',
    label: 'Community Engagement',
    children: ['step-monitor-mentions', 'step-respond-engage'],
    parents: ['outcome-social-engagement'],
    description: 'Engage with social media community'
  },
  'scenario-press-release': {
    id: 'scenario-press-release',
    level: 'scenario',
    label: 'Press Release',
    children: ['step-write-release', 'step-distribute-content'],
    parents: ['outcome-content-distribution'],
    description: 'Create and distribute press releases'
  },
  'scenario-media-amplification': {
    id: 'scenario-media-amplification',
    level: 'scenario',
    label: 'Media Amplification',
    children: ['step-target-distribution', 'step-track-pickup'],
    parents: ['outcome-content-distribution'],
    description: 'Amplify content through media channels'
  },
  'scenario-campaign-analytics': {
    id: 'scenario-campaign-analytics',
    level: 'scenario',
    label: 'Campaign Analytics',
    children: ['step-measure-reach', 'step-analyze-performance', 'step-analytics-reporting-shared'],
    parents: ['outcome-performance-measurement'],
    description: 'Analyze campaign performance metrics'
  },
  'scenario-roi-reporting': {
    id: 'scenario-roi-reporting',
    level: 'scenario',
    label: 'ROI Reporting',
    children: ['step-compile-metrics', 'step-generate-reports', 'step-analytics-reporting-shared'],
    parents: ['outcome-performance-measurement'],
    description: 'Generate ROI and executive reports'
  },
  
  // Step Level
  // Pre-rationalized Steps (duplicate functionality in each product)
  'step-social-monitoring-cision': {
    id: 'step-social-monitoring-cision',
    level: 'step',
    label: 'Monitor Social Media',
    children: ['action-track-social-cision', 'action-basic-sentiment-cision'],
    parents: ['scenario-media-monitoring-cision'],
    products: ['cision'],
    description: 'CisionOne social monitoring implementation'
  },
  'step-social-monitoring-brandwatch': {
    id: 'step-social-monitoring-brandwatch',
    level: 'step',
    label: 'Monitor Social Media',
    children: ['action-track-social-brandwatch', 'action-deep-sentiment-brandwatch', 'action-trend-analysis-brandwatch'],
    parents: ['scenario-media-monitoring-brandwatch'],
    products: ['brandwatch'],
    description: 'Brandwatch social monitoring with deep analytics'
  },
  'step-social-monitoring-smm': {
    id: 'step-social-monitoring-smm',
    level: 'step',
    label: 'Monitor Social Media',
    children: ['action-track-social-smm', 'action-realtime-track-smm', 'action-engagement-metrics-smm'],
    parents: ['scenario-media-monitoring-smm'],
    products: ['smm'],
    description: 'SMM social monitoring with engagement focus'
  },
  
  // Product-specific Steps for Media Monitoring (pre-rationalization)
  'step-track-coverage-cision': {
    id: 'step-track-coverage-cision',
    level: 'step',
    label: 'Track Coverage',
    children: ['action-set-media-alert', 'action-monitor-outlets'],
    parents: ['scenario-media-monitoring-cision'],
    products: ['cision'],
    description: 'CisionOne coverage tracking'
  },
  'step-analyze-media-sentiment-cision': {
    id: 'step-analyze-media-sentiment-cision',
    level: 'step',
    label: 'Analyze Sentiment',
    children: ['action-tone-analysis', 'action-coverage-report'],
    parents: ['scenario-media-monitoring-cision'],
    products: ['cision'],
    description: 'CisionOne sentiment analysis'
  },
  'step-track-social-brandwatch': {
    id: 'step-track-social-brandwatch',
    level: 'step',
    label: 'Track Social Conversations',
    children: ['action-conversation-tracking', 'action-influencer-tracking'],
    parents: ['scenario-media-monitoring-brandwatch'],
    products: ['brandwatch'],
    description: 'Brandwatch social tracking'
  },
  'step-analyze-trends-brandwatch': {
    id: 'step-analyze-trends-brandwatch',
    level: 'step',
    label: 'Analyze Trends',
    children: ['action-trend-detection', 'action-pattern-analysis'],
    parents: ['scenario-media-monitoring-brandwatch'],
    products: ['brandwatch'],
    description: 'Brandwatch trend analysis'
  },
  'step-track-mentions-smm': {
    id: 'step-track-mentions-smm',
    level: 'step',
    label: 'Track Mentions',
    children: ['action-mention-monitoring', 'action-hashtag-tracking'],
    parents: ['scenario-media-monitoring-smm'],
    products: ['smm'],
    description: 'SMM mention tracking'
  },
  'step-monitor-engagement-smm': {
    id: 'step-monitor-engagement-smm',
    level: 'step',
    label: 'Monitor Engagement',
    children: ['action-engagement-tracking', 'action-response-metrics'],
    parents: ['scenario-media-monitoring-smm'],
    products: ['smm'],
    description: 'SMM engagement monitoring'
  },
  
  // Shared Steps (after rationalization)
  'step-social-monitoring-shared': {
    id: 'step-social-monitoring-shared',
    level: 'step',
    label: 'Monitor Social Media',
    children: [
      // Union of all actual actions from the three products
      'action-track-social-cision',
      'action-basic-sentiment-cision',
      'action-track-social-brandwatch',
      'action-deep-sentiment-brandwatch',
      'action-trend-analysis-brandwatch',
      'action-track-social-smm',
      'action-realtime-track-smm',
      'action-engagement-metrics-smm'
    ],
    parents: ['scenario-media-monitoring-shared'],
    products: ['cision', 'brandwatch', 'smm'],
    description: 'Unified social media monitoring with all capabilities from all products'
  },
  'step-track-coverage': {
    id: 'step-track-coverage',
    level: 'step',
    label: 'Track Coverage',
    children: ['action-set-media-alert', 'action-monitor-outlets'],
    parents: ['scenario-reputation-monitoring', 'scenario-media-monitoring-shared'],
    products: ['cision'],
    description: 'Track media coverage across outlets'
  },
  'step-find-journalists': {
    id: 'step-find-journalists',
    level: 'step',
    label: 'Find Journalists',
    children: ['action-search-database', 'action-build-media-list'],
    parents: ['scenario-journalist-outreach'],
    products: ['cision'],
    description: 'Find relevant journalists and contacts'
  },
  'step-pitch-story': {
    id: 'step-pitch-story',
    level: 'step',
    label: 'Pitch Story',
    children: ['action-send-pitch', 'action-track-response'],
    parents: ['scenario-journalist-outreach'],
    products: ['cision'],
    description: 'Pitch stories to journalists'
  },
  'step-monitor-alerts': {
    id: 'step-monitor-alerts',
    level: 'step',
    label: 'Monitor Alerts',
    children: ['action-set-media-alert', 'action-escalate-issue'],
    parents: ['scenario-reputation-monitoring', 'scenario-crisis-management'],
    products: ['cision'],
    description: 'Monitor alerts for brand mentions'
  },
  'step-rapid-response': {
    id: 'step-rapid-response',
    level: 'step',
    label: 'Rapid Response',
    children: ['action-draft-statement', 'action-coordinate-response'],
    parents: ['scenario-crisis-management'],
    products: ['cision', 'prn'],
    description: 'Coordinate rapid crisis response'
  },
  'step-analyze-conversations': {
    id: 'step-analyze-conversations',
    level: 'step',
    label: 'Analyze Conversations',
    children: ['action-sentiment-analysis', 'action-topic-modeling'],
    parents: ['scenario-sentiment-analysis'],
    products: ['brandwatch'],
    description: 'Analyze consumer conversations'
  },
  'step-identify-drivers': {
    id: 'step-identify-drivers',
    level: 'step',
    label: 'Identify Drivers',
    children: ['action-driver-analysis', 'action-emotion-detection'],
    parents: ['scenario-sentiment-analysis'],
    products: ['brandwatch'],
    description: 'Identify sentiment drivers'
  },
  'step-demographic-analysis': {
    id: 'step-demographic-analysis',
    level: 'step',
    label: 'Demographic Analysis',
    children: ['action-segment-audience', 'action-profile-creation'],
    parents: ['scenario-audience-insights'],
    products: ['brandwatch'],
    description: 'Analyze audience demographics'
  },
  'step-behavior-patterns': {
    id: 'step-behavior-patterns',
    level: 'step',
    label: 'Behavior Patterns',
    children: ['action-journey-mapping', 'action-interest-analysis'],
    parents: ['scenario-audience-insights'],
    products: ['brandwatch'],
    description: 'Understand behavior patterns'
  },
  'step-schedule-posts': {
    id: 'step-schedule-posts',
    level: 'step',
    label: 'Schedule Posts',
    children: ['action-create-content', 'action-schedule-publish'],
    parents: ['scenario-content-management'],
    products: ['smm'],
    description: 'Schedule social media posts'
  },
  'step-manage-calendar': {
    id: 'step-manage-calendar',
    level: 'step',
    label: 'Manage Calendar',
    children: ['action-plan-content', 'action-coordinate-campaigns'],
    parents: ['scenario-content-management'],
    products: ['smm'],
    description: 'Manage content calendar'
  },
  'step-monitor-mentions': {
    id: 'step-monitor-mentions',
    level: 'step',
    label: 'Monitor Mentions',
    children: ['action-track-mentions', 'action-set-social-alerts'],
    parents: ['scenario-community-engagement'],
    products: ['smm'],
    description: 'Monitor social media mentions'
  },
  'step-respond-engage': {
    id: 'step-respond-engage',
    level: 'step',
    label: 'Respond & Engage',
    children: ['action-reply-comments', 'action-engage-followers'],
    parents: ['scenario-community-engagement'],
    products: ['smm'],
    description: 'Respond to and engage with community'
  },
  'step-write-release': {
    id: 'step-write-release',
    level: 'step',
    label: 'Write Release',
    children: ['action-draft-release', 'action-add-multimedia'],
    parents: ['scenario-press-release'],
    products: ['prn'],
    description: 'Write press releases'
  },
  'step-distribute-content': {
    id: 'step-distribute-content',
    level: 'step',
    label: 'Distribute Content',
    children: ['action-select-wire', 'action-send-distribution'],
    parents: ['scenario-press-release'],
    products: ['prn'],
    description: 'Distribute press releases'
  },
  'step-target-distribution': {
    id: 'step-target-distribution',
    level: 'step',
    label: 'Target Distribution',
    children: ['action-segment-lists', 'action-customize-targeting'],
    parents: ['scenario-media-amplification'],
    products: ['prn'],
    description: 'Target distribution lists'
  },
  'step-track-pickup': {
    id: 'step-track-pickup',
    level: 'step',
    label: 'Track Pickup',
    children: ['action-monitor-pickup', 'action-measure-reach'],
    parents: ['scenario-media-amplification'],
    products: ['prn'],
    description: 'Track content pickup and reach'
  },
  'step-measure-reach': {
    id: 'step-measure-reach',
    level: 'step',
    label: 'Measure Reach',
    children: ['action-calculate-reach', 'action-attribution-analysis'],
    parents: ['scenario-campaign-analytics'],
    products: ['trendkite'],
    description: 'Measure campaign reach'
  },
  'step-analyze-performance': {
    id: 'step-analyze-performance',
    level: 'step',
    label: 'Analyze Performance',
    children: ['action-performance-metrics', 'action-benchmark-comparison', 'action-analytics-shared'],
    parents: ['scenario-campaign-analytics'],
    products: ['trendkite'],
    description: 'Analyze campaign performance'
  },
  'step-analytics-reporting-shared': {
    id: 'step-analytics-reporting-shared',
    level: 'step',
    label: 'Analytics & Reporting',
    children: ['action-analytics-shared', 'action-reporting-shared', 'action-attribution-shared'],
    parents: ['scenario-campaign-analytics', 'scenario-roi-reporting', 'scenario-media-monitoring'],
    products: ['trendkite', 'cision', 'brandwatch'],
    description: 'Shared analytics and reporting capability'
  },
  'step-compile-metrics': {
    id: 'step-compile-metrics',
    level: 'step',
    label: 'Compile Metrics',
    children: ['action-gather-data', 'action-calculate-roi'],
    parents: ['scenario-roi-reporting'],
    products: ['trendkite'],
    description: 'Compile performance metrics'
  },
  'step-generate-reports': {
    id: 'step-generate-reports',
    level: 'step',
    label: 'Generate Reports',
    children: ['action-create-dashboard', 'action-export-report'],
    parents: ['scenario-roi-reporting'],
    products: ['trendkite'],
    description: 'Generate executive reports'
  },
  
  // Action Level - Pre-rationalized Actions (duplicate implementations)
  // Additional actions for product-specific media monitoring
  'action-conversation-tracking': {
    id: 'action-conversation-tracking',
    level: 'action',
    label: 'Track Conversations',
    children: [],
    parents: ['step-track-social-brandwatch'],
    products: ['brandwatch'],
    description: 'Track social conversations'
  },
  'action-influencer-tracking': {
    id: 'action-influencer-tracking',
    level: 'action',
    label: 'Track Influencers',
    children: [],
    parents: ['step-track-social-brandwatch'],
    products: ['brandwatch'],
    description: 'Monitor influencer activity'
  },
  'action-trend-detection': {
    id: 'action-trend-detection',
    level: 'action',
    label: 'Detect Trends',
    children: [],
    parents: ['step-analyze-trends-brandwatch'],
    products: ['brandwatch'],
    description: 'Detect emerging trends'
  },
  'action-pattern-analysis': {
    id: 'action-pattern-analysis',
    level: 'action',
    label: 'Analyze Patterns',
    children: [],
    parents: ['step-analyze-trends-brandwatch'],
    products: ['brandwatch'],
    description: 'Analyze conversation patterns'
  },
  'action-mention-monitoring': {
    id: 'action-mention-monitoring',
    level: 'action',
    label: 'Monitor Mentions',
    children: [],
    parents: ['step-track-mentions-smm'],
    products: ['smm'],
    description: 'Monitor brand mentions'
  },
  'action-hashtag-tracking': {
    id: 'action-hashtag-tracking',
    level: 'action',
    label: 'Track Hashtags',
    children: [],
    parents: ['step-track-mentions-smm'],
    products: ['smm'],
    description: 'Track hashtag performance'
  },
  'action-engagement-tracking': {
    id: 'action-engagement-tracking',
    level: 'action',
    label: 'Track Engagement',
    children: [],
    parents: ['step-monitor-engagement-smm'],
    products: ['smm'],
    description: 'Track engagement metrics'
  },
  'action-response-metrics': {
    id: 'action-response-metrics',
    level: 'action',
    label: 'Response Metrics',
    children: [],
    parents: ['step-monitor-engagement-smm'],
    products: ['smm'],
    description: 'Measure response times and rates'
  },
  
  // Action Level - Pre-rationalized Actions (duplicate implementations)
  // CisionOne implementation
  'action-track-social-cision': {
    id: 'action-track-social-cision',
    level: 'action',
    label: 'Track Social Media',
    children: [],
    parents: ['step-social-monitoring-cision'],
    products: ['cision'],
    description: 'CisionOne basic social tracking'
  },
  'action-basic-sentiment-cision': {
    id: 'action-basic-sentiment-cision',
    level: 'action',
    label: 'Basic Sentiment',
    children: [],
    parents: ['step-social-monitoring-cision'],
    products: ['cision'],
    description: 'CisionOne basic sentiment analysis'
  },
  
  // Brandwatch implementation
  'action-track-social-brandwatch': {
    id: 'action-track-social-brandwatch',
    level: 'action',
    label: 'Track Social Media',
    children: [],
    parents: ['step-social-monitoring-brandwatch'],
    products: ['brandwatch'],
    description: 'Brandwatch comprehensive tracking'
  },
  'action-deep-sentiment-brandwatch': {
    id: 'action-deep-sentiment-brandwatch',
    level: 'action',
    label: 'Deep Sentiment Analysis',
    children: [],
    parents: ['step-social-monitoring-brandwatch'],
    products: ['brandwatch'],
    description: 'Brandwatch AI-powered sentiment'
  },
  'action-trend-analysis-brandwatch': {
    id: 'action-trend-analysis-brandwatch',
    level: 'action',
    label: 'Trend Analysis',
    children: [],
    parents: ['step-social-monitoring-brandwatch'],
    products: ['brandwatch'],
    description: 'Brandwatch trend detection'
  },
  
  // SMM implementation
  'action-track-social-smm': {
    id: 'action-track-social-smm',
    level: 'action',
    label: 'Track Social Media',
    children: [],
    parents: ['step-social-monitoring-smm'],
    products: ['smm'],
    description: 'SMM social tracking'
  },
  'action-realtime-track-smm': {
    id: 'action-realtime-track-smm',
    level: 'action',
    label: 'Real-time Tracking',
    children: [],
    parents: ['step-social-monitoring-smm'],
    products: ['smm'],
    description: 'SMM real-time monitoring'
  },
  'action-engagement-metrics-smm': {
    id: 'action-engagement-metrics-smm',
    level: 'action',
    label: 'Engagement Metrics',
    children: [],
    parents: ['step-social-monitoring-smm'],
    products: ['smm'],
    description: 'SMM engagement analytics'
  },
  
  // Note: Shared actions are not needed - the shared step directly references
  // the union of all original actions from the products
  'action-analytics-shared': {
    id: 'action-analytics-shared',
    level: 'action',
    label: 'Generate Analytics',
    children: [],
    parents: ['step-analytics-reporting-shared', 'step-analyze-performance'],
    products: ['trendkite', 'cision', 'brandwatch'],
    description: 'Shared analytics generation'
  },
  'action-reporting-shared': {
    id: 'action-reporting-shared',
    level: 'action',
    label: 'Create Reports',
    children: [],
    parents: ['step-analytics-reporting-shared'],
    products: ['trendkite', 'cision', 'brandwatch'],
    description: 'Shared reporting capability'
  },
  'action-attribution-shared': {
    id: 'action-attribution-shared',
    level: 'action',
    label: 'Attribution Analysis',
    children: [],
    parents: ['step-analytics-reporting-shared'],
    products: ['trendkite', 'cision', 'brandwatch'],
    description: 'Shared attribution analysis'
  },
  
  // Action Level - CisionOne Actions
  'action-set-media-alert': {
    id: 'action-set-media-alert',
    level: 'action',
    label: 'Set Media Alert',
    children: [],
    parents: ['step-monitor-alerts', 'step-track-coverage'],
    products: ['cision'],
    description: 'Configure media monitoring alerts'
  },
  'action-monitor-outlets': {
    id: 'action-monitor-outlets',
    level: 'action',
    label: 'Monitor Outlets',
    children: [],
    parents: ['step-track-coverage'],
    products: ['cision'],
    description: 'Monitor specific media outlets'
  },
  'action-tone-analysis': {
    id: 'action-tone-analysis',
    level: 'action',
    label: 'Tone Analysis',
    children: [],
    parents: ['step-analyze-media-sentiment-cision'],
    products: ['cision'],
    description: 'Analyze media tone'
  },
  'action-coverage-report': {
    id: 'action-coverage-report',
    level: 'action',
    label: 'Coverage Report',
    children: [],
    parents: ['step-analyze-media-sentiment-cision'],
    products: ['cision'],
    description: 'Generate coverage report'
  },
  'action-search-database': {
    id: 'action-search-database',
    level: 'action',
    label: 'Search Database',
    children: [],
    parents: ['step-find-journalists'],
    products: ['cision'],
    description: 'Search journalist database'
  },
  'action-build-media-list': {
    id: 'action-build-media-list',
    level: 'action',
    label: 'Build Media List',
    children: [],
    parents: ['step-find-journalists'],
    products: ['cision'],
    description: 'Build targeted media lists'
  },
  'action-send-pitch': {
    id: 'action-send-pitch',
    level: 'action',
    label: 'Send Pitch',
    children: [],
    parents: ['step-pitch-story'],
    products: ['cision'],
    description: 'Send pitch to journalists'
  },
  'action-track-response': {
    id: 'action-track-response',
    level: 'action',
    label: 'Track Response',
    children: [],
    parents: ['step-pitch-story'],
    products: ['cision'],
    description: 'Track journalist responses'
  },
  'action-escalate-issue': {
    id: 'action-escalate-issue',
    level: 'action',
    label: 'Escalate Issue',
    children: [],
    parents: ['step-monitor-alerts'],
    products: ['cision'],
    description: 'Escalate critical issues'
  },
  'action-draft-statement': {
    id: 'action-draft-statement',
    level: 'action',
    label: 'Draft Statement',
    children: [],
    parents: ['step-rapid-response'],
    products: ['cision', 'prn'],
    description: 'Draft crisis statement'
  },
  'action-coordinate-response': {
    id: 'action-coordinate-response',
    level: 'action',
    label: 'Coordinate Response',
    children: [],
    parents: ['step-rapid-response'],
    products: ['cision'],
    description: 'Coordinate crisis response'
  },
  
  // Brandwatch Actions
  'action-sentiment-analysis': {
    id: 'action-sentiment-analysis',
    level: 'action',
    label: 'Sentiment Analysis',
    children: [],
    parents: ['step-analyze-conversations'],
    products: ['brandwatch'],
    description: 'Analyze consumer sentiment'
  },
  'action-topic-modeling': {
    id: 'action-topic-modeling',
    level: 'action',
    label: 'Topic Modeling',
    children: [],
    parents: ['step-analyze-conversations'],
    products: ['brandwatch'],
    description: 'Identify conversation topics'
  },
  'action-driver-analysis': {
    id: 'action-driver-analysis',
    level: 'action',
    label: 'Driver Analysis',
    children: [],
    parents: ['step-identify-drivers'],
    products: ['brandwatch'],
    description: 'Identify sentiment drivers'
  },
  'action-emotion-detection': {
    id: 'action-emotion-detection',
    level: 'action',
    label: 'Emotion Detection',
    children: [],
    parents: ['step-identify-drivers'],
    products: ['brandwatch'],
    description: 'Detect emotional drivers'
  },
  'action-segment-audience': {
    id: 'action-segment-audience',
    level: 'action',
    label: 'Segment Audience',
    children: [],
    parents: ['step-demographic-analysis'],
    products: ['brandwatch'],
    description: 'Segment audience demographics'
  },
  'action-profile-creation': {
    id: 'action-profile-creation',
    level: 'action',
    label: 'Profile Creation',
    children: [],
    parents: ['step-demographic-analysis'],
    products: ['brandwatch'],
    description: 'Create audience profiles'
  },
  'action-journey-mapping': {
    id: 'action-journey-mapping',
    level: 'action',
    label: 'Journey Mapping',
    children: [],
    parents: ['step-behavior-patterns'],
    products: ['brandwatch'],
    description: 'Map customer journeys'
  },
  'action-interest-analysis': {
    id: 'action-interest-analysis',
    level: 'action',
    label: 'Interest Analysis',
    children: [],
    parents: ['step-behavior-patterns'],
    products: ['brandwatch'],
    description: 'Analyze audience interests'
  },
  
  // Social Media Management Actions
  'action-create-content': {
    id: 'action-create-content',
    level: 'action',
    label: 'Create Content',
    children: [],
    parents: ['step-schedule-posts'],
    products: ['smm'],
    description: 'Create social content'
  },
  'action-schedule-publish': {
    id: 'action-schedule-publish',
    level: 'action',
    label: 'Schedule & Publish',
    children: [],
    parents: ['step-schedule-posts'],
    products: ['smm'],
    description: 'Schedule and publish posts'
  },
  'action-plan-content': {
    id: 'action-plan-content',
    level: 'action',
    label: 'Plan Content',
    children: [],
    parents: ['step-manage-calendar'],
    products: ['smm'],
    description: 'Plan content calendar'
  },
  'action-coordinate-campaigns': {
    id: 'action-coordinate-campaigns',
    level: 'action',
    label: 'Coordinate Campaigns',
    children: [],
    parents: ['step-manage-calendar'],
    products: ['smm'],
    description: 'Coordinate campaign timing'
  },
  'action-track-mentions': {
    id: 'action-track-mentions',
    level: 'action',
    label: 'Track Mentions',
    children: [],
    parents: ['step-monitor-mentions'],
    products: ['smm'],
    description: 'Track social mentions'
  },
  'action-set-social-alerts': {
    id: 'action-set-social-alerts',
    level: 'action',
    label: 'Set Social Alerts',
    children: [],
    parents: ['step-monitor-mentions'],
    products: ['smm'],
    description: 'Set social media alerts'
  },
  'action-reply-comments': {
    id: 'action-reply-comments',
    level: 'action',
    label: 'Reply to Comments',
    children: [],
    parents: ['step-respond-engage'],
    products: ['smm'],
    description: 'Reply to social comments'
  },
  'action-engage-followers': {
    id: 'action-engage-followers',
    level: 'action',
    label: 'Engage Followers',
    children: [],
    parents: ['step-respond-engage'],
    products: ['smm'],
    description: 'Engage with followers'
  },
  
  // PRNewswire Actions
  'action-draft-release': {
    id: 'action-draft-release',
    level: 'action',
    label: 'Draft Release',
    children: [],
    parents: ['step-write-release'],
    products: ['prn'],
    description: 'Draft press release'
  },
  'action-add-multimedia': {
    id: 'action-add-multimedia',
    level: 'action',
    label: 'Add Multimedia',
    children: [],
    parents: ['step-write-release'],
    products: ['prn'],
    description: 'Add images and videos'
  },
  'action-select-wire': {
    id: 'action-select-wire',
    level: 'action',
    label: 'Select Wire',
    children: [],
    parents: ['step-distribute-content'],
    products: ['prn'],
    description: 'Select distribution wire'
  },
  'action-send-distribution': {
    id: 'action-send-distribution',
    level: 'action',
    label: 'Send Distribution',
    children: [],
    parents: ['step-distribute-content'],
    products: ['prn'],
    description: 'Send to distribution'
  },
  'action-segment-lists': {
    id: 'action-segment-lists',
    level: 'action',
    label: 'Segment Lists',
    children: [],
    parents: ['step-target-distribution'],
    products: ['prn'],
    description: 'Segment distribution lists'
  },
  'action-customize-targeting': {
    id: 'action-customize-targeting',
    level: 'action',
    label: 'Customize Targeting',
    children: [],
    parents: ['step-target-distribution'],
    products: ['prn'],
    description: 'Customize distribution targeting'
  },
  'action-monitor-pickup': {
    id: 'action-monitor-pickup',
    level: 'action',
    label: 'Monitor Pickup',
    children: [],
    parents: ['step-track-pickup'],
    products: ['prn'],
    description: 'Monitor content pickup'
  },
  'action-measure-reach': {
    id: 'action-measure-reach',
    level: 'action',
    label: 'Measure Reach',
    children: [],
    parents: ['step-track-pickup'],
    products: ['prn'],
    description: 'Measure distribution reach'
  },
  
  // TrendKite Actions
  'action-calculate-reach': {
    id: 'action-calculate-reach',
    level: 'action',
    label: 'Calculate Reach',
    children: [],
    parents: ['step-measure-reach'],
    products: ['trendkite'],
    description: 'Calculate total reach'
  },
  'action-attribution-analysis': {
    id: 'action-attribution-analysis',
    level: 'action',
    label: 'Attribution Analysis',
    children: [],
    parents: ['step-measure-reach'],
    products: ['trendkite'],
    description: 'Analyze attribution'
  },
  'action-performance-metrics': {
    id: 'action-performance-metrics',
    level: 'action',
    label: 'Performance Metrics',
    children: [],
    parents: ['step-analyze-performance'],
    products: ['trendkite'],
    description: 'Calculate performance metrics'
  },
  'action-benchmark-comparison': {
    id: 'action-benchmark-comparison',
    level: 'action',
    label: 'Benchmark Comparison',
    children: [],
    parents: ['step-analyze-performance'],
    products: ['trendkite'],
    description: 'Compare to benchmarks'
  },
  'action-gather-data': {
    id: 'action-gather-data',
    level: 'action',
    label: 'Gather Data',
    children: [],
    parents: ['step-compile-metrics'],
    products: ['trendkite'],
    description: 'Gather performance data'
  },
  'action-calculate-roi': {
    id: 'action-calculate-roi',
    level: 'action',
    label: 'Calculate ROI',
    children: [],
    parents: ['step-compile-metrics'],
    products: ['trendkite'],
    description: 'Calculate return on investment'
  },
  'action-create-dashboard': {
    id: 'action-create-dashboard',
    level: 'action',
    label: 'Create Dashboard',
    children: [],
    parents: ['step-generate-reports'],
    products: ['trendkite'],
    description: 'Create executive dashboard'
  },
  'action-export-report': {
    id: 'action-export-report',
    level: 'action',
    label: 'Export Report',
    children: [],
    parents: ['step-generate-reports'],
    products: ['trendkite'],
    description: 'Export executive report'
  }
};

// User Intent Examples

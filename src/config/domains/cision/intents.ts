// Sample user intents for testing the intent disambiguation system
import { UserIntent } from '../../../types';

// Example queries for the intent input component
export const EXAMPLE_QUERIES = [
  "monitor social media conversations",
  "track brand sentiment",
  "analyze media coverage",
  "identify influencers",
  "manage crisis response"
];

// Placeholder text for the intent input field
export const INTENT_INPUT_PLACEHOLDER = "e.g., track media coverage";

export const USER_INTENTS: UserIntent[] = [
  {
    id: 'intent-find-journalists',
    text: 'Find journalists to pitch our story',
    entryLevel: 'scenario',
    entryNode: 'scenario-journalist-outreach'
  },
  {
    id: 'intent-handle-crisis',
    text: 'Respond to a brewing crisis quickly',
    entryLevel: 'scenario',
    entryNode: 'scenario-crisis-management'
  },
  {
    id: 'intent-create-content',
    text: 'Create content about our latest product launch',
    entryLevel: 'step',
    entryNode: 'step-schedule-posts'
    // Not ambiguous - only exists in SMM product
  },
  {
    id: 'intent-measure-campaign',
    text: 'Measure the success of our campaign',
    entryLevel: 'scenario',
    entryNode: 'scenario-campaign-analytics'
  },
  {
    id: 'intent-understand-audience',
    text: 'Understand our target audience better',
    entryLevel: 'scenario',
    entryNode: 'scenario-audience-insights'
  },
  {
    id: 'intent-track-coverage',
    text: 'Track media coverage for intelligence',
    entryLevel: 'step',
    entryNode: 'step-track-coverage-media'
  },
  {
    id: 'intent-track-reputation',
    text: 'Track coverage affecting our reputation',
    entryLevel: 'step',
    entryNode: 'step-track-coverage-reputation'
  },
  {
    id: 'intent-distribute-release',
    text: 'Distribute press release',
    entryLevel: 'scenario',
    entryNode: 'scenario-press-release'
  },
  {
    id: 'intent-monitor-alerts-reputation',
    text: 'Monitor alerts for reputation issues',
    entryLevel: 'step',
    entryNode: 'step-monitor-alerts-reputation'
  },
  {
    id: 'intent-monitor-alerts-crisis',
    text: 'Set up crisis alert monitoring',
    entryLevel: 'step',
    entryNode: 'step-monitor-alerts-crisis'
  },
  {
    id: 'intent-monitor-brand',
    text: 'Monitor what people are saying about our brand',
    entryLevel: 'outcome',
    entryNode: 'outcome-consumer-intelligence'
  },
  // Intents that map to overlapping nodes (pre-rationalized duplicates)
  {
    id: 'intent-monitor-social',
    text: 'Monitor social media conversations',
    entryLevel: 'step',
    entryNode: 'step-social-monitoring-shared',  // Maps to shared node (works when rationalized)
    ambiguous: false
  },
  {
    id: 'intent-media-monitoring',
    text: 'Set up comprehensive media monitoring',
    entryLevel: 'scenario',
    entryNode: 'scenario-media-monitoring-shared',  // Maps to shared node (works when rationalized)
    ambiguous: false
  },
  {
    id: 'intent-track-social-cision',
    text: 'Track social mentions in news outlets',
    entryLevel: 'step',
    entryNode: 'step-social-monitoring-cision',  // Maps to Cision-specific duplicate
    ambiguous: false
  },
  {
    id: 'intent-track-social-brandwatch',
    text: 'Analyze social conversations for insights',
    entryLevel: 'step',
    entryNode: 'step-social-monitoring-brandwatch',  // Maps to Brandwatch-specific duplicate
    ambiguous: false
  },
  {
    id: 'intent-track-social-smm',
    text: 'Monitor real-time social engagement',
    entryLevel: 'step',
    entryNode: 'step-social-monitoring-smm',  // Maps to SMM-specific duplicate
    ambiguous: false
  },
  // Intents that map to workflow nodes
  {
    id: 'intent-crisis-orchestration',
    text: 'Coordinate multi-channel crisis response',
    entryLevel: 'workflow',
    entryNode: 'workflow-crisis-response',
    ambiguous: false
  },
  {
    id: 'intent-campaign-intelligence',
    text: 'Get integrated campaign intelligence across all channels',
    entryLevel: 'workflow',
    entryNode: 'workflow-campaign-intelligence',
    ambiguous: false
  },
  {
    id: 'intent-brand-protection',
    text: 'Set up predictive brand protection system',
    entryLevel: 'workflow',
    entryNode: 'workflow-brand-protection',
    ambiguous: false
  }
];

// Sample User Contexts
// Note: productPreferences are now dynamically calculated from actual usage
// These default values are only used as hints when no recent actions exist

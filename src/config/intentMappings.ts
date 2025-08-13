// Intent to outcome mappings for each stage
import { StageNumber } from '../types';

interface IntentMapping {
  intentId: string;
  outcomes: string[]; // Function/outcome names that map to this intent
  error?: string; // Error message if mapping fails
}

// Define which outcomes each intent maps to at different stages
export const INTENT_MAPPINGS: Record<StageNumber, Record<string, IntentMapping>> = {
  1: {
    // Stage 1: Functions hidden, no mappings
    block: {
      intentId: 'block',
      outcomes: [],
      error: 'Functions are hidden in siloed products'
    },
    publish: {
      intentId: 'publish',
      outcomes: [],
      error: 'Functions are hidden in siloed products'
    }
  },
  2: {
    // Stage 2: Functions visible, but cross-product routing not possible
    block: {
      intentId: 'block',
      outcomes: ['Content Publishing'], // SMM only
    },
    publish: {
      intentId: 'publish',
      outcomes: ['Press Releases'], // PRN only - can't cross to PR Distribution
    },
    monitor: {
      intentId: 'monitor',
      outcomes: [], // Can't choose which product's Monitor Social
      error: 'Ambiguous: 3 products claim this capability'
    },
    analyze: {
      intentId: 'analyze',
      outcomes: ['Deep Sentiment'], // BCR only - can't route to multiple products
      error: 'Cannot route across products yet'
    }
  },
  3: {
    // Stage 3: Rationalized functions, but still no cross-product
    block: {
      intentId: 'block',
      outcomes: ['Content Publishing'],
    },
    publish: {
      intentId: 'publish',
      outcomes: ['Press Releases'], // Still single product
    },
    monitor: {
      intentId: 'monitor',
      outcomes: ['Monitor Social'], // Now unified/rationalized
    },
    analyze: {
      intentId: 'analyze',
      outcomes: ['Deep Sentiment'], // Still single outcome
    }
  },
  4: {
    // Stage 4: Unified product - but still need scenarios for complex intents
    block: {
      intentId: 'block',
      outcomes: ['Content Publishing'],
    },
    publish: {
      intentId: 'publish',
      outcomes: ['Press Releases'], // Single clear outcome
    },
    monitor: {
      intentId: 'monitor',
      outcomes: ['Monitor Social'],
    },
    analyze: {
      intentId: 'analyze',
      outcomes: ['Deep Sentiment'], // Single outcome
    },
    crisis: {
      intentId: 'crisis',
      outcomes: [], // Cannot map - needs scenario/workflow
      error: 'Requires scenario-based orchestration'
    },
    campaign: {
      intentId: 'campaign',
      outcomes: [], // Cannot map - needs scenario/workflow
      error: 'Requires multi-step workflow'
    }
  },
  5: {
    // Stage 5: Composite outcomes available - single outcome per intent
    block: {
      intentId: 'block',
      outcomes: ['Content Publishing'],
    },
    publish: {
      intentId: 'publish',
      outcomes: ['Press Releases'],
    },
    monitor: {
      intentId: 'monitor',
      outcomes: ['Monitor Social'],
    },
    analyze: {
      intentId: 'analyze',
      outcomes: ['Deep Sentiment'],
    },
    crisis: {
      intentId: 'crisis',
      outcomes: ['Crisis Response'], // Maps to composite outcome
    },
    campaign: {
      intentId: 'campaign',
      outcomes: ['Campaign Intel'], // Maps to composite outcome
    },
    protect: {
      intentId: 'protect',
      outcomes: ['Brand Protection'], // Maps to composite outcome
    }
  }
};

// Helper function to get mapped outcomes for an intent at a stage
export const getMappedOutcomes = (stage: StageNumber, intentId: string): string[] => {
  const stageMapping = INTENT_MAPPINGS[stage];
  if (!stageMapping || !stageMapping[intentId]) {
    return [];
  }
  return stageMapping[intentId].outcomes;
};

// Helper function to get error message for an intent at a stage
export const getIntentError = (stage: StageNumber, intentId: string): string | undefined => {
  const stageMapping = INTENT_MAPPINGS[stage];
  if (!stageMapping || !stageMapping[intentId]) {
    return 'Intent not available at this stage';
  }
  return stageMapping[intentId].error;
};
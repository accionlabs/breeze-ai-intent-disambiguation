import { Product, Intent, StageData } from '../types';
import { PRODUCTS_CONTENT, INTENTS_CONTENT } from '../config/content';
import { LAYOUT_CONFIG, calculateProductPositions } from '../config/layout';

// Generate product positions based on layout config
const productPositions = calculateProductPositions(Object.keys(PRODUCTS_CONTENT).length);

// Combine product content with calculated positions
export const PRODUCTS: Record<string, Product> = Object.entries(PRODUCTS_CONTENT).reduce((acc, [key, product], index) => {
  acc[key] = {
    ...product,
    position: productPositions[index]
  };
  return acc;
}, {} as Record<string, Product>);

export const INTENTS = INTENTS_CONTENT;

export const STAGE_DATA: Record<number, StageData> = {
  1: {
    number: 1,
    title: 'Existing Products with Siloed Functionality',
    subtitle: '5 powerful products, functions hidden inside',
    ambiguity: 'high',
    capability: 20,
    capabilityText: 'Basic Functions'
  },
  2: {
    number: 2,
    title: 'Individual Functional Graphs Extracted',
    subtitle: 'Functions visible but overlaps apparent',
    ambiguity: 'high',
    capability: 40,
    capabilityText: 'Function Visibility'
  },
  3: {
    number: 3,
    title: 'Rationalization of Overlapping Functions',
    subtitle: 'Duplicates merged, unique functions preserved',
    ambiguity: 'medium',
    capability: 60,
    capabilityText: 'Context Routing'
  },
  4: {
    number: 4,
    title: 'Unified Virtual Product',
    subtitle: 'Nexus orchestrates all products',
    ambiguity: 'low',
    capability: 80,
    capabilityText: 'Hierarchical Intelligence'
  },
  5: {
    number: 5,
    title: 'Cross-Product New Outcomes',
    subtitle: 'Compound intelligence emerges',
    ambiguity: 'none',
    capability: 100,
    capabilityText: 'Compound Intelligence'
  }
};
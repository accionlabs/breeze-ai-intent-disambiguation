// Type definitions for the Intent Disambiguation system
// These types are domain-agnostic and used across all configurations

export type HierarchyLevel = 'product' | 'workflow' | 'outcome' | 'scenario' | 'step' | 'action';

export interface FunctionalNode {
  id: string;
  level: HierarchyLevel;
  label: string;
  children: string[]; // IDs of child nodes
  parents: string[]; // IDs of parent nodes
  products?: string[]; // Which products can handle this
  description?: string;
}

export interface UserContext {
  profile: {
    role: string; // Made flexible to support any domain's roles
    department: string;
    seniority: string;
  };
  history: {
    timestamp: number;
    action: string;
    product: string;
    node: string;
  }[];
  patterns: {
    workflowStage: string;
    productPreferences: Record<string, number>; // product -> usage weight
    domainFocus: string[];
  };
}

export interface UserIntent {
  id: string;
  text: string;
  entryLevel: HierarchyLevel;
  entryNode: string;
  ambiguous?: boolean;
  contextDependentResolutions?: {
    role: string;
    resolution: Resolution;
  }[];
}

export interface Resolution {
  entryNode: string;
  traversalPath: {
    upward: string[];
    downward: string[];
  };
  selectedActions: string[];
  productActivation: {
    product: string;
    priority: 'primary' | 'secondary';
    actions: string[];
  }[];
  confidenceScore: number;
  reasoning: string[];
}

// Re-export graph types from utils
export type { FunctionalGraph } from '../utils/graphModel';
export { GraphOperations } from '../utils/graphModel';
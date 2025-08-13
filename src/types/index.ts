export interface Product {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  functions: string[];
  position: { x: number; y: number };
}

export interface FunctionNode {
  id: string;
  name: string;
  productIds: string[];
  isOverlapping?: boolean;
  isUnified?: boolean;
  position?: { x: number; y: number };
}

export interface Intent {
  id: string;
  text: string;
  color: string;
  bgColor: string;
  minStage: number;
  description: string;
}

export interface IntentMapping {
  result: string;
  status: 'success' | 'partial' | 'confused';
  highlights?: string[];
  error?: string;
  warning?: string;
}

export interface StageData {
  number: number;
  title: string;
  subtitle: string;
  ambiguity?: 'high' | 'medium' | 'low' | 'none';
  capability: number;
  capabilityText: string;
  isTransition?: boolean;
}

export type StageNumber = 1 | 2 | 3 | 4 | 5;
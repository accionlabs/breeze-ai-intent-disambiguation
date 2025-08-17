// Hook to load domain-specific configuration
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { convertLegacyNodes, GraphOperations } from '../utils/graphModel';
import type { 
  FunctionalNode, 
  UserIntent, 
  UserContext 
} from '../types';

interface DomainConfig {
  DOMAIN_NAME: string;
  DOMAIN_DESCRIPTION: string;
  COMPANY_NAME: string;
  PRODUCTS: Record<string, any>;
  PRODUCT_CODES: readonly string[];
  PRODUCT_COLORS: Record<string, string>;
  getProductColor: (product: string) => string;
  DOMAIN_CAPABILITIES: string[];
  INDUSTRY_VERTICALS: string[];
  DOMAIN_SYNONYMS: Record<string, string[]>;
  WORD_FORMS: Record<string, string>;
  FUNCTIONAL_NODES: Record<string, FunctionalNode>;
  USER_INTENTS: UserIntent[];
  EXAMPLE_QUERIES: string[];
  INTENT_INPUT_PLACEHOLDER: string;
  SAMPLE_CONTEXTS: Record<string, UserContext>;
  RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>>;
  DUPLICATE_NODES: string[];
  SHARED_NODES: string[];
  FUNCTIONAL_GRAPH: any;
  graphOps: GraphOperations;
}

export function useDomainConfig(): DomainConfig | null {
  const { domainId } = useParams<{ domainId: string }>();
  
  const config = useMemo(() => {
    if (!domainId) return null;
    
    try {
      // Dynamically import the domain configuration
      let domainModule: any;
      if (domainId === 'healthcare') {
        domainModule = require('../config/domains/healthcare');
      } else {
        // Default to cision
        domainModule = require('../config/domains/cision');
      }
      
      // Create the functional graph
      const FUNCTIONAL_GRAPH = convertLegacyNodes(domainModule.FUNCTIONAL_NODES);
      const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
      
      return {
        ...domainModule,
        FUNCTIONAL_GRAPH,
        graphOps
      };
    } catch (error) {
      console.error(`Failed to load domain configuration for ${domainId}:`, error);
      return null;
    }
  }, [domainId]);
  
  return config;
}
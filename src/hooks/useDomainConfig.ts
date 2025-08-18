// Hook to load domain-specific configuration
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { convertLegacyNodes, GraphOperations } from '../utils/graphModel';
import { detectRationalizedGroups, generateRationalizedAlternatives, generateDuplicateNodes, generateSharedNodes } from '../utils/automaticRationalization';
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

// Create a domain module context to enable dynamic imports
const domainModules: Record<string, any> = {
  cision: require('../config/domains/cision'),
  healthcare: require('../config/domains/healthcare'),
  ecommerce: require('../config/domains/ecommerce'),
  enterprise: require('../config/domains/enterprise')
};

export function useDomainConfig(): DomainConfig | null {
  const { domainId } = useParams<{ domainId: string }>();
  
  const config = useMemo(() => {
    if (!domainId) return null;
    
    try {
      // Dynamically get the domain module
      const domainModule = domainModules[domainId];
      
      if (!domainModule) {
        console.warn(`Domain '${domainId}' not found. Available domains:`, Object.keys(domainModules));
        // Fallback to cision if domain not found
        const fallbackModule = domainModules['cision'];
        const FUNCTIONAL_GRAPH = convertLegacyNodes(fallbackModule.FUNCTIONAL_NODES);
        const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
        
        return {
          ...fallbackModule,
          FUNCTIONAL_GRAPH,
          graphOps
        };
      }
      
      // Create the functional graph
      const FUNCTIONAL_GRAPH = convertLegacyNodes(domainModule.FUNCTIONAL_NODES);
      const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
      
      // Auto-generate rationalization data from nodes
      const rationalizedGroups = detectRationalizedGroups(domainModule.FUNCTIONAL_NODES);
      const RATIONALIZED_NODE_ALTERNATIVES = generateRationalizedAlternatives(rationalizedGroups);
      const DUPLICATE_NODES = generateDuplicateNodes(rationalizedGroups, domainModule.FUNCTIONAL_NODES);
      const SHARED_NODES = generateSharedNodes(rationalizedGroups);
      
      return {
        ...domainModule,
        FUNCTIONAL_GRAPH,
        graphOps,
        RATIONALIZED_NODE_ALTERNATIVES,
        DUPLICATE_NODES,
        SHARED_NODES
      };
    } catch (error) {
      console.error(`Failed to load domain configuration for ${domainId}:`, error);
      return null;
    }
  }, [domainId]);
  
  return config;
}
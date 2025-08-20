// Hook to load domain-specific configuration
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { convertLegacyNodes, GraphOperations } from '../utils/graphModel';
import { preprocessDomainNodes } from '../utils/automaticSharedNodeGenerator';
import type { 
  FunctionalNode, 
  UserQuery, 
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
  USER_QUERIES: UserQuery[];
  EXAMPLE_QUERIES: string[];
  QUERY_INPUT_PLACEHOLDER: string;
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
  enterprise: require('../config/domains/enterprise'),
  financial: require('../config/domains/financial')
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
        
        // Preprocess fallback domain nodes
        const preprocessedData = preprocessDomainNodes(fallbackModule.FUNCTIONAL_NODES);
        const FUNCTIONAL_NODES = preprocessedData.FUNCTIONAL_NODES;
        const FUNCTIONAL_GRAPH = convertLegacyNodes(FUNCTIONAL_NODES);
        const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
        
        return {
          ...fallbackModule,
          FUNCTIONAL_NODES,
          FUNCTIONAL_GRAPH,
          graphOps,
          RATIONALIZED_NODE_ALTERNATIVES: preprocessedData.RATIONALIZED_NODE_ALTERNATIVES,
          DUPLICATE_NODES: preprocessedData.DUPLICATE_NODES,
          SHARED_NODES: preprocessedData.SHARED_NODES
        };
      }
      
      // Preprocess domain nodes to automatically generate shared nodes
      const preprocessedData = preprocessDomainNodes(domainModule.FUNCTIONAL_NODES);
      
      // Use preprocessed nodes which now include dynamically generated shared nodes
      const FUNCTIONAL_NODES = preprocessedData.FUNCTIONAL_NODES;
      
      // Create the functional graph with the preprocessed nodes
      const FUNCTIONAL_GRAPH = convertLegacyNodes(FUNCTIONAL_NODES);
      const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
      
      // Use auto-generated rationalization data
      const RATIONALIZED_NODE_ALTERNATIVES = preprocessedData.RATIONALIZED_NODE_ALTERNATIVES;
      const DUPLICATE_NODES = preprocessedData.DUPLICATE_NODES;
      const SHARED_NODES = preprocessedData.SHARED_NODES;
      
      console.log(`Domain ${domainId} preprocessing:`, {
        originalNodes: Object.keys(domainModule.FUNCTIONAL_NODES).length,
        processedNodes: Object.keys(FUNCTIONAL_NODES).length,
        sharedNodesGenerated: SHARED_NODES.length,
        duplicatesDetected: DUPLICATE_NODES.length,
        SHARED_NODES: SHARED_NODES,
        DUPLICATE_NODES: DUPLICATE_NODES
      });
      
      return {
        ...domainModule,
        FUNCTIONAL_NODES, // Use preprocessed nodes
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
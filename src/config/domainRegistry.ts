// Domain Registry System
// This module manages multiple domains and provides a way to switch between them

import type { 
  FunctionalNode, 
  UserQuery, 
  UserContext
} from '../types';

// Domain configuration interface
export interface DomainConfig {
  // Metadata
  DOMAIN_METADATA: {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    category: string;
    keywords: string[];
  };
  
  // Core domain data
  DOMAIN_NAME: string;
  DOMAIN_DESCRIPTION: string;
  COMPANY_NAME: string;
  
  // Products
  PRODUCTS: Record<string, {
    name: string;
    description: string;
    abbreviation: string;
    alternateNames?: string[];
  }>;
  PRODUCT_CODES: readonly string[];
  PRODUCT_COLORS: Record<string, string>;
  getProductColor: (product: string) => string;
  
  // Domain capabilities
  DOMAIN_CAPABILITIES: string[];
  INDUSTRY_VERTICALS: string[];
  
  // Language processing
  DOMAIN_SYNONYMS: Record<string, string[]>;
  WORD_FORMS: Record<string, string>;
  
  // Functional hierarchy
  FUNCTIONAL_NODES: Record<string, FunctionalNode>;
  
  // User querys
  USER_QUERIES: UserQuery[];
  EXAMPLE_QUERIES: string[];
  QUERY_INPUT_PLACEHOLDER: string;
  
  // User contexts
  SAMPLE_CONTEXTS: Record<string, UserContext>;
}

// Registry class to manage domains
class DomainRegistry {
  private domains: Map<string, DomainConfig> = new Map();
  private currentDomainId: string | null = null;
  
  // Register a new domain
  register(domain: DomainConfig): void {
    const domainId = domain.DOMAIN_METADATA.id;
    this.domains.set(domainId, domain);
    
    // Set as current if it's the first domain
    if (!this.currentDomainId) {
      this.currentDomainId = domainId;
    }
  }
  
  // Get a specific domain
  getDomain(domainId: string): DomainConfig | null {
    return this.domains.get(domainId) || null;
  }
  
  // Get current domain
  getCurrentDomain(): DomainConfig | null {
    if (!this.currentDomainId) return null;
    return this.domains.get(this.currentDomainId) || null;
  }
  
  // Set current domain
  setCurrentDomain(domainId: string): boolean {
    if (!this.domains.has(domainId)) {
      console.error(`Domain '${domainId}' not found in registry`);
      return false;
    }
    this.currentDomainId = domainId;
    return true;
  }
  
  // Get all registered domains
  getAllDomains(): Array<{ id: string; name: string; description: string }> {
    return Array.from(this.domains.values()).map(domain => ({
      id: domain.DOMAIN_METADATA.id,
      name: domain.DOMAIN_METADATA.name,
      description: domain.DOMAIN_METADATA.description
    }));
  }
  
  // Check if a domain is registered
  hasDomain(domainId: string): boolean {
    return this.domains.has(domainId);
  }
  
  // Get current domain ID
  getCurrentDomainId(): string | null {
    return this.currentDomainId;
  }
}

// Create singleton instance
export const domainRegistry = new DomainRegistry();

// Helper function to load a domain dynamically
export async function loadDomain(domainId: string): Promise<DomainConfig | null> {
  try {
    // Dynamic import based on domain ID
    const domainModule = await import(`./domains/${domainId}/index`);
    
    // Construct domain config from module exports
    const domainConfig: DomainConfig = {
      DOMAIN_METADATA: domainModule.DOMAIN_METADATA,
      DOMAIN_NAME: domainModule.DOMAIN_NAME,
      DOMAIN_DESCRIPTION: domainModule.DOMAIN_DESCRIPTION,
      COMPANY_NAME: domainModule.COMPANY_NAME,
      PRODUCTS: domainModule.PRODUCTS,
      PRODUCT_CODES: domainModule.PRODUCT_CODES,
      PRODUCT_COLORS: domainModule.PRODUCT_COLORS,
      getProductColor: domainModule.getProductColor,
      DOMAIN_CAPABILITIES: domainModule.DOMAIN_CAPABILITIES,
      INDUSTRY_VERTICALS: domainModule.INDUSTRY_VERTICALS,
      DOMAIN_SYNONYMS: domainModule.DOMAIN_SYNONYMS,
      WORD_FORMS: domainModule.WORD_FORMS,
      FUNCTIONAL_NODES: domainModule.FUNCTIONAL_NODES,
      USER_QUERIES: domainModule.USER_QUERIES,
      EXAMPLE_QUERIES: domainModule.EXAMPLE_QUERIES,
      QUERY_INPUT_PLACEHOLDER: domainModule.QUERY_INPUT_PLACEHOLDER,
      SAMPLE_CONTEXTS: domainModule.SAMPLE_CONTEXTS
    };
    
    return domainConfig;
  } catch (error) {
    console.error(`Failed to load domain '${domainId}':`, error);
    return null;
  }
}

// Initialize with available domains
export async function initializeDomains(): Promise<void> {
  // Load all available domains
  const domainIds = ['cision', 'healthcare', 'ecommerce', 'enterprise'];
  
  for (const domainId of domainIds) {
    const domain = await loadDomain(domainId);
    if (domain) {
      domainRegistry.register(domain);
    }
  }
}
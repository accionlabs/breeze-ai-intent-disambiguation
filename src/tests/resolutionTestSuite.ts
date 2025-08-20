// Test suite for intent resolution across all domains
import { FunctionalNode, UserQuery, UserContext } from '../types';
import { calculateResolution, RecentAction } from '../utils/resolutionEngine';
import { GraphOperations, convertLegacyNodes } from '../utils/graphModel';
import { 
  detectRationalizedGroups, 
  generateRationalizedAlternatives, 
  generateDuplicateNodes, 
  generateSharedNodes 
} from '../utils/automaticRationalization';

// Test case structure
interface TestCase {
  id: string;
  domain: string;
  description: string;
  query: string;
  entryNode: string;
  context: {
    enabled: boolean;
    recentActions: Array<{
      product: string;
      query: string;
      success: boolean;
    }>;
  };
  rationalized: boolean;
  workflows: boolean;
  expected: {
    shouldSucceed: boolean;
    confidenceScore: number;
    reasoningContains?: string[];
    selectedActionsCount?: number;
    productActivation?: string[];
  };
}

// Test result structure
interface TestResult {
  testId: string;
  domain: string;
  description: string;
  passed: boolean;
  actual: {
    success: boolean;
    confidenceScore: number;
    reasoning: string[];
    selectedActionsCount: number;
    products: string[];
  };
  expected: TestCase['expected'];
  error?: string;
}

// Test runner class
export class ResolutionTestRunner {
  private results: TestResult[] = [];
  private domainCache: Map<string, any> = new Map();
  
  // Load domain configuration with caching
  private loadDomain(domainName: string) {
    // Check cache first
    if (this.domainCache.has(domainName)) {
      return this.domainCache.get(domainName);
    }
    
    try {
      // Use dynamic import to avoid bundling issues
      // For now, we'll use require but wrap it to prevent issues
      const domainModule = require(`../config/domains/${domainName}`);
      const FUNCTIONAL_GRAPH = convertLegacyNodes(domainModule.FUNCTIONAL_NODES);
      const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
      
      // Auto-generate rationalization data
      const rationalizedGroups = detectRationalizedGroups(domainModule.FUNCTIONAL_NODES);
      const RATIONALIZED_NODE_ALTERNATIVES = generateRationalizedAlternatives(rationalizedGroups);
      const DUPLICATE_NODES = generateDuplicateNodes(rationalizedGroups, domainModule.FUNCTIONAL_NODES);
      const SHARED_NODES = generateSharedNodes(rationalizedGroups);
      
      const domainData = {
        FUNCTIONAL_NODES: domainModule.FUNCTIONAL_NODES,
        USER_QUERIES: domainModule.USER_QUERIES,
        RATIONALIZED_NODE_ALTERNATIVES,
        DUPLICATE_NODES,
        SHARED_NODES,
        graphOps
      };
      
      // Cache the loaded domain
      this.domainCache.set(domainName, domainData);
      return domainData;
    } catch (error) {
      console.error(`Failed to load domain ${domainName}:`, error);
      return null;
    }
  }
  
  // Run a single test case
  private runTest(testCase: TestCase): TestResult {
    const domain = this.loadDomain(testCase.domain);
    if (!domain) {
      return {
        testId: testCase.id,
        domain: testCase.domain,
        description: testCase.description,
        passed: false,
        actual: {
          success: false,
          confidenceScore: 0,
          reasoning: [],
          selectedActionsCount: 0,
          products: []
        },
        expected: testCase.expected,
        error: `Failed to load domain ${testCase.domain}`
      };
    }
    
    try {
      // Convert recent actions to the format expected by calculateResolution
      const recentActions: RecentAction[] = testCase.context.recentActions
        .filter(a => a.success)
        .map((a, index) => ({
          id: `test-${index}`,
          persona: 'Test User',
          query: a.query,
          product: a.product,
          outcome: 'Test Outcome',
          matchedNode: 'test-node',
          timestamp: new Date(),
          success: a.success,
          resolution: {
            entryNode: '',
            traversalPath: { upward: [], downward: [] },
            selectedActions: [],
            productActivation: [],
            confidenceScore: 1,
            reasoning: []
          },
          toggleStates: {
            showRationalized: false,
            showWorkflows: false
          }
        }));
      
      // Create a mock UserContext if needed
      const mockContext = testCase.context.enabled ? {
        profile: {
          role: 'Test User',
          department: 'Testing',
          seniority: 'mid' as const,
          goals: []
        },
        history: [],
        patterns: {
          workflowStage: '',
          productPreferences: {},
          domainFocus: []
        }
      } : null;
      
      // Run the resolution
      const resolution = calculateResolution(
        testCase.entryNode,
        mockContext,
        testCase.rationalized,
        testCase.workflows,
        testCase.context.enabled ? recentActions : [],
        domain.FUNCTIONAL_NODES,
        domain.RATIONALIZED_NODE_ALTERNATIVES,
        domain.graphOps
      );
      
      // Extract actual results
      const actual = {
        success: resolution.confidenceScore > 0,
        confidenceScore: resolution.confidenceScore,
        reasoning: resolution.reasoning,
        selectedActionsCount: resolution.selectedActions.length,
        products: resolution.productActivation.map((p: any) => p.product)
      };
      
      // Check if test passed
      let passed = true;
      let errors: string[] = [];
      
      // Check success/failure
      if (actual.success !== testCase.expected.shouldSucceed) {
        passed = false;
        errors.push(`Expected ${testCase.expected.shouldSucceed ? 'success' : 'failure'}, got ${actual.success ? 'success' : 'failure'}`);
      }
      
      // Check confidence score
      if (actual.confidenceScore !== testCase.expected.confidenceScore) {
        passed = false;
        errors.push(`Expected confidence ${testCase.expected.confidenceScore}, got ${actual.confidenceScore}`);
      }
      
      // Check reasoning contains expected strings
      if (testCase.expected.reasoningContains) {
        for (const expectedReason of testCase.expected.reasoningContains) {
          const found = actual.reasoning.some(r => r.includes(expectedReason));
          if (!found) {
            passed = false;
            errors.push(`Expected reasoning to contain "${expectedReason}"`);
          }
        }
      }
      
      // Check selected actions count
      if (testCase.expected.selectedActionsCount !== undefined && 
          actual.selectedActionsCount !== testCase.expected.selectedActionsCount) {
        passed = false;
        errors.push(`Expected ${testCase.expected.selectedActionsCount} actions, got ${actual.selectedActionsCount}`);
      }
      
      // Check product activation
      if (testCase.expected.productActivation) {
        const expectedProducts = testCase.expected.productActivation.sort();
        const actualProducts = actual.products.sort();
        if (JSON.stringify(expectedProducts) !== JSON.stringify(actualProducts)) {
          passed = false;
          errors.push(`Expected products [${expectedProducts.join(', ')}], got [${actualProducts.join(', ')}]`);
        }
      }
      
      return {
        testId: testCase.id,
        domain: testCase.domain,
        description: testCase.description,
        passed,
        actual,
        expected: testCase.expected,
        error: errors.length > 0 ? errors.join('; ') : undefined
      };
    } catch (error) {
      return {
        testId: testCase.id,
        domain: testCase.domain,
        description: testCase.description,
        passed: false,
        actual: {
          success: false,
          confidenceScore: 0,
          reasoning: [],
          selectedActionsCount: 0,
          products: []
        },
        expected: testCase.expected,
        error: `Test execution failed: ${error}`
      };
    }
  }
  
  // Run all test cases
  runTests(testCases: TestCase[]): TestResult[] {
    this.results = [];
    
    for (const testCase of testCases) {
      console.log(`Running test: ${testCase.id} - ${testCase.description}`);
      const result = this.runTest(testCase);
      this.results.push(result);
    }
    
    return this.results;
  }
  
  // Generate test report
  generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : '0';
    
    let report = `\n${'='.repeat(80)}\n`;
    report += `QUERY RESOLUTION TEST REPORT\n`;
    report += `${'='.repeat(80)}\n\n`;
    
    report += `Summary: ${passedTests}/${totalTests} tests passed (${passRate}%)\n\n`;
    
    // Group results by domain
    const byDomain: Record<string, TestResult[]> = {};
    this.results.forEach(r => {
      if (!byDomain[r.domain]) byDomain[r.domain] = [];
      byDomain[r.domain].push(r);
    });
    
    // Report by domain
    for (const [domain, domainResults] of Object.entries(byDomain)) {
      report += `\n${'-'.repeat(40)}\n`;
      report += `Domain: ${domain.toUpperCase()}\n`;
      report += `${'-'.repeat(40)}\n`;
      
      const domainPassed = domainResults.filter(r => r.passed).length;
      const domainTotal = domainResults.length;
      report += `Results: ${domainPassed}/${domainTotal} passed\n\n`;
      
      // Show failed tests first
      const failed = domainResults.filter(r => !r.passed);
      if (failed.length > 0) {
        report += `FAILED TESTS:\n`;
        failed.forEach(r => {
          report += `\n  ❌ ${r.testId}: ${r.description}\n`;
          report += `     Error: ${r.error}\n`;
          report += `     Actual: confidence=${r.actual.confidenceScore}, `;
          report += `actions=${r.actual.selectedActionsCount}, `;
          report += `products=[${r.actual.products.join(',')}]\n`;
        });
      }
      
      // Show passed tests
      const passed = domainResults.filter(r => r.passed);
      if (passed.length > 0) {
        report += `\nPASSED TESTS:\n`;
        passed.forEach(r => {
          report += `  ✓ ${r.testId}: ${r.description}\n`;
        });
      }
    }
    
    report += `\n${'='.repeat(80)}\n`;
    
    return report;
  }
}

// Export test cases
export const TEST_CASES: TestCase[] = [
  // CISION DOMAIN TESTS
  {
    id: 'cision-1',
    domain: 'cision',
    description: 'Ambiguous query fails without context',
    query: 'Track media coverage for intelligence',
    entryNode: 'step-track-coverage-media',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: false,
      confidenceScore: 0,
      reasoningContains: ['Resolution failed']
    }
  },
  {
    id: 'cision-2',
    domain: 'cision',
    description: 'Ambiguous query succeeds with CisionOne context',
    query: 'Track media coverage for intelligence',
    entryNode: 'step-track-coverage-media',
    context: {
      enabled: true,
      recentActions: [
        { product: 'cision', query: 'Monitor alerts', success: true },
        { product: 'cision', query: 'Track reputation', success: true },
        { product: 'cision', query: 'Set up crisis alerts', success: true }
      ]
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      reasoningContains: ['Context-based resolution'],
      selectedActionsCount: 2,
      productActivation: ['cision']
    }
  },
  {
    id: 'cision-3',
    domain: 'cision',
    description: 'Non-ambiguous query succeeds without context',
    query: 'Create content about our latest product launch',
    entryNode: 'step-schedule-posts',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      selectedActionsCount: 2,
      productActivation: ['smm']
    }
  },
  {
    id: 'cision-4',
    domain: 'cision',
    description: 'Ambiguous query succeeds with rationalization',
    query: 'Monitor social media conversations',
    entryNode: 'step-social-monitoring-shared',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: true,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      reasoningContains: ['No user context available']
    }
  },
  {
    id: 'cision-5',
    domain: 'cision',
    description: 'Workflow query succeeds when workflows enabled',
    query: 'Coordinate multi-channel crisis response',
    entryNode: 'workflow-crisis-response',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: true,
    workflows: true,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      reasoningContains: ['Cross-product workflow orchestration']
    }
  },
  
  // HEALTHCARE DOMAIN TESTS
  {
    id: 'healthcare-1',
    domain: 'healthcare',
    description: 'Clinical care outcome succeeds',
    query: 'Access clinical care',
    entryNode: 'outcome-clinical-care',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['ehr']
    }
  },
  {
    id: 'healthcare-2',
    domain: 'healthcare',
    description: 'Diagnosis support scenario succeeds',
    query: 'Get diagnosis support',
    entryNode: 'scenario-diagnosis-support',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['ehr']
    }
  },
  {
    id: 'healthcare-3',
    domain: 'healthcare',
    description: 'Shared patient monitoring with context',
    query: 'Monitor patient',
    entryNode: 'scenario-patient-monitoring-shared',
    context: {
      enabled: true,
      recentActions: [
        { product: 'ehr', query: 'Access patient records', success: true },
        { product: 'pharmacy', query: 'Check medications', success: true }
      ]
    },
    rationalized: true,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['ehr', 'pharmacy']
    }
  },
  
  // ECOMMERCE DOMAIN TESTS
  {
    id: 'ecommerce-1',
    domain: 'ecommerce',
    description: 'Product search query succeeds',
    query: 'Improve online shopping experience',
    entryNode: 'outcome-customer-experience-storefront',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['storefront']
    }
  },
  {
    id: 'ecommerce-2',
    domain: 'ecommerce',
    description: 'Sales growth query succeeds',
    query: 'Increase online sales',
    entryNode: 'outcome-sales-growth-storefront',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['storefront']
    }
  },
  
  // ENTERPRISE DOMAIN TESTS
  {
    id: 'enterprise-1',
    domain: 'enterprise',
    description: 'SAP report action succeeds',
    query: 'Run financial report',
    entryNode: 'action-run-report-sap',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['sap']
    }
  },
  {
    id: 'enterprise-2',
    domain: 'enterprise',
    description: 'Track order query succeeds',
    query: 'Track customer order',
    entryNode: 'step-track-order-salesforce',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['salesforce']
    }
  },
  
  // FINANCIAL DOMAIN TESTS
  {
    id: 'financial-1',
    domain: 'financial',
    description: 'Account opening succeeds for core banking',
    query: 'Open an account',
    entryNode: 'scenario-open-account-cb',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['core-banking']
    }
  },
  {
    id: 'financial-2',
    domain: 'financial',
    description: 'Risk KYC scenario succeeds',
    query: 'Complete KYC verification',
    entryNode: 'scenario-kyc-risk',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['risk']
    }
  },
  {
    id: 'financial-3',
    domain: 'financial',
    description: 'Transfer money succeeds for core banking',
    query: 'Transfer funds',
    entryNode: 'scenario-transfer-cb',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['core-banking']
    }
  },
  {
    id: 'financial-4',
    domain: 'financial',
    description: 'Loan application query succeeds',
    query: 'Apply for loan',
    entryNode: 'scenario-application-loans',
    context: {
      enabled: false,
      recentActions: []
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['loans']
    }
  },
  {
    id: 'financial-5',
    domain: 'financial',
    description: 'Portfolio management for wealth client',
    query: 'Manage portfolio',
    entryNode: 'scenario-portfolio-wealth',
    context: {
      enabled: true,
      recentActions: [
        { product: 'wealth', query: 'Investment Trading', success: true },
        { product: 'wealth', query: 'Retirement Planning', success: true }
      ]
    },
    rationalized: false,
    workflows: false,
    expected: {
      shouldSucceed: true,
      confidenceScore: 1,
      productActivation: ['wealth']
    }
  }
];
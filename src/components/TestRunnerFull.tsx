import React, { useState } from 'react';
import { calculateResolution, RecentAction } from '../utils/resolutionEngine';
import { GraphOperations, convertLegacyNodes } from '../utils/graphModel';
import { 
  detectRationalizedGroups, 
  generateRationalizedAlternatives, 
  generateDuplicateNodes, 
  generateSharedNodes 
} from '../utils/automaticRationalization';
import { UserContext } from '../types';
import { TEST_CASES } from '../tests/resolutionTestSuite';

interface TestResult {
  testId: string;
  domain: string;
  description: string;
  passed: boolean;
  expected: {
    shouldSucceed: boolean;
    confidenceScore: number;
  };
  actual: {
    confidenceScore: number;
    selectedActionsCount: number;
    products: string[];
  };
  error?: string;
}

const TestRunnerFull: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [summary, setSummary] = useState<string>('');

  const loadDomain = async (domainName: string) => {
    const domainModule = await import(`../config/domains/${domainName}`);
    const FUNCTIONAL_GRAPH = convertLegacyNodes(domainModule.FUNCTIONAL_NODES);
    const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
    
    const rationalizedGroups = detectRationalizedGroups(domainModule.FUNCTIONAL_NODES);
    const RATIONALIZED_NODE_ALTERNATIVES = generateRationalizedAlternatives(rationalizedGroups);
    const DUPLICATE_NODES = generateDuplicateNodes(rationalizedGroups, domainModule.FUNCTIONAL_NODES);
    const SHARED_NODES = generateSharedNodes(rationalizedGroups);
    
    return {
      FUNCTIONAL_NODES: domainModule.FUNCTIONAL_NODES,
      USER_INTENTS: domainModule.USER_INTENTS,
      RATIONALIZED_NODE_ALTERNATIVES,
      DUPLICATE_NODES,
      SHARED_NODES,
      graphOps
    };
  };

  const runSingleTest = async (testCase: any): Promise<TestResult> => {
    try {
      const domain = await loadDomain(testCase.domain);
      
      // Convert recent actions to the format expected by calculateResolution
      const recentActions: RecentAction[] = testCase.context.recentActions
        .filter((a: any) => a.success)
        .map((a: any, index: number) => ({
          id: `test-${index}`,
          persona: 'Test User',
          intent: a.intent,
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
      } as UserContext : null;
      
      // Check if entry node exists
      if (!domain.FUNCTIONAL_NODES[testCase.entryNode]) {
        throw new Error(`Entry node '${testCase.entryNode}' not found in domain '${testCase.domain}'`);
      }
      
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
      
      // Check results
      const actual = {
        confidenceScore: resolution.confidenceScore,
        selectedActionsCount: resolution.selectedActions.length,
        products: resolution.productActivation.map(p => p.product)
      };
      
      const passed = 
        (resolution.confidenceScore > 0) === testCase.expected.shouldSucceed &&
        resolution.confidenceScore === testCase.expected.confidenceScore;
      
      // Add detailed error info for failures
      let error: string | undefined;
      if (!passed) {
        error = `Expected confidence ${testCase.expected.confidenceScore}, got ${resolution.confidenceScore}`;
        if (resolution.confidenceScore === 0 && resolution.reasoning.length > 0) {
          error += ` | Reason: ${resolution.reasoning[0]}`;
        }
      }
      
      return {
        testId: testCase.id,
        domain: testCase.domain,
        description: testCase.description,
        passed,
        expected: testCase.expected,
        actual,
        error
      };
    } catch (error) {
      return {
        testId: testCase.id,
        domain: testCase.domain,
        description: testCase.description,
        passed: false,
        expected: testCase.expected,
        actual: {
          confidenceScore: 0,
          selectedActionsCount: 0,
          products: []
        },
        error: `Test execution failed: ${error}`
      };
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary('Running tests...');
    
    // Filter tests by domain
    const testsToRun = selectedDomain === 'all' 
      ? TEST_CASES 
      : TEST_CASES.filter(t => t.domain === selectedDomain);
    
    const testResults: TestResult[] = [];
    
    // Run tests sequentially to avoid overloading
    for (let i = 0; i < testsToRun.length; i++) {
      const testCase = testsToRun[i];
      setSummary(`Running test ${i + 1} of ${testsToRun.length}: ${testCase.id}`);
      
      const result = await runSingleTest(testCase);
      testResults.push(result);
      
      // Update results incrementally
      setResults([...testResults]);
      
      // Small delay to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Generate summary
    const passed = testResults.filter(r => r.passed).length;
    const total = testResults.length;
    const passRate = total > 0 ? (passed / total * 100).toFixed(1) : '0';
    
    setSummary(`Completed: ${passed}/${total} tests passed (${passRate}%)`);
    setIsRunning(false);
  };

  const domains = ['all', 'cision', 'healthcare', 'ecommerce', 'enterprise'];
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  const copyResults = () => {
    const text = results.map(r => 
      `${r.testId}\t${r.domain}\t${r.description}\t${r.passed ? 'PASS' : 'FAIL'}\tExpected: ${r.expected.confidenceScore}\tActual: ${r.actual.confidenceScore}\t${r.error || ''}`
    ).join('\n');
    
    const header = `Test Results: ${passedCount}/${totalCount} passed\n\nID\tDomain\tDescription\tStatus\tExpected\tActual\tError\n`;
    const fullText = header + text;
    
    navigator.clipboard.writeText(fullText).then(() => {
      alert('Results copied to clipboard!');
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Full Test Suite Runner</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Domain: </label>
          <select 
            value={selectedDomain} 
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
            disabled={isRunning}
          >
            {domains.map(d => (
              <option key={d} value={d}>{d.toUpperCase()}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={runTests}
          disabled={isRunning}
          style={{
            padding: '10px 20px',
            background: isRunning ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
        
        <span style={{ marginLeft: '20px', fontSize: '14px' }}>
          {summary}
        </span>
      </div>

      {results.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Test Results ({passedCount}/{totalCount} passed)</h3>
            <button
              onClick={copyResults}
              style={{
                padding: '5px 15px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📋 Copy Results
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Test ID</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Domain</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Description</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Expected</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Actual</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Error</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.testId} style={{ background: r.passed ? '#e8f5e9' : '#ffebee' }}>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '12px' }}>{r.testId}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '12px' }}>{r.domain}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '12px' }}>{r.description}</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>
                    {r.passed ? '✅' : '❌'}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc', fontSize: '12px' }}>
                    {r.expected.confidenceScore}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc', fontSize: '12px' }}>
                    {r.actual.confidenceScore}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px', color: '#d32f2f' }}>
                    {r.error || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestRunnerFull;
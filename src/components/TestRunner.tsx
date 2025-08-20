import React, { useState, useCallback, useMemo } from 'react';
import { ResolutionTestRunner, TEST_CASES } from '../tests/resolutionTestSuite';

interface TestResultDisplay {
  testId: string;
  domain: string;
  description: string;
  passed: boolean;
  error?: string;
  details: {
    confidenceScore: number;
    selectedActionsCount: number;
    products: string[];
  };
}

const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResultDisplay[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [report, setReport] = useState<string>('');

  // Memoize the test runner instance to prevent recreating it on every render
  const runner = useMemo(() => new ResolutionTestRunner(), []);

  // Wrap runTests in useCallback to prevent recreation on every render
  const runTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setReport('');

    // Use setTimeout to defer execution and prevent blocking
    setTimeout(() => {
      try {
        // Filter tests by domain if needed
        const testsToRun = selectedDomain === 'all' 
          ? TEST_CASES 
          : TEST_CASES.filter(t => t.domain === selectedDomain);

        // Run tests
        const testResults = runner.runTests(testsToRun);
        
        // Convert results for display
        const displayResults: TestResultDisplay[] = testResults.map(r => ({
          testId: r.testId,
          domain: r.domain,
          description: r.description,
          passed: r.passed,
          error: r.error,
          details: {
            confidenceScore: r.actual.confidenceScore,
            selectedActionsCount: r.actual.selectedActionsCount,
            products: r.actual.products
          }
        }));

        setResults(displayResults);
        setReport(runner.generateReport());
        setIsRunning(false);
      } catch (error) {
        console.error('Error running tests:', error);
        setIsRunning(false);
        setReport(`Error running tests: ${error}`);
      }
    }, 100);
  }, [selectedDomain, runner]);

  const domains = ['all', 'cision', 'healthcare', 'ecommerce', 'enterprise', 'financial'];
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const passRate = totalCount > 0 ? (passedCount / totalCount * 100).toFixed(1) : '0';

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Intent Resolution Test Suite</h2>
      
      {/* Controls */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Domain: </label>
          <select 
            value={selectedDomain} 
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
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
        
        {results.length > 0 && (
          <span style={{ marginLeft: '20px', fontSize: '16px', fontWeight: 'bold' }}>
            Results: {passedCount}/{totalCount} passed ({passRate}%)
          </span>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Test Results</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Test ID</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Domain</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Description</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Confidence</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Actions</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Products</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Error</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.testId} style={{ background: r.passed ? '#e8f5e9' : '#ffebee' }}>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{r.testId}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{r.domain}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{r.description}</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>
                    {r.passed ? '✅' : '❌'}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>
                    {r.details.confidenceScore}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>
                    {r.details.selectedActionsCount}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {r.details.products.join(', ') || 'none'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '12px', color: '#d32f2f' }}>
                    {r.error || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Report */}
      {report && (
        <div>
          <h3>Detailed Report</h3>
          <pre style={{
            padding: '15px',
            background: '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {report}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestRunner;
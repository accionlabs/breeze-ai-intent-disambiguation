import React, { useState } from 'react';

const TestRunnerSimple: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string>('');

  const runTests = async () => {
    setIsRunning(true);
    setResults('Starting tests...\n');
    
    try {
      // Dynamically import the test suite to avoid loading on mount
      const { ResolutionTestRunner, TEST_CASES } = await import('../tests/resolutionTestSuite');
      
      setResults(prev => prev + 'Loaded test suite\n');
      
      // Create runner instance
      const runner = new ResolutionTestRunner();
      
      setResults(prev => prev + `Running ${TEST_CASES.length} test cases...\n`);
      
      // Run tests with setTimeout to avoid blocking
      setTimeout(() => {
        try {
          const testResults = runner.runTests(TEST_CASES);
          const report = runner.generateReport();
          
          setResults(report);
        } catch (error) {
          setResults(`Error running tests: ${error}\n${(error as any).stack}`);
        }
        setIsRunning(false);
      }, 100);
      
    } catch (error) {
      setResults(`Error loading test suite: ${error}`);
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Intent Resolution Test Runner (Simple)</h2>
      
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
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      <pre style={{
        padding: '15px',
        background: '#f5f5f5',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight: '600px',
        whiteSpace: 'pre-wrap'
      }}>
        {results || 'Click "Run Tests" to start'}
      </pre>
    </div>
  );
};

export default TestRunnerSimple;
import React, { useState } from 'react';
import { calculateResolution } from '../utils/resolutionEngine';

const TestRunnerMinimal: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runBasicTest = () => {
    setIsRunning(true);
    setResults('Running basic resolution test...\n\n');
    
    try {
      // Create a minimal test without loading any domains
      const mockNodes = {
        'test-action': {
          id: 'test-action',
          level: 'action' as const,
          label: 'Test Action',
          children: [],
          parents: [],
          products: ['test-product']
        }
      };
      
      const mockGraphOps = {
        getAncestors: () => [],
        getDescendants: () => [],
        getChildren: () => [],
        getParents: () => []
      };
      
      // Test basic resolution
      const resolution = calculateResolution(
        'test-action',
        null,
        false,
        false,
        [],
        mockNodes,
        {},
        mockGraphOps as any
      );
      
      setResults(prev => prev + 'Test completed successfully!\n\n');
      setResults(prev => prev + 'Resolution result:\n');
      setResults(prev => prev + JSON.stringify(resolution, null, 2));
      
    } catch (error) {
      setResults(`Error: ${error}\n\nStack trace:\n${(error as any).stack}`);
    }
    
    setIsRunning(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Minimal Test Runner</h2>
      <p>This runs a basic test without loading any domain configurations.</p>
      
      <button
        onClick={runBasicTest}
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
        {isRunning ? 'Running...' : 'Run Basic Test'}
      </button>
      
      <pre style={{
        padding: '15px',
        background: '#f5f5f5',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight: '400px'
      }}>
        {results || 'Click "Run Basic Test" to start'}
      </pre>
    </div>
  );
};

export default TestRunnerMinimal;
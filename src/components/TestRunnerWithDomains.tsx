import React, { useState } from 'react';
import { calculateResolution } from '../utils/resolutionEngine';
import { GraphOperations, convertLegacyNodes } from '../utils/graphModel';
import { 
  detectRationalizedGroups, 
  generateRationalizedAlternatives, 
  generateDuplicateNodes, 
  generateSharedNodes 
} from '../utils/automaticRationalization';

const TestRunnerWithDomains: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('cision');

  const runDomainTest = async () => {
    setIsRunning(true);
    setResults(`Loading ${selectedDomain} domain...\n\n`);
    
    try {
      // Dynamically load the selected domain
      const domainModule = await import(`../config/domains/${selectedDomain}`);
      
      setResults(prev => prev + `Domain loaded successfully\n`);
      
      // Process the domain
      const FUNCTIONAL_GRAPH = convertLegacyNodes(domainModule.FUNCTIONAL_NODES);
      const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);
      
      // Auto-generate rationalization data
      const rationalizedGroups = detectRationalizedGroups(domainModule.FUNCTIONAL_NODES);
      const RATIONALIZED_NODE_ALTERNATIVES = generateRationalizedAlternatives(rationalizedGroups);
      
      setResults(prev => prev + `Domain processed successfully\n`);
      setResults(prev => prev + `- Nodes: ${Object.keys(domainModule.FUNCTIONAL_NODES).length}\n`);
      setResults(prev => prev + `- Querys: ${domainModule.USER_QUERIES?.length || 0}\n`);
      setResults(prev => prev + `- Rationalized groups: ${Object.keys(RATIONALIZED_NODE_ALTERNATIVES).length}\n\n`);
      
      // Run a simple test
      const testQuery = domainModule.USER_QUERIES?.[0];
      if (testQuery) {
        setResults(prev => prev + `Testing query: "${testQuery.text}"\n`);
        setResults(prev => prev + `Entry node: ${testQuery.entryNode}\n\n`);
        
        const resolution = calculateResolution(
          testQuery.entryNode,
          null,
          false,
          false,
          [],
          domainModule.FUNCTIONAL_NODES,
          RATIONALIZED_NODE_ALTERNATIVES,
          graphOps
        );
        
        setResults(prev => prev + `Resolution result:\n`);
        setResults(prev => prev + `- Confidence: ${resolution.confidenceScore}\n`);
        setResults(prev => prev + `- Selected actions: ${resolution.selectedActions.length}\n`);
        setResults(prev => prev + `- Products: ${resolution.productActivation.map(p => p.product).join(', ')}\n`);
        setResults(prev => prev + `- Reasoning:\n`);
        resolution.reasoning.forEach(r => {
          setResults(prev => prev + `  • ${r}\n`);
        });
      } else {
        setResults(prev => prev + `No test querys found in this domain\n`);
      }
      
    } catch (error) {
      setResults(prev => prev + `\nError: ${error}\n\nStack trace:\n${(error as any).stack}`);
    }
    
    setIsRunning(false);
  };

  const domains = ['cision', 'healthcare', 'ecommerce', 'enterprise', 'financial'];

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Domain Test Runner</h2>
      <p>Test resolution with actual domain configurations.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Select Domain: </label>
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
        onClick={runDomainTest}
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
        {isRunning ? 'Running...' : `Test ${selectedDomain.toUpperCase()} Domain`}
      </button>
      
      <pre style={{
        padding: '15px',
        background: '#f5f5f5',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight: '500px',
        whiteSpace: 'pre-wrap'
      }}>
        {results || 'Select a domain and click the test button to start'}
      </pre>
    </div>
  );
};

export default TestRunnerWithDomains;
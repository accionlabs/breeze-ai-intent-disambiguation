import React, { useState } from 'react';
import { DomainValidator } from '../tests/domainValidation';

interface ValidationResultDisplay {
  domain: string;
  test: string;
  passed: boolean;
  errorCount: number;
  warningCount: number;
  errors: string[];
  warnings: string[];
}

interface DomainStatistics {
  totalNodes: number;
  nodesByLevel: Record<string, number>;
  uniqueNodes: number;
  sharedNodes: number;
  rationalizedNodes: number;
  duplicateLabels: number;
  products: string[];
  productDistribution: Record<string, number>;
  totalIntents: number;
  intentsByLevel: Record<string, number>;
  graphDepth: number;
  avgChildrenPerLevel: Record<string, number>;
}

const DomainValidation: React.FC = () => {
  const [results, setResults] = useState<ValidationResultDisplay[]>([]);
  const [statistics, setStatistics] = useState<Record<string, DomainStatistics>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [report, setReport] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const runValidation = async () => {
    setIsRunning(true);
    setResults([]);
    setStatistics({});
    setReport('');
    
    const validator = new DomainValidator();
    const allResults: ValidationResultDisplay[] = [];
    const domainData: Record<string, { nodes: any, intents: any[] }> = {};
    const domainStats: Record<string, DomainStatistics> = {};
    
    const domains = selectedDomain === 'all' 
      ? ['cision', 'healthcare', 'ecommerce', 'enterprise']
      : [selectedDomain];
    
    for (const domainName of domains) {
      try {
        // Load domain
        const domainModule = await import(`../config/domains/${domainName}`);
        
        // Store domain data for statistics
        domainData[domainName] = {
          nodes: domainModule.FUNCTIONAL_NODES || {},
          intents: domainModule.USER_INTENTS || []
        };
        
        // Generate statistics
        const stats = validator.gatherStatistics(
          domainName,
          domainModule.FUNCTIONAL_NODES || {},
          domainModule.USER_INTENTS || []
        );
        domainStats[domainName] = stats;
        
        // Run validation
        const domainResults = validator.validateDomain(
          domainName,
          domainModule.FUNCTIONAL_NODES,
          domainModule.USER_INTENTS,
          domainModule.RATIONALIZED_NODE_ALTERNATIVES
        );
        
        // Convert for display
        domainResults.forEach(r => {
          allResults.push({
            domain: domainName,
            test: r.test,
            passed: r.passed,
            errorCount: r.errors.length,
            warningCount: r.warnings.length,
            errors: r.errors,
            warnings: r.warnings
          });
        });
        
      } catch (error) {
        allResults.push({
          domain: domainName,
          test: 'Domain Loading',
          passed: false,
          errorCount: 1,
          warningCount: 0,
          errors: [`Failed to load domain: ${error}`],
          warnings: []
        });
      }
    }
    
    setResults(allResults);
    setStatistics(domainStats);
    setReport(validator.generateReport(allResults as any, domainData));
    setIsRunning(false);
  };

  const copyReport = () => {
    navigator.clipboard.writeText(report).then(() => {
      alert('Validation report copied to clipboard!');
    });
  };

  const domains = ['all', 'cision', 'healthcare', 'ecommerce', 'enterprise'];
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warningCount, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Domain Configuration Validator</h2>
      <p>Validate domain configurations for consistency and completeness.</p>
      
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
          
          <label style={{ marginLeft: '20px' }}>
            <input
              type="checkbox"
              checked={showDetails}
              onChange={(e) => setShowDetails(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show Details
          </label>
        </div>
        
        <button
          onClick={runValidation}
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
          {isRunning ? 'Validating...' : 'Run Validation'}
        </button>
        
        {results.length > 0 && (
          <span style={{ marginLeft: '20px', fontSize: '14px' }}>
            Results: {passedTests}/{totalTests} passed | 
            {totalErrors > 0 && <span style={{ color: '#d32f2f' }}> {totalErrors} errors</span>}
            {totalWarnings > 0 && <span style={{ color: '#ff9800' }}> {totalWarnings} warnings</span>}
          </span>
        )}
      </div>

      {results.length > 0 && (
        <div>
          {/* Domain Statistics Section */}
          {Object.keys(statistics).length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3>📊 Domain Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {Object.entries(statistics).map(([domain, stats]) => (
                  <div key={domain} style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '15px',
                    background: '#f9f9f9'
                  }}>
                    <h4 style={{ marginTop: 0, color: '#1976d2' }}>{domain.toUpperCase()}</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                      <div>
                        <strong>Total Nodes:</strong> {stats.totalNodes}
                      </div>
                      <div>
                        <strong>Graph Depth:</strong> {stats.graphDepth} levels
                      </div>
                      <div>
                        <strong>Products:</strong> {stats.products.join(', ')}
                      </div>
                      <div>
                        <strong>Total Intents:</strong> {stats.totalIntents}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                      <strong>Node Distribution:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px', fontSize: '13px' }}>
                        {Object.entries(stats.nodesByLevel).map(([level, count]) => (
                          <span key={level} style={{ 
                            background: '#e3f2fd', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            border: '1px solid #90caf9'
                          }}>
                            {level}: {count}
                            {stats.avgChildrenPerLevel[level] !== undefined && 
                              <span style={{ fontSize: '11px', color: '#666' }}> (avg {stats.avgChildrenPerLevel[level]})</span>
                            }
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                      <strong>Node Sharing:</strong>
                      <div style={{ fontSize: '13px', marginTop: '5px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                          <div>
                            <span style={{ color: '#4caf50' }}>●</span> Unique: {stats.uniqueNodes}
                          </div>
                          <div>
                            <span style={{ color: '#ff9800' }}>●</span> Shared: {stats.sharedNodes}
                          </div>
                          <div>
                            <span style={{ color: '#2196f3' }}>●</span> Rationalized: {stats.rationalizedNodes}
                          </div>
                          <div>
                            <span style={{ color: '#f44336' }}>●</span> Duplicates: {stats.duplicateLabels}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {Object.keys(stats.productDistribution).length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <strong>Product Coverage:</strong>
                        <div style={{ fontSize: '13px', marginTop: '5px' }}>
                          {Object.entries(stats.productDistribution).map(([product, count]) => {
                            const percentage = Math.round((count / stats.totalNodes) * 100);
                            return (
                              <div key={product} style={{ marginBottom: '3px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{product}:</span>
                                  <span>{count} ({percentage}%)</span>
                                </div>
                                <div style={{ 
                                  height: '4px', 
                                  background: '#e0e0e0', 
                                  borderRadius: '2px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{ 
                                    width: `${percentage}%`, 
                                    height: '100%', 
                                    background: '#4caf50',
                                    transition: 'width 0.3s'
                                  }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {stats.totalIntents > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <strong>Intent Distribution:</strong>
                        <div style={{ fontSize: '13px', marginTop: '5px' }}>
                          {Object.entries(stats.intentsByLevel).filter(([_, count]) => count > 0).map(([level, count]) => (
                            <div key={level}>
                              {level}: {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Validation Results</h3>
            <button
              onClick={copyReport}
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
              📋 Copy Report
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Domain</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>Test</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Errors</th>
                <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Warnings</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <React.Fragment key={idx}>
                  <tr style={{ background: r.passed ? '#e8f5e9' : '#ffebee' }}>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '12px' }}>{r.domain}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '12px' }}>{r.test}</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>
                      {r.passed ? '✅' : '❌'}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      border: '1px solid #ccc',
                      color: r.errorCount > 0 ? '#d32f2f' : '#4caf50',
                      fontWeight: r.errorCount > 0 ? 'bold' : 'normal'
                    }}>
                      {r.errorCount}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      border: '1px solid #ccc',
                      color: r.warningCount > 0 ? '#ff9800' : '#4caf50',
                      fontWeight: r.warningCount > 0 ? 'bold' : 'normal'
                    }}>
                      {r.warningCount}
                    </td>
                  </tr>
                  {showDetails && (r.errors.length > 0 || r.warnings.length > 0) && (
                    <tr>
                      <td colSpan={5} style={{ 
                        padding: '8px 8px 8px 40px', 
                        border: '1px solid #ccc',
                        background: '#f5f5f5',
                        fontSize: '11px'
                      }}>
                        {r.errors.length > 0 && (
                          <div style={{ marginBottom: r.warnings.length > 0 ? '8px' : 0 }}>
                            <strong style={{ color: '#d32f2f' }}>Errors:</strong>
                            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                              {r.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {r.warnings.length > 0 && (
                          <div>
                            <strong style={{ color: '#ff9800' }}>Warnings:</strong>
                            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                              {r.warnings.map((warn, i) => (
                                <li key={i}>{warn}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {report && (
            <details>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                <strong>Full Text Report</strong>
              </summary>
              <pre style={{
                padding: '15px',
                background: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '400px',
                fontSize: '12px'
              }}>
                {report}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainValidation;
import React, { useState } from 'react';
import NodeSearch from './NodeSearch';
import HierarchyVisualizationWithSearch from './HierarchyVisualizationWithSearch';
import { FUNCTIONAL_NODES } from '../config/domains/cision/nodes';
import { USER_QUERIES } from '../config/domains/cision/queries';
import { SearchResult } from '../utils/nodeSearch';
import './NodeSearchDemo.css';

const NodeSearchDemo: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState('cision');
  const [showVisualization, setShowVisualization] = useState(false);
  const [demoSearchResults, setDemoSearchResults] = useState<SearchResult[]>([]);

  // Example searches to demonstrate
  const exampleSearches = [
    { query: 'monitor', description: 'Find all monitoring-related nodes' },
    { query: 'crisis', description: 'Search for crisis management features' },
    { query: 'action-', description: 'Find all action nodes by ID prefix' },
    { query: 'Social', description: 'Search for social media features' },
    { query: 'verify', description: 'Find verification steps' },
  ];

  const handleSearchResults = (results: SearchResult[], expandNodes: Set<string>) => {
    setDemoSearchResults(results);
    console.log('Search Results:', results);
    console.log('Nodes to expand:', Array.from(expandNodes));
  };

  return (
    <div className="node-search-demo">
      <div className="demo-header">
        <h1>Node Search Facility Demo</h1>
        <p>
          Search through the functional graph using fuzzy matching, similar to intent resolution
          but focused on finding and displaying specific nodes.
        </p>
      </div>

      <div className="demo-content">
        {/* Standalone Search Demo */}
        <section className="demo-section">
          <h2>1. Standalone Node Search</h2>
          <p>Try searching for nodes by label, ID, or description:</p>
          
          <div className="search-container">
            <NodeSearch
              nodes={FUNCTIONAL_NODES}
              onSearchResults={handleSearchResults}
              onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
            />
          </div>

          {/* Example Searches */}
          <div className="example-searches">
            <h3>Example Searches:</h3>
            <div className="examples-grid">
              {exampleSearches.map((example, idx) => (
                <div key={idx} className="example-card">
                  <code className="example-query">{example.query}</code>
                  <span className="example-desc">{example.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Results Summary */}
          {demoSearchResults.length > 0 && (
            <div className="results-summary">
              <h3>Last Search Results:</h3>
              <ul className="results-list">
                {demoSearchResults.slice(0, 5).map((result, idx) => (
                  <li key={idx} className="result-item">
                    <span className="result-level" data-level={result.node.level}>
                      {result.node.level}
                    </span>
                    <span className="result-label">{result.node.label}</span>
                    <span className="result-score">
                      {Math.round(result.score * 100)}% match
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Integrated Visualization Demo */}
        <section className="demo-section">
          <h2>2. Search with Graph Visualization</h2>
          <p>
            Search nodes and see them highlighted in the graph with automatic tree expansion:
          </p>
          
          <button
            className="toggle-viz-button"
            onClick={() => setShowVisualization(!showVisualization)}
          >
            {showVisualization ? 'Hide' : 'Show'} Visualization with Search
          </button>

          {showVisualization && (
            <div className="visualization-container">
              <HierarchyVisualizationWithSearch
                FUNCTIONAL_NODES={FUNCTIONAL_NODES}
                showContext={false}
                showRationalized={true}
                showWorkflows={true}
              />
            </div>
          )}
        </section>

        {/* Feature Highlights */}
        <section className="demo-section">
          <h2>3. Search Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔍 Fuzzy Matching</h3>
              <p>
                Uses Levenshtein distance for fuzzy string matching,
                finding nodes even with typos or partial matches.
              </p>
            </div>
            
            <div className="feature-card">
              <h3>🎯 Multi-field Search</h3>
              <p>
                Search across node labels, IDs, and descriptions.
                Configure which fields to search in advanced options.
              </p>
            </div>
            
            <div className="feature-card">
              <h3>📊 Relevance Scoring</h3>
              <p>
                Results are scored and sorted by relevance.
                Exact matches rank higher than partial or fuzzy matches.
              </p>
            </div>
            
            <div className="feature-card">
              <h3>🌳 Auto-expansion</h3>
              <p>
                Automatically calculates the path from matched nodes to root,
                expanding the tree to show search results in context.
              </p>
            </div>
            
            <div className="feature-card">
              <h3>✨ Visual Highlighting</h3>
              <p>
                Matched nodes are highlighted in the graph with
                pulsing animations and increased opacity.
              </p>
            </div>
            
            <div className="feature-card">
              <h3>⚙️ Configurable Options</h3>
              <p>
                Adjust case sensitivity, fuzzy matching threshold,
                maximum results, and filter by level or product.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="demo-section">
          <h2>4. Technical Implementation</h2>
          <div className="implementation-details">
            <h3>Key Components:</h3>
            <ul>
              <li><code>NodeSearch.tsx</code> - Main search UI component</li>
              <li><code>nodeSearch.ts</code> - Search algorithms and utilities</li>
              <li><code>HierarchyVisualizationWithSearch.tsx</code> - Integration wrapper</li>
            </ul>
            
            <h3>Search Algorithm:</h3>
            <ol>
              <li>Normalize search query based on case sensitivity setting</li>
              <li>Iterate through all nodes applying filters (level, product)</li>
              <li>Calculate similarity scores for each configured field</li>
              <li>Apply fuzzy matching using Levenshtein distance</li>
              <li>Filter results by minimum score threshold</li>
              <li>Sort by relevance (exact &gt; partial &gt; fuzzy)</li>
              <li>Calculate expansion paths from matches to root</li>
              <li>Return results with metadata for visualization</li>
            </ol>
            
            <h3>Integration Points:</h3>
            <p>
              The search facility can be integrated with any graph visualization
              by passing search results and expansion paths. The visualization
              component handles highlighting and tree expansion based on these inputs.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NodeSearchDemo;
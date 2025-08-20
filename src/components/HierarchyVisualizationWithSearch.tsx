import React, { useState, useCallback, useMemo } from 'react';
import HierarchyVisualization from './HierarchyVisualization';
import NodeSearch from './NodeSearch';
import { FunctionalNode, UserContext, Resolution } from '../types';
import { SearchResult } from '../utils/nodeSearch';
import './HierarchyVisualizationWithSearch.css';

interface HierarchyVisualizationWithSearchProps {
  FUNCTIONAL_NODES: Record<string, FunctionalNode>;
  selectedQuery?: string;
  entryNode?: string;
  resolution?: Resolution;
  userContext?: UserContext;
  showContext: boolean;
  showOverlaps?: boolean;
  showRationalized?: boolean;
  showWorkflows?: boolean;
  recentActions?: any[];
  domainConfig?: any;
}

const HierarchyVisualizationWithSearch: React.FC<HierarchyVisualizationWithSearchProps> = ({
  FUNCTIONAL_NODES,
  selectedQuery,
  entryNode,
  resolution,
  userContext,
  showContext,
  showOverlaps = false,
  showRationalized = true,
  showWorkflows = false,
  recentActions = [],
  domainConfig,
}) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [expandedNodesFromSearch, setExpandedNodesFromSearch] = useState<Set<string>>(new Set());
  const [selectedSearchNode, setSelectedSearchNode] = useState<string | undefined>();
  const [showSearch, setShowSearch] = useState(false);

  // Handle search results
  const handleSearchResults = useCallback((results: SearchResult[], expandNodes: Set<string>) => {
    setSearchResults(results);
    setHighlightedNodes(new Set(results.map(r => r.nodeId)));
    setExpandedNodesFromSearch(expandNodes);
    
    // If there's exactly one result, select it
    if (results.length === 1) {
      setSelectedSearchNode(results[0].nodeId);
    } else {
      setSelectedSearchNode(undefined);
    }
  }, []);

  // Handle node selection from search
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedSearchNode(nodeId);
    setHighlightedNodes(new Set([nodeId]));
    
    // Scroll to the node in the visualization (if we had a ref to the viz)
    // This could be enhanced with a ref to the visualization component
  }, []);

  // Create a modified nodes object with search highlighting
  const enhancedNodes = useMemo(() => {
    if (highlightedNodes.size === 0) {
      return FUNCTIONAL_NODES;
    }

    // Clone the nodes and add highlighting metadata
    const enhanced: Record<string, FunctionalNode> = {};
    Object.entries(FUNCTIONAL_NODES).forEach(([id, node]) => {
      enhanced[id] = {
        ...node,
        // Add custom metadata for highlighting
        _highlighted: highlightedNodes.has(id),
        _selected: selectedSearchNode === id,
      } as FunctionalNode;
    });
    
    return enhanced;
  }, [FUNCTIONAL_NODES, highlightedNodes, selectedSearchNode]);

  // Override entry node if search selected a specific node
  const effectiveEntryNode = selectedSearchNode || entryNode;

  // Combine expanded nodes from search with regular expansion
  const combinedExpandedNodes = useMemo(() => {
    // This would need to be integrated with the HierarchyVisualization's internal state
    // For now, we pass it as a prop hint
    return expandedNodesFromSearch;
  }, [expandedNodesFromSearch]);

  return (
    <div className="hierarchy-with-search">
      {/* Search Toggle Button */}
      <button
        className="search-toggle-button"
        onClick={() => setShowSearch(!showSearch)}
        title="Toggle Node Search"
      >
        🔍 {showSearch ? 'Hide' : 'Show'} Search
      </button>

      {/* Search Interface */}
      {showSearch && (
        <div className="search-panel">
          <NodeSearch
            nodes={FUNCTIONAL_NODES}
            onSearchResults={handleSearchResults}
            onNodeSelect={handleNodeSelect}
          />
          
          {/* Search Status */}
          {searchResults.length > 0 && (
            <div className="search-status">
              <span className="status-text">
                {searchResults.length} node{searchResults.length !== 1 ? 's' : ''} found
              </span>
              {selectedSearchNode && (
                <span className="selected-node">
                  Selected: {FUNCTIONAL_NODES[selectedSearchNode]?.label}
                </span>
              )}
              <button
                className="clear-search-button"
                onClick={() => {
                  setSearchResults([]);
                  setHighlightedNodes(new Set());
                  setExpandedNodesFromSearch(new Set());
                  setSelectedSearchNode(undefined);
                }}
              >
                Clear Results
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modified Hierarchy Visualization */}
      <div className={`visualization-wrapper ${highlightedNodes.size > 0 ? 'has-search-results' : ''}`}>
        <HierarchyVisualization
          selectedQuery={selectedQuery}
          entryNode={effectiveEntryNode}
          resolution={resolution}
          userContext={userContext}
          showContext={showContext}
          showOverlaps={showOverlaps}
          showRationalized={showRationalized}
          showWorkflows={showWorkflows}
          recentActions={recentActions}
          domainConfig={domainConfig}
          expansionMode="multiple" // Allow multiple expansions for search
          // We would need to modify HierarchyVisualization to accept these:
          // searchHighlightedNodes={highlightedNodes}
          // searchExpandedNodes={combinedExpandedNodes}
          // onNodeClick={handleNodeSelect}
        />
      </div>

      {/* Search Result Details Panel */}
      {selectedSearchNode && FUNCTIONAL_NODES[selectedSearchNode] && (
        <div className="search-details-panel">
          <h3>Selected Node Details</h3>
          <div className="node-details">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{selectedSearchNode}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Label:</span>
              <span className="detail-value">{FUNCTIONAL_NODES[selectedSearchNode].label}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Level:</span>
              <span className="detail-value level-badge" data-level={FUNCTIONAL_NODES[selectedSearchNode].level}>
                {FUNCTIONAL_NODES[selectedSearchNode].level}
              </span>
            </div>
            {FUNCTIONAL_NODES[selectedSearchNode].products && (
              <div className="detail-row">
                <span className="detail-label">Products:</span>
                <span className="detail-value">
                  {FUNCTIONAL_NODES[selectedSearchNode].products?.join(', ')}
                </span>
              </div>
            )}
            {FUNCTIONAL_NODES[selectedSearchNode].description && (
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">
                  {FUNCTIONAL_NODES[selectedSearchNode].description}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Children:</span>
              <span className="detail-value">
                {FUNCTIONAL_NODES[selectedSearchNode].children.length} node(s)
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Parents:</span>
              <span className="detail-value">
                {FUNCTIONAL_NODES[selectedSearchNode].parents.length} node(s)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchyVisualizationWithSearch;
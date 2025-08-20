import React, { useState, useEffect, useCallback } from 'react';
import { FunctionalNode } from '../types';
import { searchNodes, getExpansionPaths, getSuggestedSearches, SearchResult, SearchOptions } from '../utils/nodeSearch';
import './NodeSearch.css';

interface NodeSearchProps {
  nodes: Record<string, FunctionalNode>;
  onSearchResults?: (results: SearchResult[], expandNodes: Set<string>) => void;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
}

const NodeSearch: React.FC<NodeSearchProps> = ({ 
  nodes, 
  onSearchResults, 
  onNodeSelect,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Search options state
  const [searchOptions, setSearchOptions] = useState<Partial<SearchOptions>>({
    searchIn: ['label', 'id', 'description'],
    fuzzyMatch: true,
    caseSensitive: false,
    maxResults: 10
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get suggestions on mount
  useEffect(() => {
    setSuggestions(getSuggestedSearches(nodes, 5));
  }, [nodes]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      if (onSearchResults) {
        onSearchResults([], new Set());
      }
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchOptions, nodes]);

  const performSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Perform the search
    const results = searchNodes(searchQuery, nodes, searchOptions);
    setSearchResults(results);
    setShowResults(true);
    setSelectedIndex(-1);
    
    // Get expansion paths
    const expansionPaths = getExpansionPaths(results);
    
    // Notify parent
    if (onSearchResults) {
      onSearchResults(results, expansionPaths);
    }
    
    setIsSearching(false);
  }, [searchQuery, nodes, searchOptions, onSearchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultClick(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery(result.node.label);
    setShowResults(false);
    
    // Trigger final search to expand tree
    const finalResults = searchNodes(result.node.label, nodes, searchOptions);
    const expansionPaths = getExpansionPaths(finalResults);
    
    if (onSearchResults) {
      onSearchResults(finalResults, expansionPaths);
    }
    
    if (onNodeSelect) {
      onNodeSelect(result.nodeId);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    if (onSearchResults) {
      onSearchResults([], new Set());
    }
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      product: '#e74c3c',
      workflow: '#9b59b6',
      outcome: '#3498db',
      scenario: '#2ecc71',
      step: '#f39c12',
      action: '#95a5a6'
    };
    return colors[level] || '#7f8c8d';
  };

  const getMatchBadgeColor = (matchType: string): string => {
    switch (matchType) {
      case 'exact': return '#27ae60';
      case 'partial': return '#f39c12';
      case 'fuzzy': return '#3498db';
      default: return '#95a5a6';
    }
  };

  return (
    <div className={`node-search-container ${className}`}>
      <div className="search-header">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search nodes by label, ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          {searchQuery && (
            <button className="clear-button" onClick={clearSearch}>
              ✕
            </button>
          )}
          {isSearching && <span className="search-spinner">⟳</span>}
        </div>
        
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          ⚙️ {showAdvanced ? 'Hide' : 'Show'} Options
        </button>
      </div>

      {/* Suggestions */}
      {!searchQuery && suggestions.length > 0 && (
        <div className="search-suggestions">
          <span className="suggestions-label">Try searching for:</span>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="search-options">
          <div className="option-group">
            <label>Search in:</label>
            <div className="checkbox-group">
              {(['label', 'id', 'description'] as const).map(field => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchOptions.searchIn?.includes(field) ?? false}
                    onChange={(e) => {
                      const newSearchIn = e.target.checked
                        ? [...(searchOptions.searchIn || []), field]
                        : (searchOptions.searchIn || []).filter(f => f !== field);
                      setSearchOptions({ ...searchOptions, searchIn: newSearchIn });
                    }}
                  />
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              ))}
            </div>
          </div>
          
          <div className="option-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={searchOptions.fuzzyMatch ?? true}
                onChange={(e) => setSearchOptions({ ...searchOptions, fuzzyMatch: e.target.checked })}
              />
              Fuzzy matching
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={searchOptions.caseSensitive ?? false}
                onChange={(e) => setSearchOptions({ ...searchOptions, caseSensitive: e.target.checked })}
              />
              Case sensitive
            </label>
          </div>
          
          <div className="option-group">
            <label>
              Max results:
              <input
                type="number"
                min="1"
                max="50"
                value={searchOptions.maxResults || 10}
                onChange={(e) => setSearchOptions({ ...searchOptions, maxResults: parseInt(e.target.value) || 10 })}
                className="number-input"
              />
            </label>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </div>
          <div className="results-list">
            {searchResults.map((result, idx) => (
              <div
                key={result.nodeId}
                className={`search-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="result-main">
                  <span 
                    className="result-level"
                    style={{ backgroundColor: getLevelColor(result.node.level) }}
                  >
                    {result.node.level}
                  </span>
                  <span className="result-label">{result.node.label}</span>
                  <span 
                    className="match-badge"
                    style={{ backgroundColor: getMatchBadgeColor(result.matchType) }}
                  >
                    {result.matchType}
                  </span>
                  <span className="match-score">
                    {Math.round(result.score * 100)}%
                  </span>
                </div>
                
                <div className="result-details">
                  <span className="result-id">{result.nodeId}</span>
                  {result.node.products && result.node.products.length > 0 && (
                    <span className="result-products">
                      Products: {result.node.products.join(', ')}
                    </span>
                  )}
                  {result.matchedFields.length > 0 && (
                    <span className="matched-fields">
                      Matched in: {result.matchedFields.join(', ')}
                    </span>
                  )}
                </div>
                
                {result.node.description && (
                  <div className="result-description">
                    {result.node.description}
                  </div>
                )}
                
                <div className="result-path">
                  Path: {result.pathToRoot.map(id => nodes[id]?.label || id).join(' → ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="no-results">
          No nodes found matching "{searchQuery}"
          <div className="no-results-hint">
            Try adjusting your search terms or enabling fuzzy matching
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeSearch;
// Node search utilities for finding and highlighting nodes in the functional graph
import { FunctionalNode } from '../types';

export interface SearchResult {
  nodeId: string;
  node: FunctionalNode;
  score: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
  matchedFields: string[];
  pathToRoot: string[]; // Path from matched node to root for expansion
}

export interface SearchOptions {
  searchIn: ('label' | 'id' | 'description')[];
  caseSensitive?: boolean;
  fuzzyMatch?: boolean;
  minScore?: number;
  maxResults?: number;
  levelFilter?: string[]; // Filter by node levels
  productFilter?: string[]; // Filter by products
}

const DEFAULT_OPTIONS: SearchOptions = {
  searchIn: ['label', 'id', 'description'],
  caseSensitive: false,
  fuzzyMatch: true,
  minScore: 0.3,
  maxResults: 20,
  levelFilter: [],
  productFilter: []
};

// Calculate similarity score between two strings (0-1)
function calculateSimilarity(str1: string, str2: string, caseSensitive: boolean = false): number {
  const s1 = caseSensitive ? str1 : str1.toLowerCase();
  const s2 = caseSensitive ? str2 : str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    return 0.7 + (0.3 * (shorter.length / longer.length));
  }
  
  // Word-based matching
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  let matchedWords = 0;
  
  for (const word2 of words2) {
    if (words1.some(word1 => word1.includes(word2) || word2.includes(word1))) {
      matchedWords++;
    }
  }
  
  if (matchedWords > 0) {
    return 0.4 + (0.3 * (matchedWords / Math.max(words1.length, words2.length)));
  }
  
  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - (distance / maxLen));
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  
  return dp[m][n];
}

// Find path from node to root (for tree expansion)
function findPathToRoot(
  nodeId: string,
  nodes: Record<string, FunctionalNode>,
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);
  
  const node = nodes[nodeId];
  if (!node) return [];
  
  // If this is a root node (product or workflow), return just this node
  if (node.level === 'product' || node.level === 'workflow') {
    return [nodeId];
  }
  
  // If node has parents, traverse up
  if (node.parents && node.parents.length > 0) {
    // Use the first parent (could be enhanced to find shortest path)
    const parentPath = findPathToRoot(node.parents[0], nodes, visited);
    return [...parentPath, nodeId];
  }
  
  // Orphaned node - return just this node
  return [nodeId];
}

// Search for nodes matching the query
export function searchNodes(
  query: string,
  nodes: Record<string, FunctionalNode>,
  options: Partial<SearchOptions> = {}
): SearchResult[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const results: SearchResult[] = [];
  const searchQuery = opts.caseSensitive ? query.trim() : query.trim().toLowerCase();
  
  // Search through all nodes
  Object.entries(nodes).forEach(([nodeId, node]) => {
    // Apply level filter
    if (opts.levelFilter && opts.levelFilter.length > 0) {
      if (!opts.levelFilter.includes(node.level)) {
        return;
      }
    }
    
    // Apply product filter
    if (opts.productFilter && opts.productFilter.length > 0) {
      if (!node.products || !node.products.some(p => opts.productFilter!.includes(p))) {
        return;
      }
    }
    
    let bestScore = 0;
    let matchType: 'exact' | 'partial' | 'fuzzy' = 'fuzzy';
    const matchedFields: string[] = [];
    
    // Search in specified fields
    for (const field of opts.searchIn) {
      let fieldValue = '';
      
      switch (field) {
        case 'label':
          fieldValue = node.label || '';
          break;
        case 'id':
          fieldValue = node.id || '';
          break;
        case 'description':
          fieldValue = node.description || '';
          break;
      }
      
      if (!fieldValue) continue;
      
      const score = calculateSimilarity(fieldValue, searchQuery, opts.caseSensitive);
      
      if (score > bestScore) {
        bestScore = score;
        
        // Determine match type
        const fv = opts.caseSensitive ? fieldValue : fieldValue.toLowerCase();
        const sq = searchQuery;
        
        if (fv === sq) {
          matchType = 'exact';
        } else if (fv.includes(sq) || sq.includes(fv)) {
          matchType = 'partial';
        } else {
          matchType = 'fuzzy';
        }
      }
      
      if (score >= opts.minScore!) {
        matchedFields.push(field);
      }
    }
    
    // Add to results if score meets threshold
    if (bestScore >= opts.minScore! && matchedFields.length > 0) {
      const pathToRoot = findPathToRoot(nodeId, nodes);
      
      results.push({
        nodeId,
        node,
        score: bestScore,
        matchType,
        matchedFields,
        pathToRoot
      });
    }
  });
  
  // Sort by score (highest first)
  results.sort((a, b) => {
    // Prioritize exact matches
    if (a.matchType === 'exact' && b.matchType !== 'exact') return -1;
    if (b.matchType === 'exact' && a.matchType !== 'exact') return 1;
    
    // Then by score
    return b.score - a.score;
  });
  
  // Limit results
  if (opts.maxResults && opts.maxResults > 0) {
    return results.slice(0, opts.maxResults);
  }
  
  return results;
}

// Get all unique paths that need to be expanded to show search results
export function getExpansionPaths(results: SearchResult[]): Set<string> {
  const expansionNodes = new Set<string>();
  
  results.forEach(result => {
    // Add all nodes in the path to root
    result.pathToRoot.forEach(nodeId => {
      expansionNodes.add(nodeId);
    });
    
    // Also add the matched node itself
    expansionNodes.add(result.nodeId);
  });
  
  return expansionNodes;
}

// Get suggested searches based on current nodes
export function getSuggestedSearches(
  nodes: Record<string, FunctionalNode>,
  limit: number = 5
): string[] {
  const suggestions: string[] = [];
  const levels = ['action', 'step', 'scenario', 'outcome'];
  const nodesByLevel: Record<string, string[]> = {
    action: [],
    step: [],
    scenario: [],
    outcome: []
  };
  
  // Group nodes by level
  Object.values(nodes).forEach(node => {
    if (levels.includes(node.level)) {
      nodesByLevel[node.level].push(node.label);
    }
  });
  
  // Get a sample from each level
  levels.forEach(level => {
    const levelNodes = nodesByLevel[level];
    if (levelNodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * levelNodes.length);
      suggestions.push(levelNodes[randomIndex]);
    }
  });
  
  // Add some common search terms
  const commonTerms = ['verify', 'monitor', 'analyze', 'report', 'manage'];
  commonTerms.forEach(term => {
    if (suggestions.length < limit) {
      // Check if any node contains this term
      const hasMatch = Object.values(nodes).some(node => 
        node.label.toLowerCase().includes(term.toLowerCase())
      );
      if (hasMatch) {
        suggestions.push(term);
      }
    }
  });
  
  return suggestions.slice(0, limit);
}
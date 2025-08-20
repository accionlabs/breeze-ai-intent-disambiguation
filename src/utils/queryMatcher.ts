import { FUNCTIONAL_NODES, FunctionalNode, PRODUCT_CODES, DOMAIN_SYNONYMS, WORD_FORMS } from '../config';

// Context for domain-specific matching
export interface MatchContext {
  nodes?: Record<string, FunctionalNode>;
  synonyms?: Record<string, string[]>;
  wordForms?: Record<string, string>;
  productCodes?: readonly string[];
}

// Use domain-specific synonyms from config

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  if (m === 0) return n;
  if (n === 0) return m;
  
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
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

// Simple stemming function (removes common suffixes)
function stem(word: string, wordForms?: Record<string, string>): string {
  const lower = word.toLowerCase();
  
  // Use word forms from context or config
  const forms = wordForms || WORD_FORMS;
  if (forms[lower]) {
    return forms[lower];
  }
  
  // Remove common suffixes
  const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'ness', 'ment', 's', 'es'];
  for (const suffix of suffixes) {
    if (lower.endsWith(suffix) && lower.length > suffix.length + 2) {
      return lower.slice(0, -suffix.length);
    }
  }
  
  return lower;
}

// Check if two words are synonyms
function areSynonyms(word1: string, word2: string, domainSynonyms?: Record<string, string[]>): boolean {
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();
  
  // Use synonyms from context or config
  const synonyms = domainSynonyms || DOMAIN_SYNONYMS;
  
  // Check direct synonym relationship
  for (const [key, syns] of Object.entries(synonyms)) {
    const allWords = [key, ...(syns as string[])];
    if (allWords.includes(w1) && allWords.includes(w2)) {
      return true;
    }
  }
  
  return false;
}

// Calculate word similarity score
function wordSimilarity(word1: string, word2: string, context?: MatchContext): number {
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();
  
  // Exact match
  if (w1 === w2) return 1.0;
  
  // Check stems
  if (stem(w1, context?.wordForms) === stem(w2, context?.wordForms)) return 0.8;
  
  // Check synonyms
  if (areSynonyms(w1, w2, context?.synonyms)) return 0.7;
  
  // Check Levenshtein distance for typos (threshold: 2 edits for words > 4 chars)
  const distance = levenshteinDistance(w1, w2);
  const maxLen = Math.max(w1.length, w2.length);
  
  if (maxLen > 4 && distance <= 2) {
    return 0.5 * (1 - distance / maxLen);
  }
  
  return 0;
}

// Tokenize and clean input text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0)
    .filter(word => !['i', 'want', 'to', 'need', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'for', 'with', 'from', 'by', 'about', 'my', 'our', 'we'].includes(word));
}

export interface MatchResult {
  nodeId: string;
  node: FunctionalNode;
  score: number;
  matchedWords: string[];
  confidence: 'high' | 'medium' | 'low';
}

// Main function to find best matching nodes
export function findBestMatches(inputText: string, topN: number = 5, context?: MatchContext): MatchResult[] {
  const inputTokens = tokenize(inputText);
  
  if (inputTokens.length === 0) {
    return [];
  }
  
  const results: MatchResult[] = [];
  
  // Use provided nodes or fall back to global FUNCTIONAL_NODES
  const nodesToSearch = context?.nodes || FUNCTIONAL_NODES;
  
  // Score each node
  for (const [nodeId, node] of Object.entries(nodesToSearch) as [string, FunctionalNode][]) {
    if (!node) continue;
    
    const nodeTokens = tokenize(node.label);
    let totalScore = 0;
    const matchedWords: string[] = [];
    
    // Track which node tokens have been matched to avoid double-counting
    const usedNodeTokens = new Set<string>();
    let exactMatches = 0;
    let stemMatches = 0;
    let synonymMatches = 0;
    
    // Calculate similarity for each input token
    for (const inputToken of inputTokens) {
      let bestWordScore = 0;
      let bestMatch = '';
      let bestNodeToken = '';
      let matchType = '';
      
      for (const nodeToken of nodeTokens) {
        // Skip if this node token was already matched
        if (usedNodeTokens.has(nodeToken)) continue;
        
        const similarity = wordSimilarity(inputToken, nodeToken, context);
        if (similarity > bestWordScore) {
          bestWordScore = similarity;
          bestMatch = nodeToken;
          bestNodeToken = nodeToken;
          // Determine match type
          if (inputToken.toLowerCase() === nodeToken.toLowerCase()) {
            matchType = 'exact';
          } else if (stem(inputToken, context?.wordForms) === stem(nodeToken, context?.wordForms)) {
            matchType = 'stem';
          } else if (areSynonyms(inputToken, nodeToken, context?.synonyms)) {
            matchType = 'synonym';
          } else {
            matchType = 'fuzzy';
          }
        }
      }
      
      if (bestWordScore > 0) {
        totalScore += bestWordScore;
        matchedWords.push(bestMatch);
        if (bestNodeToken) {
          usedNodeTokens.add(bestNodeToken);
        }
        // Count match types
        if (matchType === 'exact') exactMatches++;
        else if (matchType === 'stem') stemMatches++;
        else if (matchType === 'synonym') synonymMatches++;
      }
    }
    
    // Calculate base normalized score
    const normalizedScore = totalScore / inputTokens.length;
    
    // Strong bonus for exact matches over synonyms
    const exactMatchBonus = (exactMatches / inputTokens.length) * 0.15;
    
    // Small penalty for synonym matches to differentiate from exact matches
    const synonymPenalty = (synonymMatches / inputTokens.length) * -0.05;
    
    // Bonus for matching multiple words (compound match bonus)
    const matchRatio = matchedWords.length / inputTokens.length;
    const compoundBonus = matchRatio > 0.5 ? (matchRatio - 0.5) * 0.1 : 0;
    
    // Bonus for exact phrase match
    const inputPhrase = inputTokens.join(' ');
    const nodePhrase = nodeTokens.join(' ');
    const orderBonus = nodePhrase.toLowerCase() === inputPhrase.toLowerCase() ? 0.2 : 
                       nodePhrase.toLowerCase().includes(inputPhrase.toLowerCase()) ? 0.1 : 0;
    
    // Apply level-based boost
    let levelBoost = 0;
    if (node.level === 'action') levelBoost = 0.1;  // Prefer specific actions
    else if (node.level === 'step') levelBoost = 0.05;
    
    const finalScore = Math.min(1.0, normalizedScore + exactMatchBonus + synonymPenalty + compoundBonus + orderBonus + levelBoost);
    
    // Only include nodes with meaningful scores
    if (finalScore > 0.2) {
      results.push({
        nodeId,
        node,
        score: finalScore,
        matchedWords,
        confidence: finalScore > 0.7 ? 'high' : finalScore > 0.4 ? 'medium' : 'low'
      });
    }
  }
  
  // Sort by score and return top N
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topN);
}

// Function to get a single best match
export function findBestMatch(inputText: string, context?: MatchContext): MatchResult | null {
  const matches = findBestMatches(inputText, 1, context);
  return matches.length > 0 ? matches[0] : null;
}

// Generate query from user input
export interface GeneratedQuery {
  id: string;
  text: string;
  entryNode: string;
  matchConfidence: number;
  matchedNodeLabel: string;
  isAmbiguous?: boolean;  // Indicates if this maps to overlapping functions
  alternativeMatches?: Array<{
    nodeId: string;
    label: string;
    score: number;
  }>;
}

// Export the match results for use in resolution
export function getTopMatches(inputText: string, limit: number = 10, context?: MatchContext): MatchResult[] {
  return findBestMatches(inputText, limit, context);
}

export function generateQueryFromText(inputText: string, showRationalized: boolean = true, context?: MatchContext): GeneratedQuery | null {
  const matches = findBestMatches(inputText, 10, context);  // Get more matches to check for duplicates
  
  if (matches.length === 0) {
    return null;
  }
  
  const bestMatch = matches[0];
  
  // When rationalization is OFF, check if there are multiple nodes with the same label (overlapping functions)
  let isAmbiguous = false;
  if (!showRationalized) {
    // Check if multiple nodes have the same label (indicating duplicate functionality)
    const labelGroups: Record<string, MatchResult[]> = {};
    
    // Group top matches by their label
    matches.slice(0, 5).forEach((match: any) => {
      const label = match.node.label.toLowerCase();
      if (!labelGroups[label]) {
        labelGroups[label] = [];
      }
      labelGroups[label].push(match);
    });
    
    // Check if the best match's label appears in multiple nodes with high scores
    const bestMatchLabel = bestMatch.node.label.toLowerCase();
    const sameLabelMatches = labelGroups[bestMatchLabel];
    
    if (sameLabelMatches && sameLabelMatches.length > 1) {
      // Check if these are from different products (indicating overlap)
      const products = new Set<string>();
      sameLabelMatches.forEach((match: any) => {
        // Check if node has different product suffixes or is shared
        const productCodes = context?.productCodes || PRODUCT_CODES;
        productCodes.forEach((productCode: string) => {
          if (match.nodeId.includes(`-${productCode}`)) {
            products.add(productCode);
          }
        });
        if (match.nodeId.includes('-shared')) products.add('shared');
      });
      
      // If we have multiple products or a shared node, it's ambiguous
      if (products.size > 1 || products.has('shared')) {
        // Find the shared node if it exists
        const sharedNode = sameLabelMatches.find(m => m.nodeId.includes('-shared'));
        
        if (sharedNode) {
          // Return the shared node (which will fail resolution when rationalization is OFF)
          return {
            id: `user-typed-${Date.now()}`,
            text: inputText,
            entryNode: sharedNode.nodeId,
            matchConfidence: sharedNode.score,
            matchedNodeLabel: sharedNode.node.label,
            isAmbiguous: true,
            alternativeMatches: sameLabelMatches
              .filter((m: any) => m.nodeId !== sharedNode.nodeId)
              .map((m: any) => ({
                nodeId: m.nodeId,
                label: m.node.label,
                score: m.score
              }))
          };
        }
      }
    }
    
    // Also check the old logic for base function grouping
    // Group matches by their base function (removing product suffixes)
    const functionGroups: Record<string, MatchResult[]> = {};
    
    matches.forEach((match: any) => {
      // Extract base function name (e.g., "media-monitoring" from "scenario-media-monitoring-cision")
      const nodeId = match.nodeId;
      let baseFunction = nodeId;
      
      // Remove product suffixes
      const productCodes = context?.productCodes || PRODUCT_CODES;
      const productSuffixes = productCodes.map((code: string) => `-${code}`);
      productSuffixes.forEach((suffix: string) => {
        if (nodeId.endsWith(suffix)) {
          baseFunction = nodeId.slice(0, -suffix.length);
        }
      });
      
      if (!functionGroups[baseFunction]) {
        functionGroups[baseFunction] = [];
      }
      functionGroups[baseFunction].push(match);
    });
    
    // Check if the best match's function group has multiple product variants with similar scores
    const bestMatchBase = Object.keys(functionGroups).find(base => 
      functionGroups[base].some(m => m.nodeId === bestMatch.nodeId)
    );
    
    if (bestMatchBase && functionGroups[bestMatchBase].length > 1) {
      // Check if the scores are similar (within 10% of each other)
      const scores = functionGroups[bestMatchBase].map((m: any) => m.score);
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      
      if (maxScore - minScore < 0.1) {
        // Similar scores across multiple products = ambiguous
        isAmbiguous = true;
        
        // When rationalization is OFF, we should:
        // 1. First check if there's a shared node - if so, use it (will fail resolution)
        // 2. Otherwise, use the first product-specific match
        const sharedNode = functionGroups[bestMatchBase].find(m => m.nodeId.includes('-shared'));
        
        if (sharedNode) {
          // Return the shared node but mark it as ambiguous
          // This will trigger context-based resolution in calculateResolution
          return {
            id: `user-typed-${Date.now()}`,
            text: inputText,
            entryNode: sharedNode.nodeId,
            matchConfidence: sharedNode.score,
            matchedNodeLabel: sharedNode.node.label,
            isAmbiguous: true,
            alternativeMatches: functionGroups[bestMatchBase]
              .filter((m: any) => m.nodeId !== sharedNode.nodeId)
              .map((m: any) => ({
                nodeId: m.nodeId,
                label: m.node.label,
                score: m.score
              }))
          };
        }
      }
    }
  }
  
  return {
    id: `user-typed-${Date.now()}`,
    text: inputText,
    entryNode: bestMatch.nodeId,
    matchConfidence: bestMatch.score,
    matchedNodeLabel: bestMatch.node.label,
    isAmbiguous: isAmbiguous,
    alternativeMatches: matches.slice(1, 4).map((m: any) => ({  // Only top 3 alternatives
      nodeId: m.nodeId,
      label: m.node.label,
      score: m.score
    }))
  };
}
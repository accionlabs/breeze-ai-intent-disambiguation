import React, { useState, useMemo, useEffect } from 'react';
import UserContextBar from '../components/UserContextBar';
import QueryExamples from '../components/QueryExamples';
import HierarchyVisualization, { ExpansionMode } from '../components/HierarchyVisualization';
import ResolutionComparison from '../components/ResolutionComparison';
import { GeneratedQuery, getTopMatches } from '../utils/queryMatcher';
import { useDomainConfig } from '../hooks/useDomainConfig';
import { calculateResolution, RecentAction } from '../utils/resolutionEngine';
import { processRationalization } from '../utils/rationalizationProcessor';
import {
  Resolution,
  UserContext,
  DISPLAY_LIMITS,
  UI_LAYOUT,
  BUTTON_COLORS
} from '../config';

// RecentAction interface is now imported from resolutionEngine

const QueryDisambiguationSection: React.FC = () => {
  const domainConfig = useDomainConfig();
  const [selectedQuery, setSelectedQuery] = useState<string | undefined>();
  const [currentContextId, setCurrentContextId] = useState<string | null>(null);
  const [showContext, setShowContext] = useState<boolean>(false);
  const [expansionMode, setExpansionMode] = useState<ExpansionMode>('multiple');
  const [showOverlaps, setShowOverlaps] = useState<boolean>(false);
  const [showRationalized, setShowRationalized] = useState<boolean>(false);
  const [showWorkflows, setShowWorkflows] = useState<boolean>(false);
  // Store recent actions per persona
  const [recentActionsByPersona, setRecentActionsByPersona] = useState<Record<string, RecentAction[]>>({});
  const [selectedRecentAction, setSelectedRecentAction] = useState<RecentAction | null>(null);
  const [graphStateVersion, setGraphStateVersion] = useState<number>(0);
  const [generatedQuery, setGeneratedQuery] = useState<GeneratedQuery | null>(null);
  const [lastTrackedQuery, setLastTrackedQuery] = useState<string | undefined>();

  // Clear selected recent action when graph state changes
  useEffect(() => {
    setSelectedRecentAction(null);
    setGraphStateVersion(prev => prev + 1);
  }, [showRationalized, showWorkflows]);

  // Set initial context based on domain
  useEffect(() => {
    if (domainConfig && !currentContextId) {
      const firstContextId = Object.keys(domainConfig.SAMPLE_CONTEXTS)[0];
      setCurrentContextId(firstContextId);
    }
  }, [domainConfig, currentContextId]);

  // Get config values (with defaults to avoid hooks after return)
  const USER_QUERIES = domainConfig?.USER_QUERIES || [];
  const SAMPLE_CONTEXTS = domainConfig?.SAMPLE_CONTEXTS || {};
  const FUNCTIONAL_NODES_RAW = domainConfig?.FUNCTIONAL_NODES || {};
  const RATIONALIZED_NODE_ALTERNATIVES = domainConfig?.RATIONALIZED_NODE_ALTERNATIVES || {};
  const graphOps = domainConfig?.graphOps || null;

  // Process nodes for rationalization when needed
  const FUNCTIONAL_NODES = useMemo(() => {
    // Only process for enterprise domain when rationalization is on
    if (showRationalized && domainConfig?.DOMAIN_NAME === 'Enterprise Operations') {
      const result = processRationalization(
        FUNCTIONAL_NODES_RAW, 
        showRationalized,
        RATIONALIZED_NODE_ALTERNATIVES
      );
      // Warnings and duplicate children are now handled internally
      return result.processedNodes;
    }
    return FUNCTIONAL_NODES_RAW;
  }, [FUNCTIONAL_NODES_RAW, showRationalized, domainConfig?.DOMAIN_NAME, RATIONALIZED_NODE_ALTERNATIVES]);

  const currentContext = currentContextId && SAMPLE_CONTEXTS ? SAMPLE_CONTEXTS[currentContextId] : null;

  // Calculate resolution based on selected query and context
  const { baseResolution, contextualResolution } = useMemo(() => {
    console.log('RESOLUTION_CALCULATION:', {
      selectedQuery,
      generatedQueryId: generatedQuery?.id,
      hasSelectedQuery: !!selectedQuery,
      hasGeneratedQuery: !!generatedQuery
    });
    
    if (!selectedQuery && !generatedQuery) return { baseResolution: undefined, contextualResolution: undefined };

    // Determine the entry node
    let entryNode: string | undefined;
    if (generatedQuery && selectedQuery === generatedQuery.id) {
      entryNode = generatedQuery.entryNode;
    } else if (selectedQuery) {
      const query = USER_QUERIES.find((i: any) => i.id === selectedQuery);
      entryNode = query?.entryNode;
    }
    
    console.log('Entry node found:', entryNode);
    
    if (!entryNode || !graphOps) return { baseResolution: undefined, contextualResolution: undefined };

    // Get recent actions for current persona - filter for successful ones only for context
    const currentPersonaRecentActions = currentContextId ? (recentActionsByPersona[currentContextId] || []) : [];
    const successfulRecentActions = currentPersonaRecentActions.filter((action: any) => action.success);
    
    // Base resolution (no context) - don't pass recent actions
    console.log('Calculating base resolution...');
    const baseRes = calculateResolution(entryNode, null, showRationalized, showWorkflows, [], FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps);
    console.log('Base resolution result:', baseRes);
    
    // Contextual resolution - pass only successful recent actions when context is on
    console.log('Calculating contextual resolution with', successfulRecentActions.length, 'recent actions');
    const contextRes = calculateResolution(entryNode, currentContext, showRationalized, showWorkflows, successfulRecentActions, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps);
    console.log('Contextual resolution result:', contextRes);

    const result = { baseResolution: baseRes, contextualResolution: contextRes };
    console.log('useMemo returning:', result);
    return result;
  }, [selectedQuery, generatedQuery, currentContext, showRationalized, showWorkflows, currentContextId, recentActionsByPersona, USER_QUERIES, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps]);

  // Get the selected query data (either from predefined or generated)
  const selectedQueryData = useMemo(() => {
    if (generatedQuery && selectedQuery === generatedQuery.id) {
      // Convert generated query to UserQuery format
      const node = FUNCTIONAL_NODES[generatedQuery.entryNode];
      return {
        id: generatedQuery.id,
        text: generatedQuery.text,
        entryNode: generatedQuery.entryNode,
        entryLevel: node?.level || 'action',
        ambiguous: false
      };
    }
    return USER_QUERIES.find((i: any) => i.id === selectedQuery);
  }, [selectedQuery, generatedQuery]);

  // Track recent action when query is selected
  useEffect(() => {
    // Only track if this is a new query selection (not already tracked)
    if (selectedQuery === lastTrackedQuery) {
      return;
    }
    
    // Use the appropriate resolution based on context setting
    const activeResolution = showContext ? contextualResolution : baseResolution;
    
    console.log('RESOLUTION_SELECTION:', {
      showContext,
      hasBaseResolution: !!baseResolution,
      hasContextualResolution: !!contextualResolution,
      baseConfidence: baseResolution?.confidenceScore,
      contextualConfidence: contextualResolution?.confidenceScore,
      activeResolutionType: showContext ? 'contextual' : 'base',
      activeConfidence: activeResolution?.confidenceScore
    });
    
    if (selectedQuery && activeResolution) {
      // Get query data (could be predefined or generated)
      let queryData: { text: string; entryNode: string } | undefined;
      
      if (generatedQuery && selectedQuery === generatedQuery.id) {
        queryData = generatedQuery;
      } else {
        queryData = USER_QUERIES.find((i: any) => i.id === selectedQuery);
      }
      
      if (queryData) {
        // Check if resolution was successful
        const isSuccessful = activeResolution.confidenceScore > 0;
        
        console.log('RESOLUTION_SUCCESS_CHECK:', {
          queryText: queryData.text,
          confidenceScore: activeResolution.confidenceScore,
          isSuccessful,
          showContext,
          activeResolutionType: showContext ? 'contextual' : 'base',
          reasoning: activeResolution.reasoning
        });
        
        // Always prepare the action data (for display in recent querys)
        // Get the outcome and product from the resolution
        let outcome = 'No specific outcome';
        let product = 'N/A';
        
        // Only extract product/outcome if resolution was successful
        if (isSuccessful) {
          // First, look for product in the upward traversal path (most reliable)
          for (const nodeId of activeResolution.traversalPath.upward) {
            const node = FUNCTIONAL_NODES[nodeId];
            if (node && node.level === 'product') {
              // Extract product code from node ID (e.g., "product-cision" -> "cision")
              const nodeIdParts = nodeId.split('-');
              if (nodeIdParts.length >= 2) {
                product = nodeIdParts[nodeIdParts.length - 1].toLowerCase();
              }
              break;
            }
          }
          
          // If no product found in upward path, check productActivation
          if (product === 'N/A' && activeResolution.productActivation.length > 0) {
            const primaryProduct = activeResolution.productActivation.find((p: any) => p.priority === 'primary');
            if (primaryProduct) {
              product = primaryProduct.product.toLowerCase();  // Store as lowercase to match PRODUCT_CODES
            }
          }
          
          // If still no product, check for product associations in nodes
          if (product === 'N/A') {
            const allPathNodes = [
              ...activeResolution.traversalPath.upward,
              ...activeResolution.traversalPath.downward
            ];
            
            for (const nodeId of allPathNodes) {
              const node = FUNCTIONAL_NODES[nodeId];
              if (node && node.products && node.products.length > 0) {
                product = node.products[0].toLowerCase();  // Store as lowercase to match PRODUCT_CODES
                break;
              }
            }
          }
          
          // Get outcome from upward path (look for outcome level node)
          for (const nodeId of activeResolution.traversalPath.upward) {
            const node = FUNCTIONAL_NODES[nodeId];
            if (node && node.level === 'outcome') {
              outcome = node.label;
              break;
            }
          }
          
          // If no outcome found in upward path, check downward path
          if (outcome === 'No specific outcome' && activeResolution.traversalPath.downward.length > 0) {
            for (const nodeId of activeResolution.traversalPath.downward) {
              const node = FUNCTIONAL_NODES[nodeId];
              if (node && node.level === 'outcome') {
                outcome = node.label;
                break;
              }
            }
          }
        }
        
        // Get the matched node label (entry node)
        const matchedNode = FUNCTIONAL_NODES[queryData.entryNode]?.label || queryData.entryNode;
        
        // Create the action record (always, for display in recent querys)
        const newAction: RecentAction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          persona: currentContext?.profile.role || 'Unknown',
          query: queryData.text,
          product: product,
          outcome: outcome,
          matchedNode: matchedNode,
          timestamp: new Date(),
          success: isSuccessful,
          resolution: JSON.parse(JSON.stringify(activeResolution)), // Deep copy the resolution to prevent updates
          toggleStates: {
            showRationalized: showRationalized,
            showWorkflows: showWorkflows
          }
        };
        
        // Always add to recent actions (for display in recent querys panel)
        // The success flag will indicate if it was successful or not
        if (currentContextId) {
          setRecentActionsByPersona(prev => {
            const personaActions = prev[currentContextId] || [];
            const updated = [newAction, ...personaActions].slice(0, DISPLAY_LIMITS.RECENT_ACTIONS_PER_PERSONA);
            return {
              ...prev,
              [currentContextId]: updated
            };
          });
        }
        
        // Mark this query as tracked regardless of success
        setLastTrackedQuery(selectedQuery);
        
        // Unselect the query after adding to recent actions
        // This prevents auto-processing when toggles change
        setSelectedQuery(undefined);
      }
    }
  }, [selectedQuery, generatedQuery, baseResolution, contextualResolution, currentContext, currentContextId, showRationalized, showWorkflows, showContext, lastTrackedQuery]);

  // Check if domain config is loaded
  if (!domainConfig) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading domain configuration...</div>;
  }

  const handleQuerySelect = (queryId: string) => {
    setSelectedQuery(selectedQuery === queryId ? undefined : queryId);
  };

  const handleGeneratedQuerySelect = (query: GeneratedQuery) => {
    setGeneratedQuery(query);
    // Reset the tracking so this new query gets added to recent actions
    setLastTrackedQuery(undefined);
    // Auto-select the generated query
    setSelectedQuery(query.id);
  };


  const handleContextChange = (contextId: string) => {
    setCurrentContextId(contextId);
    // Clear selected query when changing persona
    setSelectedQuery(undefined);
  };

  const toggleContext = () => {
    setShowContext(!showContext);
    // Reset last tracked query so the same query can be re-evaluated with different context
    setLastTrackedQuery(undefined);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: UI_LAYOUT.MAIN_CONTENT_HEIGHT,
      overflow: 'hidden'
    }}>
      {/* User Context Bar */}
      {currentContext && currentContextId && (
        <UserContextBar
          context={currentContext}
          availableContexts={SAMPLE_CONTEXTS}
          onContextChange={handleContextChange}
          currentContextId={currentContextId}
          recentActions={(recentActionsByPersona[currentContextId] || []).filter((action: any) => action.success)}
          onClearActions={() => {
            setRecentActionsByPersona(prev => ({
              ...prev,
              [currentContextId]: []
            }));
          }}
        />
      )}

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        gap: UI_LAYOUT.MAIN_CONTENT_GAP, 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Query Examples Panel */}
        <QueryExamples
          queries={USER_QUERIES}
          selectedQuery={selectedQuery}
          onQuerySelect={handleQuerySelect}
          generatedQuery={generatedQuery}
          onGeneratedQuerySelect={handleGeneratedQuerySelect}
          showRationalized={showRationalized}
        />

        {/* Hierarchy Visualization */}
        <HierarchyVisualization
          selectedQuery={selectedQuery}
          entryNode={selectedQueryData?.entryNode}
          resolution={showContext ? contextualResolution : baseResolution}
          userContext={currentContext || undefined}
          showContext={showContext}
          expansionMode={expansionMode}
          showOverlaps={showOverlaps}
          showRationalized={showRationalized}
          showWorkflows={showWorkflows}
          recentActions={selectedRecentAction ? [selectedRecentAction] : []}
          domainConfig={domainConfig}
        />

        {/* Resolution Comparison Panel */}
        <ResolutionComparison
          baseResolution={baseResolution}
          contextualResolution={contextualResolution}
          userContext={currentContext || undefined}
          showContext={showContext}
          selectedQueryText={selectedQueryData?.text}
          generatedQuery={generatedQuery && selectedQuery === generatedQuery.id ? generatedQuery : null}
          recentActions={
            // Combine all recent actions from all personas for the query history
            Object.values(recentActionsByPersona)
              .flat()
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 5)
          }
          onClearRecentQuerys={() => {
            // Clear all recent actions for all personas
            setRecentActionsByPersona({});
          }}
          onSelectedRecentQueryChange={(selectedAction) => {
            // Pass the selected recent action to hierarchy visualization
            setSelectedRecentAction(selectedAction);
          }}
          graphStateVersion={graphStateVersion}
          currentToggles={{
            showRationalized: showRationalized,
            showWorkflows: showWorkflows
          }}
          nodes={domainConfig?.FUNCTIONAL_NODES}
        />
      </div>

      {/* Control Buttons */}
      <div style={{
        position: 'fixed',
        bottom: UI_LAYOUT.CONTROL_PANEL_BOTTOM,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: UI_LAYOUT.CONTROL_PANEL_GAP,
        alignItems: 'center'
      }}>
        {/* Show Overlaps Toggle */}
        <button
          onClick={() => setShowOverlaps(!showOverlaps)}
          style={{
            padding: UI_LAYOUT.BUTTON_PADDING,
            background: showOverlaps ? BUTTON_COLORS.OVERLAPS.ACTIVE : BUTTON_COLORS.OVERLAPS.INACTIVE,
            color: 'white',
            border: 'none',
            borderRadius: UI_LAYOUT.BUTTON_BORDER_RADIUS,
            fontSize: UI_LAYOUT.BUTTON_FONT_SIZE,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: UI_LAYOUT.BUTTON_BOX_SHADOW,
            transition: UI_LAYOUT.BUTTON_TRANSITION,
            display: 'flex',
            alignItems: 'center',
            gap: UI_LAYOUT.BUTTON_GAP
          }}
          title={showOverlaps 
            ? 'Hiding overlap indicators'
            : 'Show overlap indicators on duplicate functions'
          }
        >
          {showOverlaps ? '🔍' : '🔍'} 
          {showOverlaps ? 'Overlaps ON' : 'Overlaps OFF'}
        </button>
        
        {/* Rationalize Toggle */}
        <button
          onClick={() => {
            setShowRationalized(!showRationalized);
            // Turn off workflows when rationalization is turned off
            if (showRationalized) {
              setShowWorkflows(false);
            }
            // Reset last tracked query so the same query can be re-evaluated
            setLastTrackedQuery(undefined);
          }}
          style={{
            padding: UI_LAYOUT.BUTTON_PADDING,
            background: showRationalized ? BUTTON_COLORS.RATIONALIZED.ACTIVE : BUTTON_COLORS.RATIONALIZED.INACTIVE,
            color: 'white',
            border: 'none',
            borderRadius: UI_LAYOUT.BUTTON_BORDER_RADIUS,
            fontSize: UI_LAYOUT.BUTTON_FONT_SIZE,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: UI_LAYOUT.BUTTON_BOX_SHADOW,
            transition: UI_LAYOUT.BUTTON_TRANSITION,
            display: 'flex',
            alignItems: 'center',
            gap: UI_LAYOUT.BUTTON_GAP
          }}
          title={showRationalized 
            ? 'Hide rationalized/unified nodes'
            : 'Show rationalized/unified nodes'
          }
        >
          {showRationalized ? '🔄' : '🔄'} 
          {showRationalized ? 'Rationalized ON' : 'Rationalized OFF'}
        </button>
        
        {/* Workflows Toggle - Only enabled when rationalization is on */}
        <button
          onClick={() => {
            setShowWorkflows(!showWorkflows);
            // Reset last tracked query so the same query can be re-evaluated
            setLastTrackedQuery(undefined);
          }}
          disabled={!showRationalized}
          style={{
            padding: UI_LAYOUT.BUTTON_PADDING,
            background: !showRationalized ? '#d1d5db' : (showWorkflows ? '#ec4899' : '#6b7280'),
            color: !showRationalized ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: !showRationalized ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: !showRationalized ? 0.5 : 1
          }}
          title={!showRationalized 
            ? 'Enable rationalization first to show workflows'
            : (showWorkflows 
              ? 'Hide cross-product workflows'
              : 'Show cross-product workflows')
          }
        >
          {showWorkflows ? '🔗' : '🔗'} 
          {showWorkflows ? 'Workflows ON' : 'Workflows OFF'}
        </button>
        
        {/* Expansion Mode Toggle */}
        <button
          onClick={() => setExpansionMode(expansionMode === 'single' ? 'multiple' : 'single')}
          style={{
            padding: UI_LAYOUT.BUTTON_PADDING,
            background: expansionMode === 'multiple' ? '#10b981' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: UI_LAYOUT.BUTTON_BORDER_RADIUS,
            fontSize: UI_LAYOUT.BUTTON_FONT_SIZE,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: UI_LAYOUT.BUTTON_BOX_SHADOW,
            transition: UI_LAYOUT.BUTTON_TRANSITION,
            display: 'flex',
            alignItems: 'center',
            gap: UI_LAYOUT.BUTTON_GAP
          }}
          title={expansionMode === 'single' 
            ? 'Single expansion mode: Only one sibling can be expanded at a time'
            : 'Multiple expansion mode: Multiple siblings can be expanded simultaneously'
          }
        >
          {expansionMode === 'single' ? '☝️' : '🖐️'} 
          {expansionMode === 'single' ? 'Single' : 'Multiple'}
        </button>
        
        {/* Context Toggle Button */}
        <button
          onClick={toggleContext}
          style={{
            padding: UI_LAYOUT.BUTTON_PADDING,
            background: showContext ? '#667eea' : '#999',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          {showContext ? '👤 Context ON' : '👤 Context OFF'}
        </button>
      </div>

    </div>
  );
};

// calculateResolution function has been moved to resolutionEngine utility

/*
// REMOVED: This function is now in src/utils/resolutionEngine.ts
export function calculateResolution(
  entryNodeId: string, 
  context: UserContext | null,
  showRationalized: boolean,
  showWorkflows: boolean,
  recentActions: RecentAction[] = [],
  FUNCTIONAL_NODES: Record<string, any>,
  RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>>,
  graphOps: any
): Resolution {
  
  // First check if this is a shared/rationalized node that requires rationalization to be on
  if (entryNodeId.includes('-shared') && !showRationalized) {
    // When rationalization is OFF but we have context, try to resolve using recent actions
    if (context && recentActions.length > 0) {
      // Look for alternatives based on recent actions
      const alternatives = RATIONALIZED_NODE_ALTERNATIVES[entryNodeId];
      
      if (alternatives) {
        // Count product usage in recent SUCCESSFUL actions (already filtered)
        const productWeights: Record<string, number> = {};
        
        recentActions.forEach((action: any) => {
          const product = action.product.toLowerCase();
          
          // Use product directly since we've standardized product codes
          if (product !== 'n/a') {
            productWeights[product] = (productWeights[product] || 0) + 1;
          }
        });
        
        // Find the most used product
        let bestProduct: string | null = null;
        let maxWeight = 0;
        
        for (const [product, weight] of Object.entries(productWeights)) {
          if (weight > maxWeight && alternatives[product]) {
            bestProduct = product;
            maxWeight = weight;
          }
        }
        
        // If we found a preferred product, redirect to that specific node
        if (bestProduct) {
          const specificNodeId = alternatives[bestProduct];
          const specificNode = FUNCTIONAL_NODES[specificNodeId];
          
          if (specificNode) {
            // Recursively call with the specific node
            const resolution = calculateResolution(specificNodeId, context, showRationalized, showWorkflows, recentActions, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps);
            resolution.reasoning.unshift(`Context-based resolution: Selected ${bestProduct.toUpperCase()} based on recent usage (${maxWeight} recent actions)`);
            return resolution;
          }
        }
      }
    }
    
    // When rationalization is OFF and no context helps, shared nodes should ALWAYS fail
    // This demonstrates the problem of overlapping functions across products
    
    // Return unresolved - overlapping functions cannot be resolved
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: ['Resolution failed: Overlapping functions in multiple products - no clear resolution possible. Enable rationalization to unify duplicate functionality.']
    };
  }
  
  const entryNode = FUNCTIONAL_NODES[entryNodeId];
  
  // Check if the node exists
  if (!entryNode) {
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: ['Resolution failed: Entry node not found']
    };
  }
  
  // Track if we resolved ambiguity using context
  let contextResolvedAmbiguity = false;
  let contextMessage = '';
  
  // When rationalization is OFF, check for duplicates in two ways:
  // 1. Direct duplicates (same label as entry node)
  // 2. Ancestor duplicates (parent nodes that have duplicates)
  if (!showRationalized && !entryNodeId.includes('-shared') && !entryNodeId.includes('-workflow')) {
    // Find all nodes with the same label (potential duplicates)
    const sameLabel = entryNode.label.toLowerCase();
    const duplicateNodes = Object.keys(FUNCTIONAL_NODES).filter((nodeId: string) => {
      const node = FUNCTIONAL_NODES[nodeId];
      return node && 
             node.label.toLowerCase() === sameLabel &&
             !nodeId.includes('-shared') &&
             nodeId !== entryNodeId;  // Don't count the current node
    });
    
    // If there are other nodes with the same label, it's ambiguous
    if (duplicateNodes.length > 0) {
      // When context is ON, try to resolve based on recent usage
      if (context && recentActions.length > 0) {
        // Count product usage in recent actions
        const productWeights: Record<string, number> = {};
        
        recentActions.forEach((action: any) => {
          const product = action.product.toLowerCase();
          if (product !== 'n/a') {
            productWeights[product] = (productWeights[product] || 0) + 1;
          }
        });
        
        // Check if current node's product is the most used
        const currentNodeProducts = entryNode.products || [];
        let currentNodeWeight = 0;
        currentNodeProducts.forEach((product: string) => {
          currentNodeWeight += productWeights[product.toLowerCase()] || 0;
        });
        
        // Check weights for duplicate nodes
        let maxWeight = currentNodeWeight;
        let bestNodeId = entryNodeId;
        
        duplicateNodes.forEach((nodeId: string) => {
          const node = FUNCTIONAL_NODES[nodeId];
          const nodeProducts = node.products || [];
          let nodeWeight = 0;
          nodeProducts.forEach((product: string) => {
            nodeWeight += productWeights[product.toLowerCase()] || 0;
          });
          
          if (nodeWeight > maxWeight) {
            maxWeight = nodeWeight;
            bestNodeId = nodeId;
          }
        });
        
        // If we found a better node based on context, use it
        if (bestNodeId !== entryNodeId && maxWeight > 0) {
          const resolution = calculateResolution(bestNodeId, context, showRationalized, showWorkflows, recentActions, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps);
          resolution.reasoning.unshift(`Context-based resolution: Selected ${FUNCTIONAL_NODES[bestNodeId].products[0].toUpperCase()} version based on recent usage`);
          return resolution;
        }
        
        // If the current node is the best match based on context, continue with resolution but note it
        if (bestNodeId === entryNodeId && maxWeight > 0) {
          // Mark that context resolved the ambiguity
          contextResolvedAmbiguity = true;
          const productName = currentNodeProducts[0] || 'this product';
          contextMessage = `Context-based resolution: Selected ${productName.toUpperCase()} version based on recent usage (${duplicateNodes.length + 1} products offer this functionality)`;
          // Continue with normal resolution below
        } else if (maxWeight === 0) {
          // If context exists but doesn't help disambiguate, still fail
          return {
            entryNode: entryNodeId,
            traversalPath: { upward: [], downward: [] },
            selectedActions: [],
            productActivation: [],
            confidenceScore: 0,
            reasoning: [`Resolution failed: Multiple products offer "${entryNode.label}" (found in ${duplicateNodes.length + 1} products). Enable rationalization to unify duplicate functionality.`]
          };
        }
      } else {
        // No context to help - fail with ambiguity error
        return {
          entryNode: entryNodeId,
          traversalPath: { upward: [], downward: [] },
          selectedActions: [],
          productActivation: [],
          confidenceScore: 0,
          reasoning: [`Resolution failed: Multiple products offer "${entryNode.label}" (found in ${duplicateNodes.length + 1} products). Enable rationalization to unify duplicate functionality.`]
        };
      }
    }
    
    // ALSO check if the node or any ancestor is a duplicate (using RATIONALIZED_NODE_ALTERNATIVES)
    // This properly detects when a node is a duplicate or child of a duplicate
    const isDuplicate = isNodeOrAncestorDuplicate(entryNodeId, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES);
    
    if (isDuplicate && duplicateNodes.length === 0) {  // Only handle if no direct label duplicates already found
      // Find which ancestor is the duplicate for better error message
      let duplicateAncestorLabel = entryNode.label;
      let duplicateAncestorCount = 2; // Default count
      let currentCheckNode = entryNode;
      
      // Get all duplicate nodes from alternatives
      const allDuplicateNodes = getDuplicateNodesFromAlternatives(RATIONALIZED_NODE_ALTERNATIVES);
      
      // Debug log for duplicate detection
      console.log('DUPLICATE_DETECTION_DEBUG:', {
        entryNodeId,
        entryNodeLabel: entryNode.label,
        isDuplicate,
        directLabelDuplicates: duplicateNodes.length,
        allDuplicateNodes: allDuplicateNodes.slice(0, 10), // Show first 10 to avoid huge logs
        totalDuplicateCount: allDuplicateNodes.length,
        rationalizedAlternatives: Object.keys(RATIONALIZED_NODE_ALTERNATIVES).slice(0, 5) // Show first 5 groups
      });
      
      // Check if current node itself is a duplicate
      if (allDuplicateNodes.includes(entryNodeId)) {
        duplicateAncestorLabel = entryNode.label;
        // Count how many products have this duplicate
        for (const alternatives of Object.values(RATIONALIZED_NODE_ALTERNATIVES)) {
          if (Object.values(alternatives).includes(entryNodeId)) {
            duplicateAncestorCount = Object.keys(alternatives).length;
            break;
          }
        }
      } else {
        // Find which ancestor is the duplicate
        while (currentCheckNode.parents && currentCheckNode.parents.length > 0) {
          let foundDuplicate = false;
          for (const parentId of currentCheckNode.parents) {
            if (allDuplicateNodes.includes(parentId)) {
              const parentNode = FUNCTIONAL_NODES[parentId];
              if (parentNode) {
                duplicateAncestorLabel = parentNode.label;
                // Count alternatives
                for (const alternatives of Object.values(RATIONALIZED_NODE_ALTERNATIVES)) {
                  if (Object.values(alternatives).includes(parentId)) {
                    duplicateAncestorCount = Object.keys(alternatives).length;
                    break;
                  }
                }
              }
              foundDuplicate = true;
              break;
            }
          }
          if (foundDuplicate) break;
          const nextParentId = currentCheckNode.parents[0];
          currentCheckNode = FUNCTIONAL_NODES[nextParentId];
          if (!currentCheckNode) break;
        }
      }
      
      // When context is ON, try to resolve based on recent usage
      if (context && recentActions.length > 0) {
        // Count product usage in recent actions
        const productWeights: Record<string, number> = {};
        
        recentActions.forEach((action: any) => {
          const product = action.product.toLowerCase();
          if (product !== 'n/a') {
            productWeights[product] = (productWeights[product] || 0) + 1;
          }
        });
        
        // Check if we can resolve through this path based on product preference
        // The key insight: if the entry node and all its ancestors up to the duplicate
        // are in the same product, then we can use context to resolve through that product
        
        // Get all products involved in the path from entry node to the duplicate ancestor
        const pathProducts = new Set<string>();
        const pathTrace: any[] = [];
        
        // Add entry node's products
        if (entryNode.products) {
          entryNode.products.forEach((p: string) => {
            pathProducts.add(p.toLowerCase());
          });
        }
        pathTrace.push({
          nodeId: entryNodeId,
          label: entryNode.label,
          products: entryNode.products || [],
          type: 'entry'
        });
        
        // Walk up the tree to find all products in the path
        let walkNode = entryNode;
        while (walkNode && walkNode.parents && walkNode.parents.length > 0) {
          const parentId = walkNode.parents[0];
          const parentNode = FUNCTIONAL_NODES[parentId];
          if (parentNode) {
            pathTrace.push({
              nodeId: parentNode.id,
              label: parentNode.label,
              products: parentNode.products || [],
              type: 'ancestor'
            });
            if (parentNode.products) {
              parentNode.products.forEach((p: string) => {
                pathProducts.add(p.toLowerCase());
              });
            }
            // Stop if we've reached the duplicate ancestor
            if (parentNode.label === duplicateAncestorLabel) {
              pathTrace[pathTrace.length - 1].type = 'duplicate_ancestor';
              break;
            }
            walkNode = parentNode;
          } else {
            break;
          }
        }
        
        // Check if any product in the path has weight
        let currentNodeWeight = 0;
        let bestProduct = '';
        const productAnalysis: any[] = [];
        pathProducts.forEach((product: string) => {
          const weight = productWeights[product] || 0;
          productAnalysis.push({
            product,
            weight,
            hasWeight: weight > 0
          });
          if (weight > 0) {
            currentNodeWeight += weight;
            if (!bestProduct || weight > (productWeights[bestProduct] || 0)) {
              bestProduct = product;
            }
          }
        });
        
        // Consolidated debug log
        console.log('CONTEXT_RESOLUTION_DEBUG:', {
          query: entryNode.label,
          entryNodeId,
          isDuplicate,
          duplicateAncestor: {
            label: duplicateAncestorLabel,
            productCount: duplicateAncestorCount
          },
          recentActions: recentActions.map((a: any) => ({
            product: a.product,
            query: a.query
          })),
          productWeights,
          pathTrace,
          pathProducts: Array.from(pathProducts),
          productAnalysis,
          resolution: {
            totalWeight: currentNodeWeight,
            bestProduct,
            canResolve: currentNodeWeight > 0
          }
        });
        
        if (currentNodeWeight > 0) {
          // Context helps - mark it and continue
          contextResolvedAmbiguity = true;
          const productName = bestProduct || 'this product';
          contextMessage = `Context-based resolution: Selected ${productName.toUpperCase()} path through ambiguous "${duplicateAncestorLabel}" (${duplicateAncestorCount} products offer this functionality)`;
          // Continue with normal resolution
        } else {
          // Context doesn't help - fail
          return {
            entryNode: entryNodeId,
            traversalPath: { upward: [], downward: [] },
            selectedActions: [],
            productActivation: [],
            confidenceScore: 0,
            reasoning: [`Resolution failed: Path goes through ambiguous functionality "${duplicateAncestorLabel}" (found in ${duplicateAncestorCount} products). Enable rationalization to unify duplicate functionality.`]
          };
        }
      } else {
        // No context to help - fail with ambiguity error
        return {
          entryNode: entryNodeId,
          traversalPath: { upward: [], downward: [] },
          selectedActions: [],
          productActivation: [],
          confidenceScore: 0,
          reasoning: [`Resolution failed: Path goes through ambiguous functionality "${duplicateAncestorLabel}" (found in ${duplicateAncestorCount} products). Enable rationalization to unify duplicate functionality.`]
        };
      }
    }
  }
  
  // Check if this is a workflow node but workflows are disabled
  if (entryNode.level === 'workflow' && !showWorkflows) {
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: ['Resolution failed: Too many potential functions across products - no unique resolution possible. Enable workflows for cross-product orchestration.']
    };
  }
  
  // Check if this is a duplicate node when rationalization is on
  // When rationalized, map product-specific nodes to their unified versions
  if (!entryNodeId.includes('-shared') && showRationalized) {
    // Mapping of duplicate nodes to their rationalized/unified versions
    const rationalizedMappings: Record<string, string> = {
      // Media monitoring scenarios
      'scenario-media-monitoring-cision': 'scenario-media-monitoring-shared',
      'scenario-media-monitoring-brandwatch': 'scenario-media-monitoring-shared',
      'scenario-media-monitoring-smm': 'scenario-media-monitoring-shared',
      // Social monitoring steps
      'step-social-monitoring-cision': 'step-social-monitoring-shared',
      'step-social-monitoring-brandwatch': 'step-social-monitoring-shared',
      'step-social-monitoring-smm': 'step-social-monitoring-shared',
      // Other duplicate steps
      'step-track-coverage-cision': 'step-track-coverage-shared',
      'step-analyze-media-sentiment-cision': 'step-analyze-sentiment-shared',
      'step-track-social-brandwatch': 'step-social-monitoring-shared',
      'step-analyze-trends-brandwatch': 'step-analyze-sentiment-shared',
      'step-track-mentions-smm': 'step-social-monitoring-shared',
      'step-monitor-engagement-smm': 'step-social-monitoring-shared'
    };
    
    if (rationalizedMappings[entryNodeId]) {
      // Redirect to the unified node
      const unifiedNodeId = rationalizedMappings[entryNodeId];
      const unifiedNode = FUNCTIONAL_NODES[unifiedNodeId];
      
      if (unifiedNode) {
        // Recursively call with the unified node
        const resolution = calculateResolution(unifiedNodeId, context, showRationalized, showWorkflows, recentActions, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps);
        // Add a note about the mapping in reasoning
        resolution.reasoning.unshift('Query mapped to unified/rationalized functionality');
        return resolution;
      }
    }
  }

  const upwardPath: string[] = [];
  const downwardPath: string[] = [];
  const selectedActions: string[] = [];
  const reasoning: string[] = [];
  // Since we're using hard-coded mappings, we have 100% confidence when node is found
  let confidenceScore = 1.0;
  
  if (entryNode.level === 'workflow') {
    reasoning.push('Cross-product workflow orchestration enabled');
  }

  // Traverse upward to find context and product
  let currentNode = entryNode;
  while (currentNode.parents.length > 0) {
    // Add all parents to the upward path
    const parentId = currentNode.parents[0]; // Take first parent for main path
    upwardPath.push(parentId);
    const parentNode = FUNCTIONAL_NODES[parentId];
    if (!parentNode) break;
    currentNode = parentNode;
  }

  // Traverse downward to find actions - context-aware traversal
  const traverseDown = (nodeId: string) => {
    const node = FUNCTIONAL_NODES[nodeId];
    if (!node) return;
    
    if (node.level === 'action') {
      selectedActions.push(nodeId);
    } else {
      // If we have context, prioritize branches based on product preferences
      let childrenToTraverse = node.children;
      
      if (context && context.patterns.productPreferences) {
        // Score each child based on its alignment with product preferences
        const scoredChildren = node.children.map((childId: string) => {
          const childNode = FUNCTIONAL_NODES[childId];
          if (!childNode) return { id: childId, score: 0 };
          
          // Calculate score based on product alignment
          let score = 0;
          if (childNode.products) {
            childNode.products.forEach((product: string) => {
              score += context.patterns.productPreferences[product] || 0;
            });
          }
          
          return { id: childId, score };
        });
        
        // Sort by score and filter based on threshold
        scoredChildren.sort((a: any, b: any) => b.score - a.score);
        
        // For personas with strong preferences, only traverse high-scoring paths
        if (context.profile.role !== 'Marketing Manager' || context.history.length > 0) {
          const threshold = 0.3;
          childrenToTraverse = scoredChildren
            .filter((child: any) => child.score > threshold || scoredChildren[0].score === 0)
            .map((child: any) => child.id);
        }
      }
      
      childrenToTraverse.forEach((childId: string) => {
        downwardPath.push(childId);
        traverseDown(childId);
      });
    }
  };

  traverseDown(entryNodeId);

  // Apply context if available
  // Check both the context object and recentActions for context information
  const hasContext = (context && context.history && context.history.length > 0) || recentActions.length > 0;
  
  if (hasContext) {
    if (context && context.history && context.history.length > 0) {
      // Check if entry node matches recent history
      const recentNodes = context.history.map((h: any) => h.node);
      if (recentNodes.includes(entryNodeId)) {
        reasoning.push('Query matches recent user activity');
      }

      // Check product preferences
      const nodeProducts = entryNode.products || [];
      const preferredProducts = Object.entries(context.patterns.productPreferences)
        .sort(([,a], [,b]) => b - a)
        .map(([product]: [string, number]) => product);
      
      if (nodeProducts.some((p: string) => preferredProducts.includes(p))) {
        reasoning.push(`Aligns with preferred products: ${preferredProducts.slice(0, 2).join(', ')}`);
      }

      // Add workflow stage reasoning
      if (context.patterns.workflowStage) {
        reasoning.push(`Current workflow stage: ${context.patterns.workflowStage}`);
      }

      // Filter actions based on context
      if (entryNode.level === 'step' && entryNode.children.length > 0) {
        // Prioritize actions based on product preferences
        const contextualActions = selectedActions.filter((actionId: string) => {
          const action = FUNCTIONAL_NODES[actionId];
          if (!action || !action.products) return false;
          return action.products.some((p: string) => 
            (context.patterns.productPreferences[p] || 0) > 0.5
          );
        });
        
        if (contextualActions.length > 0) {
          selectedActions.length = 0;
          selectedActions.push(...contextualActions);
          reasoning.push('Actions filtered based on product preferences');
        }
      }
    } else if (recentActions.length > 0) {
      // We have recent actions but no full context object
      reasoning.push('Using recent action history for context');
    }
  } else {
    reasoning.push('No user context available - using generic resolution');
  }

  // Determine product activation
  const productMap: Record<string, Set<string>> = {};
  selectedActions.forEach((actionId: string) => {
    const action = FUNCTIONAL_NODES[actionId];
    if (action && action.products) {
      action.products.forEach((product: string) => {
        if (!productMap[product]) {
          productMap[product] = new Set();
        }
        productMap[product].add(actionId);
      });
    }
  });

  const productActivation = Object.entries(productMap).map(([product, actions]: [string, Set<string>], index: number) => ({
    product,
    priority: (index === 0 ? 'primary' : 'secondary') as 'primary' | 'secondary',
    actions: Array.from(actions)
  }));

  // Sort by context preference if available
  if (context && context.patterns.productPreferences) {
    productActivation.sort((a, b) => {
      const prefA = context.patterns.productPreferences[a.product] || 0;
      const prefB = context.patterns.productPreferences[b.product] || 0;
      return prefB - prefA;
    });
    
    // Update priorities after sorting
    productActivation.forEach((activation: any, index: number) => {
      activation.priority = index === 0 ? 'primary' : 'secondary';
    });
  }

  // Add context message if context resolved ambiguity
  if (contextResolvedAmbiguity && contextMessage) {
    reasoning.unshift(contextMessage);
  }
  
  const finalResolution = {
    entryNode: entryNodeId,
    traversalPath: {
      upward: upwardPath,
      downward: downwardPath
    },
    selectedActions,
    productActivation,
    confidenceScore,
    reasoning
  };
  
  console.log('FINAL_RESOLUTION:', {
    entryNodeId,
    contextResolvedAmbiguity,
    contextMessage,
    selectedActions: selectedActions.length,
    productActivation: productActivation.length,
    confidenceScore,
    reasoning
  });
  
  return finalResolution;
}
*/

export default QueryDisambiguationSection;
import React, { useState, useMemo, useEffect } from 'react';
import UserContextBar from '../components/UserContextBar';
import IntentExamples from '../components/IntentExamples';
import HierarchyVisualization, { ExpansionMode } from '../components/HierarchyVisualization';
import ResolutionComparison from '../components/ResolutionComparison';
import { GeneratedIntent } from '../utils/intentMatcher';
import {
  USER_INTENTS,
  SAMPLE_CONTEXTS,
  FUNCTIONAL_NODES,
  Resolution,
  UserContext,
  RATIONALIZED_NODE_ALTERNATIVES
} from '../config/functionalHierarchy';

export interface RecentAction {
  id: string;
  persona: string;
  intent: string;
  product: string;
  outcome: string;
  matchedNode: string;
  timestamp: Date;
  success: boolean;
  resolution: Resolution; // Store the full resolution for later display
  toggleStates: {
    showRationalized: boolean;
    showWorkflows: boolean;
  }; // Store the toggle states at time of resolution
}

const IntentDisambiguationSection: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<string | undefined>();
  const [currentContextId, setCurrentContextId] = useState<string>('marketing-manager');
  const [showContext, setShowContext] = useState<boolean>(true);
  const [expansionMode, setExpansionMode] = useState<ExpansionMode>('single');
  const [showOverlaps, setShowOverlaps] = useState<boolean>(false);
  const [showRationalized, setShowRationalized] = useState<boolean>(false);
  const [showWorkflows, setShowWorkflows] = useState<boolean>(false);
  // Store recent actions per persona
  const [recentActionsByPersona, setRecentActionsByPersona] = useState<Record<string, RecentAction[]>>({});
  const [selectedRecentAction, setSelectedRecentAction] = useState<RecentAction | null>(null);
  const [graphStateVersion, setGraphStateVersion] = useState<number>(0);
  const [generatedIntent, setGeneratedIntent] = useState<GeneratedIntent | null>(null);
  const [lastTrackedIntent, setLastTrackedIntent] = useState<string | undefined>();

  const currentContext = SAMPLE_CONTEXTS[currentContextId];

  // Clear selected recent action when graph state changes
  useEffect(() => {
    setSelectedRecentAction(null);
    setGraphStateVersion(prev => prev + 1);
  }, [showRationalized, showWorkflows]);

  // Calculate resolution based on selected intent and context
  const { baseResolution, contextualResolution } = useMemo(() => {
    if (!selectedIntent && !generatedIntent) return { baseResolution: undefined, contextualResolution: undefined };

    // Determine the entry node
    let entryNode: string | undefined;
    if (generatedIntent && selectedIntent === generatedIntent.id) {
      entryNode = generatedIntent.entryNode;
    } else if (selectedIntent) {
      const intent = USER_INTENTS.find(i => i.id === selectedIntent);
      entryNode = intent?.entryNode;
    }
    
    if (!entryNode) return { baseResolution: undefined, contextualResolution: undefined };

    // Get recent actions for current persona - filter for successful ones only for context
    const currentPersonaRecentActions = recentActionsByPersona[currentContextId] || [];
    const successfulRecentActions = currentPersonaRecentActions.filter(action => action.success);
    
    // Base resolution (no context) - don't pass recent actions
    const baseRes = calculateResolution(entryNode, null, showRationalized, showWorkflows, []);
    
    // Contextual resolution - pass only successful recent actions when context is on
    const contextRes = calculateResolution(entryNode, currentContext, showRationalized, showWorkflows, successfulRecentActions);

    return { baseResolution: baseRes, contextualResolution: contextRes };
  }, [selectedIntent, generatedIntent, currentContext, showRationalized, showWorkflows, currentContextId, recentActionsByPersona]);

  // Get the selected intent data (either from predefined or generated)
  const selectedIntentData = useMemo(() => {
    if (generatedIntent && selectedIntent === generatedIntent.id) {
      // Convert generated intent to UserIntent format
      const node = FUNCTIONAL_NODES[generatedIntent.entryNode];
      return {
        id: generatedIntent.id,
        text: generatedIntent.text,
        entryNode: generatedIntent.entryNode,
        entryLevel: node?.level || 'action',
        ambiguous: false
      };
    }
    return USER_INTENTS.find(i => i.id === selectedIntent);
  }, [selectedIntent, generatedIntent]);

  // Track recent action when intent is selected
  useEffect(() => {
    // Only track if this is a new intent selection (not already tracked)
    if (selectedIntent === lastTrackedIntent) {
      return;
    }
    
    // Use the appropriate resolution based on context setting
    const activeResolution = showContext ? contextualResolution : baseResolution;
    
    if (selectedIntent && activeResolution) {
      // Get intent data (could be predefined or generated)
      let intentData: { text: string; entryNode: string } | undefined;
      
      if (generatedIntent && selectedIntent === generatedIntent.id) {
        intentData = generatedIntent;
      } else {
        intentData = USER_INTENTS.find(i => i.id === selectedIntent);
      }
      
      if (intentData) {
        // Check if resolution was successful
        const isSuccessful = activeResolution.confidenceScore > 0;
        
        // Always prepare the action data (for display in recent intents)
        // Get the outcome and product from the resolution
        let outcome = 'No specific outcome';
        let product = 'N/A';
        
        // Only extract product/outcome if resolution was successful
        if (isSuccessful) {
          // First, look for product in the upward traversal path (most reliable)
          for (const nodeId of activeResolution.traversalPath.upward) {
            const node = FUNCTIONAL_NODES[nodeId];
            if (node && node.level === 'product') {
              product = node.label;
              break;
            }
          }
          
          // If no product found in upward path, check productActivation
          if (product === 'N/A' && activeResolution.productActivation.length > 0) {
            const primaryProduct = activeResolution.productActivation.find(p => p.priority === 'primary');
            if (primaryProduct) {
              product = primaryProduct.product.toUpperCase();
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
                product = node.products[0].toUpperCase();
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
        const matchedNode = FUNCTIONAL_NODES[intentData.entryNode]?.label || intentData.entryNode;
        
        // Create the action record (always, for display in recent intents)
        const newAction: RecentAction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          persona: currentContext.profile.role,
          intent: intentData.text,
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
        
        // Always add to recent actions (for display in recent intents panel)
        // The success flag will indicate if it was successful or not
        setRecentActionsByPersona(prev => {
          const personaActions = prev[currentContextId] || [];
          const updated = [newAction, ...personaActions].slice(0, 10);
          return {
            ...prev,
            [currentContextId]: updated
          };
        });
        
        // Mark this intent as tracked regardless of success
        setLastTrackedIntent(selectedIntent);
        
        // Unselect the intent after adding to recent actions
        // This prevents re-resolution when toggles change
        setSelectedIntent(undefined);
      }
    }
  }, [selectedIntent, generatedIntent, baseResolution, contextualResolution, currentContext, currentContextId, showRationalized, showWorkflows, showContext, lastTrackedIntent]);

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(selectedIntent === intentId ? undefined : intentId);
  };

  const handleGeneratedIntentSelect = (intent: GeneratedIntent) => {
    setGeneratedIntent(intent);
    // Reset the tracking so this new intent gets added to recent actions
    setLastTrackedIntent(undefined);
    // Auto-select the generated intent
    setSelectedIntent(intent.id);
  };

  const handleContextChange = (contextId: string) => {
    setCurrentContextId(contextId);
    // Clear selected intent when changing persona
    setSelectedIntent(undefined);
  };

  const toggleContext = () => {
    setShowContext(!showContext);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: 'calc(100vh - 140px)',
      overflow: 'hidden'
    }}>
      {/* User Context Bar */}
      <UserContextBar
        context={currentContext}
        availableContexts={SAMPLE_CONTEXTS}
        onContextChange={handleContextChange}
        currentContextId={currentContextId}
        recentActions={(recentActionsByPersona[currentContextId] || []).filter(action => action.success)}
      />

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        gap: 20, 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Intent Examples Panel */}
        <IntentExamples
          intents={USER_INTENTS}
          selectedIntent={selectedIntent}
          onIntentSelect={handleIntentSelect}
          generatedIntent={generatedIntent}
          onGeneratedIntentSelect={handleGeneratedIntentSelect}
          showRationalized={showRationalized}
        />

        {/* Hierarchy Visualization */}
        <HierarchyVisualization
          selectedIntent={selectedIntent}
          entryNode={selectedIntentData?.entryNode}
          resolution={showContext ? contextualResolution : baseResolution}
          userContext={currentContext}
          showContext={showContext}
          expansionMode={expansionMode}
          showOverlaps={showOverlaps}
          showRationalized={showRationalized}
          showWorkflows={showWorkflows}
          recentActions={selectedRecentAction ? [selectedRecentAction] : []}
        />

        {/* Resolution Comparison Panel */}
        <ResolutionComparison
          baseResolution={baseResolution}
          contextualResolution={contextualResolution}
          userContext={currentContext}
          showContext={showContext}
          selectedIntentText={selectedIntentData?.text}
          recentActions={
            // Combine all recent actions from all personas for the intent history
            Object.values(recentActionsByPersona)
              .flat()
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 5)
          }
          onSelectedRecentIntentChange={(selectedAction) => {
            // Pass the selected recent action to hierarchy visualization
            setSelectedRecentAction(selectedAction);
          }}
          graphStateVersion={graphStateVersion}
          currentToggles={{
            showRationalized: showRationalized,
            showWorkflows: showWorkflows
          }}
        />
      </div>

      {/* Control Buttons */}
      <div style={{
        position: 'fixed',
        bottom: 30,
        right: 330,
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }}>
        {/* Show Overlaps Toggle */}
        <button
          onClick={() => setShowOverlaps(!showOverlaps)}
          style={{
            padding: '10px 20px',
            background: showOverlaps ? '#f97316' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6
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
          }}
          style={{
            padding: '10px 20px',
            background: showRationalized ? '#9333ea' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6
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
          onClick={() => setShowWorkflows(!showWorkflows)}
          disabled={!showRationalized}
          style={{
            padding: '10px 20px',
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
            padding: '10px 20px',
            background: expansionMode === 'multiple' ? '#10b981' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6
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
            padding: '10px 20px',
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

// Helper function to calculate resolution
function calculateResolution(
  entryNodeId: string, 
  context: UserContext | null,
  showRationalized: boolean,
  showWorkflows: boolean,
  recentActions: RecentAction[] = []
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
        
        recentActions.forEach((action) => {
          const product = action.product.toLowerCase();
          
          // Normalize product names
          const productNormalization: Record<string, string> = {
            'cisionone': 'cision',
            'cision one': 'cision',
            'bcr': 'brandwatch',
            'brandwatch consumer research': 'brandwatch'
          };
          
          const normalizedProduct = productNormalization[product] || product;
          
          if (normalizedProduct !== 'n/a') {
            productWeights[normalizedProduct] = (productWeights[normalizedProduct] || 0) + 1;
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
            const resolution = calculateResolution(specificNodeId, context, showRationalized, showWorkflows, recentActions);
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
    // Check if there are duplicate nodes when rationalization is off
    const duplicateNodes = Object.keys(FUNCTIONAL_NODES).filter(nodeId => {
      const node = FUNCTIONAL_NODES[nodeId];
      return node && 
             node.label === entryNodeId.split('-').slice(1, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase()) &&
             !nodeId.includes('-shared');
    });
    
    if (duplicateNodes.length > 1 && !showRationalized) {
      return {
        entryNode: entryNodeId,
        traversalPath: { upward: [], downward: [] },
        selectedActions: [],
        productActivation: [],
        confidenceScore: 0,
        reasoning: [`Resolution failed: Multiple matching nodes found (${duplicateNodes.length} products). Enable rationalization for unambiguous resolution.`]
      };
    }
    
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: ['Resolution failed: Entry node not found']
    };
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
        const resolution = calculateResolution(unifiedNodeId, context, showRationalized, showWorkflows);
        // Add a note about the mapping in reasoning
        resolution.reasoning.unshift('Intent mapped to unified/rationalized functionality');
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
        const scoredChildren = node.children.map(childId => {
          const childNode = FUNCTIONAL_NODES[childId];
          if (!childNode) return { id: childId, score: 0 };
          
          // Calculate score based on product alignment
          let score = 0;
          if (childNode.products) {
            childNode.products.forEach(product => {
              score += context.patterns.productPreferences[product] || 0;
            });
          }
          
          return { id: childId, score };
        });
        
        // Sort by score and filter based on threshold
        scoredChildren.sort((a, b) => b.score - a.score);
        
        // For personas with strong preferences, only traverse high-scoring paths
        if (context.profile.role !== 'Marketing Manager' || context.history.length > 0) {
          const threshold = 0.3;
          childrenToTraverse = scoredChildren
            .filter(child => child.score > threshold || scoredChildren[0].score === 0)
            .map(child => child.id);
        }
      }
      
      childrenToTraverse.forEach(childId => {
        downwardPath.push(childId);
        traverseDown(childId);
      });
    }
  };

  traverseDown(entryNodeId);

  // Apply context if available
  if (context && context.history.length > 0) {
    // Check if entry node matches recent history
    const recentNodes = context.history.map(h => h.node);
    if (recentNodes.includes(entryNodeId)) {
      reasoning.push('Intent matches recent user activity');
    }

    // Check product preferences
    const nodeProducts = entryNode.products || [];
    const preferredProducts = Object.entries(context.patterns.productPreferences)
      .sort(([,a], [,b]) => b - a)
      .map(([product]) => product);
    
    if (nodeProducts.some(p => preferredProducts.includes(p))) {
      reasoning.push(`Aligns with preferred products: ${preferredProducts.slice(0, 2).join(', ')}`);
    }

    // Add workflow stage reasoning
    if (context.patterns.workflowStage) {
      reasoning.push(`Current workflow stage: ${context.patterns.workflowStage}`);
    }

    // Filter actions based on context
    if (entryNode.level === 'step' && entryNode.children.length > 0) {
      // Prioritize actions based on product preferences
      const contextualActions = selectedActions.filter(actionId => {
        const action = FUNCTIONAL_NODES[actionId];
        if (!action || !action.products) return false;
        return action.products.some(p => 
          (context.patterns.productPreferences[p] || 0) > 0.5
        );
      });
      
      if (contextualActions.length > 0) {
        selectedActions.length = 0;
        selectedActions.push(...contextualActions);
        reasoning.push('Actions filtered based on product preferences');
      }
    }
  } else {
    reasoning.push('No user context available - using generic resolution');
  }

  // Determine product activation
  const productMap: Record<string, Set<string>> = {};
  selectedActions.forEach(actionId => {
    const action = FUNCTIONAL_NODES[actionId];
    if (action && action.products) {
      action.products.forEach(product => {
        if (!productMap[product]) {
          productMap[product] = new Set();
        }
        productMap[product].add(actionId);
      });
    }
  });

  const productActivation = Object.entries(productMap).map(([product, actions], index) => ({
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
    productActivation.forEach((activation, index) => {
      activation.priority = index === 0 ? 'primary' : 'secondary';
    });
  }

  return {
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
}

export default IntentDisambiguationSection;
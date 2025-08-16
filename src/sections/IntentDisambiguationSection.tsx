import React, { useState, useMemo, useEffect } from 'react';
import UserContextBar from '../components/UserContextBar';
import IntentExamples from '../components/IntentExamples';
import HierarchyVisualization, { ExpansionMode } from '../components/HierarchyVisualization';
import ResolutionComparison from '../components/ResolutionComparison';
import {
  USER_INTENTS,
  SAMPLE_CONTEXTS,
  FUNCTIONAL_NODES,
  Resolution,
  UserContext
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
  const [showRationalized, setShowRationalized] = useState<boolean>(true);
  const [showWorkflows, setShowWorkflows] = useState<boolean>(false);
  // Store recent actions per persona
  const [recentActionsByPersona, setRecentActionsByPersona] = useState<Record<string, RecentAction[]>>({});
  const [selectedRecentAction, setSelectedRecentAction] = useState<RecentAction | null>(null);
  const [graphStateVersion, setGraphStateVersion] = useState<number>(0);

  const currentContext = SAMPLE_CONTEXTS[currentContextId];

  // Clear selected recent action when graph state changes
  useEffect(() => {
    setSelectedRecentAction(null);
    setGraphStateVersion(prev => prev + 1);
  }, [showRationalized, showWorkflows]);

  // Calculate resolution based on selected intent and context
  const { baseResolution, contextualResolution } = useMemo(() => {
    if (!selectedIntent) return { baseResolution: undefined, contextualResolution: undefined };

    const intent = USER_INTENTS.find(i => i.id === selectedIntent);
    if (!intent) return { baseResolution: undefined, contextualResolution: undefined };

    // Base resolution (no context)
    const baseRes = calculateResolution(intent.entryNode, null, showRationalized, showWorkflows);
    
    // Contextual resolution
    const contextRes = calculateResolution(intent.entryNode, currentContext, showRationalized, showWorkflows);

    return { baseResolution: baseRes, contextualResolution: contextRes };
  }, [selectedIntent, currentContext, showRationalized, showWorkflows]);

  const selectedIntentData = USER_INTENTS.find(i => i.id === selectedIntent);

  // Track recent action when intent is selected
  useEffect(() => {
    if (selectedIntent && baseResolution) {
      const intent = USER_INTENTS.find(i => i.id === selectedIntent);
      if (intent) {
        // Get the outcome and product from the resolution
        let outcome = 'No specific outcome';
        let product = 'N/A';
        
        // First, look for product in the upward traversal path (most reliable)
        for (const nodeId of baseResolution.traversalPath.upward) {
          const node = FUNCTIONAL_NODES[nodeId];
          if (node && node.level === 'product') {
            product = node.label;
            break;
          }
        }
        
        // If no product found in upward path, check productActivation
        if (product === 'N/A' && baseResolution.productActivation.length > 0) {
          const primaryProduct = baseResolution.productActivation.find(p => p.priority === 'primary');
          if (primaryProduct) {
            product = primaryProduct.product.toUpperCase();
          }
        }
        
        // If still no product, check for product associations in nodes
        if (product === 'N/A') {
          const allPathNodes = [
            ...baseResolution.traversalPath.upward,
            ...baseResolution.traversalPath.downward
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
        for (const nodeId of baseResolution.traversalPath.upward) {
          const node = FUNCTIONAL_NODES[nodeId];
          if (node && node.level === 'outcome') {
            outcome = node.label;
            break;
          }
        }
        
        // If no outcome found in upward path, check downward path
        if (outcome === 'No specific outcome' && baseResolution.traversalPath.downward.length > 0) {
          for (const nodeId of baseResolution.traversalPath.downward) {
            const node = FUNCTIONAL_NODES[nodeId];
            if (node && node.level === 'outcome') {
              outcome = node.label;
              break;
            }
          }
        }
        
        // Get the matched node label (entry node)
        const matchedNode = FUNCTIONAL_NODES[intent.entryNode]?.label || intent.entryNode;
        
        const newAction: RecentAction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          persona: currentContext.profile.role,
          intent: intent.text,
          product: product,
          outcome: outcome,
          matchedNode: matchedNode,
          timestamp: new Date(),
          success: baseResolution.confidenceScore > 0,
          resolution: JSON.parse(JSON.stringify(baseResolution)), // Deep copy the resolution to prevent updates
          toggleStates: {
            showRationalized: showRationalized,
            showWorkflows: showWorkflows
          }
        };
        
        // Add to recent actions for this persona (keep last 10)
        setRecentActionsByPersona(prev => {
          const personaActions = prev[currentContextId] || [];
          const updated = [newAction, ...personaActions].slice(0, 10);
          return {
            ...prev,
            [currentContextId]: updated
          };
        });
        
        // Unselect the intent after adding to recent actions
        // This prevents re-resolution when toggles change
        setSelectedIntent(undefined);
      }
    }
  }, [selectedIntent, baseResolution, currentContext, currentContextId, showRationalized, showWorkflows]);

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(selectedIntent === intentId ? undefined : intentId);
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
        recentActions={recentActionsByPersona[currentContextId] || []}
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
  showWorkflows: boolean
): Resolution {
  // First check if this is a shared/rationalized node that requires rationalization to be on
  if (entryNodeId.includes('-shared') && !showRationalized) {
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
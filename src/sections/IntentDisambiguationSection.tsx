import React, { useState, useMemo, useEffect } from 'react';
import UserContextBar from '../components/UserContextBar';
import IntentExamples from '../components/IntentExamples';
import HierarchyVisualization from '../components/HierarchyVisualization';
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
}

const IntentDisambiguationSection: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<string | undefined>();
  const [currentContextId, setCurrentContextId] = useState<string>('marketing-manager');
  const [showContext, setShowContext] = useState<boolean>(true);
  // Store recent actions per persona
  const [recentActionsByPersona, setRecentActionsByPersona] = useState<Record<string, RecentAction[]>>({});

  const currentContext = SAMPLE_CONTEXTS[currentContextId];

  // Calculate resolution based on selected intent and context
  const { baseResolution, contextualResolution } = useMemo(() => {
    if (!selectedIntent) return { baseResolution: undefined, contextualResolution: undefined };

    const intent = USER_INTENTS.find(i => i.id === selectedIntent);
    if (!intent) return { baseResolution: undefined, contextualResolution: undefined };

    // Base resolution (no context)
    const baseRes = calculateResolution(intent.entryNode, null);
    
    // Contextual resolution
    const contextRes = calculateResolution(intent.entryNode, currentContext);

    return { baseResolution: baseRes, contextualResolution: contextRes };
  }, [selectedIntent, currentContext]);

  const selectedIntentData = USER_INTENTS.find(i => i.id === selectedIntent);

  // Track recent action when intent is selected
  useEffect(() => {
    if (selectedIntent && contextualResolution) {
      const intent = USER_INTENTS.find(i => i.id === selectedIntent);
      if (intent) {
        // Get the outcome and product from the resolution
        let outcome = 'No specific outcome';
        let product = 'N/A';
        
        // Try to get the primary product and its action
        if (contextualResolution.productActivation.length > 0) {
          const primaryProduct = contextualResolution.productActivation.find(p => p.priority === 'primary');
          if (primaryProduct) {
            product = primaryProduct.product.toUpperCase();
            if (primaryProduct.actions.length > 0) {
              const actionNode = FUNCTIONAL_NODES[primaryProduct.actions[0]];
              if (actionNode) {
                outcome = actionNode.label;
              }
            }
          }
        }
        
        // If no product found yet, look through the entire traversal path
        if (product === 'N/A') {
          // Check all nodes in the traversal path for product associations
          const allPathNodes = [
            ...contextualResolution.traversalPath.upward,
            ...contextualResolution.traversalPath.downward
          ];
          
          // Find the first product-level node in the path
          for (const nodeId of allPathNodes) {
            const node = FUNCTIONAL_NODES[nodeId];
            if (node && node.level === 'product') {
              product = node.label.toUpperCase();
              break;
            }
          }
          
          // If still no product, check for product associations in nodes
          if (product === 'N/A') {
            for (const nodeId of allPathNodes) {
              const node = FUNCTIONAL_NODES[nodeId];
              if (node && node.products && node.products.length > 0) {
                product = node.products[0].toUpperCase();
                break;
              }
            }
          }
        }
        
        // Get outcome from the last node if not set
        if (outcome === 'No specific outcome' && contextualResolution.traversalPath.downward.length > 0) {
          const lastNodeId = contextualResolution.traversalPath.downward[contextualResolution.traversalPath.downward.length - 1];
          const lastNode = FUNCTIONAL_NODES[lastNodeId];
          if (lastNode) {
            outcome = lastNode.label;
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
          success: contextualResolution.confidenceScore > 0.5
        };
        
        console.log('Adding new action:', newAction); // Debug log
        
        // Add to recent actions for this persona (keep last 10)
        setRecentActionsByPersona(prev => {
          const personaActions = prev[currentContextId] || [];
          const updated = [newAction, ...personaActions].slice(0, 10);
          console.log(`Updated recent actions for ${currentContextId}:`, updated); // Debug log
          return {
            ...prev,
            [currentContextId]: updated
          };
        });
      }
    }
  }, [selectedIntent, contextualResolution, currentContext, currentContextId]);

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
          recentActions={
            // Combine all recent actions from all personas for the intent history
            Object.values(recentActionsByPersona)
              .flat()
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 10)
          }
        />

        {/* Hierarchy Visualization */}
        <HierarchyVisualization
          selectedIntent={selectedIntent}
          entryNode={selectedIntentData?.entryNode}
          resolution={showContext ? contextualResolution : baseResolution}
          userContext={currentContext}
          showContext={showContext}
        />

        {/* Resolution Comparison Panel */}
        <ResolutionComparison
          baseResolution={baseResolution}
          contextualResolution={contextualResolution}
          userContext={currentContext}
          showContext={showContext}
          selectedIntentText={selectedIntentData?.text}
        />
      </div>

      {/* Context Toggle Button */}
      <button
        onClick={toggleContext}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 330,
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
  );
};

// Helper function to calculate resolution
function calculateResolution(entryNodeId: string, context: UserContext | null): Resolution {
  const entryNode = FUNCTIONAL_NODES[entryNodeId];
  if (!entryNode) {
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: []
    };
  }

  const upwardPath: string[] = [];
  const downwardPath: string[] = [];
  const selectedActions: string[] = [];
  const reasoning: string[] = [];
  let confidenceScore = 0.5;

  // Traverse upward to find context
  let currentNode = entryNode;
  while (currentNode.parents.length > 0) {
    const parentId = currentNode.parents[0];
    upwardPath.push(parentId);
    currentNode = FUNCTIONAL_NODES[parentId];
    if (!currentNode) break;
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
    // Increase confidence based on history
    confidenceScore = 0.7;
    
    // Check if entry node matches recent history
    const recentNodes = context.history.map(h => h.node);
    if (recentNodes.includes(entryNodeId)) {
      confidenceScore = 0.95;
      reasoning.push('Intent matches recent user activity');
    }

    // Check product preferences
    const nodeProducts = entryNode.products || [];
    const preferredProducts = Object.entries(context.patterns.productPreferences)
      .sort(([,a], [,b]) => b - a)
      .map(([product]) => product);
    
    if (nodeProducts.some(p => preferredProducts.includes(p))) {
      confidenceScore = Math.min(confidenceScore + 0.1, 1);
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
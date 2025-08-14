import React, { useState, useMemo } from 'react';
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

const IntentDisambiguationSection: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<string | undefined>();
  const [currentContextId, setCurrentContextId] = useState<string>('marketing-manager');
  const [showContext, setShowContext] = useState<boolean>(true);

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
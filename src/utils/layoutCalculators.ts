// Layout calculation for compact branch-based visualization

import { HierarchyLevel, FunctionalNode } from '../types';
import { LayoutConfig, BranchBounds, NodeLayoutInfo } from '../types/layout';

interface LayoutInput {
  nodesByLevel: Record<HierarchyLevel, string[]>;
  nodes: Record<string, FunctionalNode>;
  parentChildMap: Record<string, string[]>;
  childParentMap: Record<string, string>;
  config: LayoutConfig;
}

interface LayoutResult {
  positions: Record<string, NodeLayoutInfo>;
  graphBounds: { width: number; height: number };
}

/**
 * Compact branch layout - recursive branch-based positioning
 * Each branch gets allocated width based on its size, preventing overlap
 */
export function calculateCompactBranchLayout(input: LayoutInput): LayoutResult {
  const { nodesByLevel, nodes, parentChildMap, childParentMap, config } = input;
  const positions: Record<string, NodeLayoutInfo> = {};
  const levelY = getLevelYPositions(config);
  
  // Calculate minimum graph width based on max nodes at any level
  let maxNodeCount = 0;
  Object.values(nodesByLevel).forEach(nodeIds => {
    maxNodeCount = Math.max(maxNodeCount, nodeIds.length);
  });
  
  const minGraphWidth = Math.max(
    1000,
    maxNodeCount * config.nodeWidth + (maxNodeCount + 1) * config.minNodeSpacing + 
    config.labelMargin + 2 * config.margin
  );
  
  // Recursive function to calculate branch bounds
  function calculateBranchBounds(nodeId: string, level: HierarchyLevel): BranchBounds {
    const children = parentChildMap[nodeId] || [];
    
    if (children.length === 0) {
      // Leaf node - minimum width
      return {
        startX: 0,
        width: config.nodeWidth + 2 * config.minNodeSpacing,
        nodeCount: 1,
        maxNodesInLevel: 1
      };
    }
    
    // Calculate bounds for all child branches recursively
    const childBounds: BranchBounds[] = [];
    let maxChildrenAtLevel = children.length;
    
    children.forEach(childId => {
      const childNode = nodes[childId];
      if (childNode) {
        const childLevel = getNextLevel(level);
        if (childLevel) {
          const bounds = calculateBranchBounds(childId, childLevel);
          childBounds.push(bounds);
          maxChildrenAtLevel = Math.max(maxChildrenAtLevel, bounds.maxNodesInLevel);
        }
      }
    });
    
    // Calculate minimum width needed for this branch
    // Must fit all sub-branches side by side without overlap
    const totalChildBranchWidth = childBounds.reduce((sum, b) => sum + b.width, 0);
    
    // Must also fit direct children with minimum spacing
    const directChildrenMinWidth = children.length * config.nodeWidth + 
                                   (children.length + 1) * config.minNodeSpacing;
    
    // The branch width is the maximum of:
    // 1. Sum of all child branch widths (so they don't overlap)
    // 2. Minimum width for direct children with spacing
    // 3. Minimum width for a single node
    return {
      startX: 0,
      width: Math.max(
        totalChildBranchWidth,
        directChildrenMinWidth,
        config.nodeWidth + 2 * config.minNodeSpacing
      ),
      nodeCount: 1 + childBounds.reduce((sum, b) => sum + b.nodeCount, 0),
      maxNodesInLevel: Math.max(children.length, maxChildrenAtLevel)
    };
  }
  
  // Calculate bounds for all root nodes
  const rootBounds: Map<string, BranchBounds> = new Map();
  const roots = nodesByLevel.product;
  let totalRootWidth = 0;
  
  roots.forEach(rootId => {
    const bounds = calculateBranchBounds(rootId, 'product');
    rootBounds.set(rootId, bounds);
    totalRootWidth += bounds.width;
  });
  
  // Determine graph width
  const graphWidth = Math.max(minGraphWidth, totalRootWidth + config.labelMargin + 2 * config.margin);
  const availableWidth = graphWidth - config.labelMargin - 2 * config.margin;
  
  // Position root nodes with their allocated widths
  let currentX = config.labelMargin + config.margin;
  
  // Calculate spacing between root nodes
  const totalRootMinWidth = roots.length * config.nodeWidth + 
                           (roots.length - 1) * config.minNodeSpacing;
  
  if (totalRootMinWidth > availableWidth) {
    // Not enough space - use minimum spacing
    roots.forEach((rootId, index) => {
      const bounds = rootBounds.get(rootId)!;
      const nodeX = currentX + config.nodeWidth / 2;
      
      positions[rootId] = {
        x: nodeX,
        y: levelY.product,
        branchBounds: { ...bounds, startX: currentX, width: config.nodeWidth + config.minNodeSpacing }
      };
      
      currentX += config.nodeWidth + config.minNodeSpacing;
    });
  } else {
    // Enough space - distribute proportionally
    const extraSpace = availableWidth - totalRootWidth;
    const spacingBetween = roots.length > 1 ? extraSpace / (roots.length + 1) : extraSpace / 2;
    
    currentX += spacingBetween;
    
    roots.forEach((rootId, index) => {
      const bounds = rootBounds.get(rootId)!;
      const centerX = currentX + bounds.width / 2;
      
      positions[rootId] = {
        x: centerX,
        y: levelY.product,
        branchBounds: { ...bounds, startX: currentX }
      };
      
      currentX += bounds.width + spacingBetween;
    });
  }
  
  // Helper function to adjust positions of all descendants
  function adjustDescendantPositions(nodeId: string, offsetX: number) {
    const children = parentChildMap[nodeId] || [];
    children.forEach(childId => {
      if (positions[childId]) {
        positions[childId].x += offsetX;
        if (positions[childId].branchBounds) {
          positions[childId].branchBounds!.startX += offsetX;
        }
        adjustDescendantPositions(childId, offsetX);
      }
    });
  }
  
  // Recursive function to position nodes within their branch
  function positionBranch(nodeId: string, branchBounds: BranchBounds, level: HierarchyLevel) {
    const children = parentChildMap[nodeId] || [];
    if (children.length === 0) return;
    
    const nextLevel = getNextLevel(level);
    if (!nextLevel) return;
    
    // Calculate width for each child based on their subtree size
    const childBounds: Array<{ id: string; bounds: BranchBounds }> = [];
    let totalWeight = 0;
    
    children.forEach(childId => {
      const bounds = calculateBranchBounds(childId, nextLevel);
      childBounds.push({ id: childId, bounds });
      totalWeight += bounds.nodeCount;
    });
    
    // Position children within the branch width
    if (children.length === 1) {
      // Single child - center it within parent's bounds
      const childId = children[0];
      positions[childId] = {
        x: branchBounds.startX + branchBounds.width / 2,
        y: levelY[nextLevel],
        branchBounds: {
          ...childBounds[0].bounds,
          startX: branchBounds.startX
        }
      };
      positionBranch(childId, positions[childId].branchBounds!, nextLevel);
    } else {
      // Multiple children - position based on their branch bounds
      // This ensures branches don't overlap at any level
      
      // Position child branches side by side
      let currentChildX = branchBounds.startX;
      
      children.forEach((childId, index) => {
        const childBranchBounds = childBounds[index].bounds;
        
        // Position the child node centered within its branch
        const childNodeX = currentChildX + childBranchBounds.width / 2;
        
        positions[childId] = {
          x: childNodeX,
          y: levelY[nextLevel],
          branchBounds: {
            ...childBranchBounds,
            startX: currentChildX,
            width: childBranchBounds.width
          }
        };
        
        // Recursively position the child's subtree
        positionBranch(childId, positions[childId].branchBounds!, nextLevel);
        
        // Move to next branch position
        currentChildX += childBranchBounds.width;
      });
      
      // If the children don't fill the parent's width, center them
      const totalChildrenWidth = currentChildX - branchBounds.startX;
      if (totalChildrenWidth < branchBounds.width) {
        const offset = (branchBounds.width - totalChildrenWidth) / 2;
        
        // Adjust all children positions to center them
        children.forEach(childId => {
          const pos = positions[childId];
          pos.x += offset;
          if (pos.branchBounds) {
            pos.branchBounds.startX += offset;
          }
          
          // Also adjust all descendants
          adjustDescendantPositions(childId, offset);
        });
      }
    }
  }
  
  // Position all branches recursively
  roots.forEach(rootId => {
    const rootPos = positions[rootId];
    if (rootPos && rootPos.branchBounds) {
      positionBranch(rootId, rootPos.branchBounds, 'product');
    }
  });
  
  // Position remaining nodes that might not be in the tree
  Object.entries(nodesByLevel).forEach(([level, nodeIds]) => {
    nodeIds.forEach(nodeId => {
      if (!positions[nodeId]) {
        // Orphan node - center it
        positions[nodeId] = {
          x: graphWidth / 2,
          y: levelY[level as keyof typeof levelY]
        };
      }
    });
  });
  
  return {
    positions,
    graphBounds: {
      width: graphWidth,
      height: config.margin * 2 + 50 + config.levelHeight * 5 + 50
    }
  };
}

// Helper function to get Y positions for each level
function getLevelYPositions(config: LayoutConfig) {
  return {
    product: config.margin + 50,
    workflow: config.margin + 50 + config.levelHeight,
    outcome: config.margin + 50 + config.levelHeight * 2,
    scenario: config.margin + 50 + config.levelHeight * 3,
    step: config.margin + 50 + config.levelHeight * 4,
    action: config.margin + 50 + config.levelHeight * 5
  };
}

// Helper function to get the next level in hierarchy
function getNextLevel(level: HierarchyLevel): HierarchyLevel | null {
  const levelOrder: Record<HierarchyLevel, HierarchyLevel | null> = {
    product: 'outcome',
    outcome: 'scenario',
    scenario: 'step',
    step: 'action',
    action: null,
    workflow: null
  };
  return levelOrder[level];
}
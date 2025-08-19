import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { select } from 'd3-selection';
import 'd3-transition'; // This extends the selection prototype with transition()
import { zoom as d3Zoom, zoomIdentity, ZoomBehavior, D3ZoomEvent, ZoomTransform } from 'd3-zoom';
import { 
  FunctionalNode, 
  UserContext,
  Resolution,
  HierarchyLevel,
  LEVEL_COLORS,
  LAYOUT
} from '../config';
import type { NodeMetadata } from '../utils/graphModel';
import TreeNode from './TreeNode';
import { DEFAULT_LAYOUT_CONFIG } from '../types/layout';
import { calculateCompactBranchLayout } from '../utils/layoutCalculators';

export type ExpansionMode = 'single' | 'multiple';

interface HierarchyVisualizationProps {
  selectedIntent?: string;
  entryNode?: string;
  resolution?: Resolution;
  userContext?: UserContext;
  showContext: boolean;
  expansionMode?: ExpansionMode; // Control whether multiple siblings can be expanded
  showOverlaps?: boolean; // Show overlap indicators on duplicate nodes
  showRationalized?: boolean; // Show rationalized/unified nodes
  showWorkflows?: boolean; // Show cross-product workflow nodes
  recentActions?: any[]; // Recent actions for fallback resolution
  domainConfig?: any; // Domain-specific configuration
}

interface NodePosition {
  x: number;
  y: number;
  node: FunctionalNode;
  visible: boolean;
}

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({
  selectedIntent,
  entryNode,
  resolution,
  userContext,
  showContext,
  expansionMode = 'single', // Default to single expansion mode for backward compatibility
  showOverlaps = false, // Default to not showing overlap indicators
  showRationalized = true, // Default to showing rationalized state
  showWorkflows = false, // Default to not showing workflows
  recentActions = [],
  domainConfig,
}) => {
  // Get domain-specific values or fallback to imported defaults
  const FUNCTIONAL_NODES = domainConfig?.FUNCTIONAL_NODES || require('../config').FUNCTIONAL_NODES;
  const FUNCTIONAL_GRAPH = domainConfig?.FUNCTIONAL_GRAPH || require('../config').FUNCTIONAL_GRAPH;
  const graphOps = domainConfig?.graphOps || require('../config').graphOps;
  const PRODUCT_COLORS = domainConfig?.PRODUCT_COLORS || require('../config').PRODUCT_COLORS;
  const DUPLICATE_NODES = domainConfig?.DUPLICATE_NODES || require('../config').DUPLICATE_NODES;
  const SHARED_NODES = domainConfig?.SHARED_NODES || require('../config').SHARED_NODES;
  // Use the most recent action's resolution if there's no selected intent
  // But only if a recent action is actually selected (not deselected by user)
  const selectedRecentAction = recentActions.length > 0 ? recentActions[0] : null;
  const effectiveResolution = resolution || selectedRecentAction?.resolution;
  const effectiveEntryNode = entryNode || selectedRecentAction?.resolution?.entryNode;
  const [animationPhase, setAnimationPhase] = useState<'entry' | 'upward' | 'downward' | 'complete'>('entry');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [lastExpandedNode, setLastExpandedNode] = useState<string | null>(null); // Track last expanded node
  
  // d3-zoom state and refs
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  
  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const [pendingFocusNode, setPendingFocusNode] = useState<string | null>(null);
  const [focusBounds, setFocusBounds] = useState<{minX: number, maxX: number, minY: number, maxY: number} | null>(null);
  
  // Track node position for maintaining view stability (currently disabled)
  const [nodeToMaintain, setNodeToMaintain] = useState<string | null>(null);
  
  // Effect to handle expansion mode changes
  useEffect(() => {
    if (expansionMode === 'single' && lastExpandedNode) {
      // When switching to single mode, keep only the branch containing the last expanded node
      setExpandedNodes(prev => {
        const newSet = new Set<string>();
        
        // If we have a last expanded node, keep its path
        if (prev.has(lastExpandedNode)) {
          // Add the last expanded node
          newSet.add(lastExpandedNode);
          
          // Find all ancestors of the last expanded node that are expanded
          const ancestors = graphOps.getAncestors(lastExpandedNode);
          ancestors.forEach((ancestorId: string) => {
            if (prev.has(ancestorId)) {
              newSet.add(ancestorId);
            }
          });
          
          // For each level, we need to collapse siblings
          // Build the path from root to last expanded node
          const pathToLastNode = new Set<string>([lastExpandedNode]);
          
          // Add all ancestors in the path
          let currentNode = lastExpandedNode;
          while (true) {
            const parents = graphOps.getParents(currentNode);
            if (parents.length === 0) break;
            
            // Find which parent is expanded
            const expandedParent = parents.find((p: string) => prev.has(p));
            if (expandedParent) {
              pathToLastNode.add(expandedParent);
              currentNode = expandedParent;
            } else {
              break;
            }
          }
          
          // Now only keep nodes that are in the path to the last expanded node
          prev.forEach((nodeId: string) => {
            if (pathToLastNode.has(nodeId)) {
              newSet.add(nodeId);
            }
          });
        } else {
          // If last expanded node is no longer expanded, fall back to keeping first of each sibling group
          const nodesByParent = new Map<string | null, string[]>();
          
          prev.forEach((nodeId: string) => {
            const parents = graphOps.getParents(nodeId);
            const parentKey = parents.length > 0 ? parents[0] : null;
            
            if (!nodesByParent.has(parentKey)) {
              nodesByParent.set(parentKey, []);
            }
            nodesByParent.get(parentKey)!.push(nodeId);
          });
          
          nodesByParent.forEach((children: string[], parentKey: string | null) => {
            if (children.length > 0) {
              children.sort();
              newSet.add(children[0]);
            }
          });
        }
        
        return newSet;
      });
    }
    // When switching to multiple mode, we keep all expanded nodes as they are
  }, [expansionMode, lastExpandedNode]);
  

  // Calculate which nodes are in the matched path using the new graph model
  const matchedNodes = useMemo(() => {
    if (!effectiveResolution || !effectiveEntryNode) return new Set<string>();
    
    const matched = new Set<string>();
    
    // Add entry node
    matched.add(effectiveEntryNode);
    
    // Add all nodes in traversal paths
    effectiveResolution.traversalPath.upward.forEach((nodeId: string) => matched.add(nodeId));
    effectiveResolution.traversalPath.downward.forEach((nodeId: string) => matched.add(nodeId));
    
    // Use the new graph model to get all ancestors for connectivity
    // This ensures we have a complete tree structure from root to leaves
    const allNodesInPath = Array.from(matched);
    allNodesInPath.forEach((nodeId: string) => {
      const ancestors = graphOps.getAncestors(nodeId);
      ancestors.forEach((ancestorId: string) => matched.add(ancestorId));
    });
    
    return matched;
  }, [effectiveResolution, effectiveEntryNode]);

  // Initialize expanded nodes based on selection and/or overlaps
  useEffect(() => {
    const nodesToExpand = new Set<string>();
    
    // First, handle intent selection if present
    if ((selectedIntent || effectiveResolution) && effectiveEntryNode) {
      // When intent is selected or recent action is selected, expand nodes along the matched path
      // Build path from entry node up to root using graph model
      const ancestors = graphOps.getAncestors(effectiveEntryNode);
      
      // Add all ancestors that are in the matched path
      ancestors.forEach((ancestorId: string) => {
        if (matchedNodes.has(ancestorId)) {
          // Check if this ancestor has matched children that need to be shown
          const children = graphOps.getChildren(ancestorId);
          if (children.some((childId: string) => matchedNodes.has(childId))) {
            nodesToExpand.add(ancestorId);
          }
        }
      });
      
      // Expand entry node if it has children in the matched path
      const entryNodeChildren = graphOps.getChildren(effectiveEntryNode);
      if (entryNodeChildren.some((childId: string) => matchedNodes.has(childId))) {
        nodesToExpand.add(effectiveEntryNode);
      }
      
      // Also expand any nodes in the downward path that have matched children
      if (effectiveResolution) {
        effectiveResolution.traversalPath.downward.forEach((nodeId: string) => {
          const children = graphOps.getChildren(nodeId);
          if (children.some((childId: string) => matchedNodes.has(childId))) {
            nodesToExpand.add(nodeId);
          }
        });
      }
      
      // Special case for workflow nodes: always expand them to show their outcomes
      if (effectiveResolution && FUNCTIONAL_NODES[effectiveEntryNode]?.level === 'workflow') {
        nodesToExpand.add(effectiveEntryNode);
      }
      
    }
    
    // Then, handle overlaps if showOverlaps is ON and no intent is selected
    else if (showOverlaps) {
      // Use the imported lists from config
      // Determine which nodes to use based on rationalization state
      const overlappingNodes = showRationalized ? SHARED_NODES : DUPLICATE_NODES;
      
      // For each overlapping node, expand its parent and ancestors
      overlappingNodes.forEach((nodeId: string) => {
        // Only process if this node exists
        if (FUNCTIONAL_NODES[nodeId]) {
          // Get immediate parents
          const parents = graphOps.getParents(nodeId);
          parents.forEach((parentId: string) => {
            // Expand the parent
            nodesToExpand.add(parentId);
            
            // Walk up and expand all ancestors
            let current = parentId;
            while (current) {
              const grandparents = graphOps.getParents(current);
              if (grandparents.length > 0) {
                nodesToExpand.add(grandparents[0]);
                current = grandparents[0];
              } else {
                break;
              }
            }
          });
        }
      });
      
    }
    
    // Set the final expanded nodes
    setExpandedNodes(nodesToExpand);
  }, [selectedIntent, effectiveResolution, effectiveEntryNode, matchedNodes, showOverlaps, showRationalized]);

  // Don't auto-reset zoom and pan - let user control it manually or via focus mode

  // Calculate which nodes should be visible using depth-first traversal
  const visibleNodes = useMemo(() => {
    const visible = new Set<string>();
    
    // Depth-first traversal to collect visible nodes
    const dfsCollectVisible = (nodeId: string, parentVisible: boolean = true, parentExpanded: boolean = true) => {
      if (!parentVisible || !parentExpanded) return;
      
      const node = FUNCTIONAL_GRAPH.nodes[nodeId];
      if (!node) return;
      
      // Filter nodes based on rationalized state
      // Only filter specific duplicate nodes that have shared alternatives
      // Using imported constants from config
      
      // Filter workflow nodes based on showWorkflows toggle
      if (node.level === 'workflow' && !showWorkflows) {
        return; // Hide workflow nodes when showWorkflows is false
      }
      
      // Filter based on independent toggle states
      if (showRationalized) {
        // When rationalized is ON, hide duplicate nodes UNLESS they are descendants of shared nodes
        if (DUPLICATE_NODES.includes(nodeId)) {
          // Check if this duplicate node is a descendant of a shared node
          const ancestors = graphOps.getAncestors(nodeId);
          const hasSharedAncestor = ancestors.some((ancestorId: string) => SHARED_NODES.includes(ancestorId));
          
          // If it has a shared ancestor, keep it visible (it's part of the unified structure)
          if (!hasSharedAncestor) {
            return; // Only hide if it doesn't have a shared ancestor
          }
        }
      } else {
        // When rationalized is OFF, hide shared nodes
        if (SHARED_NODES.includes(nodeId)) {
          return;
        }
      }
      
      // Check if this node should be visible
      const shouldBeVisible = selectedIntent 
        ? matchedNodes.has(nodeId)  // When intent selected, only show matched nodes
        : true;  // When no intent, show all nodes that are reached through expanded parents
      
      if (shouldBeVisible && parentVisible && parentExpanded) {
        visible.add(nodeId);
        
        // Traverse children, passing whether this node is expanded
        const isThisNodeExpanded = expandedNodes.has(nodeId);
        const children = graphOps.getChildren(nodeId);
        children.forEach((childId: string) => {
          dfsCollectVisible(childId, true, isThisNodeExpanded);
        });
      }
    };
    
    // Start DFS from root nodes (products)
    const roots = Array.from(FUNCTIONAL_GRAPH.graph.roots);
    
    // When showing overlaps and no intent is selected, show all roots but only traverse if expanded
    if (showOverlaps && !selectedIntent) {
      (roots as string[]).forEach((rootId: string) => {
        // Always make root visible when showing overlaps
        visible.add(rootId);
        // Only traverse children if this root is expanded
        const isRootExpanded = expandedNodes.has(rootId);
        if (isRootExpanded) {
          const children = graphOps.getChildren(rootId);
          children.forEach((childId: string) => {
            dfsCollectVisible(childId, true, true);
          });
        }
      });
    } else if (selectedIntent) {
      // When intent selected, only show roots that match
      (roots as string[]).forEach((rootId: string) => {
        if (matchedNodes.has(rootId)) {
          dfsCollectVisible(rootId, true, true);
        }
      });
    } else {
      // Default case: show all roots
      (roots as string[]).forEach((rootId: string) => {
        visible.add(rootId);
        // Only traverse children if this root is expanded
        const isRootExpanded = expandedNodes.has(rootId);
        if (isRootExpanded) {
          const children = graphOps.getChildren(rootId);
          children.forEach((childId: string) => {
            dfsCollectVisible(childId, true, true);
          });
        }
      });
    }
    
    return visible;
  }, [expandedNodes, selectedIntent, matchedNodes, showOverlaps, showRationalized, showWorkflows]);

  // Calculate node positions using selected layout strategy
  const { nodePositions, graphBounds } = useMemo(() => {
    
    // Use layout constants from config
    const { NODE_WIDTH, MIN_NODE_SPACING, MARGIN, LABEL_MARGIN } = LAYOUT;
    const layoutConfig = {
      nodeWidth: NODE_WIDTH,
      minNodeSpacing: MIN_NODE_SPACING,
      levelHeight: 100,
      margin: MARGIN,
      labelMargin: LABEL_MARGIN
    };

    // Collect nodes by level in depth-first order
    const nodesByLevel: Record<HierarchyLevel, string[]> = {
      product: [],
      workflow: [],
      outcome: [],
      scenario: [],
      step: [],
      action: []
    };

    // Track parent-child relationships for better alignment
    const parentChildMap: Record<string, string[]> = {};
    const childParentMap: Record<string, string> = {};
    
    // Depth-first traversal to maintain parent-child ordering
    const dfsCollectByLevel = (nodeId: string, parentId?: string) => {
      const node = FUNCTIONAL_GRAPH.nodes[nodeId];
      if (!node) return;
      
      // Skip workflow nodes - they'll be collected separately
      if (node.level === 'workflow') {
        return;
      }
      
      // Only add if visible and not already added
      if (visibleNodes.has(nodeId) && !nodesByLevel[node.level as HierarchyLevel].includes(nodeId)) {
        nodesByLevel[node.level as HierarchyLevel].push(nodeId);
        
        // Track parent-child relationship
        if (parentId) {
          if (!parentChildMap[parentId]) {
            parentChildMap[parentId] = [];
          }
          parentChildMap[parentId].push(nodeId);
          childParentMap[nodeId] = parentId;
        }
      }
      
      // For product nodes, only traverse to direct outcome children (not through workflows)
      if (node.level === 'product') {
        // Get all children
        const children = graphOps.getChildren(nodeId);
        
        // Process only direct outcome children (skip workflows)
        children.forEach((childId: string) => {
          const childNode = FUNCTIONAL_GRAPH.nodes[childId];
          if (childNode && childNode.level === 'outcome' && visibleNodes.has(childId)) {
            dfsCollectByLevel(childId, nodeId);
          }
        });
      } else {
        // For non-product nodes, traverse children normally (but skip workflows)
        const children = graphOps.getChildren(nodeId);
        children.forEach((childId: string) => {
          const childNode = FUNCTIONAL_GRAPH.nodes[childId];
          // Skip workflow nodes during traversal
          if (childNode && childNode.level !== 'workflow' && visibleNodes.has(childId)) {
            dfsCollectByLevel(childId, nodeId);
          }
        });
      }
    };

    // Collect all nodes maintaining product-based ordering
    const roots = Array.from(FUNCTIONAL_GRAPH.graph.roots);
    roots.sort(); // Ensure consistent ordering
    (roots as string[]).forEach((rootId: string) => {
      if (visibleNodes.has(rootId)) {
        dfsCollectByLevel(rootId, undefined);
      }
    });
    
    // Collect workflow nodes separately at the end if they're visible
    if (showWorkflows) {
      visibleNodes.forEach((nodeId: string) => {
        const node = FUNCTIONAL_GRAPH.nodes[nodeId];
        if (node && node.level === 'workflow' && !nodesByLevel.workflow.includes(nodeId)) {
          nodesByLevel.workflow.push(nodeId);
        }
      });
      // Sort workflow nodes for consistent ordering
      nodesByLevel.workflow.sort();
    }
    
    // Sort nodes within each level to maintain parent-child proximity
    // This helps keep children aligned under their parents
    const sortNodesByParentPosition = (level: HierarchyLevel) => {
      const nodes = nodesByLevel[level];
      if (nodes.length <= 1) return;
      
      // Group nodes by their parent
      const nodeGroups: Record<string, string[]> = { 'no-parent': [] };
      nodes.forEach(nodeId => {
        const parentId = childParentMap[nodeId];
        if (parentId) {
          if (!nodeGroups[parentId]) {
            nodeGroups[parentId] = [];
          }
          nodeGroups[parentId].push(nodeId);
        } else {
          nodeGroups['no-parent'].push(nodeId);
        }
      });
      
      // Rebuild the level array with grouped nodes
      const sortedNodes: string[] = [];
      
      // First add nodes without parents
      sortedNodes.push(...nodeGroups['no-parent']);
      
      // Then add nodes grouped by parent (in parent order from previous level)
      const parentLevel = level === 'outcome' ? 'product' :
                          level === 'scenario' ? 'outcome' :
                          level === 'step' ? 'scenario' :
                          level === 'action' ? 'step' : null;
      
      if (parentLevel && nodesByLevel[parentLevel]) {
        nodesByLevel[parentLevel].forEach(parentId => {
          if (nodeGroups[parentId]) {
            sortedNodes.push(...nodeGroups[parentId]);
          }
        });
      }
      
      // Replace the level array with sorted version
      nodesByLevel[level] = sortedNodes;
    };
    
    // Sort each level to maintain parent-child alignment
    (['outcome', 'scenario', 'step', 'action'] as HierarchyLevel[]).forEach(level => {
      sortNodesByParentPosition(level);
    });

    // Prepare input for layout calculators
    const layoutInput = {
      nodesByLevel,
      nodes: FUNCTIONAL_NODES,
      parentChildMap,
      childParentMap,
      config: layoutConfig
    };
    
    // Use compact branch layout
    const layoutResult = calculateCompactBranchLayout(layoutInput);
    
    // Convert layout result to NodePosition format expected by the component
    const positions: Record<string, NodePosition> = {};
    Object.entries(layoutResult.positions).forEach(([nodeId, pos]) => {
      positions[nodeId] = {
        x: pos.x,
        y: pos.y,
        node: FUNCTIONAL_NODES[nodeId],
        visible: visibleNodes.has(nodeId)
      };
    });

    // Add positions for hidden nodes (for smooth transitions)
    Object.keys(FUNCTIONAL_GRAPH.nodes).forEach((nodeId: string) => {
      if (!positions[nodeId]) {
        // Position hidden nodes at their parent's location
        const parents = graphOps.getParents(nodeId);
        const parentPos = parents.length > 0 ? positions[parents[0]] : null;
        const node = FUNCTIONAL_GRAPH.nodes[nodeId];
        
        // Get level Y position based on node level
        const levelY = {
          product: layoutConfig.margin + 50,
          workflow: layoutConfig.margin + 50 + layoutConfig.levelHeight,
          outcome: layoutConfig.margin + 50 + layoutConfig.levelHeight * 2,
          scenario: layoutConfig.margin + 50 + layoutConfig.levelHeight * 3,
          step: layoutConfig.margin + 50 + layoutConfig.levelHeight * 4,
          action: layoutConfig.margin + 50 + layoutConfig.levelHeight * 5
        };
        
        positions[nodeId] = {
          x: parentPos ? parentPos.x : layoutResult.graphBounds.width / 2, // Center by default
          y: parentPos ? parentPos.y : levelY[node!.level as keyof typeof levelY],
          node: FUNCTIONAL_NODES[nodeId], // Keep using old format for compatibility
          visible: false
        };
      }
    });

    return { nodePositions: positions, graphBounds: layoutResult.graphBounds };
  }, [visibleNodes, showWorkflows, FUNCTIONAL_NODES, FUNCTIONAL_GRAPH.nodes, graphOps]);


  // Calculate confidence based on user context
  const getNodeConfidence = (nodeId: string): number => {
    if (!showContext || !userContext || !userContext.history.length) return 0.5;
    
    const node = FUNCTIONAL_GRAPH.nodes[nodeId];
    if (!node) return 0.5;

    // Check if node appears in recent history
    const recentUse = userContext.history.some(h => h.node === nodeId);
    if (recentUse) return 0.95;

    // Check product preferences
    const nodeProducts = node.products || [];
    const avgPreference = nodeProducts.reduce((sum: number, product: string) => {
      return sum + (userContext.patterns.productPreferences[product] || 0);
    }, 0) / Math.max(nodeProducts.length, 1);

    return 0.5 + (avgPreference * 0.45);
  };

  // Get the product color for a node based on its product root
  const getNodeProductColor = (nodeId: string): string => {
    const node = FUNCTIONAL_GRAPH.nodes[nodeId];
    if (!node) return LEVEL_COLORS.product; // Fallback to gray
    
    // If this is a product node, use its product color directly
    if (node.level === 'product') {
      const productKey = node.id.replace('product-', '');
      return PRODUCT_COLORS[productKey as keyof typeof PRODUCT_COLORS] || LEVEL_COLORS.product;
    }
    
    // If this is a workflow node, use the workflow color
    if (node.level === 'workflow') {
      return LEVEL_COLORS.workflow;
    }
    
    // Otherwise, find the product ancestor (skipping workflow level)
    const ancestors = graphOps.getAncestors(nodeId);
    for (const ancestorId of ancestors) {
      const ancestor = FUNCTIONAL_GRAPH.nodes[ancestorId];
      if (ancestor && ancestor.level === 'product') {
        const productKey = ancestor.id.replace('product-', '');
        return PRODUCT_COLORS[productKey as keyof typeof PRODUCT_COLORS] || LEVEL_COLORS.product;
      }
    }
    
    // If no product ancestor found, check if node has product associations
    if (node.products && node.products.length > 0) {
      return PRODUCT_COLORS[node.products[0] as keyof typeof PRODUCT_COLORS] || LEVEL_COLORS.product;
    }
    
    return LEVEL_COLORS.product; // Default fallback
  };

  // Initialize d3-zoom
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const zoom = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 10]) // Min zoom 0.3x, max zoom 10x
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        setTransform(event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Cleanup
    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  // Animation control
  useEffect(() => {
    if (!selectedIntent) {
      setAnimationPhase('entry');
      return;
    }

    const phases = ['entry', 'upward', 'downward', 'complete'];
    let currentPhase = 0;

    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < phases.length) {
        setAnimationPhase(phases[currentPhase] as any);
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [selectedIntent]);

  // Zoom control handlers using d3-zoom API
  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const svg = select(svgRef.current) as any;
    svg.transition()
      .duration(250)
      .call(zoomBehaviorRef.current.scaleBy, 1.2);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const svg = select(svgRef.current) as any;
    svg.transition()
      .duration(250)
      .call(zoomBehaviorRef.current.scaleBy, 1 / 1.2);
  }, []);

  const handleZoomReset = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const svg = select(svgRef.current) as any;
    svg.transition()
      .duration(750)
      .call(zoomBehaviorRef.current.transform, zoomIdentity);
  }, []);

  // Auto-focus function using d3-zoom
  const autoFocus = useCallback((nodeIds: string[], options?: {
    padding?: number;
    duration?: number;
    minScale?: number;
    maxScale?: number;
  }) => {
    if (!svgRef.current || !zoomBehaviorRef.current || nodeIds.length === 0) return;
    
    const {
      padding = 100,
      duration = 750,
      minScale = 0.5,
      maxScale = 4
    } = options || {};
    
    // Calculate bounding box for the nodes
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    nodeIds.forEach(nodeId => {
      const pos = nodePositions[nodeId];
      if (pos) {
        const nodeHalfWidth = 70;
        const nodeHalfHeight = 25;
        minX = Math.min(minX, pos.x - nodeHalfWidth);
        maxX = Math.max(maxX, pos.x + nodeHalfWidth);
        minY = Math.min(minY, pos.y - nodeHalfHeight);
        maxY = Math.max(maxY, pos.y + nodeHalfHeight);
      }
    });
    
    if (!isFinite(minX) || !isFinite(maxX)) return;
    
    // Add padding
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;
    
    // Calculate dimensions
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Get viewport dimensions
    const viewportWidth = svgRef.current.clientWidth;
    const viewportHeight = svgRef.current.clientHeight;
    
    // Calculate optimal scale
    const scale = Math.min(
      maxScale,
      Math.max(
        minScale,
        Math.min(
          viewportWidth / width,
          viewportHeight / height
        ) * 0.9 // 90% to leave margin
      )
    );
    
    // Apply transform with animation
    const svg = select(svgRef.current) as any;
    svg.transition()
      .duration(duration)
      .call(
        zoomBehaviorRef.current.transform,
        zoomIdentity
          .translate(viewportWidth / 2, viewportHeight / 2)
          .scale(scale)
          .translate(-centerX, -centerY)
      );
  }, [nodePositions]);

  // Toggle node expansion with configurable peer collapse behavior using graph model
  const focusOnBranch = useCallback((nodeId: string) => {
    if (!nodePositions[nodeId]) return;
    
    // Collect all visible nodes in the branch
    const branchNodes: string[] = [nodeId];
    
    const addDescendants = (id: string) => {
      const children = graphOps.getChildren(id);
      children.forEach((childId: string) => {
        if (visibleNodes.has(childId) && !branchNodes.includes(childId)) {
          branchNodes.push(childId);
          if (expandedNodes.has(childId)) {
            addDescendants(childId);
          }
        }
      });
    };
    
    if (expandedNodes.has(nodeId)) {
      addDescendants(nodeId);
    }
    
    // Use auto-focus to zoom into the branch
    autoFocus(branchNodes, {
      padding: 50,
      duration: 500,
      maxScale: 2
    });
  }, [nodePositions, expandedNodes, visibleNodes, graphOps, autoFocus]);

  // Clear nodeToMaintain when positions update (compensation disabled)
  useEffect(() => {
    if (nodeToMaintain) {
      setNodeToMaintain(null);
    }
  }, [nodeToMaintain, nodePositions]);

  // Handle focus on pending node using d3-zoom
  useEffect(() => {
    if (pendingFocusNode && nodePositions[pendingFocusNode] && focusMode) {
      // Collect all visible nodes in the branch
      const branchNodes: string[] = [pendingFocusNode];
      
      const addDescendants = (id: string) => {
        const children = graphOps.getChildren(id);
        children.forEach((childId: string) => {
          if (visibleNodes.has(childId) && !branchNodes.includes(childId)) {
            branchNodes.push(childId);
            if (expandedNodes.has(childId)) {
              addDescendants(childId);
            }
          }
        });
      };
      
      if (expandedNodes.has(pendingFocusNode)) {
        addDescendants(pendingFocusNode);
      }
      
      // Use auto-focus to center on the branch
      autoFocus(branchNodes, {
        padding: 80,
        duration: 750,
        maxScale: 2.5
      });
      
      // Clear the pending focus node
      setPendingFocusNode(null);
    }
  }, [pendingFocusNode, nodePositions, expandedNodes, visibleNodes, focusMode, graphOps, autoFocus]);

  const toggleNodeExpansion = (nodeId: string) => {
    const children = graphOps.getChildren(nodeId);
    if (children.length === 0) return;
    
    // If intent is selected, only allow toggling matched nodes
    if (selectedIntent && !matchedNodes.has(nodeId)) return;
    
    // Check if this node has any matched children to expand
    const hasMatchedChildren = selectedIntent ? 
      children.some((childId: string) => matchedNodes.has(childId)) : 
      true;
    
    if (!hasMatchedChildren) return;
    
    const isExpanding = !expandedNodes.has(nodeId);
    
    // Store node id for reference (compensation disabled)
    setNodeToMaintain(nodeId);
    
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      
      // If this node is already expanded, just collapse it
      if (newSet.has(nodeId)) {
        // Collapse: remove this node and all its descendants from expanded set
        const removeDescendants = (id: string) => {
          newSet.delete(id);
          const descendants = graphOps.getDescendants(id);
          descendants.forEach((descId: string) => newSet.delete(descId));
        };
        removeDescendants(nodeId);
      } else {
        // Expand the node - track this as the last expanded node
        setLastExpandedNode(nodeId);
        
        // Only collapse siblings if in 'single' expansion mode
        if (expansionMode === 'single') {
          const node = FUNCTIONAL_GRAPH.nodes[nodeId];
          if (!node) return newSet;
          
          // Find all peers that need to be collapsed
          const peersToCollapse: string[] = [];
          const parents = graphOps.getParents(nodeId);
          
          if (parents.length > 0) {
            // If this node has parents, find siblings through parents
            parents.forEach((parentId: string) => {
              const siblings = graphOps.getChildren(parentId);
              siblings.forEach((siblingId: string) => {
                if (siblingId !== nodeId) {
                  // Check if this sibling or any of its descendants are expanded
                  const checkExpanded = (id: string): boolean => {
                    if (newSet.has(id)) return true;
                    const descendants = graphOps.getDescendants(id);
                    return descendants.some((descId: string) => newSet.has(descId));
                  };
                  
                  if (checkExpanded(siblingId)) {
                    peersToCollapse.push(siblingId);
                  }
                }
              });
            });
          } else {
            // This is a root node - find other expanded nodes at same level
            const nodesAtLevel = graphOps.getNodesAtLevel(node.level);
            nodesAtLevel.forEach((n: NodeMetadata) => {
              if (n.id !== nodeId && graphOps.getParents(n.id).length === 0) {
                const checkExpanded = (id: string): boolean => {
                  if (newSet.has(id)) return true;
                  const descendants = graphOps.getDescendants(id);
                  return descendants.some((descId: string) => newSet.has(descId));
                };
                
                if (checkExpanded(n.id)) {
                  peersToCollapse.push(n.id);
                }
              }
            });
          }
          
          // Collapse all peer nodes and their entire subtrees
          peersToCollapse.forEach((peerId: string) => {
            newSet.delete(peerId);
            const descendants = graphOps.getDescendants(peerId);
            descendants.forEach((descId: string) => newSet.delete(descId));
          });
        }
        // If expansionMode === 'multiple', we don't collapse siblings
        
        // Now expand this node
        newSet.add(nodeId);
      }
      
      return newSet;
    });
    
  };

  // Render connections between nodes using the graph model
  const renderConnections = () => {
    const connections: React.ReactElement[] = [];
    const drawnConnections = new Set<string>();
    
    // Only draw connections from expanded nodes to their visible children
    expandedNodes.forEach((parentId: string) => {
      if (!visibleNodes.has(parentId)) return;
      
      // Use graph model to get children
      const children = graphOps.getChildren(parentId);
      
      children.forEach((childId: string) => {
        if (!visibleNodes.has(childId)) return;
        
        const connectionKey = `${parentId}-${childId}`;
        if (drawnConnections.has(connectionKey)) return;
        drawnConnections.add(connectionKey);
        
        const parentPos = nodePositions[parentId];
        const childPos = nodePositions[childId];
        
        if (parentPos && childPos && parentPos.visible && childPos.visible) {
          const isInPath = effectiveResolution && (
            (effectiveResolution.traversalPath.upward.includes(parentId) && effectiveResolution.traversalPath.upward.includes(childId)) ||
            (effectiveResolution.traversalPath.downward.includes(parentId) && effectiveResolution.traversalPath.downward.includes(childId)) ||
            (parentId === effectiveEntryNode && effectiveResolution.traversalPath.downward.includes(childId)) ||
            (childId === effectiveEntryNode && effectiveResolution.traversalPath.upward.includes(parentId))
          );

          const isUpward = resolution && (
            effectiveResolution.traversalPath.upward.includes(parentId) && 
            effectiveResolution.traversalPath.upward.includes(childId)
          );
          
          const isDownward = resolution && (
            (effectiveResolution.traversalPath.downward.includes(parentId) && effectiveResolution.traversalPath.downward.includes(childId)) ||
            (parentId === entryNode && resolution.traversalPath.downward.includes(childId))
          );

          // Get product color for the connection
          const connectionColor = getNodeProductColor(parentId);

          // Draw a curved path
          const midY = (parentPos.y + childPos.y) / 2;
          const path = `M ${parentPos.x} ${parentPos.y + 25} C ${parentPos.x} ${midY}, ${childPos.x} ${midY}, ${childPos.x} ${childPos.y - 25}`;

          connections.push(
            <path
              key={connectionKey}
              d={path}
              fill="none"
              stroke={isInPath ? connectionColor : connectionColor}
              strokeWidth={isInPath ? 2.5 : 1.5}
              strokeDasharray={isUpward ? '5,5' : 'none'}
              opacity={isInPath ? 1 : 0.5}
            />
          );
        }
      });
    });

    return connections;
  };

  // Render a single node using TreeNode component
  const renderNode = (nodeId: string) => {
    const pos = nodePositions[nodeId];
    if (!pos || !pos.visible) return null;

    const node = pos.node;
    const isEntry = effectiveEntryNode === nodeId;
    const isInUpward = effectiveResolution?.traversalPath.upward.includes(nodeId);
    const isInDownward = effectiveResolution?.traversalPath.downward.includes(nodeId);
    const isInPath = isEntry || isInUpward || isInDownward;
    const confidence = getNodeConfidence(nodeId);
    const isExpanded = expandedNodes.has(nodeId);
    const children = graphOps.getChildren(nodeId);
    const hasChildren = children.length > 0;
    const hasMatchedChildren = selectedIntent ? 
      children.some((childId: string) => matchedNodes.has(childId)) : 
      hasChildren;
    const isHovered = hoveredNode === nodeId;

    const productColor = getNodeProductColor(nodeId);
    
    // Create a light background color by adding opacity to the product color
    const getLightColor = (color: string): string => {
      // Convert hex to RGB and add 15% opacity
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.15)`;
    };
    
    // Check if this node is shared across multiple products
    const nodeData = FUNCTIONAL_GRAPH.nodes[nodeId];
    const isSharedNode = nodeData && nodeData.products && nodeData.products.length > 1;
    
    // Use imported lists from config for overlap detection
    
    // For shared nodes, use a gradient or mixed color
    let nodeFillColor = isInPath ? productColor : getLightColor(productColor);
    let nodeStrokeColor = isEntry ? '#ff4444' : productColor;
    let strokeWidthOverride = undefined;
    let strokeDasharray = undefined;
    
    if (showRationalized && isSharedNode && !isEntry) {
      // Use a gradient purple color for shared nodes (only when rationalization is ON)
      nodeStrokeColor = '#9333ea'; // Purple for shared
      strokeWidthOverride = 3; // Thicker border for shared nodes
      if (isInPath) {
        nodeFillColor = '#9333ea';
      } else {
        nodeFillColor = 'rgba(147, 51, 234, 0.15)'; // Light purple
      }
    }
    
    
    // Determine if this node should show overlap border
    let showOverlapBorder = false;
    
    if (showOverlaps) {
      if (showRationalized) {
        // In rationalized mode, show overlap on shared nodes and their entire subtree
        if (SHARED_NODES.includes(nodeId)) {
          showOverlapBorder = true;
        } else {
          // Check if this node is a child of a shared node
          const ancestors = graphOps.getAncestors(nodeId);
          if (ancestors.some((ancestorId: string) => SHARED_NODES.includes(ancestorId))) {
            showOverlapBorder = true;
          }
        }
      } else {
        // In non-rationalized mode, show overlap on duplicate nodes and their entire subtree
        if (DUPLICATE_NODES.includes(nodeId)) {
          showOverlapBorder = true;
        } else {
          // Check if this node is a child of a duplicate node
          const ancestors = graphOps.getAncestors(nodeId);
          if (ancestors.some((ancestorId: string) => DUPLICATE_NODES.includes(ancestorId))) {
            showOverlapBorder = true;
          }
        }
      }
    }
    
    return (
      <TreeNode
        key={nodeId}
        nodeId={nodeId}
        node={node}
        position={{ x: pos.x, y: pos.y }}
        isEntry={isEntry}
        isInPath={isInPath}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        hasMatchedChildren={hasMatchedChildren}
        isHovered={isHovered}
        confidence={confidence}
        showContext={showContext}
        animationPhase={animationPhase}
        showConfidence={selectedIntent !== undefined && userContext && userContext.history.length > 0}
        fillColor={nodeFillColor}
        strokeColor={nodeStrokeColor}
        strokeWidth={strokeWidthOverride}
        showOverlapBorder={showOverlapBorder}
        badge={showRationalized && isSharedNode && nodeData?.products ? { 
          text: `${nodeData.products.length} Products`, 
          color: '#9333ea',
          position: 'bottom'
        } : undefined}
        onClick={() => {
          if (hasMatchedChildren) {
            toggleNodeExpansion(nodeId);
          }
        }}
        onMouseEnter={() => setHoveredNode(nodeId)}
        onMouseLeave={() => setHoveredNode(null)}
      />
    );
  };

  // Auto-focus disabled to prevent unwanted zoom changes
  // Uncomment this effect to enable auto-focus on intent selection
  // useEffect(() => {
  //   if (selectedIntent && matchedNodes.size > 0 && nodePositions) {
  //     // Small delay to let the graph render first
  //     setTimeout(() => {
  //       const matchedNodeIds = Array.from(matchedNodes);
  //       autoFocus(matchedNodeIds, {
  //         padding: 100,
  //         duration: 1000,
  //         maxScale: 1.5
  //       });
  //     }, 300);
  //   } else if (showOverlaps && !selectedIntent && nodePositions) {
  //     // Auto-focus on overlapping nodes
  //     setTimeout(() => {
  //       const overlappingNodes = showRationalized ? SHARED_NODES : DUPLICATE_NODES;
  //       if (overlappingNodes.length > 0) {
  //         autoFocus(overlappingNodes, {
  //           padding: 120,
  //           duration: 800,
  //           maxScale: 1.2
  //         });
  //       }
  //     }, 300);
  //   }
  // }, [selectedIntent, matchedNodes, showOverlaps, showRationalized, nodePositions, autoFocus, SHARED_NODES, DUPLICATE_NODES]);

  return (
    <div style={{
      flex: 1,
      background: 'linear-gradient(to bottom, #f5f5f5, white)',
      borderRadius: 12,
      padding: 20,
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '4px 12px',
        background: focusMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(102, 126, 234, 0.1)',
        borderRadius: 20,
        fontSize: 11,
        color: focusMode ? '#3B82F6' : '#667eea',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        {focusMode ? 
          `🎯 Auto-Focus Mode: View automatically adjusts when you expand/collapse nodes` :
          selectedIntent ? 
            `Showing matched path • ${expandedNodes.size} nodes expanded • Zoom: ${Math.round(transform.k * 100)}%` :
            `Click nodes to expand/collapse • ${expandedNodes.size} nodes expanded • ${expansionMode === 'single' ? 'Single' : 'Multiple'} mode • Zoom: ${Math.round(transform.k * 100)}%`
        }
      </div>

      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 10
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title="Zoom In (Scroll Up)"
        >
          +
        </button>
        <button
          onClick={handleZoomReset}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title="Reset View"
        >
          ⟲
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title="Zoom Out (Scroll Down)"
        >
          −
        </button>
        <div style={{ 
          borderTop: '1px solid #ddd', 
          margin: '4px 6px',
          opacity: 0.5
        }} />
        <button
          onClick={() => {
            setFocusMode(!focusMode);
          }}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: focusMode ? '2px solid #3B82F6' : '1px solid #ddd',
            background: focusMode ? '#3B82F6' : 'white',
            color: focusMode ? 'white' : '#333',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: focusMode ? '0 4px 8px rgba(59,130,246,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          title={focusMode ? "Exit Auto-Focus Mode" : "Auto-Focus Mode - Automatically adjusts view when expanding/collapsing"}
        >
          🎯
        </button>
      </div>

      {/* Main visualization */}
      <svg
        ref={svgRef}
        width="100%"
        height="600"
        viewBox={`0 0 ${graphBounds.width} ${graphBounds.height}`}
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: 'grab'
        }}
      >
        {/* Transform group for zoom and pan */}
        <g transform={transform.toString()}>
          {/* Level labels inside SVG - positioned between node rows */}
          <g>
            {/* Product label - above product nodes */}
            <rect x={20} y={40} width={3} height={30} fill="#9ca3af" rx={2} />
            <text x={30} y={55} fill="#6b7280" fontSize={11} fontWeight="bold" dominantBaseline="middle">
              PRODUCT
            </text>
            
            {/* Workflow label - between product and outcome (only show when workflows are visible) */}
            {showWorkflows && (
              <>
                <rect x={20} y={140} width={3} height={30} fill="#9ca3af" rx={2} />
                <text x={30} y={155} fill="#6b7280" fontSize={11} fontWeight="bold" dominantBaseline="middle">
                  WORKFLOW
                </text>
              </>
            )}
            
            {/* Outcome label - between workflow and scenario */}
            <rect x={20} y={240} width={3} height={30} fill="#9ca3af" rx={2} />
            <text x={30} y={255} fill="#6b7280" fontSize={11} fontWeight="bold" dominantBaseline="middle">
              OUTCOME
            </text>
            
            {/* Scenario label - between outcome and scenario */}
            <rect x={20} y={340} width={3} height={30} fill="#9ca3af" rx={2} />
            <text x={30} y={355} fill="#6b7280" fontSize={11} fontWeight="bold" dominantBaseline="middle">
              SCENARIO
            </text>
            
            {/* Step label - between scenario and step */}
            <rect x={20} y={440} width={3} height={30} fill="#9ca3af" rx={2} />
            <text x={30} y={455} fill="#6b7280" fontSize={11} fontWeight="bold" dominantBaseline="middle">
              STEP
            </text>
            
            {/* Action label - between step and action */}
            <rect x={20} y={540} width={3} height={30} fill="#9ca3af" rx={2} />
            <text x={30} y={555} fill="#6b7280" fontSize={11} fontWeight="bold" dominantBaseline="middle">
              ACTION
            </text>
          </g>
          
          {/* Unified Virtual Product border in rationalized mode */}
          {showRationalized && (() => {
            // Find all visible product nodes
            const productNodes = Object.entries(nodePositions)
              .filter(([nodeId, pos]: [string, any]) => {
                const node = FUNCTIONAL_GRAPH.nodes[nodeId];
                return node && node.level === 'product' && pos.visible;
              })
              .map(([_, pos]: [string, any]) => pos);
            
            if (productNodes.length > 0) {
              // Calculate bounding box for all product nodes
              const minX = Math.min(...productNodes.map((p: any) => p.x)) - 85; // Account for node width/2 + padding
              const maxX = Math.max(...productNodes.map((p: any) => p.x)) + 85;
              const y = productNodes[0].y; // All product nodes have same y
              
              return (
                <g>
                  <rect
                    x={minX}
                    y={y - 35} // Account for node height/2 + padding
                    width={maxX - minX}
                    height={70}
                    rx={12}
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    strokeDasharray="12,6"
                    opacity={0.6}
                  />
                  <text
                    x={(minX + maxX) / 2}
                    y={y - 45}
                    fill="#9333ea"
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="middle"
                    opacity={0.8}
                  >
                    UNIFIED VIRTUAL PRODUCT
                  </text>
                </g>
              );
            }
            return null;
          })()}
          
          {/* Render connections first (behind nodes) */}
          <g>{renderConnections()}</g>
          
          {/* Render nodes on top */}
          <g>{Object.keys(nodePositions).map((nodeId: string) => renderNode(nodeId))}</g>
        </g>
      </svg>

    </div>
  );
};

export default HierarchyVisualization;

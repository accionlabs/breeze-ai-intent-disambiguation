import React, { useMemo, useEffect, useState } from 'react';
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
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const [pendingFocusNode, setPendingFocusNode] = useState<string | null>(null);
  const [focusBounds, setFocusBounds] = useState<{minX: number, maxX: number, minY: number, maxY: number} | null>(null);
  
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
    
    // When showing overlaps and no intent is selected, only process roots that are expanded
    if (showOverlaps && !selectedIntent) {
      (roots as string[]).forEach((rootId: string) => {
        // Only make root visible if it's in the expanded set
        if (expandedNodes.has(rootId)) {
          visible.add(rootId);
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

  // Handle focus bounds calculation after diagram updates
  useEffect(() => {
    if (pendingFocusNode && nodePositions[pendingFocusNode]) {
      // Calculate bounds for the branch starting from pendingFocusNode
      const branchNodes = new Set<string>([pendingFocusNode]);
      
      // Collect all visible descendants
      const addDescendants = (id: string) => {
        const children = graphOps.getChildren(id);
        children.forEach((childId: string) => {
          if (visibleNodes.has(childId) && !branchNodes.has(childId)) {
            branchNodes.add(childId);
            if (expandedNodes.has(childId)) {
              addDescendants(childId);
            }
          }
        });
      };
      
      if (expandedNodes.has(pendingFocusNode)) {
        addDescendants(pendingFocusNode);
      }
      
      // Calculate bounding box
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      branchNodes.forEach(id => {
        const pos = nodePositions[id];
        if (pos) {
          const nodeHalfWidth = 70;
          const nodeHalfHeight = 25;
          minX = Math.min(minX, pos.x - nodeHalfWidth);
          maxX = Math.max(maxX, pos.x + nodeHalfWidth);
          minY = Math.min(minY, pos.y - nodeHalfHeight);
          maxY = Math.max(maxY, pos.y + nodeHalfHeight);
        }
      });
      
      // Add some padding
      const padding = 20;
      minX -= padding;
      maxX += padding;
      minY -= padding;
      maxY += padding;
      
      // Set the focus bounds for rendering
      if (isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
        setFocusBounds({ minX, maxX, minY, maxY });
        
        // After setting bounds, calculate pan to center the rectangle
        if (focusMode) {
          // Calculate rectangle dimensions and center in SVG coordinates
          const rectWidth = maxX - minX;
          const rectHeight = maxY - minY;
          const rectCenterX = (minX + maxX) / 2;
          const rectCenterY = (minY + maxY) / 2;
          
          // Get viewport dimensions
          const svgElement = document.querySelector('svg');
          const viewportWidth = svgElement?.clientWidth || 800;
          const viewportHeight = svgElement?.clientHeight || 600;
          
          // Get viewBox dimensions
          const viewBoxAttr = svgElement?.getAttribute('viewBox') || '0 0 1600 700';
          const [, , vbWidth, vbHeight] = viewBoxAttr.split(' ').map(Number);
          
          // STEP 1: Calculate pan needed to center the rectangle (at current zoom level)
          // With transform="translate(pan.x, pan.y) scale(zoom)"
          // The pan is in SVG coordinates, applied before scale
          // After transform, an SVG point (x,y) appears at screen position: ((x + pan) * zoom)
          // To center rectCenter at viewport center: (rectCenter + pan) * zoom = viewportCenter
          // Therefore: pan = (viewportCenter / zoom) - rectCenter
          
          // But viewport dimensions are in screen pixels, need to map to SVG coords
          const viewportCenterX = viewportWidth / 2;
          const viewportCenterY = viewportHeight / 2;
          
          // Map viewport center to SVG coordinates considering viewBox
          const svgScale = vbWidth / viewportWidth;
          const svgViewportCenterX = viewportCenterX * svgScale;
          const svgViewportCenterY = viewportCenterY * svgScale * (vbHeight / vbWidth);
          
          // Calculate pan in SVG coordinates
          const targetPanX = (svgViewportCenterX / zoom) - rectCenterX;
          const targetPanY = (svgViewportCenterY / zoom) - rectCenterY;
          
          
          // Apply the pan first
          setPan({ x: targetPanX, y: targetPanY });
          
          // STEP 2: After pan is applied, calculate zoom (but don't apply it yet)
          setTimeout(() => {
            // Get current pan values after step 1
            const currentPanX = targetPanX;
            const currentPanY = targetPanY;
            const currentZoom = zoom;
            
            // Define margin percentage (e.g., 0.85 means the rectangle should fit in 85% of viewport)
            const marginFactor = 0.85;
            
            // Calculate the scale factor from SVG coordinates to viewport pixels
            const svgToViewportScaleX = viewportWidth / vbWidth;
            const svgToViewportScaleY = viewportHeight / vbHeight;
            
            // Calculate zoom needed to fit the rectangle within the viewport with margin
            const zoomToFitWidth = (viewportWidth * marginFactor) / (rectWidth * svgToViewportScaleX);
            const zoomToFitHeight = (viewportHeight * marginFactor) / (rectHeight * svgToViewportScaleY);
            
            // Take the smaller zoom to ensure both dimensions fit
            let targetZoom = Math.min(zoomToFitWidth, zoomToFitHeight);
            
            // Clamp zoom to reasonable bounds
            targetZoom = Math.max(0.3, Math.min(targetZoom, 10));
            
            // Calculate zoom ratio
            const zoomRatio = targetZoom / currentZoom;
            
            // When zooming from center, we need to adjust pan
            // The viewport center in screen coordinates
            const viewportCenterScreenX = viewportWidth / 2;
            const viewportCenterScreenY = viewportHeight / 2;
            
            // What point in SVG space is at the viewport center before zoom?
            const svgPointAtCenterX = (viewportCenterScreenX - currentPanX) / currentZoom;
            const svgPointAtCenterY = (viewportCenterScreenY - currentPanY) / currentZoom;
            
            // After zoom, where would this SVG point be in screen space?
            const newScreenX = svgPointAtCenterX * targetZoom;
            const newScreenY = svgPointAtCenterY * targetZoom;
            
            // Calculate new pan to keep that point at viewport center
            const adjustedPanX = viewportCenterScreenX - newScreenX;
            const adjustedPanY = viewportCenterScreenY - newScreenY;
            
            
            // DON'T APPLY ZOOM - calculations only for future use
          }, 100); // Small delay to let the pan complete
        }
      }
      
      // Clear the pending focus node
      setPendingFocusNode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFocusNode, nodePositions, expandedNodes, visibleNodes, focusMode, zoom]); // Added focusMode and zoom as dependencies

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

  // Zoom handlers - zoom from center of viewport
  const handleZoomIn = () => {
    const scale = 1.2;
    const newZoom = Math.min(zoom * scale, 10); // Max zoom 10x
    
    // Get actual viewport dimensions from SVG element
    const svgElement = document.querySelector('svg');
    const viewportWidth = svgElement?.clientWidth || 800;
    const viewportHeight = svgElement?.clientHeight || 600;
    
    // Get viewBox to understand SVG coordinate system
    const viewBoxAttr = svgElement?.getAttribute('viewBox') || '0 0 1600 700';
    const [, , vbWidth, vbHeight] = viewBoxAttr.split(' ').map(Number);
    
    // Calculate viewport center in screen pixels
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Convert viewport center to SVG coordinates (considering viewBox)
    const svgCenterX = (centerX / viewportWidth) * vbWidth;
    const svgCenterY = (centerY / viewportHeight) * vbHeight;
    
    // With transform="translate(pan.x, pan.y) scale(zoom)", 
    // the formula to keep a point fixed during zoom is:
    // newPan = svgCenter - (svgCenter - oldPan) * (newZoom / oldZoom)
    const zoomRatio = newZoom / zoom;
    const newPanX = svgCenterX - (svgCenterX - pan.x) * zoomRatio;
    const newPanY = svgCenterY - (svgCenterY - pan.y) * zoomRatio;
    
    
    // Apply zoom and adjusted pan
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleZoomOut = () => {
    const scale = 1 / 1.2;
    const newZoom = Math.max(zoom * scale, 0.3); // Min zoom 0.3x
    
    // Get actual viewport dimensions from SVG element
    const svgElement = document.querySelector('svg');
    const viewportWidth = svgElement?.clientWidth || 800;
    const viewportHeight = svgElement?.clientHeight || 600;
    
    // Get viewBox to understand SVG coordinate system
    const viewBoxAttr = svgElement?.getAttribute('viewBox') || '0 0 1600 700';
    const [, , vbWidth, vbHeight] = viewBoxAttr.split(' ').map(Number);
    
    // Calculate viewport center in screen pixels
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Convert viewport center to SVG coordinates (considering viewBox)
    const svgCenterX = (centerX / viewportWidth) * vbWidth;
    const svgCenterY = (centerY / viewportHeight) * vbHeight;
    
    // With transform="translate(pan.x, pan.y) scale(zoom)", 
    // the formula to keep a point fixed during zoom is:
    // newPan = svgCenter - (svgCenter - oldPan) * (newZoom / oldZoom)
    const zoomRatio = newZoom / zoom;
    const newPanX = svgCenterX - (svgCenterX - pan.x) * zoomRatio;
    const newPanY = svgCenterY - (svgCenterY - pan.y) * zoomRatio;
    
    
    // Apply zoom and adjusted pan
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      // Store just the mouse position when starting drag
      setDragStart({ 
        x: e.clientX, 
        y: e.clientY 
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      // Calculate the mouse movement delta
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Scale the pan movement based on zoom level
      // When zoomed in, the graph is larger, so we need to pan more to keep up with the mouse
      // When zoomed out, the graph is smaller, so we pan less
      const scaledDeltaX = deltaX * Math.max(1, zoom * 0.8); // Scale up when zoomed in
      const scaledDeltaY = deltaY * Math.max(1, zoom * 0.8);
      
      setPan(prevPan => ({
        x: prevPan.x + scaledDeltaX,
        y: prevPan.y + scaledDeltaY
      }));
      
      // Update dragStart for next move event
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    // Get the mouse position relative to the SVG viewport
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate zoom factor
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(10, zoom * delta));
    const scale = newZoom / zoom;
    
    // Adjust pan to keep the point under the mouse cursor fixed
    setPan(prevPan => ({
      x: x - (x - prevPan.x) * scale,
      y: y - (y - prevPan.y) * scale
    }));
    
    setZoom(newZoom);
  };

  // Toggle node expansion with configurable peer collapse behavior using graph model
  // Focus on a branch starting from a specific node
  const focusOnBranch = (nodeId: string) => {
    // Get fresh node positions from the current render
    const currentPositions = nodePositions;
    
    if (!currentPositions[nodeId]) {
      return;
    }
    
    // ALWAYS start from base state (zoom=1, pan=0,0)
    // This ensures consistent calculations every time
    setZoom(1);
    setPan({ x: 0, y: 0 });
    
    // Small delay to let the reset apply
    setTimeout(() => {
      // Collect all visible nodes in the branch
      const branchNodes = new Set<string>([nodeId]);
      
      const addDescendants = (id: string) => {
        const children = graphOps.getChildren(id);
        children.forEach((childId: string) => {
          if (visibleNodes.has(childId) && !branchNodes.has(childId)) {
            branchNodes.add(childId);
            if (expandedNodes.has(childId)) {
              addDescendants(childId);
            }
          }
        });
      };
      
      if (expandedNodes.has(nodeId)) {
        addDescendants(nodeId);
      }
      
      // Calculate bounding box in SVG coordinates
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      branchNodes.forEach(id => {
        const pos = currentPositions[id];
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
      
      // Add padding around the branch
      const padding = 30;
      minX -= padding;
      maxX += padding;
      minY -= padding;
      maxY += padding;
      
      const branchWidth = maxX - minX;
      const branchHeight = maxY - minY;
      const branchCenterX = (minX + maxX) / 2;
      const branchCenterY = (minY + maxY) / 2;
      
      // Get viewport dimensions
      const svgElement = document.querySelector('svg');
      const viewportWidth = svgElement?.clientWidth || 800;
      const viewportHeight = svgElement?.clientHeight || 600;
      
      // Get viewBox dimensions
      const viewBoxAttr = svgElement?.getAttribute('viewBox') || '0 0 1600 700';
      const [, , vbWidth, vbHeight] = viewBoxAttr.split(' ').map(Number);
      
      // How SVG units map to screen pixels at zoom=1
      const svgToScreenScale = Math.min(viewportWidth / vbWidth, viewportHeight / vbHeight);
      
      // Calculate zoom to fit branch in 85% of viewport (leaving margins)
      const targetWidth = viewportWidth * 0.85;
      const targetHeight = viewportHeight * 0.85;
      
      const zoomToFitWidth = targetWidth / (branchWidth * svgToScreenScale);
      const zoomToFitHeight = targetHeight / (branchHeight * svgToScreenScale);
      
      // Use the smaller zoom to ensure both dimensions fit
      // Cap at 1.8 to avoid too much zoom
      const targetZoom = Math.min(zoomToFitWidth, zoomToFitHeight, 1.8);
      
      // Don't zoom out too much
      const finalZoom = Math.max(targetZoom, 0.5);
      
      // Calculate pan to center the branch
      const screenCenterX = branchCenterX * svgToScreenScale * finalZoom;
      const screenCenterY = branchCenterY * svgToScreenScale * finalZoom;
      
      const targetPanX = (viewportWidth / 2) - screenCenterX;
      const targetPanY = (viewportHeight / 2) - screenCenterY;
      
      
      // Apply the transform
      setZoom(finalZoom);
      setPan({ x: targetPanX, y: targetPanY });
    }, 50);
  };

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
    
    // Set pending focus node to calculate bounds after re-render
    if (isExpanding) {
      setPendingFocusNode(nodeId);
    } else {
      // When collapsing, clear the focus bounds
      setFocusBounds(null);
      // Optionally focus on parent
      const parents = graphOps.getParents(nodeId);
      if (parents.length > 0) {
        setPendingFocusNode(parents[0]);
      }
    }
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
            `Showing matched path • ${expandedNodes.size} nodes expanded • Zoom: ${Math.round(zoom * 100)}%` :
            `Click nodes to expand/collapse • ${expandedNodes.size} nodes expanded • ${expansionMode === 'single' ? 'Single' : 'Multiple'} mode • Zoom: ${Math.round(zoom * 100)}%`
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
        width="100%"
        height="600"
        viewBox={`0 0 ${graphBounds.width} ${graphBounds.height}`}
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Transform group for zoom and pan */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
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

import React, { useMemo, useEffect, useState } from 'react';
import { 
  FunctionalNode, 
  FUNCTIONAL_NODES, 
  FUNCTIONAL_GRAPH,
  graphOps,
  LEVEL_COLORS,
  PRODUCT_COLORS,
  UserContext,
  Resolution,
  HierarchyLevel
} from '../config/functionalHierarchy';
import TreeNode from './TreeNode';

export type ExpansionMode = 'single' | 'multiple';

interface HierarchyVisualizationProps {
  selectedIntent?: string;
  entryNode?: string;
  resolution?: Resolution;
  userContext: UserContext;
  showContext: boolean;
  expansionMode?: ExpansionMode; // Control whether multiple siblings can be expanded
  showOverlaps?: boolean; // Show overlap indicators on duplicate nodes
  showRationalized?: boolean; // Show rationalized/unified nodes
  showWorkflows?: boolean; // Show cross-product workflow nodes
  recentActions?: any[]; // Recent actions for fallback resolution
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
  recentActions = []
}) => {
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
          ancestors.forEach(ancestorId => {
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
            const expandedParent = parents.find(p => prev.has(p));
            if (expandedParent) {
              pathToLastNode.add(expandedParent);
              currentNode = expandedParent;
            } else {
              break;
            }
          }
          
          // Now only keep nodes that are in the path to the last expanded node
          prev.forEach(nodeId => {
            if (pathToLastNode.has(nodeId)) {
              newSet.add(nodeId);
            }
          });
        } else {
          // If last expanded node is no longer expanded, fall back to keeping first of each sibling group
          const nodesByParent = new Map<string | null, string[]>();
          
          prev.forEach(nodeId => {
            const parents = graphOps.getParents(nodeId);
            const parentKey = parents.length > 0 ? parents[0] : null;
            
            if (!nodesByParent.has(parentKey)) {
              nodesByParent.set(parentKey, []);
            }
            nodesByParent.get(parentKey)!.push(nodeId);
          });
          
          nodesByParent.forEach((children, parentKey) => {
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
  
  // Example: Using the new graph model for efficient operations
  // This demonstrates how the new model simplifies graph operations
  useEffect(() => {
    if (entryNode) {
      // Example 1: Get ancestors using new graph model (much simpler!)
      const ancestors = graphOps.getAncestors(entryNode);
      console.log('Ancestors using new model:', ancestors);
      
      // Example 2: Get descendants
      const descendants = graphOps.getDescendants(entryNode);
      console.log('Descendants using new model:', descendants);
      
      // Example 3: Find overlapping nodes
      const overlaps = graphOps.findOverlappingNodes();
      console.log('Overlapping nodes:', overlaps);
      
      // Example 4: Get subgraph from entry node
      const subgraph = graphOps.getSubgraph(entryNode, 2);
      console.log('Subgraph (2 levels deep):', subgraph);
    }
  }, [entryNode]);

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
    allNodesInPath.forEach(nodeId => {
      const ancestors = graphOps.getAncestors(nodeId);
      ancestors.forEach(ancestorId => matched.add(ancestorId));
    });
    
    console.log('Matched nodes:', Array.from(matched), 'for entry:', effectiveEntryNode);
    return matched;
  }, [effectiveResolution, effectiveEntryNode]);

  // Initialize expanded nodes based on selection
  useEffect(() => {
    if ((selectedIntent || effectiveResolution) && effectiveEntryNode) {
      const nodesToExpand = new Set<string>();
      
      // When intent is selected or recent action is selected, expand nodes along the matched path
      // Build path from entry node up to root using graph model
      const ancestors = graphOps.getAncestors(effectiveEntryNode);
      
      // Add all ancestors that are in the matched path
      ancestors.forEach(ancestorId => {
        if (matchedNodes.has(ancestorId)) {
          // Check if this ancestor has matched children that need to be shown
          const children = graphOps.getChildren(ancestorId);
          if (children.some(childId => matchedNodes.has(childId))) {
            nodesToExpand.add(ancestorId);
          }
        }
      });
      
      // Expand entry node if it has children in the matched path
      const entryNodeChildren = graphOps.getChildren(effectiveEntryNode);
      if (entryNodeChildren.some(childId => matchedNodes.has(childId))) {
        nodesToExpand.add(effectiveEntryNode);
      }
      
      // Also expand any nodes in the downward path that have matched children
      if (effectiveResolution) {
        effectiveResolution.traversalPath.downward.forEach((nodeId: string) => {
          const children = graphOps.getChildren(nodeId);
          if (children.some(childId => matchedNodes.has(childId))) {
            nodesToExpand.add(nodeId);
          }
        });
      }
      
      // Special case for workflow nodes: always expand them to show their outcomes
      if (effectiveResolution && FUNCTIONAL_NODES[effectiveEntryNode]?.level === 'workflow') {
        nodesToExpand.add(effectiveEntryNode);
      }
      
      console.log('Auto-expanding nodes:', Array.from(nodesToExpand), 'for entry:', effectiveEntryNode);
      setExpandedNodes(nodesToExpand);
    } else {
      // Default: nothing expanded
      setExpandedNodes(new Set());
    }
  }, [selectedIntent, effectiveResolution, effectiveEntryNode, matchedNodes]);

  // Calculate which nodes should be visible using depth-first traversal
  const visibleNodes = useMemo(() => {
    const visible = new Set<string>();
    
    // Depth-first traversal to collect visible nodes
    const dfsCollectVisible = (nodeId: string, parentVisible: boolean = true) => {
      if (!parentVisible) return;
      
      const node = FUNCTIONAL_GRAPH.nodes[nodeId];
      if (!node) return;
      
      // Filter nodes based on rationalized state
      // Only filter specific duplicate nodes that have shared alternatives
      const duplicateNodes = [
        'scenario-media-monitoring-cision',
        'scenario-media-monitoring-brandwatch', 
        'scenario-media-monitoring-smm',
        'step-social-monitoring-cision',
        'step-social-monitoring-brandwatch',
        'step-social-monitoring-smm',
        'step-track-coverage-cision',
        'step-analyze-media-sentiment-cision',
        'step-track-social-brandwatch',
        'step-analyze-trends-brandwatch',
        'step-track-mentions-smm',
        'step-monitor-engagement-smm',
        'action-track-social-cision',
        'action-basic-sentiment-cision',
        'action-track-social-brandwatch',
        'action-deep-sentiment-brandwatch',
        'action-trend-analysis-brandwatch',
        'action-track-social-smm',
        'action-realtime-track-smm',
        'action-engagement-metrics-smm',
        'action-conversation-tracking',
        'action-influencer-tracking',
        'action-trend-detection',
        'action-pattern-analysis',
        'action-mention-monitoring',
        'action-hashtag-tracking',
        'action-engagement-tracking',
        'action-response-metrics'
      ];
      
      const sharedNodes = [
        'scenario-media-monitoring-shared',
        'step-social-monitoring-shared'
        // The shared scenario now directly uses the original steps and actions
        // so we don't need separate shared versions of those
      ];
      
      // Filter workflow nodes based on showWorkflows toggle
      if (node.level === 'workflow' && !showWorkflows) {
        return; // Hide workflow nodes when showWorkflows is false
      }
      
      // Filter based on independent toggle states
      if (showRationalized) {
        // When rationalized is ON, hide duplicate nodes UNLESS they are descendants of shared nodes
        if (duplicateNodes.includes(nodeId)) {
          // Check if this duplicate node is a descendant of a shared node
          const ancestors = graphOps.getAncestors(nodeId);
          const hasSharedAncestor = ancestors.some(ancestorId => sharedNodes.includes(ancestorId));
          
          // If it has a shared ancestor, keep it visible (it's part of the unified structure)
          if (!hasSharedAncestor) {
            return; // Only hide if it doesn't have a shared ancestor
          }
        }
      } else {
        // When rationalized is OFF, hide shared nodes
        if (sharedNodes.includes(nodeId)) {
          return;
        }
      }
      
      // Check if this node should be visible
      const shouldBeVisible = selectedIntent 
        ? matchedNodes.has(nodeId)  // When intent selected, only show matched nodes
        : true;  // When no intent, show all expanded paths
      
      if (shouldBeVisible && parentVisible) {
        visible.add(nodeId);
        
        // Only traverse children if this node is expanded
        if (expandedNodes.has(nodeId)) {
          const children = graphOps.getChildren(nodeId);
          children.forEach(childId => {
            dfsCollectVisible(childId, true);
          });
        }
      }
    };
    
    // Start DFS from root nodes (products)
    const roots = Array.from(FUNCTIONAL_GRAPH.graph.roots);
    roots.forEach(rootId => {
      // Product nodes are always visible if they match or no intent is selected
      if (!selectedIntent || matchedNodes.has(rootId)) {
        dfsCollectVisible(rootId, true);
      }
    });
    
    return visible;
  }, [expandedNodes, selectedIntent, matchedNodes, showOverlaps, showRationalized, showWorkflows]);

  // Calculate node positions with dynamic sizing to prevent overlap
  const { nodePositions, graphBounds } = useMemo(() => {
    const positions: Record<string, NodePosition> = {};
    
    // Constants for layout
    const NODE_WIDTH = 140;
    const MIN_NODE_SPACING = 30; // Minimum spacing between nodes
    const LEVEL_HEIGHT = 100; // Vertical spacing between levels
    const MARGIN = 50; // Margin around the entire graph
    const LABEL_MARGIN = 100; // Minimum distance from left edge to first node center (increased for label space)
    
    // Fixed Y positions properly aligned with level labels
    const levelY = {
      product: MARGIN + 50,
      workflow: MARGIN + 50 + LEVEL_HEIGHT,
      outcome: MARGIN + 50 + LEVEL_HEIGHT * 2,
      scenario: MARGIN + 50 + LEVEL_HEIGHT * 3,
      step: MARGIN + 50 + LEVEL_HEIGHT * 4,
      action: MARGIN + 50 + LEVEL_HEIGHT * 5
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

    // Depth-first traversal to maintain parent-child ordering
    const dfsCollectByLevel = (nodeId: string) => {
      const node = FUNCTIONAL_GRAPH.nodes[nodeId];
      if (!node) return;
      
      // Skip workflow nodes - they'll be collected separately
      if (node.level === 'workflow') {
        return;
      }
      
      // Only add if visible and not already added
      if (visibleNodes.has(nodeId) && !nodesByLevel[node.level].includes(nodeId)) {
        nodesByLevel[node.level].push(nodeId);
      }
      
      // For product nodes, only traverse to direct outcome children (not through workflows)
      if (node.level === 'product') {
        // Get all children
        const children = graphOps.getChildren(nodeId);
        
        // Process only direct outcome children (skip workflows)
        children.forEach(childId => {
          const childNode = FUNCTIONAL_GRAPH.nodes[childId];
          if (childNode && childNode.level === 'outcome' && visibleNodes.has(childId)) {
            dfsCollectByLevel(childId);
          }
        });
      } else {
        // For non-product nodes, traverse children normally (but skip workflows)
        const children = graphOps.getChildren(nodeId);
        children.forEach(childId => {
          const childNode = FUNCTIONAL_GRAPH.nodes[childId];
          // Skip workflow nodes during traversal
          if (childNode && childNode.level !== 'workflow' && visibleNodes.has(childId)) {
            dfsCollectByLevel(childId);
          }
        });
      }
    };

    // Collect all nodes maintaining product-based ordering
    const roots = Array.from(FUNCTIONAL_GRAPH.graph.roots);
    roots.sort(); // Ensure consistent ordering
    roots.forEach(rootId => {
      if (visibleNodes.has(rootId)) {
        dfsCollectByLevel(rootId);
      }
    });
    
    // Collect workflow nodes separately at the end if they're visible
    if (showWorkflows) {
      visibleNodes.forEach(nodeId => {
        const node = FUNCTIONAL_GRAPH.nodes[nodeId];
        if (node && node.level === 'workflow' && !nodesByLevel.workflow.includes(nodeId)) {
          nodesByLevel.workflow.push(nodeId);
        }
      });
      // Sort workflow nodes for consistent ordering
      nodesByLevel.workflow.sort();
    }

    // First pass: calculate the maximum width needed
    let maxWidth = 0;
    const levelWidths: Record<string, number> = {};
    
    Object.entries(nodesByLevel).forEach(([level, nodeIds]) => {
      if (nodeIds.length === 0) {
        levelWidths[level] = 0;
        return;
      }
      
      // Calculate the total width needed for this level
      const totalRequiredWidth = nodeIds.length * NODE_WIDTH + (nodeIds.length - 1) * MIN_NODE_SPACING;
      levelWidths[level] = totalRequiredWidth;
      
      // Update max width
      maxWidth = Math.max(maxWidth, totalRequiredWidth);
    });
    
    // Add margins to the max width, including space for labels
    const graphWidth = maxWidth + 2 * MARGIN + LABEL_MARGIN;

    // Second pass: position nodes centered within the graph width
    Object.entries(nodesByLevel).forEach(([level, nodeIds]) => {
      if (nodeIds.length === 0) return;
      
      const levelWidth = levelWidths[level];
      const spacing = NODE_WIDTH + MIN_NODE_SPACING;
      
      // Calculate starting X position
      // Center nodes in the available space after the label margin
      const availableWidth = graphWidth - LABEL_MARGIN - MARGIN;
      const centeredStartX = LABEL_MARGIN + (availableWidth - levelWidth) / 2 + NODE_WIDTH / 2;
      const startX = Math.max(LABEL_MARGIN, centeredStartX);
      
      // Position each node in the order they were collected (depth-first)
      nodeIds.forEach((nodeId, index) => {
        const node = FUNCTIONAL_GRAPH.nodes[nodeId];
        if (node) {
          positions[nodeId] = {
            x: startX + (index * spacing),
            y: levelY[level as keyof typeof levelY],
            node: FUNCTIONAL_NODES[nodeId], // Keep using old format for compatibility
            visible: true
          };
        }
      });
    });

    // Add positions for hidden nodes (for smooth transitions)
    Object.keys(FUNCTIONAL_GRAPH.nodes).forEach(nodeId => {
      if (!positions[nodeId]) {
        // Position hidden nodes at their parent's location
        const parents = graphOps.getParents(nodeId);
        const parentPos = parents.length > 0 ? positions[parents[0]] : null;
        const node = FUNCTIONAL_GRAPH.nodes[nodeId];
        
        positions[nodeId] = {
          x: parentPos ? parentPos.x : graphWidth / 2, // Center by default
          y: parentPos ? parentPos.y : levelY[node!.level as keyof typeof levelY],
          node: FUNCTIONAL_NODES[nodeId], // Keep using old format for compatibility
          visible: false
        };
      }
    });

    // Calculate graph bounds
    const bounds = {
      width: Math.max(graphWidth, 1000), // Minimum width of 1000
      height: MARGIN * 2 + 50 + LEVEL_HEIGHT * 5 + 50 // Total height with margins (updated for workflow level)
    };

    return { nodePositions: positions, graphBounds: bounds };
  }, [visibleNodes, showWorkflows]);

  // Calculate confidence based on user context
  const getNodeConfidence = (nodeId: string): number => {
    if (!showContext || !userContext.history.length) return 0.5;
    
    const node = FUNCTIONAL_GRAPH.nodes[nodeId];
    if (!node) return 0.5;

    // Check if node appears in recent history
    const recentUse = userContext.history.some(h => h.node === nodeId);
    if (recentUse) return 0.95;

    // Check product preferences
    const nodeProducts = node.products || [];
    const avgPreference = nodeProducts.reduce((sum, product) => {
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
    const newZoom = Math.min(zoom * scale, 3); // Max zoom 3x
    
    // Get viewport dimensions
    const viewportWidth = 800; // Approximate viewport width
    const viewportHeight = 600; // Approximate viewport height
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Adjust pan to keep center point fixed
    setPan(prevPan => ({
      x: centerX - (centerX - prevPan.x) * scale,
      y: centerY - (centerY - prevPan.y) * scale
    }));
    
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const scale = 1 / 1.2;
    const newZoom = Math.max(zoom * scale, 0.3); // Min zoom 0.3x
    
    // Get viewport dimensions
    const viewportWidth = 800; // Approximate viewport width
    const viewportHeight = 600; // Approximate viewport height
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Adjust pan to keep center point fixed
    setPan(prevPan => ({
      x: centerX - (centerX - prevPan.x) * scale,
      y: centerY - (centerY - prevPan.y) * scale
    }));
    
    setZoom(newZoom);
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
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
    const newZoom = Math.max(0.3, Math.min(3, zoom * delta));
    const scale = newZoom / zoom;
    
    // Adjust pan to keep the point under the mouse cursor fixed
    setPan(prevPan => ({
      x: x - (x - prevPan.x) * scale,
      y: y - (y - prevPan.y) * scale
    }));
    
    setZoom(newZoom);
  };

  // Toggle node expansion with configurable peer collapse behavior using graph model
  const toggleNodeExpansion = (nodeId: string) => {
    const children = graphOps.getChildren(nodeId);
    if (children.length === 0) return;
    
    // If intent is selected, only allow toggling matched nodes
    if (selectedIntent && !matchedNodes.has(nodeId)) return;
    
    // Check if this node has any matched children to expand
    const hasMatchedChildren = selectedIntent ? 
      children.some(childId => matchedNodes.has(childId)) : 
      true;
    
    if (!hasMatchedChildren) return;
    
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      
      // If this node is already expanded, just collapse it
      if (newSet.has(nodeId)) {
        // Collapse: remove this node and all its descendants from expanded set
        const removeDescendants = (id: string) => {
          newSet.delete(id);
          const descendants = graphOps.getDescendants(id);
          descendants.forEach(descId => newSet.delete(descId));
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
            parents.forEach(parentId => {
              const siblings = graphOps.getChildren(parentId);
              siblings.forEach(siblingId => {
                if (siblingId !== nodeId) {
                  // Check if this sibling or any of its descendants are expanded
                  const checkExpanded = (id: string): boolean => {
                    if (newSet.has(id)) return true;
                    const descendants = graphOps.getDescendants(id);
                    return descendants.some(descId => newSet.has(descId));
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
            nodesAtLevel.forEach(n => {
              if (n.id !== nodeId && graphOps.getParents(n.id).length === 0) {
                const checkExpanded = (id: string): boolean => {
                  if (newSet.has(id)) return true;
                  const descendants = graphOps.getDescendants(id);
                  return descendants.some(descId => newSet.has(descId));
                };
                
                if (checkExpanded(n.id)) {
                  peersToCollapse.push(n.id);
                }
              }
            });
          }
          
          // Collapse all peer nodes and their entire subtrees
          peersToCollapse.forEach(peerId => {
            newSet.delete(peerId);
            const descendants = graphOps.getDescendants(peerId);
            descendants.forEach(descId => newSet.delete(descId));
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
    expandedNodes.forEach(parentId => {
      if (!visibleNodes.has(parentId)) return;
      
      // Use graph model to get children
      const children = graphOps.getChildren(parentId);
      
      children.forEach(childId => {
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
      children.some(childId => matchedNodes.has(childId)) : 
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
    
    // Define lists of duplicate and shared nodes for overlap detection
    const duplicateNodes = [
      'scenario-media-monitoring-cision',
      'scenario-media-monitoring-brandwatch', 
      'scenario-media-monitoring-smm',
      'step-social-monitoring-cision',
      'step-social-monitoring-brandwatch',
      'step-social-monitoring-smm',
      'step-track-coverage-cision',
      'step-analyze-media-sentiment-cision',
      'step-track-social-brandwatch',
      'step-analyze-trends-brandwatch',
      'step-track-mentions-smm',
      'step-monitor-engagement-smm',
      'action-track-social-cision',
      'action-basic-sentiment-cision',
      'action-track-social-brandwatch',
      'action-deep-sentiment-brandwatch',
      'action-trend-analysis-brandwatch',
      'action-track-social-smm',
      'action-realtime-track-smm',
      'action-engagement-metrics-smm'
    ];
    
    const sharedNodes = [
      'scenario-media-monitoring-shared',
      'step-social-monitoring-shared'
      // The shared scenario now directly uses the original steps and actions
    ];
    
    // For shared nodes, use a gradient or mixed color
    let nodeFillColor = isInPath ? productColor : getLightColor(productColor);
    let nodeStrokeColor = isEntry ? '#ff4444' : productColor;
    let strokeWidthOverride = undefined;
    let strokeDasharray = undefined;
    
    if (isSharedNode && !isEntry) {
      // Use a gradient purple color for shared nodes
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
        if (sharedNodes.includes(nodeId)) {
          showOverlapBorder = true;
        } else {
          // Check if this node is a child of a shared node
          const ancestors = graphOps.getAncestors(nodeId);
          if (ancestors.some(ancestorId => sharedNodes.includes(ancestorId))) {
            showOverlapBorder = true;
          }
        }
      } else {
        // In non-rationalized mode, show overlap on duplicate nodes and their entire subtree
        if (duplicateNodes.includes(nodeId)) {
          showOverlapBorder = true;
        } else {
          // Check if this node is a child of a duplicate node
          const ancestors = graphOps.getAncestors(nodeId);
          if (ancestors.some(ancestorId => duplicateNodes.includes(ancestorId))) {
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
        showConfidence={selectedIntent !== undefined && userContext.history.length > 0}
        fillColor={nodeFillColor}
        strokeColor={nodeStrokeColor}
        strokeWidth={strokeWidthOverride}
        showOverlapBorder={showOverlapBorder}
        badge={isSharedNode && nodeData?.products ? { 
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
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: 20,
        fontSize: 11,
        color: '#667eea',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        {selectedIntent ? 
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
              .filter(([nodeId, pos]) => {
                const node = FUNCTIONAL_GRAPH.nodes[nodeId];
                return node && node.level === 'product' && pos.visible;
              })
              .map(([_, pos]) => pos);
            
            if (productNodes.length > 0) {
              // Calculate bounding box for all product nodes
              const minX = Math.min(...productNodes.map(p => p.x)) - 85; // Account for node width/2 + padding
              const maxX = Math.max(...productNodes.map(p => p.x)) + 85;
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
          <g>{Object.keys(nodePositions).map(nodeId => renderNode(nodeId))}</g>
        </g>
      </svg>


      {/* Product Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        fontSize: 11,
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: 12,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Products</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: PRODUCT_COLORS.cision,
              borderRadius: 3
            }} />
            <span>CisionOne</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: PRODUCT_COLORS.prn,
              borderRadius: 3
            }} />
            <span>PRNewswire</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: PRODUCT_COLORS.brandwatch,
              borderRadius: 3
            }} />
            <span>Brandwatch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: PRODUCT_COLORS.smm,
              borderRadius: 3
            }} />
            <span>Social Media</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: PRODUCT_COLORS.trendkite,
              borderRadius: 3
            }} />
            <span>TrendKite</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyVisualization;

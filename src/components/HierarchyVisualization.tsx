import React, { useMemo, useEffect, useState } from 'react';
import { 
  FunctionalNode, 
  FUNCTIONAL_NODES, 
  LEVEL_COLORS,
  UserContext,
  Resolution
} from '../config/functionalHierarchy';

interface HierarchyVisualizationProps {
  selectedIntent?: string;
  entryNode?: string;
  resolution?: Resolution;
  userContext: UserContext;
  showContext: boolean;
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
  showContext
}) => {
  const [animationPhase, setAnimationPhase] = useState<'entry' | 'upward' | 'downward' | 'complete'>('entry');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate which nodes are in the matched path
  const matchedNodes = useMemo(() => {
    if (!selectedIntent || !resolution || !entryNode) return new Set<string>();
    
    const matched = new Set<string>();
    
    // Add entry node
    matched.add(entryNode);
    
    // Add all nodes in traversal paths
    resolution.traversalPath.upward.forEach(nodeId => matched.add(nodeId));
    resolution.traversalPath.downward.forEach(nodeId => matched.add(nodeId));
    
    // For each node in the path, ensure we have a complete tree structure
    // by adding necessary ancestors to connect to root
    const nodesToProcess = Array.from(matched);
    const processed = new Set<string>();
    
    while (nodesToProcess.length > 0) {
      const nodeId = nodesToProcess.pop()!;
      if (processed.has(nodeId)) continue;
      processed.add(nodeId);
      
      const node = FUNCTIONAL_NODES[nodeId];
      if (!node) continue;
      
      // Add all ancestors to ensure connectivity
      node.parents.forEach(parentId => {
        matched.add(parentId);
        if (!processed.has(parentId)) {
          nodesToProcess.push(parentId);
        }
      });
    }
    
    return matched;
  }, [selectedIntent, resolution, entryNode]);

  // Initialize expanded nodes based on selection
  useEffect(() => {
    if (selectedIntent && resolution) {
      const nodesToExpand = new Set<string>();
      
      // When intent is selected, expand nodes along the matched path
      if (entryNode) {
        // Build path from entry node up to root
        const pathToRoot: string[] = [];
        const buildPath = (nodeId: string) => {
          const node = FUNCTIONAL_NODES[nodeId];
          if (node && node.parents.length > 0) {
            // Only expand the first matched parent to maintain single-peer expansion
            const matchedParent = node.parents.find(parentId => matchedNodes.has(parentId));
            if (matchedParent) {
              pathToRoot.push(matchedParent);
              buildPath(matchedParent);
            }
          }
        };
        
        buildPath(entryNode);
        
        // Add nodes to expand set (these are the nodes whose children we want to see)
        pathToRoot.forEach(nodeId => {
          nodesToExpand.add(nodeId);
        });
        
        // Expand entry node if it has children in the matched path
        const entryNodeObj = FUNCTIONAL_NODES[entryNode];
        if (entryNodeObj && entryNodeObj.children.some(childId => matchedNodes.has(childId))) {
          nodesToExpand.add(entryNode);
        }
        
        // Also expand any nodes in the downward path that have matched children
        resolution.traversalPath.downward.forEach(nodeId => {
          const node = FUNCTIONAL_NODES[nodeId];
          if (node && node.children.some(childId => matchedNodes.has(childId))) {
            nodesToExpand.add(nodeId);
          }
        });
      }
      
      setExpandedNodes(nodesToExpand);
    } else {
      // Default: nothing expanded
      setExpandedNodes(new Set());
    }
  }, [selectedIntent, resolution, entryNode, matchedNodes]);

  // Calculate which nodes should be visible
  const visibleNodes = useMemo(() => {
    const visible = new Set<string>();
    
    if (selectedIntent && matchedNodes.size > 0) {
      // When intent is selected, only show matched nodes that should be visible based on expansion
      // Start with matched product nodes (root level)
      Object.values(FUNCTIONAL_NODES).forEach(node => {
        if (node.level === 'product' && matchedNodes.has(node.id)) {
          visible.add(node.id);
        }
      });
      
      // For each expanded node, show its matched children
      expandedNodes.forEach(nodeId => {
        if (matchedNodes.has(nodeId)) {
          const node = FUNCTIONAL_NODES[nodeId];
          if (node) {
            node.children.forEach(childId => {
              if (matchedNodes.has(childId)) {
                visible.add(childId);
              }
            });
          }
        }
      });
    } else {
      // No intent selected: show product nodes and expanded children
      Object.values(FUNCTIONAL_NODES).forEach(node => {
        if (node.level === 'product') {
          visible.add(node.id);
        }
      });
      
      // Add children of expanded nodes
      expandedNodes.forEach(nodeId => {
        const node = FUNCTIONAL_NODES[nodeId];
        if (node) {
          node.children.forEach(childId => visible.add(childId));
        }
      });
    }
    
    return visible;
  }, [expandedNodes, selectedIntent, matchedNodes]);

  // Calculate node positions with proper vertical alignment
  const nodePositions = useMemo(() => {
    const positions: Record<string, NodePosition> = {};
    
    // Fixed Y positions properly aligned with level labels
    const levelY = {
      product: 87,     // Product at top
      outcome: 187,    // Outcome below product
      scenario: 287,   // Scenario below outcome
      step: 387,       // Step below scenario
      action: 487      // Action at bottom
    };

    // Group visible nodes by level
    const nodesByLevel: Record<string, FunctionalNode[]> = {
      product: [],
      outcome: [],
      scenario: [],
      step: [],
      action: []
    };

    Object.values(FUNCTIONAL_NODES).forEach(node => {
      if (visibleNodes.has(node.id)) {
        nodesByLevel[node.level].push(node);
      }
    });

    // Position nodes horizontally within each level
    Object.entries(nodesByLevel).forEach(([level, nodes]) => {
      if (nodes.length === 0) return;
      
      const totalWidth = 1000;
      const nodeWidth = 140;
      
      let startX: number;
      let spacing: number;
      
      if (level === 'product') {
        // Special handling for product nodes to ensure proper spacing
        // 5 products, each 140px wide, need to fit in 1000px width
        const totalSpacing = 180; // Fixed spacing between product nodes
        const totalRequiredWidth = nodes.length * nodeWidth + (nodes.length - 1) * 40;
        startX = (totalWidth - totalRequiredWidth) / 2 + nodeWidth / 2;
        spacing = totalSpacing;
      } else {
        // Regular spacing for other levels
        const minSpacing = 20;
        const availableWidth = totalWidth - 100;
        const requiredWidth = nodes.length * nodeWidth + (nodes.length - 1) * minSpacing;
        
        if (requiredWidth <= availableWidth) {
          startX = (totalWidth - requiredWidth) / 2 + nodeWidth / 2;
          spacing = nodeWidth + minSpacing;
        } else {
          spacing = availableWidth / nodes.length;
          startX = 50 + spacing / 2;
        }
      }
      
      nodes.forEach((node, index) => {
        positions[node.id] = {
          x: startX + (index * spacing),
          y: levelY[level as keyof typeof levelY],
          node,
          visible: true
        };
      });
    });

    // Add positions for hidden nodes (for smooth transitions)
    Object.values(FUNCTIONAL_NODES).forEach(node => {
      if (!positions[node.id]) {
        // Position hidden nodes at their parent's location
        const parent = node.parents.length > 0 ? positions[node.parents[0]] : null;
        positions[node.id] = {
          x: parent ? parent.x : 450,
          y: parent ? parent.y : levelY[node.level as keyof typeof levelY],
          node,
          visible: false
        };
      }
    });

    return positions;
  }, [visibleNodes]);

  // Calculate confidence based on user context
  const getNodeConfidence = (nodeId: string): number => {
    if (!showContext || !userContext.history.length) return 0.5;
    
    const node = FUNCTIONAL_NODES[nodeId];
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

  // Toggle node expansion with peer collapse behavior
  const toggleNodeExpansion = (nodeId: string) => {
    const node = FUNCTIONAL_NODES[nodeId];
    if (!node || node.children.length === 0) return;
    
    // If intent is selected, only allow toggling matched nodes
    if (selectedIntent && !matchedNodes.has(nodeId)) return;
    
    // Check if this node has any matched children to expand
    const hasMatchedChildren = selectedIntent ? 
      node.children.some(childId => matchedNodes.has(childId)) : 
      true;
    
    if (!hasMatchedChildren) return;
    
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      
      // If this node is already expanded, just collapse it
      if (newSet.has(nodeId)) {
        // Collapse: remove this node and all its descendants from expanded set
        const removeDescendants = (id: string) => {
          newSet.delete(id);
          const n = FUNCTIONAL_NODES[id];
          if (n) {
            n.children.forEach(childId => removeDescendants(childId));
          }
        };
        removeDescendants(nodeId);
      } else {
        // Find all peers that need to be collapsed
        const peersToCollapse: string[] = [];
        
        // If this node has parents, find siblings through parents
        if (node.parents.length > 0) {
          node.parents.forEach(parentId => {
            const parent = FUNCTIONAL_NODES[parentId];
            if (parent) {
              parent.children.forEach(childId => {
                if (childId !== nodeId) {
                  // Check if this sibling or any of its descendants are expanded
                  const checkExpanded = (id: string): boolean => {
                    if (newSet.has(id)) return true;
                    const n = FUNCTIONAL_NODES[id];
                    if (n) {
                      return n.children.some(cId => checkExpanded(cId));
                    }
                    return false;
                  };
                  
                  if (checkExpanded(childId)) {
                    peersToCollapse.push(childId);
                  }
                }
              });
            }
          });
        } else {
          // This is a root node - find other expanded nodes at same level
          Object.values(FUNCTIONAL_NODES).forEach(n => {
            if (n.id !== nodeId && n.level === node.level && n.parents.length === 0) {
              const checkExpanded = (id: string): boolean => {
                if (newSet.has(id)) return true;
                const node = FUNCTIONAL_NODES[id];
                if (node) {
                  return node.children.some(cId => checkExpanded(cId));
                }
                return false;
              };
              
              if (checkExpanded(n.id)) {
                peersToCollapse.push(n.id);
              }
            }
          });
        }
        
        // Collapse all peer nodes and their entire subtrees
        const collapseSubtree = (id: string) => {
          newSet.delete(id);
          const n = FUNCTIONAL_NODES[id];
          if (n) {
            n.children.forEach(childId => collapseSubtree(childId));
          }
        };
        
        peersToCollapse.forEach(peerId => {
          collapseSubtree(peerId);
        });
        
        // Now expand this node
        newSet.add(nodeId);
      }
      
      return newSet;
    });
  };

  // Render connections between nodes
  const renderConnections = () => {
    const connections: React.ReactElement[] = [];
    const drawnConnections = new Set<string>();
    
    // Only draw connections from expanded nodes to their children
    expandedNodes.forEach(nodeId => {
      const node = FUNCTIONAL_NODES[nodeId];
      if (!node || !visibleNodes.has(nodeId)) return;
      
      node.children.forEach(childId => {
        if (!visibleNodes.has(childId)) return;
        
        const connectionKey = `${nodeId}-${childId}`;
        if (drawnConnections.has(connectionKey)) return;
        drawnConnections.add(connectionKey);
        
        const parentPos = nodePositions[nodeId];
        const childPos = nodePositions[childId];
        
        if (parentPos && childPos && parentPos.visible && childPos.visible) {
          const isInPath = resolution && (
            (resolution.traversalPath.upward.includes(node.id) && resolution.traversalPath.upward.includes(childId)) ||
            (resolution.traversalPath.downward.includes(node.id) && resolution.traversalPath.downward.includes(childId)) ||
            (node.id === entryNode && resolution.traversalPath.downward.includes(childId)) ||
            (childId === entryNode && resolution.traversalPath.upward.includes(node.id))
          );

          const isUpward = resolution && (
            resolution.traversalPath.upward.includes(node.id) && 
            resolution.traversalPath.upward.includes(childId)
          );
          
          const isDownward = resolution && (
            (resolution.traversalPath.downward.includes(node.id) && resolution.traversalPath.downward.includes(childId)) ||
            (node.id === entryNode && resolution.traversalPath.downward.includes(childId))
          );

          // Draw a curved path
          const midY = (parentPos.y + childPos.y) / 2;
          const path = `M ${parentPos.x} ${parentPos.y + 25} C ${parentPos.x} ${midY}, ${childPos.x} ${midY}, ${childPos.x} ${childPos.y - 25}`;

          connections.push(
            <path
              key={connectionKey}
              d={path}
              fill="none"
              stroke={isInPath ? (isUpward ? '#9333ea' : isDownward ? '#10b981' : '#667eea') : '#888888'}
              strokeWidth={isInPath ? 2.5 : 1.5}
              strokeDasharray={isUpward ? '5,5' : 'none'}
              opacity={isInPath ? 1 : 0.7}
              style={{
                transition: 'all 0.5s ease'
              }}
            >
              {isInPath && (
                <animate
                  attributeName="stroke-opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          );
        }
      });
    });

    return connections;
  };

  // Render a single node
  const renderNode = (nodeId: string) => {
    const pos = nodePositions[nodeId];
    if (!pos || !pos.visible) return null;

    const node = pos.node;
    const isEntry = entryNode === nodeId;
    const isInUpward = resolution?.traversalPath.upward.includes(nodeId);
    const isInDownward = resolution?.traversalPath.downward.includes(nodeId);
    const isInPath = isEntry || isInUpward || isInDownward;
    const confidence = getNodeConfidence(nodeId);
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.children.length > 0;
    const hasMatchedChildren = selectedIntent ? 
      node.children.some(childId => matchedNodes.has(childId)) : 
      hasChildren;
    const isHovered = hoveredNode === nodeId;

    const shouldShow = 
      !selectedIntent ||
      animationPhase === 'entry' && isEntry ||
      animationPhase === 'upward' && (isEntry || isInUpward) ||
      animationPhase === 'downward' && (isEntry || isInUpward || isInDownward) ||
      animationPhase === 'complete';

    return (
      <g 
        key={nodeId} 
        style={{ 
          opacity: shouldShow ? 1 : (isInPath ? 0.3 : 1),
          cursor: hasMatchedChildren ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
        onClick={() => toggleNodeExpansion(nodeId)}
        onMouseEnter={() => setHoveredNode(nodeId)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <rect
          x={pos.x - 70}
          y={pos.y - 25}
          width={140}
          height={50}
          rx={8}
          fill={isInPath ? LEVEL_COLORS[node.level] : 'white'}
          stroke={isEntry ? '#ff4444' : LEVEL_COLORS[node.level]}
          strokeWidth={isEntry ? 4 : isInPath ? 2.5 : 2}
          opacity={showContext ? (0.3 + confidence * 0.7) : 1}
          style={{
            filter: isEntry ? 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.6))' : 
                    isHovered ? 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))' : 'none',
            transition: 'all 0.5s ease'
          }}
        />
        
        {/* Render text with word wrapping for longer labels */}
        {(() => {
          const words = node.label.split(' ');
          const maxWidth = 120; // Maximum width for text
          const lineHeight = 14;
          const lines: string[] = [];
          let currentLine = '';
          
          // Simple word wrapping algorithm
          words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            // Approximate character width (6px per character for 12px font)
            if (testLine.length * 6 > maxWidth) {
              if (currentLine) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                lines.push(word);
              }
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Center the text block vertically
          const startY = pos.y - (lines.length - 1) * lineHeight / 2;
          
          return lines.map((line, index) => (
            <text
              key={index}
              x={pos.x}
              y={startY + index * lineHeight}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isInPath ? 'white' : '#333'}
              fontSize={12}
              fontWeight={isInPath ? 'bold' : 'normal'}
              style={{ pointerEvents: 'none' }}
            >
              {line}
            </text>
          ));
        })()}

        {/* Expand/Collapse indicator */}
        {hasMatchedChildren && (
          <g style={{ pointerEvents: 'none' }}>
            <circle
              cx={pos.x + 55}
              cy={pos.y - 15}
              r={8}
              fill={isExpanded ? '#4caf50' : '#ff9800'}
              opacity={0.8}
            />
            <text
              x={pos.x + 55}
              y={pos.y - 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={10}
              fontWeight="bold"
            >
              {isExpanded ? '−' : '+'}
            </text>
          </g>
        )}

        {/* Entry point indicator */}
        {isEntry && (
          <>
            <circle
              cx={pos.x}
              cy={pos.y - 35}
              r={6}
              fill="#ff4444"
              style={{
                animation: 'pulse 2s infinite',
                pointerEvents: 'none'
              }}
            />
            <text
              x={pos.x}
              y={pos.y - 45}
              textAnchor="middle"
              fontSize={10}
              fill="#ff4444"
              fontWeight="bold"
              style={{ pointerEvents: 'none' }}
            >
              ENTRY
            </text>
          </>
        )}

        {/* Confidence indicator - only show when intent is selected */}
        {selectedIntent && showContext && userContext.history.length > 0 && (
          <text
            x={pos.x}
            y={pos.y + 35}
            textAnchor="middle"
            fontSize={9}
            fill={confidence > 0.8 ? '#4caf50' : confidence > 0.6 ? '#ff9800' : '#f44336'}
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {Math.round(confidence * 100)}%
          </text>
        )}

        {/* Tooltip on hover */}
        {isHovered && node.description && (
          <g style={{ pointerEvents: 'none' }}>
            <rect
              x={pos.x - 100}
              y={pos.y + 40}
              width={200}
              height={30}
              rx={4}
              fill="rgba(0, 0, 0, 0.9)"
            />
            <text
              x={pos.x}
              y={pos.y + 60}
              textAnchor="middle"
              fill="white"
              fontSize={10}
            >
              {node.description}
            </text>
          </g>
        )}
      </g>
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
      <style>{`
        @keyframes pulse {
          0% { r: 4; opacity: 1; }
          50% { r: 8; opacity: 0.5; }
          100% { r: 4; opacity: 1; }
        }
      `}</style>

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
        fontWeight: 'bold'
      }}>
        {selectedIntent ? 
          `Showing matched path • ${expandedNodes.size} nodes expanded` :
          `Click nodes to expand/collapse • ${expandedNodes.size} nodes expanded`
        }
      </div>

      {/* Main visualization */}
      <svg
        width="100%"
        height="600"
        viewBox="0 0 1000 600"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Level labels inside SVG - positioned between node rows */}
        <g>
          {/* Product label - above product nodes */}
          <rect x={20} y={40} width={3} height={30} fill={LEVEL_COLORS.product} rx={2} />
          <text x={30} y={55} fill={LEVEL_COLORS.product} fontSize={11} fontWeight="bold" dominantBaseline="middle">
            PRODUCT
          </text>
          
          {/* Outcome label - between product and outcome */}
          <rect x={20} y={137} width={3} height={30} fill={LEVEL_COLORS.outcome} rx={2} />
          <text x={30} y={152} fill={LEVEL_COLORS.outcome} fontSize={11} fontWeight="bold" dominantBaseline="middle">
            OUTCOME
          </text>
          
          {/* Scenario label - between outcome and scenario */}
          <rect x={20} y={237} width={3} height={30} fill={LEVEL_COLORS.scenario} rx={2} />
          <text x={30} y={252} fill={LEVEL_COLORS.scenario} fontSize={11} fontWeight="bold" dominantBaseline="middle">
            SCENARIO
          </text>
          
          {/* Step label - between scenario and step */}
          <rect x={20} y={337} width={3} height={30} fill={LEVEL_COLORS.step} rx={2} />
          <text x={30} y={352} fill={LEVEL_COLORS.step} fontSize={11} fontWeight="bold" dominantBaseline="middle">
            STEP
          </text>
          
          {/* Action label - between step and action */}
          <rect x={20} y={437} width={3} height={30} fill={LEVEL_COLORS.action} rx={2} />
          <text x={30} y={452} fill={LEVEL_COLORS.action} fontSize={11} fontWeight="bold" dominantBaseline="middle">
            ACTION
          </text>
        </g>
        
        {/* Render connections first (behind nodes) */}
        <g>{renderConnections()}</g>
        
        {/* Render nodes on top */}
        <g>{Object.keys(nodePositions).map(nodeId => renderNode(nodeId))}</g>
      </svg>

      {/* Animation phase indicator */}
      {selectedIntent && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 'bold'
        }}>
          {animationPhase === 'entry' && '1. Entry Point'}
          {animationPhase === 'upward' && '2. Context Discovery ↑'}
          {animationPhase === 'downward' && '3. Action Expansion ↓'}
          {animationPhase === 'complete' && '4. Complete Path'}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        fontSize: 10,
        color: '#666',
        display: 'flex',
        gap: 15
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ 
            width: 20, 
            height: 2, 
            background: '#9333ea',
            borderStyle: 'dashed'
          }} />
          <span>Context (Upward)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ 
            width: 20, 
            height: 2, 
            background: '#10b981' 
          }} />
          <span>Actions (Downward)</span>
        </div>
      </div>
    </div>
  );
};

export default HierarchyVisualization;
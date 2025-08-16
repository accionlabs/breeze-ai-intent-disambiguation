import React from 'react';
import { FunctionalNode, LEVEL_COLORS } from '../config/functionalHierarchy';

export interface TreeNodeProps {
  nodeId: string;
  node: FunctionalNode;
  position: { x: number; y: number };
  isEntry?: boolean;
  isInPath?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  hasMatchedChildren?: boolean;
  isHovered?: boolean;
  confidence?: number;
  showContext?: boolean;
  animationPhase?: 'entry' | 'upward' | 'downward' | 'complete';
  
  // Visual customization props
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  showConfidence?: boolean;
  showExpandIndicator?: boolean;
  showOverlapBorder?: boolean;
  
  // Custom labels/badges
  customLabel?: string;
  badge?: {
    text: string;
    color: string;
    position?: 'top' | 'bottom';
  };
  
  // Event handlers
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  nodeId,
  node,
  position,
  isEntry = false,
  isInPath = false,
  isExpanded = false,
  hasChildren = false,
  hasMatchedChildren = false,
  isHovered = false,
  confidence = 0.5,
  showContext = false,
  animationPhase = 'complete',
  
  // Visual customization
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  opacity = 1,
  showConfidence = false,
  showExpandIndicator = true,
  showOverlapBorder = false,
  
  // Custom labels
  customLabel,
  badge,
  
  // Event handlers
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  // Calculate display properties
  const shouldShow = 
    animationPhase === 'complete' ||
    (animationPhase === 'entry' && isEntry) ||
    (animationPhase === 'upward' && (isEntry || isInPath)) ||
    (animationPhase === 'downward' && (isEntry || isInPath));

  // Determine colors and styles
  const defaultFillColor = isInPath ? LEVEL_COLORS[node.level] : 'white';
  const defaultStrokeColor = isEntry ? '#ff4444' : LEVEL_COLORS[node.level];
  const defaultStrokeWidth = isEntry ? 4 : isInPath ? 2.5 : 2;
  
  const finalFillColor = fillColor !== undefined ? fillColor : defaultFillColor;
  const finalStrokeColor = strokeColor !== undefined ? strokeColor : defaultStrokeColor;
  const finalStrokeWidth = strokeWidth !== undefined ? strokeWidth : defaultStrokeWidth;
  const finalOpacity = shouldShow ? opacity : (isInPath ? 0.3 : opacity);

  // Calculate text display
  const displayLabel = customLabel || node.label;
  const words = displayLabel.split(' ');
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
  const textStartY = position.y - (lines.length - 1) * lineHeight / 2;

  return (
    <g 
      style={{ 
        cursor: hasMatchedChildren ? 'pointer' : 'default'
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Overlap border - rendered behind the main rectangle */}
      {showOverlapBorder && (
        <rect
          x={position.x - 75}
          y={position.y - 30}
          width={150}
          height={60}
          rx={10}
          fill="none"
          stroke="#f97316"
          strokeWidth={2.5}
          strokeDasharray="8,4"
          opacity={finalOpacity * 0.8}
        />
      )}
      
      {/* Main node rectangle */}
      <rect
        x={position.x - 70}
        y={position.y - 25}
        width={140}
        height={50}
        rx={8}
        fill={finalFillColor}
        fillOpacity={showContext ? (0.3 + confidence * 0.7) : 1}
        stroke={finalStrokeColor}
        strokeWidth={finalStrokeWidth}
        strokeOpacity={finalOpacity}
        strokeDasharray={strokeDasharray}
        style={{
          filter: isEntry ? 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.6))' : 
                  isHovered ? 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))' : 'none'
        }}
      />
      
      {/* Node text */}
      {lines.map((line, index) => (
        <text
          key={index}
          x={position.x}
          y={textStartY + index * lineHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isEntry ? 'white' : (isInPath ? '#000' : '#333')}
          fontSize={12}
          fontWeight={isInPath || isEntry ? 'bold' : 'normal'}
          style={{ pointerEvents: 'none' }}
        >
          {line}
        </text>
      ))}

      {/* Expand/Collapse indicator */}
      {showExpandIndicator && hasMatchedChildren && (
        <g style={{ pointerEvents: 'none' }}>
          <circle
            cx={position.x + 55}
            cy={position.y - 15}
            r={8}
            fill={isExpanded ? '#4caf50' : '#ff9800'}
            opacity={0.8}
          />
          <text
            x={position.x + 55}
            y={position.y - 15}
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
            cx={position.x}
            cy={position.y - 35}
            r={6}
            fill="#ff4444"
            style={{
              pointerEvents: 'none'
            }}
          />
          <text
            x={position.x}
            y={position.y - 45}
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

      {/* Confidence indicator */}
      {showConfidence && showContext && (
        <text
          x={position.x}
          y={position.y + 35}
          textAnchor="middle"
          fontSize={9}
          fill={confidence > 0.8 ? '#4caf50' : confidence > 0.6 ? '#ff9800' : '#f44336'}
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {Math.round(confidence * 100)}%
        </text>
      )}

      {/* Custom badge */}
      {badge && (
        <g style={{ pointerEvents: 'none' }}>
          <rect
            x={position.x - 30}
            y={badge.position === 'top' ? position.y - 40 : position.y + 30}
            width={60}
            height={16}
            rx={8}
            fill={badge.color}
            opacity={0.9}
          />
          <text
            x={position.x}
            y={badge.position === 'top' ? position.y - 32 : position.y + 38}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={9}
            fontWeight="bold"
          >
            {badge.text}
          </text>
        </g>
      )}

      {/* Tooltip on hover */}
      {isHovered && node.description && (
        <g style={{ pointerEvents: 'none' }}>
          <rect
            x={position.x - 100}
            y={position.y + 40}
            width={200}
            height={30}
            rx={4}
            fill="rgba(0, 0, 0, 0.9)"
          />
          <text
            x={position.x}
            y={position.y + 55}
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

export default TreeNode;
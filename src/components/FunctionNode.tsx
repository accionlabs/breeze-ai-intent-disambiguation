import React from 'react';
import { FunctionNode as FunctionNodeType } from '../types';
import { LAYOUT_CONFIG } from '../config/layout';

interface FunctionNodeProps {
  node: FunctionNodeType;
  color: string;
  position: { x: number; y: number };
  isHighlighted?: boolean;
  highlightColor?: string;
  isOverlapping?: boolean;
  isUnified?: boolean;
}

const FunctionNode: React.FC<FunctionNodeProps> = ({ 
  node, 
  color, 
  position, 
  isHighlighted = false,
  highlightColor,
  isOverlapping = false,
  isUnified = false 
}) => {
  const nodeStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x - 50,
    top: position.y - 15,
    width: 100,
    height: 30,
    backgroundColor: isHighlighted && highlightColor ? highlightColor : isUnified ? '#4caf50' : isHighlighted ? color : 'white',
    border: `2px ${isOverlapping ? 'dashed' : 'solid'} ${isOverlapping ? '#ff5722' : color}`,
    borderRadius: LAYOUT_CONFIG.functionNodes.borderRadius,
    display: 'flex',
    zIndex: LAYOUT_CONFIG.zIndex.functions,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: isHighlighted ? `0 0 12px ${color}40` : '0 2px 4px rgba(0,0,0,0.1)',
    animation: isOverlapping ? 'pulse 2s infinite' : undefined,
  };

  const textStyle: React.CSSProperties = {
    color: isUnified || isHighlighted ? 'white' : '#333',
    fontSize: 10,
    fontWeight: isUnified ? 'bold' : 'normal',
    textAlign: 'center',
  };

  return (
    <div 
      style={nodeStyle} 
      className={`function-node ${isOverlapping ? 'overlapping' : ''}`}
      data-function={node.name}
    >
      <span style={textStyle}>{node.name}</span>
    </div>
  );
};

export default FunctionNode;
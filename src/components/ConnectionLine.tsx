import React from 'react';
import { LAYOUT_CONFIG } from '../config/layout';

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  dashed?: boolean;
  opacity?: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ 
  from, 
  to, 
  color, 
  dashed = false, 
  opacity = 0.3 
}) => {
  // Calculate control points for bezier curve
  const midY = (from.y + to.y) / 2;
  const controlPoint1 = { x: from.x, y: midY };
  const controlPoint2 = { x: to.x, y: midY };
  
  // Create bezier path
  const path = `M ${from.x} ${from.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`;
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: LAYOUT_CONFIG.zIndex.connections,
      }}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={LAYOUT_CONFIG.connections.strokeWidth}
        fill="none"
        opacity={opacity}
        strokeDasharray={dashed ? '5,3' : undefined}
      />
    </svg>
  );
};

export default ConnectionLine;
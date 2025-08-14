import React from 'react';
import { LAYOUT_CONFIG } from '../config/layout';

interface CapabilityBubbleProps {
  text: string;
  position: { x: number; y: number };
  color: string;
  intensity?: 'primary' | 'secondary';
  isOverlapping?: boolean;
  width?: number;
}

const CapabilityBubble: React.FC<CapabilityBubbleProps> = ({ 
  text, 
  position, 
  color, 
  intensity = 'primary',
  isOverlapping = false,
  width = 140
}) => {
  const opacity = intensity === 'primary' ? 1 : 0.6;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x - width/2,
        top: position.y - 20,
        width: width,
        padding: '8px 10px',
        background: isOverlapping 
          ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
          : `rgba(255, 255, 255, ${opacity})`,
        border: `2px solid ${isOverlapping ? '#4caf50' : color}`,
        borderRadius: 15,
        borderStyle: isOverlapping ? 'solid' : (intensity === 'primary' ? 'solid' : 'dashed'),
        boxShadow: intensity === 'primary' 
          ? '0 2px 8px rgba(0,0,0,0.1)' 
          : '0 1px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: LAYOUT_CONFIG.zIndex.functions,
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.5s ease',
      }}
    >
      <div style={{
        fontSize: 11,
        color: isOverlapping ? 'white' : color,
        textAlign: 'center',
        lineHeight: '1.3',
        fontWeight: intensity === 'primary' ? 500 : 400,
        opacity: intensity === 'primary' ? 1 : 0.9,
      }}>
        {text}
      </div>
    </div>
  );
};

export default CapabilityBubble;
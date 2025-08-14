import React, { useState, useEffect } from 'react';
import { Intent, StageNumber } from '../types';
import { INTENTS } from '../data/config';
import { getIntentStatus } from '../config/intentMappings';

interface IntentBarProps {
  currentIntent?: string;
  onIntentSelect: (intentId: string) => void;
  currentStage: number;
  orientation?: 'horizontal' | 'vertical';
}

const IntentBar: React.FC<IntentBarProps> = ({ currentIntent, onIntentSelect, currentStage, orientation = 'horizontal' }) => {
  const intents = Object.values(INTENTS);
  const [statusInfo, setStatusInfo] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
  } | undefined>();
  
  useEffect(() => {
    if (currentIntent) {
      const status = getIntentStatus(currentStage as StageNumber, currentIntent);
      setStatusInfo(status);
    } else {
      setStatusInfo(undefined);
    }
  }, [currentIntent, currentStage]);
  
  const isVertical = orientation === 'vertical';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row',
      gap: 10,
      padding: 15,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      alignItems: isVertical ? 'stretch' : 'center',
      marginBottom: isVertical ? 0 : 20,
      width: isVertical ? 200 : 'auto',
      minWidth: isVertical ? 200 : 'auto',
    }}>
      <span style={{ 
        fontWeight: 'bold', 
        marginRight: isVertical ? 0 : 10,
        marginBottom: isVertical ? 10 : 0,
        textAlign: isVertical ? 'center' : 'left'
      }}>Test Intent:</span>
      {intents.map(intent => {
        const isActive = currentIntent === intent.id;
        const isAvailable = currentStage >= intent.minStage;
        
        return (
          <button
            key={intent.id}
            onClick={() => onIntentSelect(intent.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '2px solid transparent',
              background: isActive ? intent.color : 'white',
              color: isActive ? 'white' : '#666',
              cursor: 'pointer',
              opacity: isAvailable ? 1 : 0.5,
              transition: 'all 0.3s ease',
              fontSize: 12,
              fontWeight: isActive ? 'bold' : 'normal',
              borderColor: isActive ? intent.color : '#ddd',
              width: isVertical ? '100%' : 'auto',
            }}
            title={intent.description}
          >
            "{intent.text}"
          </button>
        );
      })}
      
      {/* Status Panel */}
      {statusInfo && (
        <div style={{
          marginTop: isVertical ? 15 : 0,
          marginLeft: isVertical ? 0 : 15,
          padding: '12px 15px',
          background: statusInfo.type === 'error' ? '#ffebee' : 
                      statusInfo.type === 'success' ? '#e8f5e9' : '#fff3e0',
          color: statusInfo.type === 'error' ? '#c62828' : 
                 statusInfo.type === 'success' ? '#2e7d32' : '#ef6c00',
          borderRadius: 8,
          border: `1px solid ${
            statusInfo.type === 'error' ? '#ffcdd2' : 
            statusInfo.type === 'success' ? '#a5d6a7' : '#ffe0b2'
          }`,
          fontSize: 12,
          fontWeight: 500,
          width: isVertical ? '100%' : 'auto',
          maxWidth: isVertical ? '100%' : 300,
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: 6,
            fontSize: 11,
            textTransform: 'uppercase',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {statusInfo.type === 'success' && '✓ '}
            {statusInfo.type === 'error' && '⚠️ '}
            {statusInfo.type === 'warning' && '⚡ '}
            Intent Status
          </div>
          <div style={{ fontWeight: 600, marginBottom: statusInfo.details ? 4 : 0 }}>
            {statusInfo.message}
          </div>
          {statusInfo.details && (
            <div style={{ 
              fontSize: 11, 
              opacity: 0.9,
              marginTop: 4,
              paddingTop: 4,
              borderTop: `1px solid ${
                statusInfo.type === 'error' ? '#ffcdd2' : 
                statusInfo.type === 'success' ? '#c8e6c9' : '#ffe0b2'
              }`,
            }}>
              {statusInfo.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IntentBar;
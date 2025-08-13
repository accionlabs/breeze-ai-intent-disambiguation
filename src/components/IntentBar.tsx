import React, { useState, useEffect } from 'react';
import { Intent, StageNumber } from '../types';
import { INTENTS } from '../data/config';
import { getIntentError } from '../config/intentMappings';

interface IntentBarProps {
  currentIntent?: string;
  onIntentSelect: (intentId: string) => void;
  currentStage: number;
}

const IntentBar: React.FC<IntentBarProps> = ({ currentIntent, onIntentSelect, currentStage }) => {
  const intents = Object.values(INTENTS);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [errorIntentId, setErrorIntentId] = useState<string | undefined>();
  
  useEffect(() => {
    if (currentIntent) {
      const error = getIntentError(currentStage as StageNumber, currentIntent);
      if (error) {
        setErrorMessage(error);
        setErrorIntentId(currentIntent);
        // Clear error after 3 seconds
        setTimeout(() => {
          setErrorMessage(undefined);
          setErrorIntentId(undefined);
        }, 3000);
      }
    }
  }, [currentIntent, currentStage]);
  
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      padding: 15,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      alignItems: 'center',
      marginBottom: 20
    }}>
      <span style={{ fontWeight: 'bold', marginRight: 10 }}>Test Intent:</span>
      {intents.map(intent => {
        const isActive = currentIntent === intent.id;
        const isAvailable = currentStage >= intent.minStage;
        
        return (
          <div key={intent.id} style={{ position: 'relative' }}>
            <button
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
                borderColor: isActive ? intent.color : '#ddd'
              }}
              title={intent.description}
            >
              "{intent.text}"
            </button>
            {errorIntentId === intent.id && errorMessage && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 5,
                padding: '4px 8px',
                background: '#f44336',
                color: 'white',
                borderRadius: 4,
                fontSize: 10,
                whiteSpace: 'nowrap',
                zIndex: 100,
                animation: 'fadeIn 0.3s ease'
              }}>
                ⚠️ {errorMessage}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default IntentBar;
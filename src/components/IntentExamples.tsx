import React from 'react';
import { UserIntent, LEVEL_COLORS } from '../config/functionalHierarchy';

interface IntentExamplesProps {
  intents: UserIntent[];
  selectedIntent?: string;
  onIntentSelect: (intentId: string) => void;
}

const IntentExamples: React.FC<IntentExamplesProps> = ({ 
  intents, 
  selectedIntent, 
  onIntentSelect 
}) => {
  const getLevelIcon = (level: string) => {
    const icons = {
      outcome: '🎯',
      scenario: '📋',
      step: '👣',
      action: '⚡'
    };
    return icons[level as keyof typeof icons] || '•';
  };

  return (
    <div style={{
      width: 250,
      background: 'white',
      borderRadius: 12,
      padding: 15,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ 
        fontSize: 16, 
        marginBottom: 15,
        color: '#333'
      }}>
        User Intent Examples
      </h3>
      
      <div style={{ 
        fontSize: 11, 
        color: '#666', 
        marginBottom: 15,
        lineHeight: 1.4
      }}>
        Click an intent to see how it maps to the functional hierarchy
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {intents.map(intent => {
          const isSelected = selectedIntent === intent.id;
          const levelColor = LEVEL_COLORS[intent.entryLevel];
          
          return (
            <button
              key={intent.id}
              onClick={() => onIntentSelect(intent.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                marginBottom: 8,
                background: isSelected 
                  ? `linear-gradient(135deg, ${levelColor}22, ${levelColor}11)`
                  : 'white',
                color: '#333',
                border: `2px solid ${isSelected ? levelColor : '#e0e0e0'}`,
                borderRadius: 8,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderColor = levelColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 8,
                marginBottom: 4
              }}>
                <span style={{ fontSize: 14 }}>
                  {getLevelIcon(intent.entryLevel)}
                </span>
                <span style={{ 
                  fontSize: 13,
                  fontWeight: isSelected ? 'bold' : 'normal'
                }}>
                  "{intent.text}"
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 6,
                marginTop: 4
              }}>
                <span style={{
                  fontSize: 9,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: levelColor,
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {intent.entryLevel}
                </span>
                
                {intent.ambiguous && (
                  <span style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: '#ff9800',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    CONTEXT-DEPENDENT
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 15,
        paddingTop: 15,
        borderTop: '1px solid #e0e0e0',
        fontSize: 11,
        color: '#999'
      }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Legend:</div>
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <div key={level} style={{ 
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              background: color
            }} />
            <span style={{ textTransform: 'capitalize' }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntentExamples;
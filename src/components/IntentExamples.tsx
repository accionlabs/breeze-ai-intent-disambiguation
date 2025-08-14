import React from 'react';
import { UserIntent, LEVEL_COLORS } from '../config/functionalHierarchy';
import { RecentAction } from '../sections/IntentDisambiguationSection';

interface IntentExamplesProps {
  intents: UserIntent[];
  selectedIntent?: string;
  onIntentSelect: (intentId: string) => void;
  recentActions?: RecentAction[];
}

const IntentExamples: React.FC<IntentExamplesProps> = ({ 
  intents, 
  selectedIntent, 
  onIntentSelect,
  recentActions = [] 
}) => {
  console.log('IntentExamples recentActions:', recentActions); // Debug log
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
        color: '#666'
      }}>
        <div style={{ 
          marginBottom: 8, 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>Recent Actions</span>
          {recentActions.length > 0 && (
            <span style={{ 
              fontSize: 9, 
              color: '#999',
              fontWeight: 'normal'
            }}>
              {recentActions.length} recorded
            </span>
          )}
        </div>
        
        {recentActions.length === 0 ? (
          <div style={{ 
            color: '#999', 
            fontStyle: 'italic',
            padding: '8px 0'
          }}>
            No actions yet. Select an intent above to see how different personas resolve it.
          </div>
        ) : (
          <div style={{ 
            maxHeight: 150,
            overflowY: 'auto'
          }}>
            {recentActions.slice(0, 5).map((action) => {
              const timeAgo = Math.floor((Date.now() - action.timestamp.getTime()) / 1000);
              const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : 
                             timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m ago` :
                             `${Math.floor(timeAgo / 3600)}h ago`;
              
              return (
                <div key={action.id} style={{
                  marginBottom: 8,
                  padding: '6px 8px',
                  background: action.success ? '#f0f9ff' : '#fff0f0',
                  border: `1px solid ${action.success ? '#90cdf4' : '#fca5a5'}`,
                  borderRadius: 6,
                  fontSize: 10
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: 2
                  }}>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: action.success ? '#1e40af' : '#dc2626'
                    }}>
                      {action.persona}
                    </span>
                    <span style={{ color: '#999' }}>•</span>
                    <span style={{ color: '#999' }}>{timeStr}</span>
                  </div>
                  <div style={{ 
                    fontSize: 9,
                    color: '#666',
                    marginTop: 2
                  }}>
                    "{action.intent}" → {action.outcome}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntentExamples;
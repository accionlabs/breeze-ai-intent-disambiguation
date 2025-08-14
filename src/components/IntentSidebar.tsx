import React from 'react';
import { UserIntent, INTENT_CATEGORIES } from '../config/userIntents';

interface IntentSidebarProps {
  intents: UserIntent[];
  selectedIntent?: string;
  onIntentSelect: (intentId: string) => void;
}

const IntentSidebar: React.FC<IntentSidebarProps> = ({ intents, selectedIntent, onIntentSelect }) => {
  // Group intents by category
  const intentsByCategory = intents.reduce((acc, intent) => {
    if (!acc[intent.category]) {
      acc[intent.category] = [];
    }
    acc[intent.category].push(intent);
    return acc;
  }, {} as Record<string, UserIntent[]>);

  return (
    <div style={{
      width: 280,
      background: 'white',
      borderRadius: 12,
      padding: 15,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%', // Take full height of parent
      overflow: 'hidden', // Prevent overflow from breaking layout
    }}>
      <h3 style={{ 
        fontSize: 16, 
        marginBottom: 15,
        color: '#333',
        flexShrink: 0,
      }}>
        User Intents
      </h3>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        paddingRight: 5,
      }}>
      {INTENT_CATEGORIES.map(category => {
        const categoryIntents = intentsByCategory[category.id] || [];
        if (categoryIntents.length === 0) return null;
        
        return (
          <div key={category.id} style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: category.color,
              marginBottom: 8,
              opacity: 0.8,
            }}>
              {category.label}
            </div>
            
            {categoryIntents.map(intent => {
              const isSelected = selectedIntent === intent.id;
              const hasWorkflow = intent.workflow && intent.workflow.length > 0;
              
              return (
                <button
                  key={intent.id}
                  onClick={() => onIntentSelect(intent.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: 6,
                    background: isSelected 
                      ? `linear-gradient(135deg, ${category.color}dd 0%, ${category.color}99 100%)`
                      : 'white',
                    color: isSelected ? 'white' : '#666',
                    border: `1px solid ${isSelected ? category.color : '#e0e0e0'}`,
                    borderRadius: 8,
                    textAlign: 'left',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    {hasWorkflow && (
                      <span style={{
                        fontSize: 10,
                        padding: '2px 4px',
                        borderRadius: 4,
                        background: isSelected ? 'rgba(255,255,255,0.3)' : category.color,
                        color: isSelected ? 'white' : 'white',
                        fontWeight: 'bold',
                      }}>
                        W
                      </span>
                    )}
                    <span style={{ flex: 1 }}>"{intent.text}"</span>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
      
      <div style={{
        marginTop: 20,
        paddingTop: 15,
        borderTop: '1px solid #e0e0e0',
        fontSize: 11,
        color: '#999',
      }}>
        <div style={{ marginBottom: 5 }}>
          <span style={{
            display: 'inline-block',
            width: 16,
            height: 12,
            background: '#667eea',
            borderRadius: 2,
            marginRight: 5,
            verticalAlign: 'middle',
          }}></span>
          Primary capability
        </div>
        <div>
          <span style={{
            display: 'inline-block',
            width: 14,
            height: 10,
            background: '#667eea',
            opacity: 0.4,
            borderRadius: 2,
            marginRight: 5,
            verticalAlign: 'middle',
          }}></span>
          Secondary capability
        </div>
        <div style={{ marginTop: 5 }}>
          <span style={{
            display: 'inline-block',
            padding: '1px 3px',
            borderRadius: 2,
            background: '#667eea',
            color: 'white',
            fontSize: 9,
            fontWeight: 'bold',
            marginRight: 5,
          }}>W</span>
          Has workflow
        </div>
      </div>
      </div>
    </div>
  );
};

export default IntentSidebar;
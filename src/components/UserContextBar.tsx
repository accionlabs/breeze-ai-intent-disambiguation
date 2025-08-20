import React from 'react';
import { UserContext, getProductColor } from '../config';
import { RecentAction } from '../utils/resolutionEngine';

interface UserContextBarProps {
  context: UserContext;
  availableContexts: Record<string, UserContext>;
  onContextChange: (contextId: string) => void;
  currentContextId: string;
  recentActions?: RecentAction[];
  onClearActions?: () => void;
}

const UserContextBar: React.FC<UserContextBarProps> = ({ 
  context, 
  availableContexts, 
  onContextChange,
  currentContextId,
  recentActions = [],
  onClearActions
}) => {
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Calculate dynamic product usage from recent actions
  const calculateProductUsage = () => {
    const productCounts: Record<string, number> = {};
    let total = 0;
    
    // Count product usage from recent actions
    recentActions.forEach(action => {
      const product = action.product; // Already lowercase
      if (product !== 'n/a') {
        productCounts[product] = (productCounts[product] || 0) + 1;
        total++;
      }
    });
    
    // Convert to percentages
    const productUsage: Record<string, number> = {};
    if (total > 0) {
      Object.entries(productCounts).forEach(([product, count]) => {
        productUsage[product] = count / total;
      });
    }
    
    return productUsage;
  };
  
  const dynamicProductUsage = calculateProductUsage();
  const hasRecentUsage = Object.keys(dynamicProductUsage).length > 0;

  return (
    <div style={{
      background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Role Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#666', fontWeight: 'bold' }}>PERSONA:</span>
            <select 
              value={currentContextId}
              onChange={(e) => onContextChange(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '2px solid #667eea',
                background: 'white',
                fontSize: 13,
                fontWeight: 'bold',
                color: '#667eea',
                cursor: 'pointer'
              }}
            >
              {Object.entries(availableContexts).map(([id, ctx]) => (
                <option key={id} value={id}>
                  {ctx.profile.role}
                </option>
              ))}
            </select>
          </div>

          {/* Department & Seniority */}
          <div style={{ 
            padding: '4px 10px',
            background: '#f5f5f5',
            borderRadius: 4,
            fontSize: 11,
            color: '#666'
          }}>
            {context.profile.department} • {context.profile.seniority}
          </div>

          {/* Workflow Stage */}
          {context.patterns.workflowStage && (
            <div style={{
              padding: '4px 10px',
              background: '#e8f5e9',
              borderRadius: 4,
              fontSize: 11,
              color: '#2e7d32',
              fontWeight: 'bold'
            }}>
              📊 {context.patterns.workflowStage}
            </div>
          )}

          {/* Domain Focus Tags - moved to top row */}
          {context.patterns.domainFocus && context.patterns.domainFocus.length > 0 && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{ fontSize: 10, color: '#999' }}>FOCUS:</span>
              {context.patterns.domainFocus.map(domain => (
                <span key={domain} style={{
                  padding: '2px 6px',
                  background: '#f0f0f0',
                  borderRadius: 3,
                  fontSize: 10,
                  color: '#666'
                }}>
                  {domain}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Product Preferences - Dynamic from recent actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#999' }}>
            Product Usage{hasRecentUsage ? ' (Live)' : ''}:
          </span>
          {hasRecentUsage ? (
            // Show dynamic usage from recent actions
            Object.entries(dynamicProductUsage)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([product, weight]) => (
                <div key={product} style={{
                  padding: '3px 8px',
                  background: getProductColor(product),
                  color: 'white',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 'bold',
                  boxShadow: '0 0 8px rgba(102, 126, 234, 0.3)'
                }}>
                  {product.toUpperCase()} {Math.round(weight * 100)}%
                </div>
              ))
          ) : (
            // Show message when no usage data available
            <div style={{
              padding: '3px 8px',
              background: '#f0f0f0',
              color: '#999',
              borderRadius: 4,
              fontSize: 10,
              fontStyle: 'italic'
            }}>
              No product usage yet - select queries to build history
            </div>
          )}
        </div>
      </div>

      {/* Recent History Timeline */}
      <div style={{ 
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#666', fontWeight: 'bold' }}>
              RECENT ACTIONS:
            </span>
            {recentActions.length > 0 && onClearActions && (
              <button
                onClick={onClearActions}
                style={{
                  padding: '2px 8px',
                  fontSize: 10,
                  background: '#ff5252',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ff1744'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ff5252'}
                title="Clear all recent actions"
              >
                Clear History
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {recentActions.length > 0 ? (
              // Show dynamic recent actions - newest on the right
              recentActions.slice(0, 5).reverse().map((action, index, arr) => {
                const timeAgo = Math.floor((Date.now() - action.timestamp.getTime()) / 1000);
                const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : 
                               timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m ago` :
                               `${Math.floor(timeAgo / 3600)}h ago`;
                
                // Get product color (product is already lowercase)
                const productColor = getProductColor(action.product);
                
                return (
                  <React.Fragment key={action.id}>
                    <div style={{
                      padding: '4px 10px',
                      background: 'white',
                      border: `1px solid ${productColor}`,
                      borderRadius: 6,
                      fontSize: 11,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 80
                    }}>
                      <div style={{ 
                        color: productColor,
                        fontWeight: 'bold',
                        marginBottom: 2
                      }}>
                        {action.product.toUpperCase()}
                      </div>
                      <div style={{ 
                        color: '#666', 
                        fontSize: 10,
                        textAlign: 'center',
                        maxWidth: 100,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {action.matchedNode}
                      </div>
                      <div style={{ color: '#999', fontSize: 9, marginTop: 2 }}>
                        {timeStr}
                      </div>
                    </div>
                    {index < arr.length - 1 && (
                      <div style={{ color: '#ccc', fontSize: 16 }}>→</div>
                    )}
                  </React.Fragment>
                );
              })
            ) : null}
            {recentActions.length === 0 && (
              <div style={{ 
                color: '#999', 
                fontSize: 11, 
                fontStyle: 'italic' 
              }}>
                No recent actions (new user)
              </div>
            )}
          </div>
        </div>

    </div>
  );
};

export default UserContextBar;
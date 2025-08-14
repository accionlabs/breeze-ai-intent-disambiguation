import React from 'react';
import { UserContext } from '../config/functionalHierarchy';
import { RecentAction } from '../sections/IntentDisambiguationSection';

interface UserContextBarProps {
  context: UserContext;
  availableContexts: Record<string, UserContext>;
  onContextChange: (contextId: string) => void;
  currentContextId: string;
  recentActions?: RecentAction[];
}

const UserContextBar: React.FC<UserContextBarProps> = ({ 
  context, 
  availableContexts, 
  onContextChange,
  currentContextId,
  recentActions = [] 
}) => {
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getProductColor = (product: string) => {
    const colors: Record<string, string> = {
      bcr: '#f9a825',
      smm: '#1976d2',
      cision: '#ef6c00',
      prn: '#7b1fa2',
      trendkite: '#00897b',
      brandwatch: '#e91e63',
      'n/a': '#999'
    };
    return colors[product] || '#666';
  };

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
            <span style={{ fontSize: 12, color: '#666', fontWeight: 'bold' }}>CONTEXT:</span>
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

        {/* Product Preferences */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#999' }}>Product Usage:</span>
          {Object.entries(context.patterns.productPreferences || {})
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
                opacity: 0.5 + (weight * 0.5)
              }}>
                {product.toUpperCase()} {Math.round(weight * 100)}%
              </div>
            ))}
        </div>
      </div>

      {/* Recent History Timeline */}
      {(recentActions.length > 0 || context.history.length > 0) && (
        <div style={{ 
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 8, fontWeight: 'bold' }}>
            RECENT ACTIONS:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {recentActions.length > 0 ? (
              // Show dynamic recent actions - newest on the right
              recentActions.slice(0, 5).reverse().map((action, index, arr) => {
                const timeAgo = Math.floor((Date.now() - action.timestamp.getTime()) / 1000);
                const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : 
                               timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m ago` :
                               `${Math.floor(timeAgo / 3600)}h ago`;
                
                // Get product color
                const productColor = getProductColor(action.product.toLowerCase());
                
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
                        {action.product}
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
            ) : (
              // Fallback to static history if no dynamic actions
              context.history.slice(-5).map((item, index) => (
                <React.Fragment key={index}>
                  <div style={{
                    padding: '4px 10px',
                    background: 'white',
                    border: `1px solid ${getProductColor(item.product)}`,
                    borderRadius: 6,
                    fontSize: 11,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 80
                  }}>
                    <div style={{ 
                      color: getProductColor(item.product),
                      fontWeight: 'bold',
                      marginBottom: 2
                    }}>
                      {item.product.toUpperCase()}
                    </div>
                    <div style={{ color: '#666', fontSize: 10 }}>
                      {item.action}
                    </div>
                    <div style={{ color: '#999', fontSize: 9, marginTop: 2 }}>
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>
                  {index < context.history.length - 1 && (
                    <div style={{ color: '#ccc', fontSize: 16 }}>→</div>
                  )}
                </React.Fragment>
              ))
            )}
            {recentActions.length === 0 && context.history.length === 0 && (
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
      )}

    </div>
  );
};

export default UserContextBar;
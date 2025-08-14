import React from 'react';
import { Resolution, FUNCTIONAL_NODES, UserContext } from '../config/functionalHierarchy';

interface ResolutionComparisonProps {
  baseResolution?: Resolution;
  contextualResolution?: Resolution;
  userContext: UserContext;
  showContext: boolean;
  selectedIntentText?: string;
}

const ResolutionComparison: React.FC<ResolutionComparisonProps> = ({
  baseResolution,
  contextualResolution,
  userContext,
  showContext,
  selectedIntentText
}) => {
  const getProductColor = (product: string) => {
    const colors: Record<string, string> = {
      bcr: '#f9a825',
      smm: '#1976d2',
      cision: '#ef6c00',
      prn: '#7b1fa2',
      trendkite: '#00897b'
    };
    return colors[product] || '#666';
  };

  const renderResolution = (resolution: Resolution | undefined, title: string, isContextual: boolean) => {
    if (!resolution) {
      return (
        <div style={{
          padding: 20,
          background: '#f5f5f5',
          borderRadius: 8,
          textAlign: 'center',
          color: '#999',
          fontSize: 12,
          fontStyle: 'italic'
        }}>
          Select an intent to see resolution
        </div>
      );
    }

    const entryNode = FUNCTIONAL_NODES[resolution.entryNode];

    return (
      <div style={{
        padding: 15,
        background: isContextual ? 'linear-gradient(to bottom, #f0f7ff, white)' : 'white',
        border: `1px solid ${isContextual ? '#667eea' : '#e0e0e0'}`,
        borderRadius: 8
      }}>
        <h4 style={{ 
          fontSize: 12, 
          marginBottom: 12,
          color: isContextual ? '#667eea' : '#666',
          fontWeight: 'bold'
        }}>
          {title}
        </h4>

        {/* Entry Point */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>ENTRY POINT:</div>
          <div style={{
            padding: '6px 10px',
            background: '#f8f9fa',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 'bold'
          }}>
            {entryNode?.label} ({entryNode?.level})
          </div>
        </div>

        {/* Confidence Score */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>CONFIDENCE:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              flex: 1,
              height: 8,
              background: '#e0e0e0',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${resolution.confidenceScore * 100}%`,
                height: '100%',
                background: resolution.confidenceScore > 0.8 ? '#4caf50' : 
                           resolution.confidenceScore > 0.5 ? '#ff9800' : '#f44336',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <span style={{ 
              fontSize: 11, 
              fontWeight: 'bold',
              color: resolution.confidenceScore > 0.8 ? '#4caf50' : 
                     resolution.confidenceScore > 0.5 ? '#ff9800' : '#f44336'
            }}>
              {Math.round(resolution.confidenceScore * 100)}%
            </span>
          </div>
        </div>

        {/* Context Path */}
        {resolution.traversalPath.upward.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>CONTEXT PATH:</div>
            <div style={{ fontSize: 10, color: '#9333ea' }}>
              {resolution.traversalPath.upward.map(nodeId => 
                FUNCTIONAL_NODES[nodeId]?.label
              ).filter(Boolean).join(' → ')}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>ACTIONS TO EXECUTE:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {resolution.selectedActions.map(actionId => {
              const action = FUNCTIONAL_NODES[actionId];
              if (!action) return null;
              return (
                <div key={actionId} style={{
                  padding: '3px 8px',
                  background: '#fff3e0',
                  border: '1px solid #ffb74d',
                  borderRadius: 4,
                  fontSize: 10,
                  color: '#e65100'
                }}>
                  {action.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Activation */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>PRODUCTS ACTIVATED:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {resolution.productActivation.map((activation, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <div style={{
                  padding: '2px 6px',
                  background: getProductColor(activation.product),
                  color: 'white',
                  borderRadius: 3,
                  fontSize: 9,
                  fontWeight: 'bold'
                }}>
                  {activation.product.toUpperCase()}
                </div>
                <span style={{ 
                  fontSize: 10,
                  color: activation.priority === 'primary' ? '#333' : '#999'
                }}>
                  {activation.priority === 'primary' ? '●' : '○'}
                </span>
                <span style={{ fontSize: 10, color: '#666' }}>
                  {activation.actions.length} actions
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        {resolution.reasoning.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>REASONING:</div>
            <div style={{
              padding: 8,
              background: '#f8f9fa',
              borderRadius: 4,
              fontSize: 10,
              color: '#666',
              lineHeight: 1.4
            }}>
              {resolution.reasoning.map((reason, index) => (
                <div key={index} style={{ marginBottom: index < resolution.reasoning.length - 1 ? 4 : 0 }}>
                  • {reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      width: 300,
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
        marginBottom: 10,
        color: '#333'
      }}>
        Intent Resolution
      </h3>

      {selectedIntentText && (
        <div style={{
          padding: '8px 12px',
          background: '#e8f5e9',
          borderRadius: 6,
          fontSize: 12,
          color: '#2e7d32',
          marginBottom: 15,
          fontWeight: 'bold'
        }}>
          "{selectedIntentText}"
        </div>
      )}

      {/* Toggle Context */}
      <div style={{
        marginBottom: 15,
        padding: 10,
        background: '#f8f9fa',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: 11, color: '#666' }}>
          Context-Aware Resolution
        </span>
        <label style={{
          position: 'relative',
          display: 'inline-block',
          width: 40,
          height: 22
        }}>
          <input
            type="checkbox"
            checked={showContext}
            readOnly
            style={{ display: 'none' }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: showContext ? '#667eea' : '#ccc',
            transition: '0.4s',
            borderRadius: 22
          }}>
            <span style={{
              position: 'absolute',
              content: '',
              height: 16,
              width: 16,
              left: showContext ? 21 : 3,
              bottom: 3,
              background: 'white',
              transition: '0.4s',
              borderRadius: '50%'
            }} />
          </span>
        </label>
      </div>

      {/* Resolution Comparison */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!showContext ? (
          renderResolution(baseResolution, 'Generic Resolution', false)
        ) : (
          <div>
            {userContext.history.length === 0 ? (
              <div style={{
                padding: 20,
                background: '#fff3e0',
                borderRadius: 8,
                fontSize: 11,
                color: '#e65100',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  No Context Available
                </div>
                <div>
                  This is a new user with no history. 
                  The system will use generic resolution.
                </div>
                <div style={{ marginTop: 8, color: '#666' }}>
                  Try selecting different user contexts to see how resolution changes.
                </div>
              </div>
            ) : (
              renderResolution(contextualResolution, 'Context-Based Resolution', true)
            )}
          </div>
        )}
      </div>

      {/* Context Impact Summary */}
      {showContext && userContext.history.length > 0 && contextualResolution && (
        <div style={{
          marginTop: 15,
          paddingTop: 15,
          borderTop: '1px solid #e0e0e0',
          fontSize: 10,
          color: '#666'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Context Impact:</div>
          <div style={{ lineHeight: 1.4 }}>
            Based on your role as <strong>{userContext.profile.role}</strong> and 
            recent actions in <strong>{userContext.patterns.workflowStage}</strong>, 
            the system resolved this intent with {' '}
            <strong>{Math.round(contextualResolution.confidenceScore * 100)}%</strong> confidence.
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolutionComparison;
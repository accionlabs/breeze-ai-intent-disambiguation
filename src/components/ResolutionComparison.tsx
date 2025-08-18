import React, { useState, useEffect } from 'react';
import { Resolution, FUNCTIONAL_NODES, UserContext, DISPLAY_LIMITS, getProductColor, FunctionalNode } from '../config';
import { RecentAction } from '../sections/IntentDisambiguationSection';
import { GeneratedIntent } from '../utils/intentMatcher';

interface ResolutionComparisonProps {
  baseResolution?: Resolution;
  contextualResolution?: Resolution;
  userContext?: UserContext;
  showContext: boolean;
  selectedIntentText?: string;
  generatedIntent?: GeneratedIntent | null;
  recentActions?: RecentAction[];
  onSelectedRecentIntentChange?: (action: RecentAction | null) => void;
  onClearRecentIntents?: () => void;
  graphStateVersion?: number;
  currentToggles?: {
    showRationalized: boolean;
    showWorkflows: boolean;
  };
  nodes?: Record<string, FunctionalNode>;
}

const ResolutionComparison: React.FC<ResolutionComparisonProps> = ({
  baseResolution,
  contextualResolution,
  userContext,
  showContext,
  selectedIntentText,
  generatedIntent,
  recentActions = [],
  onSelectedRecentIntentChange,
  onClearRecentIntents,
  graphStateVersion = 0,
  currentToggles,
  nodes
}) => {
  const [selectedRecentIntent, setSelectedRecentIntent] = useState<string | null>(null);
  const [userDeselected, setUserDeselected] = useState(false);
  const [lastFirstIntentId, setLastFirstIntentId] = useState<string | null>(null);
  
  // Auto-select the latest intent only when a NEW intent is added
  useEffect(() => {
    // Check if the first intent in the list has changed (indicating a new intent was added)
    const currentFirstIntentId = recentActions.length > 0 ? recentActions[0].id : null;
    
    if (currentFirstIntentId && currentFirstIntentId !== lastFirstIntentId) {
      // A new intent was added at the top of the list
      setSelectedRecentIntent(currentFirstIntentId);
      setUserDeselected(false);
    }
    
    setLastFirstIntentId(currentFirstIntentId);
  }, [recentActions]);
  
  // Notify parent when selected recent intent changes
  useEffect(() => {
    if (onSelectedRecentIntentChange) {
      const selected = selectedRecentIntent ? 
        recentActions.find(a => a.id === selectedRecentIntent) || null : 
        null;
      onSelectedRecentIntentChange(selected);
    }
  }, [selectedRecentIntent, recentActions, onSelectedRecentIntentChange]);
  
  // Clear selection when graph state changes (toggles change)
  // But don't clear if we just selected a new intent
  useEffect(() => {
    // Only clear if the selected intent is not the most recent one
    if (selectedRecentIntent && recentActions.length > 0 && selectedRecentIntent !== recentActions[0].id) {
      setSelectedRecentIntent(null);
      setUserDeselected(true);
    }
  }, [graphStateVersion]);
  
  // Clear selected recent intent when a new intent is selected from main list
  // (removed this as we now handle it in the above useEffect)
  
  // Get the selected recent action data
  const selectedRecentAction = selectedRecentIntent
    ? recentActions.find(action => action.id === selectedRecentIntent)
    : null;
  
  // Determine what to show: current resolution or historical recent intent
  // Only show current resolution if there's no selected recent action
  // If a recent action is selected (even the most recent one), use its stored resolution
  const showCurrentResolution = baseResolution && !selectedRecentAction;

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

    const functionalNodes = nodes || FUNCTIONAL_NODES;
    const entryNode = functionalNodes[resolution.entryNode];

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

        {/* Context-based resolution indicator */}
        {resolution.reasoning.some(r => r.includes('Context-based resolution')) && (
          <div style={{
            marginBottom: 12,
            padding: '8px 12px',
            background: 'linear-gradient(to right, #fef3c7, #fef9e7)',
            border: '2px solid #f59e0b',
            borderRadius: 6,
            fontSize: 11,
            color: '#92400e',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>🎯</span>
            <div>
              <div>Context-Based Resolution</div>
              <div style={{ fontSize: 10, fontWeight: 'normal', marginTop: 2, color: '#78350f' }}>
                {resolution.reasoning.find(r => r.includes('Context-based resolution'))?.replace('Context-based resolution: ', '')}
              </div>
            </div>
          </div>
        )}

        {/* Resolution Result - Product and Outcome */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>RESOLVED TO:</div>
          
          {/* Primary Product and Outcome */}
          {resolution.productActivation.length > 0 && (() => {
            const primaryProduct = resolution.productActivation.find(p => p.priority === 'primary') || resolution.productActivation[0];
            // Try to find outcome from traversal path
            let outcomeName = 'N/A';
            const outcomeNode = resolution.traversalPath.upward
              .concat(resolution.traversalPath.downward)
              .map(nodeId => functionalNodes[nodeId])
              .find(node => node && node.level === 'outcome');
            if (outcomeNode) {
              outcomeName = outcomeNode.label;
            }
            
            return (
              <div style={{
                padding: '8px 12px',
                background: 'linear-gradient(to right, #f0f7ff, white)',
                border: '2px solid #667eea',
                borderRadius: 6,
                marginBottom: 8
              }}>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{
                      padding: '4px 10px',
                      background: getProductColor(primaryProduct.product),
                      color: 'white',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {primaryProduct.product.toUpperCase()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: '#333',
                    paddingLeft: 4
                  }}>
                    {outcomeName}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: '#666' }}>
                  {primaryProduct.actions.length} action{primaryProduct.actions.length !== 1 ? 's' : ''} will be executed
                </div>
              </div>
            );
          })()}
          
          {/* Entry Point Info */}
          <div style={{
            padding: '6px 10px',
            background: '#f8f9fa',
            borderRadius: 4,
            fontSize: 10,
            color: '#666'
          }}>
            Entry: <strong>{entryNode?.label}</strong> ({entryNode?.level})
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
              {resolution.traversalPath.upward
                .slice()
                .reverse()
                .map(nodeId => functionalNodes[nodeId]?.label)
                .filter(Boolean)
                .join(' → ')}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>ACTIONS TO EXECUTE:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {resolution.selectedActions.map(actionId => {
              const action = functionalNodes[actionId];
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

      {/* Show selected intent or recent intent */}
      {(selectedRecentAction || selectedIntentText) && (
        <div style={{
          padding: '8px 12px',
          background: selectedRecentAction ? '#f0f7ff' : '#e8f5e9',
          borderRadius: 6,
          fontSize: 12,
          color: selectedRecentAction ? '#1565c0' : '#2e7d32',
          marginBottom: 15,
          fontWeight: 'bold'
        }}>
          "{selectedRecentAction ? selectedRecentAction.intent : selectedIntentText}"
          {selectedRecentAction && (
            <div style={{ 
              fontSize: 10, 
              color: '#666', 
              fontWeight: 'normal',
              marginTop: 4
            }}>
              From: {selectedRecentAction.persona}
            </div>
          )}
        </div>
      )}

      {/* Show match confidence and alternatives for generated intents */}
      {generatedIntent && !selectedRecentAction && (
        <div style={{
          padding: '10px 12px',
          background: '#f8f9fa',
          borderRadius: 6,
          fontSize: 11,
          marginBottom: 15,
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ 
            fontSize: 10, 
            color: '#999', 
            marginBottom: 6,
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            Match Analysis
          </div>
          
          {/* Primary match */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8
          }}>
            <span style={{
              padding: '3px 8px',
              background: generatedIntent.matchConfidence > 0.7 ? '#e8f5e9' :
                         generatedIntent.matchConfidence > 0.4 ? '#fff3e0' :
                         '#ffebee',
              color: generatedIntent.matchConfidence > 0.7 ? '#2e7d32' :
                     generatedIntent.matchConfidence > 0.4 ? '#e65100' :
                     '#c62828',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 'bold',
              border: `1px solid ${
                generatedIntent.matchConfidence > 0.7 ? '#81c784' :
                generatedIntent.matchConfidence > 0.4 ? '#ffb74d' :
                '#ef5350'
              }`
            }}>
              {Math.round(generatedIntent.matchConfidence * 100)}% confidence
            </span>
            <span style={{ fontSize: 11, color: '#333' }}>
              → {generatedIntent.matchedNodeLabel}
            </span>
          </div>
          
          {/* Alternative matches */}
          {generatedIntent.alternativeMatches && generatedIntent.alternativeMatches.length > 0 && (
            <div style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1px solid #e0e0e0'
            }}>
              <div style={{ 
                fontSize: 10, 
                color: '#666', 
                marginBottom: 4,
                fontStyle: 'italic'
              }}>
                Other considered matches:
              </div>
              {generatedIntent.alternativeMatches.slice(0, DISPLAY_LIMITS.ALTERNATIVE_MATCHES_DISPLAY).map((alt, idx) => (
                <div key={idx} style={{ 
                  marginLeft: 10, 
                  fontSize: 10,
                  color: '#666',
                  marginBottom: 2
                }}>
                  • {alt.label} ({Math.round(alt.score * 100)}%)
                </div>
              ))}
            </div>
          )}
          
          {/* Ambiguity indicator */}
          {generatedIntent.isAmbiguous && (
            <div style={{
              marginTop: 8,
              padding: '4px 8px',
              background: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: 4,
              fontSize: 10,
              color: '#92400e',
              fontWeight: 'bold'
            }}>
              ⚠️ Ambiguous: Multiple products offer this function
            </div>
          )}
        </div>
      )}


      {/* Resolution Display */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {showCurrentResolution ? (
          // Show current intent resolution
          renderResolution(baseResolution, 'Intent Mapping', false)
        ) : selectedRecentAction ? (
          // Show selected recent intent's resolution using stored resolution data
          selectedRecentAction.resolution ? (
            renderResolution(selectedRecentAction.resolution, `Intent Mapping${selectedRecentAction.toggleStates ? ` (${selectedRecentAction.toggleStates.showRationalized ? 'Rationalized' : 'Not Rationalized'})` : ''}`, false)
          ) : (
            // Fallback for old data without stored resolution
            <div style={{
              padding: 15,
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 8
            }}>
              <h4 style={{ 
                fontSize: 12, 
                marginBottom: 12,
                color: '#666',
                fontWeight: 'bold'
              }}>
                Intent Mapping
              </h4>
              
              {/* Resolved To section for recent intent */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>RESOLVED TO:</div>
                <div style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(to right, #f0f7ff, white)',
                  border: '2px solid #667eea',
                  borderRadius: 6,
                  marginBottom: 8
                }}>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{
                        padding: '4px 10px',
                        background: getProductColor(selectedRecentAction.product.toLowerCase()),
                        color: 'white',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {selectedRecentAction.product}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: '#333',
                      paddingLeft: 4
                    }}>
                      {selectedRecentAction.outcome}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#666' }}>
                    Matched to: {selectedRecentAction.matchedNode}
                  </div>
                </div>
              </div>
              
              {/* Success indicator */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>STATUS:</div>
                <div style={{
                  padding: '6px 10px',
                  background: selectedRecentAction.success ? '#e8f5e9' : '#ffebee',
                  borderRadius: 4,
                  fontSize: 11,
                  color: selectedRecentAction.success ? '#2e7d32' : '#c62828',
                  fontWeight: 'bold'
                }}>
                  {selectedRecentAction.success ? '✓ Successfully Resolved' : '✗ Resolution Failed'}
                </div>
              </div>
            </div>
          )
        ) : (
          <div style={{
            padding: 20,
            background: '#f5f5f5',
            borderRadius: 8,
            textAlign: 'center',
            color: '#999',
            fontSize: 12,
            fontStyle: 'italic'
          }}>
            Select an intent to see how it maps to products and outcomes
          </div>
        )}
      </div>

      
      {/* Recent Intents Section */}
      <div style={{
        marginTop: 20,
        padding: 15,
        background: '#f8f9fa',
        borderRadius: 8,
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
          <span>Recent Intents</span>
          {recentActions.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ 
                fontSize: 9, 
                color: '#999',
                fontWeight: 'normal'
              }}>
                Last 5
              </span>
              {onClearRecentIntents && (
                <button
                  onClick={() => {
                    setSelectedRecentIntent(null);
                    onClearRecentIntents();
                  }}
                  style={{
                    padding: '2px 6px',
                    fontSize: 9,
                    background: '#ff5252',
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ff1744'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ff5252'}
                  title="Clear all recent intents"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
        
        {recentActions.length === 0 ? (
          <div style={{ 
            color: '#999', 
            fontStyle: 'italic',
            padding: '8px 0'
          }}>
            No recent intents. Select an intent to see how it resolves.
          </div>
        ) : (
          <div style={{ 
            maxHeight: 200,
            overflowY: 'auto'
          }}>
            {recentActions.slice(0, DISPLAY_LIMITS.RECENT_INTENTS_DISPLAY).map((action, index) => {
              const timeAgo = Math.floor((Date.now() - action.timestamp.getTime()) / 1000);
              const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : 
                             timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m ago` :
                             `${Math.floor(timeAgo / 3600)}h ago`;
              const isSelected = selectedRecentIntent === action.id;
              
              // Check if the action's toggle states match current graph state
              const isCompatible = !currentToggles || 
                (action.toggleStates.showRationalized === currentToggles.showRationalized &&
                 action.toggleStates.showWorkflows === currentToggles.showWorkflows);
              
              return (
                <div 
                  key={action.id} 
                  onClick={() => {
                    // Only allow clicking if compatible with current state
                    if (!isCompatible) return;
                    
                    if (action.id === selectedRecentIntent) {
                      // User is deselecting
                      setSelectedRecentIntent(null);
                      setUserDeselected(true);
                    } else {
                      // User is selecting a different intent
                      setSelectedRecentIntent(action.id);
                      setUserDeselected(false);
                    }
                  }}
                  title={!isCompatible ? 
                    `Cannot select: Graph state has changed. This intent was resolved with Rationalization ${action.toggleStates.showRationalized ? 'ON' : 'OFF'} and Workflows ${action.toggleStates.showWorkflows ? 'ON' : 'OFF'}` :
                    (isSelected ? 'Click to deselect and clear visualization' : 'Click to view this resolution')
                  }
                  style={{
                    marginBottom: 8,
                    padding: '8px 10px',
                    background: !isCompatible ? '#f3f4f6' : (isSelected 
                      ? 'linear-gradient(to right, #f0f7ff, white)'
                      : (action.success ? '#fafbfc' : '#fef2f2')),
                    borderRadius: 4,
                    border: isSelected ? '2px solid #667eea' : `1px solid ${!isCompatible ? '#d1d5db' : (action.success ? '#e5e7eb' : '#fecaca')}`,
                    borderLeft: `3px solid ${!isCompatible ? '#9ca3af' : (action.success ? '#10b981' : '#ef4444')}`,
                    fontSize: 10,
                    cursor: isCompatible ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                    opacity: !isCompatible ? 0.5 : (action.success ? 1 : 0.9),
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && isCompatible) {
                      e.currentTarget.style.background = action.success ? '#f0f9ff' : '#fef2f2';
                      e.currentTarget.style.borderColor = action.success ? '#cbd5e1' : '#fca5a5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && isCompatible) {
                      e.currentTarget.style.background = action.success ? '#fafbfc' : '#fef2f2';
                      e.currentTarget.style.borderColor = action.success ? '#e5e7eb' : '#fecaca';
                    }
                  }}
                >
                  {/* Incompatible state indicator */}
                  {!isCompatible && (
                    <div style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      fontSize: 9,
                      padding: '2px 6px',
                      background: '#6b7280',
                      color: 'white',
                      borderRadius: 3,
                      fontWeight: 'bold'
                    }}>
                      🔒 LOCKED
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isSelected && (
                        <span style={{ 
                          color: '#667eea',
                          fontWeight: 'bold',
                          fontSize: 11
                        }}>▶</span>
                      )}
                      <span style={{ 
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: !isCompatible ? '#9ca3af' : (action.success ? '#10b981' : '#ef4444')
                      }}>
                        {action.success ? '✓' : '✗'}
                      </span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: !isCompatible ? '#6b7280' : (isSelected ? '#667eea' : (action.success ? '#333' : '#991b1b'))
                      }}>
                        {action.persona}
                      </span>
                    </div>
                    <span style={{ color: !isCompatible ? '#9ca3af' : '#999' }}>{timeStr}</span>
                  </div>
                  <div style={{ 
                    color: !isCompatible ? '#9ca3af' : (isSelected ? '#333' : (action.success ? '#555' : '#7f1d1d')), 
                    marginBottom: 4,
                    fontWeight: isSelected ? 500 : 'normal',
                    fontStyle: action.success ? 'normal' : 'italic'
                  }}>
                    "{action.intent}"
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 8,
                    fontSize: 9,
                    color: !isCompatible ? '#9ca3af' : (isSelected ? '#667eea' : '#666')
                  }}>
                    <span>→ {action.product}</span>
                    <span>• {action.outcome}</span>
                    {action.toggleStates && (
                      <span style={{ 
                        marginLeft: 'auto',
                        opacity: 0.7,
                        fontStyle: 'italic'
                      }}>
                        {action.toggleStates.showRationalized ? 'R' : ''}
                        {action.toggleStates.showWorkflows ? 'W' : ''}
                      </span>
                    )}
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

export default ResolutionComparison;
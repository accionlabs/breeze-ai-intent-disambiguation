import React, { useState, useMemo } from 'react';
import { USER_INTENTS, UserIntent } from '../config/userIntents';
import { PRODUCTS } from '../data/config';
import { LAYOUT_CONFIG } from '../config/layout';
import IntentSidebar from '../components/IntentSidebar';
import ProductBox from '../components/ProductBox';
import CapabilityBubble from '../components/CapabilityBubble';
import ConnectionLine from '../components/ConnectionLine';

const IntentMappingSection: React.FC = () => {
  const [selectedIntentId, setSelectedIntentId] = useState<string | undefined>();
  const products = Object.values(PRODUCTS);
  
  const selectedIntent = useMemo(() => {
    return USER_INTENTS.find(intent => intent.id === selectedIntentId);
  }, [selectedIntentId]);

  const handleIntentSelect = (intentId: string) => {
    // Toggle off if same intent
    if (selectedIntentId === intentId) {
      setSelectedIntentId(undefined);
    } else {
      setSelectedIntentId(intentId);
    }
  };

  // Calculate capability positions below products
  const getCapabilityPosition = (productIndex: number, hasMultiple: boolean = false) => {
    const product = products[productIndex];
    return {
      x: product.position.x,
      y: product.position.y + 100 // Fixed height below products
    };
  };

  // Check if multiple products have same/similar capability
  const findOverlappingCapabilities = (intent: UserIntent) => {
    const capabilities: Record<string, string[]> = {};
    
    Object.entries(intent.productMappings).forEach(([productId, capability]) => {
      if (capability) {
        // Simple overlap detection based on keywords
        const keywords = ['monitoring', 'sentiment', 'analysis', 'tracking', 'alert', 'report'];
        const matchedKeyword = keywords.find(kw => 
          capability.toLowerCase().includes(kw)
        );
        
        if (matchedKeyword) {
          if (!capabilities[matchedKeyword]) {
            capabilities[matchedKeyword] = [];
          }
          capabilities[matchedKeyword].push(productId);
        }
      }
    });
    
    return Object.entries(capabilities)
      .filter(([_, products]) => products.length > 1)
      .map(([keyword, products]) => ({ keyword, products }));
  };

  const overlaps = selectedIntent ? findOverlappingCapabilities(selectedIntent) : [];

  // Render workflow animation if exists - connects capabilities, not products
  const renderWorkflow = () => {
    if (!selectedIntent?.workflow) return null;
    
    return (
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: LAYOUT_CONFIG.zIndex.connections + 1,
        }}
      >
        {selectedIntent.workflow.map((step, index) => {
          if (index === 0) return null;
          
          const prevStep = selectedIntent.workflow![index - 1];
          const prevProduct = products.find(p => p.id === prevStep.product);
          const currentProduct = products.find(p => p.id === step.product);
          
          if (!prevProduct || !currentProduct) return null;
          
          // Connect the capabilities (below products) instead of products
          const prevProductIndex = products.findIndex(p => p.id === prevStep.product);
          const currentProductIndex = products.findIndex(p => p.id === step.product);
          const prevCapabilityPos = getCapabilityPosition(prevProductIndex);
          const currentCapabilityPos = getCapabilityPosition(currentProductIndex);
          
          const startY = prevCapabilityPos.y;
          const endY = currentCapabilityPos.y;
          
          return (
            <g key={index}>
              <path
                d={`M ${prevCapabilityPos.x} ${startY} 
                    Q ${(prevCapabilityPos.x + currentCapabilityPos.x) / 2} ${(startY + endY) / 2 + 30},
                      ${currentCapabilityPos.x} ${endY}`}
                stroke="#9333ea"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                opacity="0.6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="10"
                  to="0"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </path>
              <circle
                cx={currentCapabilityPos.x}
                cy={endY}
                r="4"
                fill="#9333ea"
              />
              <text
                x={currentCapabilityPos.x + 20}
                y={endY}
                textAnchor="middle"
                fill="#9333ea"
                fontSize="10"
                fontWeight="bold"
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: 20, 
      alignItems: 'stretch',
      height: 'calc(100vh - 140px)', // Fixed height based on viewport (reduced header)
      overflow: 'hidden',
    }}>
      <IntentSidebar
        intents={USER_INTENTS}
        selectedIntent={selectedIntentId}
        onIntentSelect={handleIntentSelect}
      />
      
      <div style={{ 
        flex: 1,
        background: 'white',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, color: '#333', margin: 0 }}>
            Cross Product Intent Resolution
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>
            {selectedIntent 
              ? `Showing how "${selectedIntent.text}" resolves across multiple products`
              : 'Select an intent from the sidebar to see how it orchestrates across products'}
          </p>
        </div>
        
        <div style={{
          flex: 1,
          background: 'linear-gradient(to bottom, #f5f5f5, white)',
          borderRadius: LAYOUT_CONFIG.container.borderRadius,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: LAYOUT_CONFIG.container.minWidth,
            height: LAYOUT_CONFIG.container.height,
          }}>
            {/* Products at bottom - always visible */}
            {products.map(product => (
              <ProductBox key={product.id} product={product} />
            ))}
            
            {/* Capabilities and connections - only when intent selected */}
            {selectedIntent && (
              <>
                {/* Render capabilities for each product */}
                {products.map((product, index) => {
                  // Check if this product is part of the workflow
                  const workflowStep = selectedIntent.workflow?.find(w => w.product === product.id);
                  const capability = selectedIntent.productMappings[product.id as keyof typeof selectedIntent.productMappings];
                  
                  // For workflow intents, show capabilities for ALL workflow products
                  // For non-workflow intents, only show products with capabilities
                  if (!capability && !workflowStep) return null;
                  
                  const position = getCapabilityPosition(index);
                  const hasOverlap = overlaps.some(o => 
                    o.products.includes(product.id)
                  );
                  
                  // Always prefer the capability mapping if it exists, otherwise use workflow action
                  const displayText = capability || (workflowStep ? workflowStep.action : '');
                  const isWorkflowStep = !!workflowStep;
                  
                  return (
                    <React.Fragment key={product.id}>
                      <CapabilityBubble
                        text={displayText || ''}
                        position={position}
                        color={isWorkflowStep ? '#9333ea' : product.color}
                        intensity="primary"
                        isOverlapping={hasOverlap && overlaps[0]?.products[0] === product.id}
                        width={150}
                      />
                      <ConnectionLine
                        from={{ x: product.position.x, y: product.position.y + 25 }}
                        to={{ x: position.x, y: position.y - 20 }}
                        color={isWorkflowStep ? '#9333ea' : product.color}
                        opacity={0.3}
                      />
                    </React.Fragment>
                  );
                })}
                
                {/* Render workflow if exists */}
                {renderWorkflow()}
                
                {/* Insights panel */}
                {selectedIntent.insights && selectedIntent.insights.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #667eea',
                    borderRadius: 8,
                    padding: 12,
                    maxWidth: 250,
                    zIndex: 20,
                  }}>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#667eea',
                      marginBottom: 8,
                    }}>
                      Key Insights
                    </div>
                    {selectedIntent.insights.map((insight, i) => (
                      <div key={i} style={{
                        fontSize: 11,
                        color: '#666',
                        marginBottom: 4,
                        paddingLeft: 12,
                        position: 'relative',
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: 5,
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#667eea',
                        }}></span>
                        {insight}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Workflow legend */}
                {selectedIntent.workflow && (
                  <div style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'rgba(147, 51, 234, 0.1)',
                    border: '1px solid #9333ea',
                    borderRadius: 20,
                    padding: '6px 16px',
                    fontSize: 11,
                    color: '#9333ea',
                    fontWeight: 'bold',
                  }}>
                    Workflow: {selectedIntent.workflow.map(w => w.product.toUpperCase()).join(' → ')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentMappingSection;
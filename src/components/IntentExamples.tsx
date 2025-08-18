import React, { useMemo } from 'react';
import { UserIntent, LEVEL_COLORS } from '../config';
import IntentInput from './IntentInput';
import { GeneratedIntent } from '../utils/intentMatcher';
import { reorderIntents, getIntentLevelLabel } from '../utils/intentReorderer';
import { useDomainConfig } from '../hooks/useDomainConfig';

interface IntentExamplesProps {
  intents: UserIntent[];
  selectedIntent?: string;
  onIntentSelect: (intentId: string) => void;
  generatedIntent?: GeneratedIntent | null;
  onGeneratedIntentSelect: (intent: GeneratedIntent) => void;
  showRationalized?: boolean;
}

const IntentExamples: React.FC<IntentExamplesProps> = ({ 
  intents, 
  selectedIntent, 
  onIntentSelect,
  generatedIntent,
  onGeneratedIntentSelect,
  showRationalized = true
}) => {
  const domainConfig = useDomainConfig();
  
  // Reorder intents based on duplication status and level
  const reorderedIntents = useMemo(() => {
    if (!domainConfig) return { allIntents: intents, clearIntents: [], duplicateIntents: [], workflowIntents: [] };
    
    // Use the raw nodes to get product information
    const nodes = domainConfig.FUNCTIONAL_NODES || {};
    
    const result = reorderIntents(
      intents,
      nodes,
      domainConfig.RATIONALIZED_NODE_ALTERNATIVES,
      domainConfig.SHARED_NODES,
      domainConfig.DUPLICATE_NODES
    );
    
    return result;
  }, [intents, domainConfig]);
  
  const handleIntentGenerated = (intent: GeneratedIntent) => {
    onGeneratedIntentSelect(intent);
  };
  
  // Clear current generated intent when a new one is being generated
  const handleNewIntentInput = () => {
    // No longer needed since we don't track current generated intent
  };
  const getLevelIcon = (level: string) => {
    const icons = {
      outcome: '🎯',
      scenario: '📋',
      step: '👣',
      action: '⚡',
      workflow: '🔄'
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
        User Intents
      </h3>
      
      {/* Intent Input Component */}
      <IntentInput 
        onIntentGenerated={handleIntentGenerated}
        onNewInput={handleNewIntentInput}
        showRationalized={showRationalized}
        context={domainConfig ? {
          nodes: domainConfig.FUNCTIONAL_NODES,
          synonyms: domainConfig.DOMAIN_SYNONYMS,
          wordForms: domainConfig.WORD_FORMS,
          productCodes: domainConfig.PRODUCT_CODES
        } : undefined}
        placeholder={domainConfig?.INTENT_INPUT_PLACEHOLDER}
      />
      
      <div style={{ 
        fontSize: 11, 
        color: '#666', 
        marginBottom: 15,
        paddingTop: 10,
        borderTop: '1px solid #e0e0e0',
        lineHeight: 1.4
      }}>
        Or select a predefined intent below
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Group 1: Clear Non-duplicate Intents */}
        {reorderedIntents.clearIntents.length > 0 && (
          <>
            <div style={{ 
              fontSize: 10, 
              color: '#666', 
              marginBottom: 8,
              marginTop: 10,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              Clear (Non-duplicate)
            </div>
            {reorderedIntents.clearIntents.map(intent => renderIntentButton(intent))}
          </>
        )}
        
        {/* Group 2: Duplicate/Ambiguous Intents */}
        {reorderedIntents.duplicateIntents.length > 0 && (
          <>
            <div style={{ 
              fontSize: 10, 
              color: '#666', 
              marginBottom: 8,
              marginTop: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              borderTop: '1px solid #e0e0e0',
              paddingTop: 12
            }}>
              Duplicate/Ambiguous
            </div>
            {reorderedIntents.duplicateIntents.map(intent => renderIntentButton(intent))}
          </>
        )}
        
        {/* Group 3: Workflow Intents */}
        {reorderedIntents.workflowIntents.length > 0 && (
          <>
            <div style={{ 
              fontSize: 10, 
              color: '#666', 
              marginBottom: 8,
              marginTop: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              borderTop: '1px solid #e0e0e0',
              paddingTop: 12
            }}>
              Cross-Product Workflows
            </div>
            {reorderedIntents.workflowIntents.map(intent => renderIntentButton(intent))}
          </>
        )}
      </div>
    </div>
  );
  
  function renderIntentButton(intent: any) {
    const isSelected = selectedIntent === intent.id;
    const levelColor = LEVEL_COLORS[intent.entryLevel as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.workflow;
    
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
          marginTop: 4,
          flexWrap: 'wrap'
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
            {getIntentLevelLabel(intent.entryLevel)}
          </span>
          
          {/* Show products for all intents */}
          {intent.products && intent.products.length > 0 && (
            <>
              {intent.products.map((product: string, idx: number) => (
                <span key={idx} style={{
                  fontSize: 9,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: '1px solid #90caf9'
                }}>
                  {product}
                </span>
              ))}
            </>
          )}
          
          {intent.ambiguous && (
            <span style={{
              fontSize: 9,
              padding: '2px 6px',
              borderRadius: 4,
              background: '#ff9800',
              color: 'white',
              fontWeight: 'bold'
            }}>
              AMBIGUOUS
            </span>
          )}
        </div>
      </button>
    );
  }
};

export default IntentExamples;
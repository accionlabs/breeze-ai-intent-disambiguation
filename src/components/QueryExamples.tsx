import React, { useMemo } from 'react';
import { UserQuery, LEVEL_COLORS } from '../config';
import QueryInput from './QueryInput';
import { GeneratedQuery } from '../utils/queryMatcher';
import { reorderQueries, getQueryLevelLabel } from '../utils/queryReorderer';
import { useDomainConfig } from '../hooks/useDomainConfig';

interface QueryExamplesProps {
  queries: UserQuery[];
  selectedQuery?: string;
  onQuerySelect: (queryId: string) => void;
  generatedQuery?: GeneratedQuery | null;
  onGeneratedQuerySelect: (query: GeneratedQuery) => void;
  showRationalized?: boolean;
}

const QueryExamples: React.FC<QueryExamplesProps> = ({ 
  queries, 
  selectedQuery, 
  onQuerySelect,
  generatedQuery,
  onGeneratedQuerySelect,
  showRationalized = true
}) => {
  const domainConfig = useDomainConfig();
  
  // Reorder queries based on duplication status and level
  const reorderedQueries = useMemo(() => {
    if (!domainConfig) return { allQueries: queries, clearQueries: [], duplicateQueries: [], workflowQueries: [] };
    
    // Use the raw nodes to get product information
    const nodes = domainConfig.FUNCTIONAL_NODES || {};
    
    const result = reorderQueries(
      queries,
      nodes,
      domainConfig.RATIONALIZED_NODE_ALTERNATIVES,
      domainConfig.SHARED_NODES,
      domainConfig.DUPLICATE_NODES
    );
    
    return result;
  }, [queries, domainConfig]);
  
  const handleQueryGenerated = (query: GeneratedQuery) => {
    onGeneratedQuerySelect(query);
  };
  
  // Clear current generated query when a new one is being generated
  const handleNewQueryInput = () => {
    // No longer needed since we don't track current generated query
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
        User Queries
      </h3>
      
      {/* Query Input Component */}
      <QueryInput 
        onQueryGenerated={handleQueryGenerated}
        onNewInput={handleNewQueryInput}
        showRationalized={showRationalized}
        context={domainConfig ? {
          nodes: domainConfig.FUNCTIONAL_NODES,
          synonyms: domainConfig.DOMAIN_SYNONYMS,
          wordForms: domainConfig.WORD_FORMS,
          productCodes: domainConfig.PRODUCT_CODES
        } : undefined}
        placeholder={domainConfig?.QUERY_INPUT_PLACEHOLDER}
      />
      
      <div style={{ 
        fontSize: 11, 
        color: '#666', 
        marginBottom: 15,
        paddingTop: 10,
        borderTop: '1px solid #e0e0e0',
        lineHeight: 1.4
      }}>
        Or select a predefined query below
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Group 1: Clear Non-duplicate Queries */}
        {reorderedQueries.clearQueries.length > 0 && (
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
            {reorderedQueries.clearQueries.map(query => renderQueryButton(query))}
          </>
        )}
        
        {/* Group 2: Duplicate/Ambiguous Queries */}
        {reorderedQueries.duplicateQueries.length > 0 && (
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
            {reorderedQueries.duplicateQueries.map(query => renderQueryButton(query))}
          </>
        )}
        
        {/* Group 3: Workflow Queries */}
        {reorderedQueries.workflowQueries.length > 0 && (
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
            {reorderedQueries.workflowQueries.map(query => renderQueryButton(query))}
          </>
        )}
      </div>
    </div>
  );
  
  function renderQueryButton(query: any) {
    const isSelected = selectedQuery === query.id;
    const levelColor = LEVEL_COLORS[query.entryLevel as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.workflow;
    
    return (
      <button
        key={query.id}
        onClick={() => onQuerySelect(query.id)}
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
            {getLevelIcon(query.entryLevel)}
          </span>
          <span style={{ 
            fontSize: 13,
            fontWeight: isSelected ? 'bold' : 'normal'
          }}>
            "{query.text}"
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
            {getQueryLevelLabel(query.entryLevel)}
          </span>
          
          {/* Show products for all querys */}
          {query.products && query.products.length > 0 && (
            <>
              {query.products.map((product: string, idx: number) => (
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
          
          {query.ambiguous && (
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

export default QueryExamples;
import React, { useMemo } from 'react';
import { StageNumber, Product, FunctionNode as FunctionNodeType } from '../types';
import { PRODUCTS } from '../data/config';
import { LAYOUT_CONFIG, getAdjustedFunctionBaseY, getFunctionYOffset } from '../config/layout';
import { COMPOSITE_OUTCOMES, NEXUS_BRANDING, COMPOSITE_OUTCOME_STYLE, INTENTS_CONTENT } from '../config/content';
import { getMappedOutcomes } from '../config/intentMappings';
import ProductBox from './ProductBox';
import FunctionNode from './FunctionNode';
import ConnectionLine from './ConnectionLine';

interface StageVisualizationProps {
  stage: StageNumber;
  highlightedIntent?: string;
}

const StageVisualization: React.FC<StageVisualizationProps> = ({ stage, highlightedIntent }) => {
  const products = Object.values(PRODUCTS);
  
  // Get mapped outcomes for the highlighted intent
  const mappedOutcomes = highlightedIntent ? getMappedOutcomes(stage, highlightedIntent) : [];
  const intentColor = highlightedIntent ? INTENTS_CONTENT[highlightedIntent]?.color : undefined;
  
  // Create a vertical grid layout aligned with products
  const functionGrid = useMemo(() => {
    const grid: Record<string, { func: string; productId: string; position: { x: number; y: number }; row: number; col: number }> = {};
    
    // Group functions by name to identify commonalities
    const functionsByName: Record<string, string[]> = {};
    products.forEach(product => {
      // Reverse the order of functions for each product
      const reversedFunctions = [...product.functions].reverse();
      reversedFunctions.forEach(func => {
        if (!functionsByName[func]) {
          functionsByName[func] = [];
        }
        functionsByName[func].push(product.id);
      });
    });
    
    // Separate overlapping and unique functions
    const overlappingFuncs: string[] = [];
    
    Object.entries(functionsByName).forEach(([funcName, productIds]) => {
      if (productIds.length > 1) {
        overlappingFuncs.push(funcName);
      }
    });
    
    // Build a 2D grid layout
    const gridLayout: (string | null)[][] = [];
    let currentRow = 0;
    
    // First, place overlapping functions in their own rows
    overlappingFuncs.forEach(funcName => {
      if (!gridLayout[currentRow]) {
        gridLayout[currentRow] = Array(products.length).fill(null);
      }
      // Place this function in all columns where it exists
      const productIds = functionsByName[funcName];
      productIds.forEach(prodId => {
        const colIndex = products.findIndex(p => p.id === prodId);
        if (colIndex !== -1) {
          gridLayout[currentRow][colIndex] = funcName;
        }
      });
      currentRow++;
    });
    
    // Now place unique functions, allowing them to fill empty cells in existing rows
    products.forEach((product, colIndex) => {
      // Reverse the order of functions for each product
      const reversedFunctions = [...product.functions].reverse();
      reversedFunctions.forEach(func => {
        // Skip if already placed (overlapping)
        if (overlappingFuncs.includes(func)) return;
        
        // Try to find an available cell in any existing row first (including rows with overlapping functions)
        let placed = false;
        for (let row = 0; row < gridLayout.length && !placed; row++) {
          if (gridLayout[row][colIndex] === null) {
            gridLayout[row][colIndex] = func;
            placed = true;
          }
        }
        
        // If no available cell in existing rows, create a new row
        if (!placed) {
          const newRow = gridLayout.length;
          gridLayout[newRow] = Array(products.length).fill(null);
          gridLayout[newRow][colIndex] = func;
        }
      });
    });
    
    // Convert grid layout to position map
    const spacingY = LAYOUT_CONFIG.functions.spacingY;
    const baseY = getAdjustedFunctionBaseY();
    
    gridLayout.forEach((row, rowIndex) => {
      row.forEach((funcName, colIndex) => {
        if (funcName) {
          const product = products[colIndex];
          const key = `${product.id}-${funcName}`;
          grid[key] = {
            func: funcName,
            productId: product.id,
            position: {
              x: product.position.x,
              y: baseY + (rowIndex * spacingY)
            },
            row: rowIndex,
            col: colIndex
          };
        }
      });
    });
    
    return grid;
  }, [products]);
  
  // Identify overlapping functions
  const overlappingFunctions = useMemo(() => {
    const functionCounts: Record<string, string[]> = {};
    
    products.forEach(product => {
      product.functions.forEach(func => {
        if (!functionCounts[func]) {
          functionCounts[func] = [];
        }
        functionCounts[func].push(product.id);
      });
    });
    
    return Object.entries(functionCounts)
      .filter(([_, productIds]) => productIds.length > 1)
      .map(([func, productIds]) => ({ func, productIds }));
  }, [products]);

  const isOverlapping = (funcName: string) => {
    return overlappingFunctions.some(o => o.func === funcName);
  };

  const renderStage1 = () => (
    <>
      {/* Products only - functions hidden */}
      {products.map(product => (
        <ProductBox key={product.id} product={product} />
      ))}
    </>
  );

  const renderStage2 = () => (
    <>
      {/* Products at bottom */}
      {products.map(product => (
        <ProductBox key={product.id} product={product} />
      ))}
      
      {/* Functions in fixed grid positions */}
      {Object.entries(functionGrid).map(([key, item]) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        
        const funcIsOverlapping = isOverlapping(item.func);
        
        return (
          <React.Fragment key={key}>
            <FunctionNode
              node={{
                id: key,
                name: item.func,
                productIds: [item.productId]
              }}
              color={product.color}
              position={item.position}
              isHighlighted={mappedOutcomes.includes(item.func)}
              highlightColor={intentColor}
              isOverlapping={funcIsOverlapping}
            />
            <ConnectionLine
              from={{ x: product.position.x, y: product.position.y }}
              to={{ x: item.position.x, y: item.position.y }}
              color={product.color}
              opacity={0.3}
            />
          </React.Fragment>
        );
      })}
    </>
  );

  const renderStage3 = () => {
    const renderedFunctions = new Set<string>();
    
    return (
      <>
        {/* Products at bottom */}
        {products.map(product => (
          <ProductBox key={product.id} product={product} />
        ))}
        
        {/* Functions vertically aligned, rationalized ones shown as single node */}
        {Object.entries(functionGrid).map(([key, item]) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          
          const funcIsOverlapping = isOverlapping(item.func);
          
          // For overlapping functions, render only one unified node in the center
          if (funcIsOverlapping) {
            if (renderedFunctions.has(item.func)) {
              // Already rendered, just draw the connection line
              const overlap = overlappingFunctions.find(o => o.func === item.func);
              if (!overlap) return null;
              
              // Calculate center position for rationalized function
              const involvedProducts = products.filter(p => overlap.productIds.includes(p.id));
              const centerX = involvedProducts.reduce((sum, p) => sum + p.position.x, 0) / involvedProducts.length;
              
              return (
                <ConnectionLine
                  key={`${key}-line`}
                  from={{ x: product.position.x, y: product.position.y }}
                  to={{ x: centerX, y: item.position.y }}
                  color={product.color}
                  dashed={true}
                  opacity={0.3}
                />
              );
            }
            
            renderedFunctions.add(item.func);
            
            // Calculate center position for rationalized function
            const overlap = overlappingFunctions.find(o => o.func === item.func);
            if (!overlap) return null;
            
            const involvedProducts = products.filter(p => overlap.productIds.includes(p.id));
            const centerX = involvedProducts.reduce((sum, p) => sum + p.position.x, 0) / involvedProducts.length;
            
            return (
              <React.Fragment key={key}>
                <FunctionNode
                  node={{
                    id: key,
                    name: item.func,
                    productIds: overlap.productIds
                  }}
                  color="#4caf50"
                  position={{ x: centerX, y: item.position.y }}
                  isHighlighted={mappedOutcomes.includes(item.func)}
                  highlightColor={intentColor}
                  isUnified={true}
                />
                {overlap.productIds.map(prodId => {
                  const prod = products.find(p => p.id === prodId);
                  if (!prod) return null;
                  return (
                    <ConnectionLine
                      key={`${prodId}-${item.func}`}
                      from={{ x: prod.position.x, y: prod.position.y + 25 }}
                      to={{ x: centerX, y: item.position.y - 15 }}
                      color={prod.color}
                      dashed={true}
                      opacity={0.3}
                    />
                  );
                })}
              </React.Fragment>
            );
          }
          
          // Non-overlapping functions stay in their vertical position
          return (
            <React.Fragment key={key}>
              <FunctionNode
                node={{
                  id: key,
                  name: item.func,
                  productIds: [item.productId]
                }}
                color={product.color}
                position={item.position}
                isHighlighted={mappedOutcomes.includes(item.func)}
                highlightColor={intentColor}
              />
              <ConnectionLine
                from={{ x: product.position.x, y: product.position.y + 25 }}
                to={{ x: item.position.x, y: item.position.y - 15 }}
                color={product.color}
                opacity={0.3}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderStage4 = () => {
    // Get leftmost and rightmost product positions
    const leftEdge = Math.min(...products.map(p => p.position.x)) - LAYOUT_CONFIG.unifiedProduct.marginX;
    const rightEdge = Math.max(...products.map(p => p.position.x)) + LAYOUT_CONFIG.unifiedProduct.marginX;
    const nexusY = LAYOUT_CONFIG.unifiedProduct.y;
    const renderedFunctions = new Set<string>();
    // No offset needed for functions
    const yOffset = 0;
    
    return (
      <>
        {/* Original products shown with transparency */}
        {products.map(product => (
          <div key={product.id} style={{ opacity: 0.3 }}>
            <ProductBox product={product} />
          </div>
        ))}
        
        {/* Unified Nexus product box spanning full width */}
        <div style={{
          position: 'absolute',
          left: leftEdge,
          top: nexusY - 25,
          width: rightEdge - leftEdge,
          height: LAYOUT_CONFIG.unifiedProduct.height,
          background: NEXUS_BRANDING.color.gradient,
          border: `${LAYOUT_CONFIG.unifiedProduct.borderWidth}px solid ${NEXUS_BRANDING.color.primary}`,
          borderRadius: LAYOUT_CONFIG.unifiedProduct.borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          zIndex: 10,
        }}>
          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            {NEXUS_BRANDING.fullName}
          </span>
        </div>
        
        {/* All functions unified and connected to Nexus */}
        {Object.entries(functionGrid).map(([key, item]) => {
          const funcIsOverlapping = isOverlapping(item.func);
          
          // For overlapping functions, show single unified node
          if (funcIsOverlapping) {
            if (renderedFunctions.has(item.func)) {
              return null; // Already rendered
            }
            renderedFunctions.add(item.func);
            
            // Calculate center position for unified function
            const overlap = overlappingFunctions.find(o => o.func === item.func);
            if (!overlap) return null;
            
            const involvedProducts = products.filter(p => overlap.productIds.includes(p.id));
            const centerX = involvedProducts.reduce((sum, p) => sum + p.position.x, 0) / involvedProducts.length;
            
            return (
              <React.Fragment key={key}>
                <FunctionNode
                  node={{
                    id: key,
                    name: item.func,
                    productIds: []
                  }}
                  color="#4caf50"
                  position={{ x: centerX, y: item.position.y }}
                  isHighlighted={mappedOutcomes.includes(item.func)}
                  highlightColor={intentColor}
                  isUnified={true}
                />
                <ConnectionLine
                  from={{ x: centerX, y: nexusY + 25 }}
                  to={{ x: centerX, y: item.position.y - 15 }}
                  color="#667eea"
                  opacity={0.4}
                />
              </React.Fragment>
            );
          }
          
          // Non-overlapping functions
          return (
            <React.Fragment key={key}>
              <FunctionNode
                node={{
                  id: key,
                  name: item.func,
                  productIds: []
                }}
                color="#667eea"
                position={{ x: item.position.x, y: item.position.y }}
                isHighlighted={mappedOutcomes.includes(item.func)}
                highlightColor={intentColor}
              />
              <ConnectionLine
                from={{ x: item.position.x, y: nexusY + 25 }}
                to={{ x: item.position.x, y: item.position.y - 15 }}
                color="#667eea"
                opacity={0.3}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderStage5 = () => {
    const nexusY = LAYOUT_CONFIG.unifiedProduct.y;
    const renderedFunctions = new Set<string>();
    // No offset needed for functions
    const yOffset = 0;
    
    return (
      <>
        {/* Original products shown with transparency */}
        {products.map(product => (
          <div key={product.id} style={{ opacity: 0.3 }}>
            <ProductBox product={product} />
          </div>
        ))}
        
        {/* Unified Nexus product box */}
        <div style={{
          position: 'absolute',
          left: Math.min(...products.map(p => p.position.x)) - LAYOUT_CONFIG.unifiedProduct.marginX,
          top: nexusY - 25,
          width: Math.max(...products.map(p => p.position.x)) + LAYOUT_CONFIG.unifiedProduct.marginX - (Math.min(...products.map(p => p.position.x)) - LAYOUT_CONFIG.unifiedProduct.marginX),
          height: 50,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '2px solid #667eea',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          zIndex: 10,
        }}>
          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            {NEXUS_BRANDING.fullName}
          </span>
        </div>
        
        {/* Regular functions */}
        {Object.entries(functionGrid).map(([key, item]) => {
          const funcIsOverlapping = isOverlapping(item.func);
          
          if (funcIsOverlapping) {
            if (renderedFunctions.has(item.func)) return null;
            renderedFunctions.add(item.func);
            
            const overlap = overlappingFunctions.find(o => o.func === item.func);
            if (!overlap) return null;
            
            const involvedProducts = products.filter(p => overlap.productIds.includes(p.id));
            const centerX = involvedProducts.reduce((sum, p) => sum + p.position.x, 0) / involvedProducts.length;
            
            return (
              <React.Fragment key={key}>
                <FunctionNode
                  node={{
                    id: key,
                    name: item.func,
                    productIds: []
                  }}
                  color="#4caf50"
                  position={{ x: centerX, y: item.position.y }}
                  isHighlighted={mappedOutcomes.includes(item.func)}
                  highlightColor={intentColor}
                  isUnified={true}
                />
                <ConnectionLine
                  from={{ x: centerX, y: nexusY + 25 }}
                  to={{ x: centerX, y: item.position.y - 15 }}
                  color="#667eea"
                  opacity={0.4}
                />
              </React.Fragment>
            );
          }
          
          return (
            <React.Fragment key={key}>
              <FunctionNode
                node={{
                  id: key,
                  name: item.func,
                  productIds: []
                }}
                color="#667eea"
                position={{ x: item.position.x, y: item.position.y }}
                isHighlighted={mappedOutcomes.includes(item.func)}
                highlightColor={intentColor}
              />
              <ConnectionLine
                from={{ x: item.position.x, y: nexusY + 25 }}
                to={{ x: item.position.x, y: item.position.y - 15 }}
                color="#667eea"
                opacity={0.3}
              />
            </React.Fragment>
          );
        })}
        
        {/* Add composite outcomes below regular functions */}
        {COMPOSITE_OUTCOMES.map((composite, index) => {
          // Place composite outcomes at fixed position below functions
          const xPos = LAYOUT_CONFIG.compositeOutcomes.startX + (index * LAYOUT_CONFIG.compositeOutcomes.spacing);
          const yPos = LAYOUT_CONFIG.compositeOutcomes.baseY;
          
          return (
            <React.Fragment key={composite.name}>
              <div style={{
                position: 'absolute',
                left: xPos - 60,
                top: yPos - 15,
                padding: LAYOUT_CONFIG.compositeOutcomes.padding,
                background: mappedOutcomes.includes(composite.name) && intentColor 
                  ? intentColor 
                  : COMPOSITE_OUTCOME_STYLE.color.gradient,
                color: 'white',
                borderRadius: LAYOUT_CONFIG.compositeOutcomes.borderRadius,
                fontSize: LAYOUT_CONFIG.compositeOutcomes.fontSize,
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                border: '2px solid rgba(255,255,255,0.3)',
                zIndex: 15,
              }}>
                {composite.name}
              </div>
              
              {/* Lines from composite to component functions */}
              {composite.components.map(compFunc => {
                // Find the position of this component function
                const funcEntry = Object.entries(functionGrid).find(([_, item]) => item.func === compFunc);
                if (!funcEntry) return null;
                
                const funcItem = funcEntry[1];
                let funcX = funcItem.position.x;
                
                // For overlapping functions, use center position
                if (isOverlapping(compFunc)) {
                  const overlap = overlappingFunctions.find(o => o.func === compFunc);
                  if (overlap) {
                    const involvedProducts = products.filter(p => overlap.productIds.includes(p.id));
                    funcX = involvedProducts.reduce((sum, p) => sum + p.position.x, 0) / involvedProducts.length;
                  }
                }
                
                return (
                  <ConnectionLine
                    key={`${composite.name}-${compFunc}`}
                    from={{ x: funcX, y: funcItem.position.y + 15 }}
                    to={{ x: xPos, y: yPos - 15 }}
                    color="#9333ea"
                    opacity={0.3}
                    dashed={true}
                  />
                );
              })}
              
              {/* Line from Nexus to composite */}
              <ConnectionLine
                from={{ x: xPos, y: nexusY + 25 }}
                to={{ x: xPos, y: yPos - 15 }}
                color="#9333ea"
                opacity={0.4}
                dashed={false}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: LAYOUT_CONFIG.container.minWidth,
    height: LAYOUT_CONFIG.container.height,
    display: 'flex',
    justifyContent: 'center',
  };
  
  const innerContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: LAYOUT_CONFIG.container.minWidth,
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        {stage === 1 && renderStage1()}
        {stage === 2 && renderStage2()}
        {stage === 3 && renderStage3()}
        {stage === 4 && renderStage4()}
        {stage === 5 && renderStage5()}
      </div>
    </div>
  );
};

export default StageVisualization;
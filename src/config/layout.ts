// Layout configuration for the semantic evolution visualization

export const LAYOUT_CONFIG = {
  // Container dimensions
  container: {
    width: '100%',
    minWidth: 1100,    // Minimum width to accommodate all 5 products
    height: 500,
    borderRadius: 12,
  },

  // Product box layout
  products: {
    baseY: 400,          // Y position for product boxes
    width: 120,          // Width of each product box
    height: 50,          // Height of each product box
    spacing: 200,        // Horizontal spacing between products
    startX: 150,         // X position of first product
    borderRadius: 8,
    borderWidth: 2,
  },

  // Function/Outcome grid layout
  functions: {
    baseY: 340,          // Base Y position for functions (moved up to create more space)
    spacingY: 35,        // Vertical spacing between function rows
    minDistanceFromProducts: 70, // Increased distance between bottom function and top of products
  },

  // Unified product (NEXUS) layout
  unifiedProduct: {
    y: 320,              // Y position for NEXUS box
    height: 50,          // Height of NEXUS box
    marginX: 60,         // Extra margin on left/right sides
    borderRadius: 8,
    borderWidth: 2,
  },

  // Stage 4 & 5 specific adjustments
  stage4: {
    // functionYOffset calculated dynamically below
  },

  // Composite outcomes layout (Stage 5)
  compositeOutcomes: {
    spacingFromGrid: 60, // Vertical spacing above the highest function
    spacing: 300,        // Horizontal spacing between composite outcomes
    startX: 250,         // Starting X position
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 12,
  },

  // Connection lines
  connections: {
    strokeWidth: 2,
    opacity: {
      normal: 0.3,
      emphasized: 0.4,
      faded: 0.2,
    },
  },

  // Function nodes
  functionNodes: {
    width: 100,
    height: 30,
    borderRadius: 15,
    fontSize: 11,
    padding: '6px 12px',
  },

  // Animation timings
  animations: {
    transitionDuration: '0.3s',
    hoverScale: 1.05,
  },

  // Z-index layers
  zIndex: {
    connections: 1,      // Lowest layer for connections
    products: 5,
    functions: 10,
    unifiedProduct: 10,
    compositeOutcomes: 15,
  },
};

// Helper function to calculate positions
export const calculateProductPositions = (productCount: number) => {
  const positions: { x: number; y: number }[] = [];
  const { spacing } = LAYOUT_CONFIG.products;
  const { baseY } = LAYOUT_CONFIG.products;
  
  // Center products within the container
  const totalWidth = (productCount - 1) * spacing;
  const centerX = LAYOUT_CONFIG.container.minWidth / 2;
  const startX = centerX - (totalWidth / 2);
  
  for (let i = 0; i < productCount; i++) {
    positions.push({
      x: startX + (i * spacing),
      y: baseY,
    });
  }
  
  return positions;
};

// Adjust function base Y to ensure minimum distance from products
export const getAdjustedFunctionBaseY = () => {
  const { baseY: productY, height: productHeight } = LAYOUT_CONFIG.products;
  const { minDistanceFromProducts } = LAYOUT_CONFIG.functions;
  
  // Ensure functions are at least minDistanceFromProducts above products
  return productY - productHeight/2 - minDistanceFromProducts;
};

// Calculate function Y offset for Stage 4 & 5
// This is the difference between top of products and top of NEXUS
export const getFunctionYOffset = () => {
  const productTopY = LAYOUT_CONFIG.products.baseY - LAYOUT_CONFIG.products.height/2;
  const nexusTopY = LAYOUT_CONFIG.unifiedProduct.y - LAYOUT_CONFIG.unifiedProduct.height/2;
  
  // The offset is how much we need to move functions up when NEXUS appears
  return productTopY - nexusTopY;
};
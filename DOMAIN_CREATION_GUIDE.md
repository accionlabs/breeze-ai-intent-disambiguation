# Domain Creation Guide

This guide provides step-by-step instructions for creating new demo domains for the Semantic Engineering Platform. Follow these guidelines to avoid common pitfalls and ensure consistency across domains.

## Table of Contents
1. [Domain Structure Overview](#domain-structure-overview)
2. [Step-by-Step Creation Process](#step-by-step-creation-process)
3. [Critical Design Patterns](#critical-design-patterns)
4. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
5. [Testing Checklist](#testing-checklist)

## Domain Structure Overview

Each domain requires the following files in `/src/config/domains/{domain-name}/`:

```
domains/
└── {domain-name}/
    ├── index.ts          # Main exports and metadata
    ├── domain.ts         # Domain configuration and constants
    ├── nodes.ts          # Functional hierarchy nodes
    ├── intents.ts        # User intent examples
    ├── contexts.ts       # User personas/contexts
    └── rationalization.ts # Overlap and rationalization config
```

## Step-by-Step Creation Process

### 1. Create Domain Folder Structure
Create a new folder under `/src/config/domains/` with your domain name (lowercase, no spaces).

### 2. Define domain.ts

```typescript
// Domain-specific configuration
export const DOMAIN_NAME = "Your Domain Name";
export const DOMAIN_DESCRIPTION = "Brief description";
export const COMPANY_NAME = "Company Name";

// CRITICAL: Define product codes and colors
export const PRODUCT_CODES = ['product1', 'product2', 'product3'] as const;
export type ProductCode = typeof PRODUCT_CODES[number];

// CRITICAL: Each product needs a unique color
export const PRODUCT_COLORS = {
  'product1': '#4F46E5',  // Use different colors!
  'product2': '#10B981',  
  'product3': '#F59E0B',
  'n/a': '#999'
};

export const PRODUCTS = {
  'product1': {
    name: 'Product Name',
    description: 'Product description',
    abbreviation: 'P1'
  },
  // ... more products
};

// Helper function - REQUIRED
export const getProductColor = (product: string): string => {
  const normalizedProduct = product.toLowerCase();
  if (normalizedProduct === 'n/a') {
    return PRODUCT_COLORS['n/a'];
  }
  return PRODUCT_COLORS[normalizedProduct as keyof typeof PRODUCT_COLORS] || PRODUCT_COLORS['n/a'];
};

// Additional domain configuration
export const DOMAIN_CAPABILITIES = [...];
export const INDUSTRY_VERTICALS = [...];
export const DOMAIN_SYNONYMS = {...};
export const WORD_FORMS = {...};
```

### 3. Create nodes.ts - Functional Hierarchy

**CRITICAL PATTERN: Products Must Have Disconnected Trees**

```typescript
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // 1. PRODUCTS - Top level
  'product-a': {
    id: 'product-a',
    label: 'Product A',
    level: 'product',
    products: ['a'],
    parents: [],
    children: ['outcome-1-a', 'outcome-2-a'] // Product-specific outcomes
  },
  
  // 2. OUTCOMES - Each product has its own outcomes (NO SHARING)
  'outcome-1-a': {
    id: 'outcome-1-a',
    label: 'Outcome for Product A',
    level: 'outcome',
    products: ['a'],
    parents: ['product-a'],
    children: [
      'scenario-unique-a',           // Unique to product A
      'scenario-duplicate-a',         // Duplicate (will have overlap)
      'scenario-shared-a-b'          // Shared (for rationalization)
    ]
  },
  
  // 3. DUPLICATE SCENARIOS - Same functionality in different products
  'scenario-duplicate-a': {
    id: 'scenario-duplicate-a',
    label: 'Duplicate Functionality',
    level: 'scenario',
    products: ['a'],
    parents: ['outcome-1-a'],
    children: ['step-duplicate-a']
  },
  'scenario-duplicate-b': {
    id: 'scenario-duplicate-b',
    label: 'Duplicate Functionality',  // Same label
    level: 'scenario',
    products: ['b'],
    parents: ['outcome-1-b'],          // Different parent
    children: ['step-duplicate-b']
  },
  
  // 4. SHARED SCENARIOS - Created for rationalization
  // CRITICAL: Must have parents from BOTH products
  'scenario-shared-a-b': {
    id: 'scenario-shared-a-b',
    label: 'Unified Functionality',
    level: 'scenario',
    products: ['a', 'b'],
    parents: ['outcome-1-a', 'outcome-1-b'], // Parents from both products
    children: ['step-unified-a-b']
  },
  
  // 5. STEPS and ACTIONS follow the same pattern
  // ...
};
```

### 4. Define rationalization.ts

```typescript
// Maps shared nodes to their product-specific alternatives
export const RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>> = {
  'scenario-shared-a-b': {
    'a': 'scenario-duplicate-a',
    'b': 'scenario-duplicate-b'
  }
  // ... more mappings
};

// DUPLICATE_NODES - Nodes that represent overlapping functionality
export const DUPLICATE_NODES = [
  'scenario-duplicate-a',
  'scenario-duplicate-b',
  // Include all duplicate nodes at all levels
];

// SHARED_NODES - Unified nodes shown when rationalization is ON
export const SHARED_NODES = [
  'scenario-shared-a-b',
  'step-unified-a-b',
  // Include all shared/unified nodes
];
```

### 5. Create intents.ts

```typescript
import { UserIntent } from '../../../types';

export const EXAMPLE_QUERIES = [
  "query example 1",
  "query example 2"
];

export const INTENT_INPUT_PLACEHOLDER = "e.g., do something";

export const USER_INTENTS: UserIntent[] = [
  {
    id: 'intent-1',
    text: 'User intent text',
    entryNode: 'node-id-that-exists',  // MUST reference existing node
    entryLevel: 'scenario',            // Must match node's level
    ambiguous: false
  }
  // ... more intents
];
```

### 6. Create contexts.ts

```typescript
import { UserContext } from '../../../types';

// Use Record format, not array
export const SAMPLE_CONTEXTS: Record<string, UserContext> = {
  'persona-key': {
    profile: {
      role: 'Role Name',
      department: 'Department',
      seniority: 'Senior'
    },
    history: [],  // Start with empty history
    patterns: {
      productPreferences: {
        'product1': 0.7,
        'product2': 0.3
      },
      workflowStage: 'Stage Name',
      domainFocus: ['Focus1', 'Focus2']
    }
  }
  // ... more personas
};

// For compatibility
export const USER_CONTEXTS = SAMPLE_CONTEXTS;
```

### 7. Create index.ts

```typescript
// Domain exports
export * from './domain';
export * from './nodes';
export * from './intents';
export * from './contexts';
export * from './rationalization';

// Domain metadata
export const DOMAIN_METADATA = {
  id: 'domain-id',
  name: 'Domain Name',
  description: 'Domain description',
  version: '1.0.0',
  author: 'Breeze.AI',
  category: 'Category',
  keywords: ['keyword1', 'keyword2']
};
```

### 8. Register the Domain

Add to `/src/hooks/useDomainConfig.ts`:

```typescript
const domainModules: Record<string, any> = {
  cision: require('../config/domains/cision'),
  healthcare: require('../config/domains/healthcare'),
  ecommerce: require('../config/domains/ecommerce'),
  'your-domain': require('../config/domains/your-domain')  // Add your domain
};
```

Add to `/src/config/domainRegistry.ts`:

```typescript
const domainIds = ['cision', 'healthcare', 'ecommerce', 'your-domain'];
```

Add to `/src/components/DomainCards.tsx`:

```typescript
const domains = [
  // ... existing domains
  {
    id: 'your-domain',
    name: 'Your Domain Name',
    description: 'Domain description',
    category: 'Category',
    keywords: ['keyword1', 'keyword2'],
    primaryColor: '#xxxxxx',
    accentColor: '#xxxxxx',
    available: true
  }
];
```

## Critical Design Patterns

### 1. Product Tree Independence
- **RULE**: Each product must have its own separate tree
- **NO** shared outcomes between products
- **NO** shared scenarios/steps/actions (except rationalized ones)
- Each product's tree starts from the product node and branches independently

### 2. Duplicate vs Shared Nodes
- **Duplicate Nodes**: Product-specific implementations of similar functionality
  - Named with product suffix: `scenario-search-product1`, `scenario-search-product2`
  - Each belongs to only ONE product
  - Connected only to their product's tree
  
- **Shared Nodes**: Unified/rationalized versions
  - Named with 'shared' suffix: `scenario-search-shared`
  - Belong to MULTIPLE products
  - Have parents from ALL relevant products
  - Only shown when rationalization is ON

### 3. Parent-Child Consistency
- **RULE**: If node A lists node B as a child, node B MUST list node A as a parent
- **RULE**: Shared nodes must have parents from all participating products
- **RULE**: Parent outcomes must list both duplicate AND shared scenarios as children

### 4. Rationalization Behavior
- **Rationalization OFF**: Shows duplicate nodes with orange borders
- **Rationalization ON**: Hides duplicate nodes, shows shared nodes with orange borders
- Shared nodes must exist in the graph (not created dynamically)

## Common Mistakes to Avoid

### ❌ DON'T: Share outcomes between products
```typescript
// WRONG
'outcome-shared': {
  products: ['a', 'b'],  // Outcomes should never be shared
  ...
}
```

### ✅ DO: Create separate outcomes for each product
```typescript
// CORRECT
'outcome-1-a': {
  products: ['a'],
  ...
},
'outcome-1-b': {
  products: ['b'],
  ...
}
```

### ❌ DON'T: Create orphan nodes
```typescript
// WRONG - No parents defined
'scenario-orphan': {
  parents: [],  // This creates an orphan
  ...
}
```

### ✅ DO: Connect all nodes properly
```typescript
// CORRECT
'scenario-connected': {
  parents: ['outcome-1-a'],  // Properly connected
  ...
}
```

### ❌ DON'T: Forget to list shared nodes in parent's children
```typescript
// WRONG
'outcome-1-a': {
  children: ['scenario-duplicate-a']  // Missing shared scenario
}
```

### ✅ DO: Include both duplicate and shared in children
```typescript
// CORRECT
'outcome-1-a': {
  children: ['scenario-duplicate-a', 'scenario-shared-a-b']
}
```

### ❌ DON'T: Use the same color for all products
```typescript
// WRONG
PRODUCT_COLORS = {
  'product1': '#4F46E5',
  'product2': '#4F46E5',  // Same color!
  'product3': '#4F46E5'   // Same color!
}
```

### ✅ DO: Use distinct colors for visual differentiation
```typescript
// CORRECT
PRODUCT_COLORS = {
  'product1': '#4F46E5',  // Indigo
  'product2': '#10B981',  // Emerald
  'product3': '#F59E0B'   // Amber
}
```

## Testing Checklist

Before considering your domain complete, verify:

### Graph Structure
- [ ] All products have independent trees
- [ ] No orphan nodes appear in the visualization
- [ ] Parent-child relationships are bidirectional
- [ ] Shared nodes have parents from all relevant products

### Overlaps & Rationalization
- [ ] Duplicate nodes show orange borders when "Show Overlaps" is ON
- [ ] Rationalization OFF shows duplicate nodes
- [ ] Rationalization ON shows shared/unified nodes
- [ ] No resolution failures when rationalization is toggled

### Visual Display
- [ ] Each product has a distinct color
- [ ] Node labels are clear and concise
- [ ] Graph expands/collapses properly
- [ ] Pan and zoom work smoothly

### Intents & Context
- [ ] All intents reference valid existing nodes
- [ ] Intent entry levels match node levels
- [ ] Personas have appropriate product preferences
- [ ] Context switching works properly

### Build & Integration
- [ ] `npm run build` succeeds without errors
- [ ] Domain appears in home page selector
- [ ] Domain loads without console errors
- [ ] All toggles and controls work properly

## Example: Creating a Finance Domain

Here's a quick example of creating a simple finance domain with 3 products:

1. **Products**: Banking, Investments, Loans
2. **Overlaps**: 
   - Account Management (Banking & Investments)
   - Risk Assessment (Investments & Loans)
   - Transaction Processing (Banking & Loans)

Follow the patterns above to create:
- Separate trees for each product
- Duplicate scenarios for overlaps
- Shared scenarios for rationalization
- Proper parent-child connections

## Troubleshooting

### Problem: "Orphan nodes appear in the graph"
**Solution**: Check that all nodes have valid parents (except products) and that parents list them as children.

### Problem: "Rationalization doesn't show any nodes"
**Solution**: Ensure shared nodes exist in nodes.ts and are listed in SHARED_NODES array.

### Problem: "Colors are all the same"
**Solution**: Update PRODUCT_COLORS with distinct hex values for each product.

### Problem: "Intent resolution fails"
**Solution**: Verify all intent entryNode values reference existing node IDs.

## Summary

Creating a domain requires careful attention to:
1. **Structure**: Independent product trees with proper connections
2. **Overlaps**: Duplicate nodes for demonstration, shared nodes for resolution
3. **Consistency**: Bidirectional parent-child relationships
4. **Visual**: Distinct colors and clear labeling
5. **Testing**: Thorough validation of all features

Follow this guide to create robust, demonstrable domains that showcase the power of semantic engineering for multi-product integration.
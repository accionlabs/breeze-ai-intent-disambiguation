# Financial Domain Rebuild Plan

## Architecture Principles
1. Each product must have completely independent trees
2. No node (except -shared nodes) should have multiple products
3. Shared functionality requires:
   - Product-specific nodes (e.g., action-foo-cb for core-banking)
   - A shared node for rationalization (e.g., action-foo-shared)
   - Rationalization mapping from shared to product-specific

## Simplified Structure
To ensure correctness, we'll start with a smaller, manageable structure:

### Products (5)
- product-core-banking
- product-wealth  
- product-loans
- product-payments
- product-risk

### Each Product Gets:
- 1-2 outcomes (unique to that product)
- 2-3 scenarios per outcome
- 2-3 steps per scenario
- 2-3 actions per step

### Shared Nodes (for rationalization):
- A few carefully selected shared scenarios/steps/actions with -shared suffix
- Each shared node maps to product-specific versions

## Implementation Steps:
1. Create independent product trees
2. Add shared nodes for common functionality
3. Set up rationalization mappings
4. Fix intent references
5. Validate everything passes
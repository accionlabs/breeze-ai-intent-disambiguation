# Automatic Rationalization Testing Guide

## Summary of Changes
All manual shared/unified nodes have been removed from all domains. The system now automatically generates shared nodes when duplicate nodes are detected across different products.

## Domains Updated
- **Financial**: 1 manual shared node removed
- **Healthcare**: 6 manual shared nodes removed  
- **Ecommerce**: 18 manual shared nodes removed
- **Enterprise**: 20 manual shared nodes removed
- **Cision**: 7 manual shared nodes removed

## How to Test

### 1. Start the Application
```bash
npm start
# or if port 3000 is busy:
PORT=3001 npm start
```

### 2. Test Each Domain

For each domain (Financial, Healthcare, Ecommerce, Enterprise, Cision):

#### A. Non-Rationalized Mode (Default)
1. Select the domain from the dropdown
2. Ensure "Show Rationalized" toggle is **OFF** (default)
3. Verify:
   - Duplicate nodes are visible (e.g., multiple "Customer 360 View" nodes in Enterprise)
   - No shared nodes appear (no nodes with "-shared" suffix)
   - All nodes are properly connected (no orphaned nodes)

#### B. Rationalized Mode
1. Turn **ON** the "Show Rationalized" toggle
2. Verify:
   - Duplicate nodes are hidden
   - Auto-generated shared nodes appear (with "-shared" suffix)
   - Shared nodes connect multiple product trees
   - Graph remains fully connected

### 3. Specific Test Cases

#### Enterprise Domain
- **Duplicates to check**: 
  - Customer 360 View (salesforce, analytics)
  - Document Management (ms365, projects)
  - Employee Management (ms365, projects, fieldops)
- **Auto-generated shared nodes**:
  - scenario-customer-360-view-shared
  - scenario-document-management-shared
  - scenario-employee-management-shared

#### Ecommerce Domain
- **Duplicates to check**:
  - Customer Profile Management
  - Order Tracking
  - Payment Processing
  - Shipping Management
  - Returns Processing
  - Customer Support
  - Marketing Campaigns
  - Customer Segmentation
  - Cross-sell Recommendations

#### Healthcare Domain
- **Duplicates to check**:
  - Patient Record Management
  - Care Coordination
  - Medical Records

### 4. Search Functionality
1. Use the search box on the left side of the screen
2. Search for duplicate nodes (e.g., "Customer 360")
3. Verify search results show all matching nodes
4. Click on results to expand and highlight nodes
5. Ensure clicking doesn't trigger intent resolution

## Expected Behavior

### Non-Rationalized Mode
- Shows the raw functional graph with all duplicate nodes
- Each product has its own copy of shared functionality
- No "-shared" nodes visible
- Total node count is higher

### Rationalized Mode  
- Shows optimized graph with shared nodes
- Duplicate nodes are hidden
- Auto-generated shared nodes connect product trees
- Total visible node count is lower
- More efficient representation of cross-product functionality

## Success Criteria
✅ All domains load without errors
✅ Toggle between modes works smoothly
✅ No orphaned nodes in either mode
✅ Search finds nodes correctly
✅ Auto-generated shared nodes have correct connections
✅ No manual shared nodes remain in the codebase

## Troubleshooting
- If you see orphaned nodes: Check browser console for errors
- If shared nodes don't appear: Verify automatic generation is working
- If app doesn't load: Check that all TypeScript compiles correctly

## Architecture Notes
The automatic rationalization system:
1. Detects duplicate nodes (same label, level, different products)
2. Creates shared nodes dynamically at runtime
3. Maintains all graph connections
4. Controls visibility through the rationalization toggle
5. Never modifies the original duplicate nodes
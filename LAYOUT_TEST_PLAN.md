# Layout Modes Test Plan

## Test Scenarios for Three Layout Strategies

### 1. Classic Centered Layout
**Expected Behavior:**
- Each level's nodes center independently
- Tree width varies by level
- Single nodes center perfectly
- Multiple nodes space evenly at their level

**Test Cases:**
1. Single root → Multiple children
2. Multiple roots → Mixed children counts
3. Deep hierarchy (5+ levels)
4. Rationalized nodes with shared children

### 2. Uniform Width Layout  
**Expected Behavior:**
- All levels use same maximum width
- Nodes distribute evenly within consistent bounds
- Single nodes still center
- No horizontal shifting when expanding/collapsing

**Test Cases:**
1. Expand parent with many children - parent stays visible
2. Complex multi-product hierarchy
3. Rationalized scenarios with unified steps
4. Wide level (8+ nodes) followed by narrow level (1-2 nodes)

### 3. Compact Branch Layout
**Expected Behavior:**
- Each branch uses only its allocated width
- Recursive width allocation based on subtree size
- Siblings stay close within their branch
- Minimal horizontal spread

**Test Cases:**
1. Asymmetric tree (one large branch, one small)
2. Deep single-branch hierarchy
3. Multiple products with varying complexity
4. Rationalized nodes maintaining branch boundaries

## Test Queries to Use

### Simple Hierarchy Test
- "Monitor brand reputation" (BCR - single branch)
- "Schedule social posts" (SMM - single branch)

### Complex Multi-Product Test
- "Monitor media and schedule posts" (BCR + SMM)
- "Track brand sentiment across channels" (multiple products)

### Rationalization Test
- "Monitor conversations" (triggers rationalization)
- "Identify influencers" (cross-product overlap)

### Deep Hierarchy Test
- "Crisis management workflow" (deep scenario → step → action chain)
- "Complete PR campaign" (full outcome → action hierarchy)

## Validation Checklist

For each layout mode and test case:

- [ ] Nodes don't overlap
- [ ] Labels are readable
- [ ] Parent-child connections clear
- [ ] Expanding nodes doesn't cause jarring shifts
- [ ] Graph bounds appropriate for content
- [ ] Zoom/pan requirements minimized
- [ ] Rationalized nodes display correctly
- [ ] Product badges visible and aligned

## Performance Checks

- [ ] Layout calculation < 100ms for 50 nodes
- [ ] Smooth transitions between layouts
- [ ] No memory leaks when switching modes
- [ ] Responsive to window resize

## Edge Cases

1. Empty hierarchy
2. Single node only
3. 100+ nodes
4. Circular references (if any)
5. Orphaned nodes
6. Mixed product selections
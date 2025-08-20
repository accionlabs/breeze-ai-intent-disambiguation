#!/usr/bin/env python3
"""Validate healthcare domain nodes"""

import re
from collections import defaultdict

def extract_nodes_from_file(filepath):
    """Extract node definitions from TypeScript file"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    nodes = {}
    lines = content.split('\n')
    current_node = None
    current_data = {}
    
    for line in lines:
        # Check for node ID
        if match := re.match(r"\s*'([^']+)':\s*\{", line):
            if current_node:
                nodes[current_node] = current_data
            current_node = match.group(1)
            current_data = {'id': current_node, 'children': [], 'parents': [], 'products': []}
        
        # Extract properties
        elif current_node:
            if 'label:' in line:
                if match := re.search(r"label:\s*'([^']+)'", line):
                    current_data['label'] = match.group(1)
            elif 'level:' in line:
                if match := re.search(r"level:\s*'([^']+)'", line):
                    current_data['level'] = match.group(1)
            elif 'products:' in line:
                if match := re.search(r"products:\s*\[([^\]]*)\]", line):
                    prods = match.group(1)
                    current_data['products'] = [p.strip().strip("'\"") for p in prods.split(',') if p.strip()]
            elif 'children:' in line:
                if match := re.search(r"children:\s*\[([^\]]*)\]", line):
                    children = match.group(1)
                    current_data['children'] = [c.strip().strip("'\"") for c in children.split(',') if c.strip()]
            elif 'parents:' in line:
                if match := re.search(r"parents:\s*\[([^\]]*)\]", line):
                    parents = match.group(1)
                    current_data['parents'] = [p.strip().strip("'\"") for p in parents.split(',') if p.strip()]
    
    # Add last node
    if current_node:
        nodes[current_node] = current_data
    
    return nodes

def check_shared_node_validity(nodes):
    """Check shared node validity"""
    products = ['ehr', 'pharmacy']
    product_trees = {}
    
    # Build reachability for each product
    for product in products:
        product_node = f'product-{product}'
        if product_node not in nodes:
            continue
        
        reachable = set()
        to_visit = [product_node]
        
        while to_visit:
            current = to_visit.pop()
            if current in reachable:
                continue
            reachable.add(current)
            
            if current in nodes and 'children' in nodes[current]:
                to_visit.extend(nodes[current]['children'])
        
        product_trees[product] = reachable
    
    # Find nodes reachable from multiple products
    shared_nodes = {}
    for node_id in nodes:
        if nodes[node_id].get('level') == 'product':
            continue
        reachable_from = [p for p in products if node_id in product_trees.get(p, set())]
        if len(reachable_from) > 1:
            shared_nodes[node_id] = reachable_from
    
    errors = []
    warnings = []
    
    # Check shared nodes
    for node_id, prods in shared_nodes.items():
        node = nodes[node_id]
        if '-shared' in node_id or '-unified' in node_id:
            # This is properly marked as shared - OK!
            print(f"  ✓ {node_id} properly marked as shared, connects: {prods}")
            # Check products array
            if set(node.get('products', [])) != set(prods):
                warnings.append(f"{node_id} products array mismatch")
        else:
            # Not marked as shared but connects multiple products - ERROR!
            errors.append(f"{node_id} connects {prods} but not marked as shared")
    
    # Check nodes marked as shared that aren't actually shared
    for node_id, node in nodes.items():
        if '-shared' in node_id or '-unified' in node_id:
            if node_id not in shared_nodes:
                reachable_from = [p for p in products if node_id in product_trees.get(p, set())]
                if len(reachable_from) == 0:
                    warnings.append(f"{node_id} marked as shared but orphaned")
                elif len(reachable_from) == 1:
                    warnings.append(f"{node_id} marked as shared but only used by {reachable_from[0]}")
    
    return errors, warnings, shared_nodes

def main():
    filepath = 'src/config/domains/healthcare/nodes.ts'
    
    print("Validating Healthcare Domain...")
    print("=" * 60)
    
    nodes = extract_nodes_from_file(filepath)
    
    if not nodes:
        print("ERROR: Could not extract nodes from file")
        return
    
    # Count nodes
    total = len(nodes)
    shared = sum(1 for n in nodes if '-shared' in n or '-unified' in n)
    by_level = defaultdict(int)
    for node in nodes.values():
        by_level[node.get('level', 'unknown')] += 1
    
    print(f"\nNode Statistics:")
    print(f"  Total nodes: {total}")
    print(f"  Nodes marked as shared: {shared}")
    for level in ['product', 'outcome', 'scenario', 'step', 'action']:
        print(f"  {level.capitalize()}s: {by_level[level]}")
    
    print(f"\nChecking shared node validity...")
    errors, warnings, shared_nodes = check_shared_node_validity(nodes)
    
    if errors:
        print(f"\n❌ ERRORS found:")
        for error in errors:
            print(f"  - {error}")
    
    if warnings:
        print(f"\n⚠️  Warnings:")
        for warning in warnings:
            print(f"  - {warning}")
    
    print("\n" + "=" * 60)
    if not errors:
        print(f"✅ Healthcare domain validation PASSED")
        print(f"   {len(shared_nodes)} nodes properly connecting multiple products")
    else:
        print(f"❌ Healthcare domain validation FAILED")
        print(f"   {len(errors)} errors found")

if __name__ == "__main__":
    main()
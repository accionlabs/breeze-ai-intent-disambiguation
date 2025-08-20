#!/usr/bin/env python3
"""Find duplicate nodes in financial domain that should be rationalized"""

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

def find_duplicates(nodes):
    """Find duplicate nodes by label and level"""
    nodes_by_label_level = defaultdict(list)
    
    for node_id, node in nodes.items():
        # Skip shared nodes
        if '-shared' in node_id or '-unified' in node_id:
            continue
        
        key = (node.get('level'), node.get('label', '').lower())
        nodes_by_label_level[key].append((node_id, node))
    
    # Find duplicates
    duplicates = {}
    for (level, label), node_list in nodes_by_label_level.items():
        if len(node_list) > 1:
            # Check if they're from different products
            all_products = set()
            for node_id, node in node_list:
                all_products.update(node.get('products', []))
            
            # If they span multiple products, they're duplicates
            if len(all_products) > 1:
                duplicates[(level, label)] = {
                    'nodes': [nid for nid, _ in node_list],
                    'products': list(all_products)
                }
    
    return duplicates

def main():
    filepath = 'src/config/domains/financial/nodes.ts'
    
    print("Finding Duplicate Nodes in Financial Domain")
    print("=" * 60)
    
    nodes = extract_nodes_from_file(filepath)
    
    if not nodes:
        print("ERROR: Could not extract nodes from file")
        return
    
    duplicates = find_duplicates(nodes)
    
    if duplicates:
        print(f"\nFound {len(duplicates)} groups of duplicate nodes that should be rationalized:\n")
        
        # Group by level for better organization
        by_level = defaultdict(list)
        for (level, label), info in duplicates.items():
            by_level[level].append((label, info))
        
        for level in ['outcome', 'scenario', 'step', 'action']:
            if level in by_level:
                print(f"\n{level.upper()} level duplicates:")
                print("-" * 40)
                for label, info in sorted(by_level[level]):
                    print(f"\n'{label}':")
                    print(f"  Duplicate nodes: {info['nodes']}")
                    print(f"  Products: {info['products']}")
                    print(f"  → Should create: {label.replace(' ', '-').lower()}-shared")
    else:
        print("\nNo duplicate nodes found that need rationalization.")
    
    # Summary
    print("\n" + "=" * 60)
    print("RECOMMENDATION:")
    print("=" * 60)
    
    if duplicates:
        print(f"\n1. Create {len(duplicates)} shared nodes for rationalization")
        print("2. Update RATIONALIZED_NODE_ALTERNATIVES mapping")
        print("3. Ensure shared nodes have union of all children from duplicates")
        print("\nExample shared node structure:")
        
        # Show example for first duplicate
        for (level, label), info in list(duplicates.items())[:1]:
            shared_id = f"{label.replace(' ', '-').lower()}-shared"
            print(f"\n'{shared_id}': {{")
            print(f"  id: '{shared_id}',")
            print(f"  label: '{label}',")
            print(f"  level: '{level}',")
            print(f"  products: {info['products']},")
            print(f"  children: [...union of children from {info['nodes']}],")
            print(f"  parents: [...appropriate parent nodes...]")
            print("}")

if __name__ == "__main__":
    main()
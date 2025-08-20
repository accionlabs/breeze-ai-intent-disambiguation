#!/usr/bin/env python3
"""Find ALL potential duplicate nodes across products in financial domain"""

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

def analyze_similarity(nodes):
    """Analyze nodes for similar functionality that could be rationalized"""
    
    # Group by label similarity (not exact match)
    label_groups = defaultdict(list)
    
    for node_id, node in nodes.items():
        if '-shared' in node_id or '-unified' in node_id:
            continue
        
        label = node.get('label', '').lower()
        level = node.get('level')
        
        # Normalize label for grouping
        # Remove product-specific terms
        normalized = label
        for term in ['core banking', 'wealth', 'loans', 'payments', 'risk', 'compliance']:
            normalized = normalized.replace(term, '').strip()
        
        # Common operations that might be duplicated
        key_terms = ['verify', 'check', 'validate', 'authenticate', 'submit', 'collect', 
                     'capture', 'document', 'identity', 'kyc', 'compliance', 'monitor', 
                     'report', 'analyze', 'assess', 'transfer', 'process']
        
        for term in key_terms:
            if term in normalized:
                key = (level, term)
                label_groups[key].append((node_id, node))
                break
        else:
            # Use full normalized label if no key term found
            if normalized:
                key = (level, normalized)
                label_groups[key].append((node_id, node))
    
    # Find groups with multiple nodes from different products
    potential_duplicates = {}
    
    for (level, key), node_list in label_groups.items():
        if len(node_list) > 1:
            # Check products
            products_map = defaultdict(list)
            for node_id, node in node_list:
                for prod in node.get('products', []):
                    products_map[prod].append(node_id)
            
            # If nodes span multiple products, they might be duplicates
            if len(products_map) > 1:
                potential_duplicates[(level, key)] = {
                    'nodes': node_list,
                    'products': list(products_map.keys())
                }
    
    return potential_duplicates

def main():
    filepath = 'src/config/domains/financial/nodes.ts'
    
    print("Analyzing Financial Domain for Rationalization Opportunities")
    print("=" * 60)
    
    nodes = extract_nodes_from_file(filepath)
    
    if not nodes:
        print("ERROR: Could not extract nodes from file")
        return
    
    # Find exact duplicates
    exact_duplicates = defaultdict(list)
    for node_id, node in nodes.items():
        if '-shared' not in node_id and '-unified' not in node_id:
            key = (node.get('level'), node.get('label', '').lower())
            exact_duplicates[key].append((node_id, node))
    
    print("\n1. EXACT DUPLICATE LABELS (same label, same level):")
    print("-" * 40)
    found_exact = False
    for (level, label), node_list in exact_duplicates.items():
        if len(node_list) > 1:
            # Check if different products
            all_prods = set()
            for _, node in node_list:
                all_prods.update(node.get('products', []))
            
            if len(all_prods) > 1:
                found_exact = True
                print(f"\n{level}: '{label}'")
                for node_id, node in node_list:
                    print(f"  - {node_id} (products: {node.get('products', [])})")
    
    if not found_exact:
        print("  None found")
    
    # Find similar functionality
    potential = analyze_similarity(nodes)
    
    print("\n\n2. SIMILAR FUNCTIONALITY (could be rationalized):")
    print("-" * 40)
    
    by_level = defaultdict(list)
    for (level, key), info in potential.items():
        by_level[level].append((key, info))
    
    for level in ['scenario', 'step', 'action']:
        if level in by_level:
            print(f"\n{level.upper()} level:")
            for key, info in sorted(by_level[level]):
                print(f"\n  Pattern: '{key}' across {info['products']}")
                for node_id, node in info['nodes'][:5]:
                    print(f"    - {node_id}: {node.get('label')}")
                if len(info['nodes']) > 5:
                    print(f"    ... and {len(info['nodes']) - 5} more")
    
    # Recommendations
    print("\n" + "=" * 60)
    print("RECOMMENDATIONS:")
    print("=" * 60)
    
    print("\n1. Current shared nodes: 1 (step-verify-identity-shared)")
    print("\n2. Consider creating shared nodes for these common patterns:")
    print("   - Document verification/validation")
    print("   - Compliance checking")
    print("   - Transaction processing")
    print("   - Reporting and analytics")
    print("\n3. Each shared node should:")
    print("   - Have '-shared' suffix")
    print("   - Include union of children from all duplicates")
    print("   - Be mapped in RATIONALIZED_NODE_ALTERNATIVES")

if __name__ == "__main__":
    main()
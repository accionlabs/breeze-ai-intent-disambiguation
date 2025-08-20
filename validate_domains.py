#!/usr/bin/env python3
"""Validate domain nodes for product tree independence and shared node marking"""

import re
import sys
import os
from collections import defaultdict

def extract_nodes_from_file(filepath):
    """Extract node definitions from TypeScript file"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find all node definitions
    nodes = {}
    pattern = r"'([^']+)':\s*\{[^}]*id:\s*'([^']+)'[^}]*label:\s*'([^']+)'[^}]*level:\s*'([^']+)'[^}]*(?:products:\s*\[([^\]]*)\])?[^}]*(?:children:\s*\[([^\]]*)\])?[^}]*(?:parents:\s*\[([^\]]*)\])?[^}]*\}"
    
    # Simpler extraction - just get the FUNCTIONAL_NODES object
    start = content.find('export const FUNCTIONAL_NODES')
    if start == -1:
        return {}
    
    # Extract each node manually
    lines = content[start:].split('\n')
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

def check_product_independence(nodes, domain_name):
    """Check if product trees are independent (excluding workflow and shared nodes)"""
    # Extract product names from the nodes
    products = []
    for node_id, node in nodes.items():
        if node.get('level') == 'product':
            product_name = node_id.replace('product-', '')
            products.append(product_name)
    
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
    
    # Check for overlaps
    overlaps = []
    for i, prod1 in enumerate(products):
        if prod1 not in product_trees:
            continue
        for prod2 in products[i+1:]:
            if prod2 not in product_trees:
                continue
            
            # Find overlapping nodes
            overlap = []
            for node in product_trees[prod1]:
                if node in product_trees[prod2]:
                    node_obj = nodes.get(node, {})
                    # Skip if it's a workflow node (intentionally cross-product)
                    if node_obj.get('level') == 'workflow':
                        continue
                    # Skip if it's properly marked as shared/unified (rationalized)
                    if '-shared' in node or '-unified' in node:
                        continue
                    # This is an improper overlap
                    overlap.append(node)
            
            if overlap:
                overlaps.append((prod1, prod2, overlap))
    
    return overlaps

def find_orphaned_nodes(nodes):
    """Find nodes with no parents (except products and workflows)"""
    orphaned = []
    for node_id, node in nodes.items():
        # Skip product nodes (they're roots) and workflow nodes (special cross-product nodes)
        if node.get('level') not in ['product', 'workflow'] and not node.get('parents'):
            orphaned.append(node_id)
    return orphaned

def validate_references(nodes):
    """Check that all parent/child references exist"""
    errors = []
    for node_id, node in nodes.items():
        # Check parents exist
        for parent in node.get('parents', []):
            if parent and parent not in nodes:
                errors.append(f"Node {node_id} references non-existent parent: {parent}")
        
        # Check children exist
        for child in node.get('children', []):
            if child and child not in nodes:
                errors.append(f"Node {node_id} references non-existent child: {child}")
    
    return errors

def check_shared_nodes_validity(nodes):
    """Check that shared nodes properly represent rationalized duplicates
    
    Based on rationalizationProcessor.ts logic:
    1. Shared nodes should have corresponding duplicate nodes (same label, same level, different products)
    2. Shared nodes should be the union of their duplicate nodes' children
    3. RATIONALIZED_NODE_ALTERNATIVES maps shared nodes to their product-specific duplicates
    """
    errors = []
    warnings = []
    info = []
    
    # Find all shared nodes
    shared_nodes = {}
    for node_id, node in nodes.items():
        if '-shared' in node_id or '-unified' in node_id:
            shared_nodes[node_id] = node
    
    # Group nodes by label and level to find duplicates (like detectDuplicateNodes in TS)
    nodes_by_label_level = defaultdict(list)
    for node_id, node in nodes.items():
        # Skip shared nodes themselves
        if '-shared' in node_id or '-unified' in node_id:
            continue
        key = (node.get('level'), node.get('label', '').lower())
        nodes_by_label_level[key].append((node_id, node))
    
    # Find actual duplicate groups (same label/level, different products)
    duplicate_groups = {}
    for (level, label), node_list in nodes_by_label_level.items():
        if len(node_list) > 1:
            # Check if they're from different products
            products_per_node = []
            for node_id, node in node_list:
                products_per_node.append(set(node.get('products', [])))
            
            # If nodes have different products, they're duplicates
            all_products_identical = all(
                products_per_node[0] == pset for pset in products_per_node[1:]
            )
            
            if not all_products_identical:
                duplicate_groups[(level, label)] = [nid for nid, _ in node_list]
    
    # Check each shared node
    for shared_id, shared_node in shared_nodes.items():
        shared_label = shared_node.get('label', '').lower()
        shared_level = shared_node.get('level')
        
        # Find corresponding duplicate group
        found_duplicates = None
        for (level, label), dup_ids in duplicate_groups.items():
            # Check if this shared node corresponds to these duplicates
            # Could be exact match or "unified"/"shared" version of the label
            if level == shared_level:
                if (label == shared_label or 
                    label.replace(' ', '-') in shared_id.lower() or
                    shared_label.startswith('unified') and label in shared_label):
                    found_duplicates = dup_ids
                    break
        
        if found_duplicates:
            info.append(f"Shared node {shared_id} rationalizes duplicates: {found_duplicates}")
            
            # Verify shared node has union of children from duplicates
            duplicate_children = set()
            for dup_id in found_duplicates:
                dup_node = nodes.get(dup_id)
                if dup_node:
                    duplicate_children.update(dup_node.get('children', []))
            
            shared_children = set(shared_node.get('children', []))
            
            # Check if shared node's children include all duplicate children
            # (It may have MORE children if it's a proper union)
            missing_children = duplicate_children - shared_children
            if missing_children:
                warnings.append(f"Shared node {shared_id} missing children from duplicates: {list(missing_children)}")
        else:
            # No corresponding duplicates found
            warnings.append(f"Shared node {shared_id} ('{shared_node.get('label')}') has no corresponding duplicate nodes to rationalize")
    
    # Check for duplicate groups without shared nodes
    for (level, label), dup_ids in duplicate_groups.items():
        # Check if there's a corresponding shared node
        has_shared = False
        for shared_id, shared_node in shared_nodes.items():
            if (shared_node.get('level') == level and 
                (shared_node.get('label', '').lower() == label or
                 label.replace(' ', '-') in shared_id.lower())):
                has_shared = True
                break
        
        if not has_shared:
            # These duplicates could be rationalized
            info.append(f"Duplicate nodes {dup_ids} ('{label}' at {level}) could be rationalized with a -shared node")
    
    # Print results
    if errors:
        print(f"  ❌ Shared node errors:")
        for error in errors:
            print(f"    - {error}")
    
    if warnings:
        print(f"  ⚠️  Shared node warnings:")
        for warning in warnings[:5]:
            print(f"    - {warning}")
        if len(warnings) > 5:
            print(f"    ... and {len(warnings) - 5} more")
    
    if info and len(shared_nodes) > 0:
        print(f"  ℹ️  Rationalization info:")
        for msg in info[:3]:
            print(f"    - {msg}")
        if len(info) > 3:
            print(f"    ... and {len(info) - 3} more")
    
    if not errors and not warnings:
        if len(shared_nodes) > 0:
            print(f"  ✓ All {len(shared_nodes)} shared nodes properly represent rationalized functionality")
        else:
            print(f"  ✓ No shared nodes in this domain (no rationalization)")
    
    return errors

def validate_domain(domain_name):
    """Validate a specific domain"""
    filepath = f'src/config/domains/{domain_name}/nodes.ts'
    
    if not os.path.exists(filepath):
        print(f"Domain '{domain_name}' not found at {filepath}")
        return False
    
    print(f"\nValidating {domain_name.upper()} Domain...")
    print("=" * 60)
    
    nodes = extract_nodes_from_file(filepath)
    
    if not nodes:
        print("ERROR: Could not extract nodes from file")
        return False
    
    # Count nodes
    total = len(nodes)
    shared = sum(1 for n in nodes if '-shared' in n or '-unified' in n)
    workflows = sum(1 for node in nodes.values() if node.get('level') == 'workflow')
    by_level = defaultdict(int)
    for node in nodes.values():
        by_level[node.get('level', 'unknown')] += 1
    
    print(f"\nNode Statistics:")
    print(f"  Total nodes: {total}")
    print(f"  Nodes marked as shared: {shared}")
    print(f"  Workflow nodes (cross-product): {workflows}")
    for level in ['product', 'workflow', 'outcome', 'scenario', 'step', 'action']:
        if by_level[level] > 0:
            print(f"  {level.capitalize()}s: {by_level[level]}")
    
    # Check for orphaned nodes
    print(f"\nChecking for orphaned nodes...")
    orphaned = find_orphaned_nodes(nodes)
    if orphaned:
        print(f"  ⚠️  Found {len(orphaned)} orphaned nodes:")
        for node_id in orphaned[:5]:  # Show first 5
            node = nodes[node_id]
            print(f"    - {node_id} ({node.get('level')}): {node.get('label')}")
        if len(orphaned) > 5:
            print(f"    ... and {len(orphaned) - 5} more")
    else:
        print("  ✓ No orphaned nodes found")
    
    # Validate references
    print(f"\nValidating node references...")
    ref_errors = validate_references(nodes)
    if ref_errors:
        print(f"  ⚠️  Found {len(ref_errors)} reference errors:")
        for error in ref_errors[:5]:
            print(f"    - {error}")
        if len(ref_errors) > 5:
            print(f"    ... and {len(ref_errors) - 5} more")
    else:
        print("  ✓ All references valid")
    
    # Check product independence and shared node marking
    print(f"\nChecking product tree independence and shared node marking...")
    overlaps = check_product_independence(nodes, domain_name)
    
    # Check shared nodes represent rationalized duplicates
    print(f"\nChecking shared nodes represent rationalized functionality...")
    shared_validation_errors = check_shared_nodes_validity(nodes)
    
    # Count shared nodes
    shared_count = sum(1 for nid in nodes if '-shared' in nid or '-unified' in nid)
    
    if overlaps:
        print(f"  ❌ Found nodes connecting products without -shared marking:")
        for prod1, prod2, overlap_nodes in overlaps:
            print(f"    {prod1} ↔ {prod2}: {len(overlap_nodes)} improperly shared nodes")
            for node_id in overlap_nodes[:3]:
                node = nodes.get(node_id, {})
                print(f"      - {node_id}: {node.get('label', 'Unknown')}")
            if len(overlap_nodes) > 3:
                print(f"      ... and {len(overlap_nodes) - 3} more")
    else:
        if shared_count > 0:
            print(f"  ✓ All shared nodes properly marked ({shared_count} shared nodes)")
        else:
            print("  ✓ All product trees are independent (no shared nodes)")
    
    print("\n" + "=" * 60)
    success = not orphaned and not ref_errors and not overlaps
    if success:
        print(f"✅ {domain_name.upper()} domain validation PASSED")
    else:
        print(f"❌ {domain_name.upper()} domain validation FAILED")
        print(f"   Issues: {len(orphaned)} orphaned, {len(ref_errors)} ref errors, {len(overlaps)} improper overlaps")
    
    return success

def main():
    """Main function to validate domains"""
    # Default domains to test
    all_domains = ['cision', 'healthcare', 'ecommerce', 'enterprise', 'financial']
    
    # Check if specific domains were provided as arguments
    if len(sys.argv) > 1:
        domains_to_test = sys.argv[1:]
    else:
        domains_to_test = all_domains
    
    print("=" * 60)
    print("DOMAIN VALIDATION TOOL")
    print("=" * 60)
    
    results = {}
    for domain in domains_to_test:
        if domain not in all_domains:
            print(f"\n⚠️  Unknown domain: {domain}")
            continue
        results[domain] = validate_domain(domain)
    
    # Summary
    print("\n" + "=" * 60)
    print("VALIDATION SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for v in results.values() if v)
    failed = len(results) - passed
    
    for domain, success in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"  {domain.upper():15} {status}")
    
    print("\n" + "=" * 60)
    print(f"Total: {passed} passed, {failed} failed out of {len(results)} domains")
    
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
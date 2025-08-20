// Script to add workflow nodes to all domains
const fs = require('fs');
const path = require('path');

// Define workflows for each domain
const domainWorkflows = {
  financial: {
    workflows: [
      {
        id: 'workflow-kyc-onboarding',
        label: 'KYC & Onboarding Orchestration',
        description: 'Complete customer onboarding across banking, wealth, and risk products',
        children: ['outcome-accounts-cb', 'outcome-compliance-risk', 'outcome-investments-wealth'],
        products: ['core-banking', 'risk', 'wealth']
      },
      {
        id: 'workflow-fraud-response',
        label: 'Fraud Response Coordination',
        description: 'Coordinate fraud detection and response across payments, accounts, and risk',
        children: ['outcome-monitoring-risk', 'outcome-processing-payments', 'outcome-accounts-cb'],
        products: ['risk', 'payments', 'core-banking']
      },
      {
        id: 'workflow-lending-lifecycle',
        label: 'End-to-End Lending Workflow',
        description: 'Orchestrate complete lending lifecycle from application to servicing',
        children: ['outcome-origination-loans', 'outcome-compliance-risk', 'outcome-servicing-loans', 'outcome-accounts-cb'],
        products: ['loans', 'risk', 'core-banking']
      }
    ],
    intents: [
      {
        id: 'intent-workflow-kyc-onboarding',
        text: 'Execute complete KYC and customer onboarding workflow',
        entryNode: 'workflow-kyc-onboarding',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-fraud-response',
        text: 'Coordinate multi-product fraud response workflow',
        entryNode: 'workflow-fraud-response',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-lending-lifecycle',
        text: 'Orchestrate end-to-end lending workflow',
        entryNode: 'workflow-lending-lifecycle',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      }
    ]
  },
  
  healthcare: {
    workflows: [
      {
        id: 'workflow-patient-admission',
        label: 'Patient Admission Orchestration',
        description: 'Coordinate patient admission across EHR, billing, and pharmacy',
        children: ['outcome-patient-records', 'outcome-billing', 'outcome-medication-pharmacy'],
        products: ['ehr', 'billing', 'pharmacy']
      },
      {
        id: 'workflow-emergency-response',
        label: 'Emergency Care Coordination',
        description: 'Orchestrate emergency response across clinical, diagnostic, and pharmacy',
        children: ['outcome-clinical-care', 'outcome-diagnostics', 'outcome-medication-pharmacy'],
        products: ['ehr', 'diagnostics', 'pharmacy']
      },
      {
        id: 'workflow-chronic-care',
        label: 'Chronic Care Management',
        description: 'Manage chronic patient care across multiple touchpoints',
        children: ['outcome-clinical-care', 'outcome-patient-records', 'outcome-medication-pharmacy', 'outcome-diagnostics'],
        products: ['ehr', 'pharmacy', 'diagnostics']
      }
    ],
    intents: [
      {
        id: 'intent-workflow-patient-admission',
        text: 'Execute patient admission orchestration workflow',
        entryNode: 'workflow-patient-admission',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-emergency-response',
        text: 'Coordinate emergency care workflow',
        entryNode: 'workflow-emergency-response',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-chronic-care',
        text: 'Manage chronic care coordination workflow',
        entryNode: 'workflow-chronic-care',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      }
    ]
  },
  
  ecommerce: {
    workflows: [
      {
        id: 'workflow-order-fulfillment',
        label: 'Order Fulfillment Orchestration',
        description: 'Complete order processing from storefront through inventory and shipping',
        children: ['outcome-customer-experience-storefront', 'outcome-inventory-management', 'outcome-customer-relationship-crm'],
        products: ['storefront', 'inventory', 'crm']
      },
      {
        id: 'workflow-seasonal-campaign',
        label: 'Seasonal Campaign Coordination',
        description: 'Coordinate seasonal campaigns across storefront, inventory, and CRM',
        children: ['outcome-sales-storefront', 'outcome-inventory-management', 'outcome-customer-relationship-crm'],
        products: ['storefront', 'inventory', 'crm']
      },
      {
        id: 'workflow-customer-retention',
        label: 'Customer Retention Workflow',
        description: 'Orchestrate customer retention across sales, support, and loyalty',
        children: ['outcome-customer-relationship-crm', 'outcome-customer-experience-storefront', 'outcome-sales-storefront'],
        products: ['crm', 'storefront']
      }
    ],
    intents: [
      {
        id: 'intent-workflow-order-fulfillment',
        text: 'Execute order fulfillment orchestration workflow',
        entryNode: 'workflow-order-fulfillment',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-seasonal-campaign',
        text: 'Coordinate seasonal campaign workflow',
        entryNode: 'workflow-seasonal-campaign',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-customer-retention',
        text: 'Orchestrate customer retention workflow',
        entryNode: 'workflow-customer-retention',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      }
    ]
  },
  
  enterprise: {
    workflows: [
      {
        id: 'workflow-employee-onboarding',
        label: 'Employee Onboarding Orchestration',
        description: 'Complete employee onboarding across HR, IT, and collaboration tools',
        children: ['outcome-employee-management-ms365', 'outcome-employee-management-projects', 'outcome-financial-reporting-sap'],
        products: ['ms365', 'projects', 'sap']
      },
      {
        id: 'workflow-project-delivery',
        label: 'Project Delivery Coordination',
        description: 'Orchestrate project delivery from planning through execution',
        children: ['outcome-project-management-projects', 'outcome-field-operations-fieldops', 'outcome-collaboration-ms365'],
        products: ['projects', 'fieldops', 'ms365']
      },
      {
        id: 'workflow-business-intelligence',
        label: 'Business Intelligence Pipeline',
        description: 'Coordinate data flow from operations through analytics to reporting',
        children: ['outcome-financial-reporting-sap', 'outcome-business-analytics', 'outcome-customer-360-salesforce'],
        products: ['sap', 'analytics', 'salesforce']
      }
    ],
    intents: [
      {
        id: 'intent-workflow-employee-onboarding',
        text: 'Execute employee onboarding orchestration workflow',
        entryNode: 'workflow-employee-onboarding',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-project-delivery',
        text: 'Coordinate project delivery workflow',
        entryNode: 'workflow-project-delivery',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      },
      {
        id: 'intent-workflow-business-intelligence',
        text: 'Orchestrate business intelligence pipeline workflow',
        entryNode: 'workflow-business-intelligence',
        entryLevel: 'workflow',
        isDuplicate: false,
        isWorkflow: true
      }
    ]
  }
};

// Function to update nodes file
function updateNodesFile(domain, workflows) {
  const nodesPath = path.join(__dirname, 'src', 'config', 'domains', domain, 'nodes.ts');
  
  // Read current nodes file
  let content = fs.readFileSync(nodesPath, 'utf8');
  
  // Find the closing bracket of FUNCTIONAL_NODES
  const lastBracketIndex = content.lastIndexOf('};');
  
  // Generate workflow nodes
  let workflowNodes = '\n  // WORKFLOW LEVEL - Cross-product orchestration\n';
  
  workflows.forEach(workflow => {
    workflowNodes += `  '${workflow.id}': {
    id: '${workflow.id}',
    label: '${workflow.label}',
    level: 'workflow',
    children: [${workflow.children.map(c => `'${c}'`).join(', ')}],
    parents: [],
    description: '${workflow.description}'
  },\n`;
  });
  
  // Insert before the closing bracket
  content = content.slice(0, lastBracketIndex) + ',\n' + workflowNodes + content.slice(lastBracketIndex);
  
  // Also update product nodes to include workflow children
  workflows.forEach(workflow => {
    workflow.products.forEach(product => {
      const productPattern = new RegExp(`('product-${product}':\\s*{[^}]*children:\\s*\\[)([^\\]]*)`, 'g');
      content = content.replace(productPattern, (match, prefix, children) => {
        if (!children.includes(workflow.id)) {
          const childrenArray = children ? children + ', ' : '';
          return prefix + childrenArray + `'${workflow.id}'`;
        }
        return match;
      });
    });
    
    // Update outcome parents to include workflow
    workflow.children.forEach(childId => {
      const outcomePattern = new RegExp(`('${childId}':\\s*{[^}]*parents:\\s*\\[)([^\\]]*)`, 'g');
      content = content.replace(outcomePattern, (match, prefix, parents) => {
        if (!parents.includes(workflow.id)) {
          const parentsArray = parents ? parents + ', ' : '';
          return prefix + parentsArray + `'${workflow.id}'`;
        }
        return match;
      });
    });
  });
  
  // Write back
  fs.writeFileSync(nodesPath, content);
  console.log(`✅ Updated nodes for ${domain} domain`);
}

// Function to update intents file
function updateIntentsFile(domain, intents) {
  const intentsPath = path.join(__dirname, 'src', 'config', 'domains', domain, 'intents.ts');
  
  // Read current intents file
  let content = fs.readFileSync(intentsPath, 'utf8');
  
  // Find where to insert workflow intents (before the closing bracket)
  const lastBracketIndex = content.lastIndexOf('];');
  
  // Generate workflow intents section
  let workflowIntents = ',\n\n  // ============================================\n';
  workflowIntents += '  // WORKFLOW INTENTS\n';
  workflowIntents += '  // Cross-product orchestration workflows\n';
  workflowIntents += '  // ============================================\n';
  
  intents.forEach((intent, index) => {
    if (index > 0) workflowIntents += ',\n';
    workflowIntents += `  {
    id: '${intent.id}',
    text: '${intent.text}',
    entryNode: '${intent.entryNode}',
    entryLevel: '${intent.entryLevel}' as any,
    isDuplicate: ${intent.isDuplicate},
    isWorkflow: ${intent.isWorkflow}
  }`;
  });
  
  // Insert before the closing bracket
  content = content.slice(0, lastBracketIndex) + workflowIntents + '\n' + content.slice(lastBracketIndex);
  
  // Update intent statistics
  const statsPattern = /workflow:\s*\d+/;
  const newWorkflowCount = intents.length;
  content = content.replace(statsPattern, `workflow: ${newWorkflowCount}`);
  
  // Update total count
  const totalPattern = /total:\s*(\d+)/;
  content = content.replace(totalPattern, (match, currentTotal) => {
    return `total: ${parseInt(currentTotal) + newWorkflowCount}`;
  });
  
  // Write back
  fs.writeFileSync(intentsPath, content);
  console.log(`✅ Updated intents for ${domain} domain`);
}

// Process each domain
Object.entries(domainWorkflows).forEach(([domain, config]) => {
  console.log(`\n📦 Processing ${domain} domain...`);
  
  try {
    // Backup existing files
    const nodesPath = path.join(__dirname, 'src', 'config', 'domains', domain, 'nodes.ts');
    const intentsPath = path.join(__dirname, 'src', 'config', 'domains', domain, 'intents.ts');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(nodesPath, nodesPath.replace('.ts', `.backup.${timestamp}.ts`));
    fs.copyFileSync(intentsPath, intentsPath.replace('.ts', `.backup.${timestamp}.ts`));
    
    // Update files
    updateNodesFile(domain, config.workflows);
    updateIntentsFile(domain, config.intents);
    
  } catch (error) {
    console.error(`❌ Error processing ${domain}:`, error.message);
  }
});

console.log('\n✨ Workflow addition complete!');
console.log('\nSummary:');
Object.entries(domainWorkflows).forEach(([domain, config]) => {
  console.log(`  ${domain}: ${config.workflows.length} workflows, ${config.intents.length} intents`);
});
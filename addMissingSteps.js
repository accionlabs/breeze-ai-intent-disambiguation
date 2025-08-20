// Script to add missing ServiceNow and Monitoring steps
const fs = require('fs');
const path = require('path');

// Read the nodes file
const nodesPath = path.join(__dirname, 'src/config/domains/enterprise/nodes.ts');
let nodesContent = fs.readFileSync(nodesPath, 'utf8');

// Find the location to insert new nodes (after existing steps)
const insertPoint = nodesContent.indexOf('// Action Level - Simplified');

// New ServiceNow and Monitoring steps to add
const newSteps = `
  // ServiceNow ITSM Steps
  'scenario-sla-management': {
    id: 'scenario-sla-management',
    label: 'SLA Management',
    level: 'scenario',
    products: ['servicenow'],
    parents: ['outcome-customer-support-servicenow'],
    children: ['step-define-sla', 'step-monitor-sla']
  },
  'step-define-sla': {
    id: 'step-define-sla',
    label: 'Define SLAs',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-sla-management'],
    children: ['action-define-sla-create', 'action-define-sla-configure']
  },
  'step-monitor-sla': {
    id: 'step-monitor-sla',
    label: 'Monitor SLAs',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-sla-management'],
    children: ['action-monitor-sla-track', 'action-monitor-sla-alert']
  },
  'step-create-ticket': {
    id: 'step-create-ticket',
    label: 'Create Support Ticket',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-ticket-management'],
    children: ['action-create-ticket-new', 'action-create-ticket-categorize']
  },
  'step-assign-ticket': {
    id: 'step-assign-ticket',
    label: 'Assign Ticket',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-ticket-management'],
    children: ['action-assign-ticket-route', 'action-assign-ticket-notify']
  },
  'step-create-incident': {
    id: 'step-create-incident',
    label: 'Create Incident',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-incident-management'],
    children: ['action-create-incident-new', 'action-create-incident-categorize']
  },
  'step-resolve-incident': {
    id: 'step-resolve-incident',
    label: 'Resolve Incident',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-incident-management'],
    children: ['action-resolve-incident-fix', 'action-resolve-incident-close']
  },
  'step-request-change': {
    id: 'step-request-change',
    label: 'Request Change',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-change-management-servicenow'],
    children: ['action-request-change-submit', 'action-request-change-document']
  },
  'step-approve-change': {
    id: 'step-approve-change',
    label: 'Approve Change',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-change-management-servicenow'],
    children: ['action-approve-change-review', 'action-approve-change-authorize']
  },
  'step-identify-root-cause': {
    id: 'step-identify-root-cause',
    label: 'Identify Root Cause',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-problem-management'],
    children: ['action-identify-root-cause-analyze', 'action-identify-root-cause-document']
  },
  'step-implement-fix': {
    id: 'step-implement-fix',
    label: 'Implement Fix',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-problem-management'],
    children: ['action-implement-fix-deploy', 'action-implement-fix-validate']
  },
  'step-create-kb-article': {
    id: 'step-create-kb-article',
    label: 'Create KB Article',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-knowledge-management-servicenow'],
    children: ['action-create-kb-article-write', 'action-create-kb-article-publish']
  },
  'step-search-knowledge': {
    id: 'step-search-knowledge',
    label: 'Search Knowledge Base',
    level: 'step',
    products: ['servicenow'],
    parents: ['scenario-knowledge-management-servicenow'],
    children: ['action-search-knowledge-query', 'action-search-knowledge-suggest']
  },
  
  // Monitoring Steps
  'step-collect-metrics': {
    id: 'step-collect-metrics',
    label: 'Collect Metrics',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-metrics-collection'],
    children: ['action-collect-metrics-gather', 'action-collect-metrics-store']
  },
  'step-aggregate-data': {
    id: 'step-aggregate-data',
    label: 'Aggregate Data',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-metrics-collection'],
    children: ['action-aggregate-data-combine', 'action-aggregate-data-summarize']
  },
  'step-collect-logs': {
    id: 'step-collect-logs',
    label: 'Collect Logs',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-log-aggregation'],
    children: ['action-collect-logs-gather', 'action-collect-logs-centralize']
  },
  'step-parse-logs': {
    id: 'step-parse-logs',
    label: 'Parse Logs',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-log-aggregation'],
    children: ['action-parse-logs-extract', 'action-parse-logs-structure']
  },
  'step-trace-requests': {
    id: 'step-trace-requests',
    label: 'Trace Requests',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-apm-monitoring'],
    children: ['action-trace-requests-track', 'action-trace-requests-correlate']
  },
  'step-analyze-performance': {
    id: 'step-analyze-performance',
    label: 'Analyze Performance',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-apm-monitoring'],
    children: ['action-analyze-performance-measure', 'action-analyze-performance-report']
  },
  'step-define-alerts': {
    id: 'step-define-alerts',
    label: 'Define Alerts',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-alerting-monitoring'],
    children: ['action-define-alerts-create', 'action-define-alerts-configure']
  },
  'step-notify-teams': {
    id: 'step-notify-teams',
    label: 'Notify Teams',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-alerting-monitoring'],
    children: ['action-notify-teams-send', 'action-notify-teams-escalate']
  },
  'step-forecast-usage': {
    id: 'step-forecast-usage',
    label: 'Forecast Usage',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-capacity-planning-monitoring'],
    children: ['action-forecast-usage-predict', 'action-forecast-usage-model']
  },
  'step-plan-scaling': {
    id: 'step-plan-scaling',
    label: 'Plan Scaling',
    level: 'step',
    products: ['monitoring'],
    parents: ['scenario-capacity-planning-monitoring'],
    children: ['action-plan-scaling-calculate', 'action-plan-scaling-recommend']
  },

`;

// Insert the new steps before the Action Level comment
nodesContent = nodesContent.slice(0, insertPoint) + newSteps + '\n' + nodesContent.slice(insertPoint);

// Write the updated content back
fs.writeFileSync(nodesPath, nodesContent);

console.log('✅ Added missing ServiceNow ITSM and Monitoring steps!');
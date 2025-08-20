// Script to add missing actions for ServiceNow and Monitoring steps
const fs = require('fs');
const path = require('path');

// Read the nodes file
const nodesPath = path.join(__dirname, 'src/config/domains/enterprise/nodes.ts');
let nodesContent = fs.readFileSync(nodesPath, 'utf8');

// Find the location to insert new actions (at the end, before the closing brace)
const insertPoint = nodesContent.lastIndexOf('};');

// Missing actions to add
const missingActions = `
  // Missing ServiceNow ITSM Actions
  'action-define-sla-create': {
    id: 'action-define-sla-create',
    label: 'Create SLA',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-define-sla'],
    children: []
  },
  'action-define-sla-configure': {
    id: 'action-define-sla-configure',
    label: 'Configure SLA',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-define-sla'],
    children: []
  },
  'action-monitor-sla-track': {
    id: 'action-monitor-sla-track',
    label: 'Track SLA',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-monitor-sla'],
    children: []
  },
  'action-monitor-sla-alert': {
    id: 'action-monitor-sla-alert',
    label: 'SLA Alert',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-monitor-sla'],
    children: []
  },
  'action-create-ticket-new': {
    id: 'action-create-ticket-new',
    label: 'New Ticket',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-create-ticket'],
    children: []
  },
  'action-create-ticket-categorize': {
    id: 'action-create-ticket-categorize',
    label: 'Categorize Ticket',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-create-ticket'],
    children: []
  },
  'action-assign-ticket-route': {
    id: 'action-assign-ticket-route',
    label: 'Route Ticket',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-assign-ticket'],
    children: []
  },
  'action-assign-ticket-notify': {
    id: 'action-assign-ticket-notify',
    label: 'Notify Assignee',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-assign-ticket'],
    children: []
  },
  'action-create-incident-new': {
    id: 'action-create-incident-new',
    label: 'New Incident',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-create-incident'],
    children: []
  },
  'action-create-incident-categorize': {
    id: 'action-create-incident-categorize',
    label: 'Categorize Incident',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-create-incident'],
    children: []
  },
  'action-resolve-incident-fix': {
    id: 'action-resolve-incident-fix',
    label: 'Apply Fix',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-resolve-incident'],
    children: []
  },
  'action-resolve-incident-close': {
    id: 'action-resolve-incident-close',
    label: 'Close Incident',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-resolve-incident'],
    children: []
  },
  'action-request-change-submit': {
    id: 'action-request-change-submit',
    label: 'Submit Change',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-request-change'],
    children: []
  },
  'action-request-change-document': {
    id: 'action-request-change-document',
    label: 'Document Change',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-request-change'],
    children: []
  },
  'action-approve-change-review': {
    id: 'action-approve-change-review',
    label: 'Review Change',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-approve-change'],
    children: []
  },
  'action-approve-change-authorize': {
    id: 'action-approve-change-authorize',
    label: 'Authorize Change',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-approve-change'],
    children: []
  },
  'action-identify-root-cause-analyze': {
    id: 'action-identify-root-cause-analyze',
    label: 'Analyze Cause',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-identify-root-cause'],
    children: []
  },
  'action-identify-root-cause-document': {
    id: 'action-identify-root-cause-document',
    label: 'Document Cause',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-identify-root-cause'],
    children: []
  },
  'action-implement-fix-deploy': {
    id: 'action-implement-fix-deploy',
    label: 'Deploy Fix',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-implement-fix'],
    children: []
  },
  'action-implement-fix-validate': {
    id: 'action-implement-fix-validate',
    label: 'Validate Fix',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-implement-fix'],
    children: []
  },
  'action-create-kb-article-write': {
    id: 'action-create-kb-article-write',
    label: 'Write Article',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-create-kb-article'],
    children: []
  },
  'action-create-kb-article-publish': {
    id: 'action-create-kb-article-publish',
    label: 'Publish Article',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-create-kb-article'],
    children: []
  },
  'action-search-knowledge-query': {
    id: 'action-search-knowledge-query',
    label: 'Search KB',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-search-knowledge'],
    children: []
  },
  'action-search-knowledge-suggest': {
    id: 'action-search-knowledge-suggest',
    label: 'Suggest Articles',
    level: 'action',
    products: ['servicenow'],
    parents: ['step-search-knowledge'],
    children: []
  },
  
  // Missing Monitoring Actions
  'action-collect-metrics-gather': {
    id: 'action-collect-metrics-gather',
    label: 'Gather Metrics',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-collect-metrics'],
    children: []
  },
  'action-collect-metrics-store': {
    id: 'action-collect-metrics-store',
    label: 'Store Metrics',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-collect-metrics'],
    children: []
  },
  'action-aggregate-data-combine': {
    id: 'action-aggregate-data-combine',
    label: 'Combine Data',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-aggregate-data'],
    children: []
  },
  'action-aggregate-data-summarize': {
    id: 'action-aggregate-data-summarize',
    label: 'Summarize Data',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-aggregate-data'],
    children: []
  },
  'action-collect-logs-gather': {
    id: 'action-collect-logs-gather',
    label: 'Gather Logs',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-collect-logs'],
    children: []
  },
  'action-collect-logs-centralize': {
    id: 'action-collect-logs-centralize',
    label: 'Centralize Logs',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-collect-logs'],
    children: []
  },
  'action-parse-logs-extract': {
    id: 'action-parse-logs-extract',
    label: 'Extract Fields',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-parse-logs'],
    children: []
  },
  'action-parse-logs-structure': {
    id: 'action-parse-logs-structure',
    label: 'Structure Data',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-parse-logs'],
    children: []
  },
  'action-trace-requests-track': {
    id: 'action-trace-requests-track',
    label: 'Track Request',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-trace-requests'],
    children: []
  },
  'action-trace-requests-correlate': {
    id: 'action-trace-requests-correlate',
    label: 'Correlate Traces',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-trace-requests'],
    children: []
  },
  'action-analyze-performance-measure': {
    id: 'action-analyze-performance-measure',
    label: 'Measure Performance',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-analyze-performance'],
    children: []
  },
  'action-analyze-performance-report': {
    id: 'action-analyze-performance-report',
    label: 'Performance Report',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-analyze-performance'],
    children: []
  },
  'action-define-alerts-create': {
    id: 'action-define-alerts-create',
    label: 'Create Alert',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-define-alerts'],
    children: []
  },
  'action-define-alerts-configure': {
    id: 'action-define-alerts-configure',
    label: 'Configure Alert',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-define-alerts'],
    children: []
  },
  'action-notify-teams-send': {
    id: 'action-notify-teams-send',
    label: 'Send Notification',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-notify-teams'],
    children: []
  },
  'action-notify-teams-escalate': {
    id: 'action-notify-teams-escalate',
    label: 'Escalate Alert',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-notify-teams'],
    children: []
  },
  'action-forecast-usage-predict': {
    id: 'action-forecast-usage-predict',
    label: 'Predict Usage',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-forecast-usage'],
    children: []
  },
  'action-forecast-usage-model': {
    id: 'action-forecast-usage-model',
    label: 'Model Capacity',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-forecast-usage'],
    children: []
  },
  'action-plan-scaling-calculate': {
    id: 'action-plan-scaling-calculate',
    label: 'Calculate Scaling',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-plan-scaling'],
    children: []
  },
  'action-plan-scaling-recommend': {
    id: 'action-plan-scaling-recommend',
    label: 'Recommend Scaling',
    level: 'action',
    products: ['monitoring'],
    parents: ['step-plan-scaling'],
    children: []
  }
`;

// Insert the new actions before the closing brace
nodesContent = nodesContent.slice(0, insertPoint) + ',' + missingActions + '\n' + nodesContent.slice(insertPoint);

// Write the updated content back
fs.writeFileSync(nodesPath, nodesContent);

console.log('✅ Added all missing ServiceNow and Monitoring actions!');
// Enterprise Operations domain functional hierarchy
// Demonstrates integration between packaged and custom applications
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level - Mix of packaged and custom applications
  'product-sap': {
    id: 'product-sap',
    label: 'SAP ERP',
    level: 'product',
    parents: [],
    children: ['outcome-financial-control-sap', 'outcome-supply-chain-sap']
  },
  'product-salesforce': {
    id: 'product-salesforce',
    label: 'Salesforce CRM',
    level: 'product',
    parents: [],
    children: ['outcome-sales-growth-salesforce', 'outcome-customer-service-salesforce']
  },
  'product-ms365': {
    id: 'product-ms365',
    label: 'Microsoft 365',
    level: 'product',
    parents: [],
    children: ['outcome-collaboration-ms365', 'outcome-automation-ms365']
  },
  'product-analytics': {
    id: 'product-analytics',
    label: 'Analytics Platform',
    level: 'product',
    parents: [],
    children: ['outcome-business-intelligence-analytics', 'outcome-realtime-insights-analytics']
  },
  'product-projects': {
    id: 'product-projects',
    label: 'Project Hub',
    level: 'product',
    parents: [],
    children: ['outcome-project-delivery-projects', 'outcome-resource-optimization-projects']
  },
  'product-fieldops': {
    id: 'product-fieldops',
    label: 'Field Operations',
    level: 'product',
    parents: [],
    children: ['outcome-field-service-fieldops', 'outcome-mobile-workforce-fieldops']
  },

  // Outcome Level - Product-specific outcomes (no sharing)
  // SAP outcomes
  'outcome-financial-control-sap': {
    id: 'outcome-financial-control-sap',
    label: 'Financial Control',
    level: 'outcome',
    products: ['sap'],
    parents: ['product-sap'],
    children: ['scenario-financial-reporting-sap', 'scenario-financial-reporting-shared', 'scenario-budgeting', 'scenario-compliance']
  },
  'outcome-supply-chain-sap': {
    id: 'outcome-supply-chain-sap',
    label: 'Supply Chain Excellence',
    level: 'outcome',
    products: ['sap'],
    parents: ['product-sap'],
    children: ['scenario-inventory-management', 'scenario-order-processing-sap', 'scenario-order-processing-shared', 'scenario-procurement']
  },

  // Salesforce outcomes
  'outcome-sales-growth-salesforce': {
    id: 'outcome-sales-growth-salesforce',
    label: 'Sales Growth',
    level: 'outcome',
    products: ['salesforce'],
    parents: ['product-salesforce'],
    children: ['scenario-lead-management', 'scenario-opportunity-tracking', 'scenario-customer-360-salesforce', 'scenario-customer-360-shared']
  },
  'outcome-customer-service-salesforce': {
    id: 'outcome-customer-service-salesforce',
    label: 'Customer Service Excellence',
    level: 'outcome',
    products: ['salesforce'],
    parents: ['product-salesforce'],
    children: ['scenario-case-management', 'scenario-order-processing-salesforce', 'scenario-order-processing-shared', 'scenario-knowledge-base']
  },

  // MS365 outcomes
  'outcome-collaboration-ms365': {
    id: 'outcome-collaboration-ms365',
    label: 'Team Collaboration',
    level: 'outcome',
    products: ['ms365'],
    parents: ['product-ms365'],
    children: ['scenario-team-communication', 'scenario-document-management-ms365', 'scenario-document-management-shared']
  },
  'outcome-automation-ms365': {
    id: 'outcome-automation-ms365',
    label: 'Process Automation',
    level: 'outcome',
    products: ['ms365'],
    parents: ['product-ms365'],
    children: ['scenario-workflow-automation', 'scenario-employee-management-ms365', 'scenario-employee-management-shared']
  },

  // Analytics outcomes
  'outcome-business-intelligence-analytics': {
    id: 'outcome-business-intelligence-analytics',
    label: 'Business Intelligence',
    level: 'outcome',
    products: ['analytics'],
    parents: ['product-analytics'],
    children: ['scenario-financial-reporting-analytics', 'scenario-financial-reporting-shared', 'scenario-customer-360-analytics', 'scenario-customer-360-shared']
  },
  'outcome-realtime-insights-analytics': {
    id: 'outcome-realtime-insights-analytics',
    label: 'Real-time Insights',
    level: 'outcome',
    products: ['analytics'],
    parents: ['product-analytics'],
    children: ['scenario-operational-dashboards', 'scenario-predictive-analytics']
  },

  // Projects outcomes
  'outcome-project-delivery-projects': {
    id: 'outcome-project-delivery-projects',
    label: 'Project Delivery',
    level: 'outcome',
    products: ['projects'],
    parents: ['product-projects'],
    children: ['scenario-project-planning', 'scenario-document-management-projects', 'scenario-document-management-shared', 'scenario-milestone-tracking']
  },
  'outcome-resource-optimization-projects': {
    id: 'outcome-resource-optimization-projects',
    label: 'Resource Optimization',
    level: 'outcome',
    products: ['projects'],
    parents: ['product-projects'],
    children: ['scenario-resource-allocation', 'scenario-employee-management-projects', 'scenario-employee-management-shared', 'scenario-capacity-planning']
  },

  // Field Ops outcomes
  'outcome-field-service-fieldops': {
    id: 'outcome-field-service-fieldops',
    label: 'Field Service Excellence',
    level: 'outcome',
    products: ['fieldops'],
    parents: ['product-fieldops'],
    children: ['scenario-work-order-management', 'scenario-route-optimization']
  },
  'outcome-mobile-workforce-fieldops': {
    id: 'outcome-mobile-workforce-fieldops',
    label: 'Mobile Workforce',
    level: 'outcome',
    products: ['fieldops'],
    parents: ['product-fieldops'],
    children: ['scenario-mobile-timesheet', 'scenario-employee-management-fieldops', 'scenario-employee-management-shared', 'scenario-offline-sync']
  },

  // DUPLICATE SCENARIOS - These show the overlap problems
  // Financial Reporting appears in SAP and Analytics
  'scenario-financial-reporting-sap': {
    id: 'scenario-financial-reporting-sap',
    label: 'SAP Financial Reporting',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-financial-control-sap'],
    children: ['step-generate-reports-sap', 'step-consolidate-data-sap']
  },
  'scenario-financial-reporting-analytics': {
    id: 'scenario-financial-reporting-analytics',
    label: 'Analytics Financial Reporting',
    level: 'scenario',
    products: ['analytics'],
    parents: ['outcome-business-intelligence-analytics'],
    children: ['step-create-dashboards-analytics', 'step-analyze-trends-analytics']
  },

  // Customer 360 appears in Salesforce, SAP, and Analytics
  'scenario-customer-360-salesforce': {
    id: 'scenario-customer-360-salesforce',
    label: 'Customer 360 View',
    level: 'scenario',
    products: ['salesforce'],
    parents: ['outcome-sales-growth-salesforce'],
    children: ['step-view-interactions-salesforce', 'step-track-opportunities-salesforce']
  },
  'scenario-customer-360-analytics': {
    id: 'scenario-customer-360-analytics',
    label: 'Customer 360 View',
    level: 'scenario',
    products: ['analytics'],
    parents: ['outcome-business-intelligence-analytics'],
    children: ['step-analyze-behavior-analytics', 'step-segment-customers-analytics']
  },

  // Order Processing appears in SAP and Salesforce
  'scenario-order-processing-sap': {
    id: 'scenario-order-processing-sap',
    label: 'SAP Order Processing',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-supply-chain-sap'],
    children: ['step-fulfill-order-sap', 'step-manage-inventory-sap']
  },
  'scenario-order-processing-salesforce': {
    id: 'scenario-order-processing-salesforce',
    label: 'Salesforce Order Processing',
    level: 'scenario',
    products: ['salesforce'],
    parents: ['outcome-customer-service-salesforce'],
    children: ['step-create-order-salesforce', 'step-track-order-salesforce']
  },

  // Document Management appears in MS365 and Projects
  'scenario-document-management-ms365': {
    id: 'scenario-document-management-ms365',
    label: 'Document Management',
    level: 'scenario',
    products: ['ms365'],
    parents: ['outcome-collaboration-ms365'],
    children: ['step-store-documents-ms365', 'step-share-documents-ms365']
  },
  'scenario-document-management-projects': {
    id: 'scenario-document-management-projects',
    label: 'Document Management',
    level: 'scenario',
    products: ['projects'],
    parents: ['outcome-project-delivery-projects'],
    children: ['step-manage-deliverables-projects', 'step-version-control-projects']
  },

  // Employee Management appears in MS365, Projects, and Field Ops
  'scenario-employee-management-ms365': {
    id: 'scenario-employee-management-ms365',
    label: 'Employee Management',
    level: 'scenario',
    products: ['ms365'],
    parents: ['outcome-automation-ms365'],
    children: ['step-manage-users-ms365', 'step-provision-access-ms365']
  },
  'scenario-employee-management-projects': {
    id: 'scenario-employee-management-projects',
    label: 'Employee Management',
    level: 'scenario',
    products: ['projects'],
    parents: ['outcome-resource-optimization-projects'],
    children: ['step-assign-resources-projects', 'step-track-availability-projects']
  },
  'scenario-employee-management-fieldops': {
    id: 'scenario-employee-management-fieldops',
    label: 'Employee Management',
    level: 'scenario',
    products: ['fieldops'],
    parents: ['outcome-mobile-workforce-fieldops'],
    children: ['step-schedule-technicians-fieldops', 'step-track-location-fieldops']
  },

  // SHARED SCENARIOS - Created through rationalization
  'scenario-financial-reporting-shared': {
    id: 'scenario-financial-reporting-shared',
    label: 'Unified Financial Reporting',
    level: 'scenario',
    products: ['sap', 'analytics'],
    parents: ['outcome-financial-control-sap', 'outcome-business-intelligence-analytics'],
    children: ['step-financial-reporting-unified']
  },
  'scenario-customer-360-shared': {
    id: 'scenario-customer-360-shared',
    label: 'Customer 360 View',
    level: 'scenario',
    products: ['salesforce', 'analytics'],
    parents: ['outcome-sales-growth-salesforce', 'outcome-business-intelligence-analytics'],
    children: ['step-customer-360-unified']
  },
  'scenario-order-processing-shared': {
    id: 'scenario-order-processing-shared',
    label: 'End-to-End Order Processing',
    level: 'scenario',
    products: ['salesforce', 'sap'],
    parents: ['outcome-customer-service-salesforce', 'outcome-supply-chain-sap'],
    children: ['step-order-processing-unified']
  },
  'scenario-document-management-shared': {
    id: 'scenario-document-management-shared',
    label: 'Unified Document Management',
    level: 'scenario',
    products: ['ms365', 'projects'],
    parents: ['outcome-collaboration-ms365', 'outcome-project-delivery-projects'],
    children: ['step-document-management-unified']
  },
  'scenario-employee-management-shared': {
    id: 'scenario-employee-management-shared',
    label: 'Unified Employee Management',
    level: 'scenario',
    products: ['ms365', 'projects', 'fieldops'],
    parents: ['outcome-automation-ms365', 'outcome-resource-optimization-projects', 'outcome-mobile-workforce-fieldops'],
    children: ['step-employee-management-unified']
  },

  // Unique scenarios (no overlap)
  'scenario-budgeting': {
    id: 'scenario-budgeting',
    label: 'Budget Planning',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-financial-control-sap'],
    children: ['step-create-budget', 'step-track-variance']
  },
  'scenario-compliance': {
    id: 'scenario-compliance',
    label: 'Regulatory Compliance',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-financial-control-sap'],
    children: ['step-audit-trail', 'step-generate-compliance-reports']
  },
  'scenario-lead-management': {
    id: 'scenario-lead-management',
    label: 'Lead Management',
    level: 'scenario',
    products: ['salesforce'],
    parents: ['outcome-sales-growth-salesforce'],
    children: ['step-capture-leads', 'step-qualify-leads']
  },
  'scenario-opportunity-tracking': {
    id: 'scenario-opportunity-tracking',
    label: 'Opportunity Tracking',
    level: 'scenario',
    products: ['salesforce'],
    parents: ['outcome-sales-growth-salesforce'],
    children: ['step-create-opportunity', 'step-update-pipeline']
  },
  'scenario-case-management': {
    id: 'scenario-case-management',
    label: 'Case Management',
    level: 'scenario',
    products: ['salesforce'],
    parents: ['outcome-customer-service-salesforce'],
    children: ['step-create-case', 'step-resolve-case']
  },
  'scenario-team-communication': {
    id: 'scenario-team-communication',
    label: 'Team Communication',
    level: 'scenario',
    products: ['ms365'],
    parents: ['outcome-collaboration-ms365'],
    children: ['step-chat-messaging', 'step-video-meetings']
  },
  'scenario-workflow-automation': {
    id: 'scenario-workflow-automation',
    label: 'Workflow Automation',
    level: 'scenario',
    products: ['ms365'],
    parents: ['outcome-automation-ms365'],
    children: ['step-create-flows', 'step-trigger-actions']
  },
  'scenario-operational-dashboards': {
    id: 'scenario-operational-dashboards',
    label: 'Operational Dashboards',
    level: 'scenario',
    products: ['analytics'],
    parents: ['outcome-realtime-insights-analytics'],
    children: ['step-monitor-kpis', 'step-alert-anomalies']
  },
  'scenario-predictive-analytics': {
    id: 'scenario-predictive-analytics',
    label: 'Predictive Analytics',
    level: 'scenario',
    products: ['analytics'],
    parents: ['outcome-realtime-insights-analytics'],
    children: ['step-build-models', 'step-generate-forecasts']
  },
  'scenario-project-planning': {
    id: 'scenario-project-planning',
    label: 'Project Planning',
    level: 'scenario',
    products: ['projects'],
    parents: ['outcome-project-delivery-projects'],
    children: ['step-define-scope', 'step-create-schedule']
  },
  'scenario-resource-allocation': {
    id: 'scenario-resource-allocation',
    label: 'Resource Allocation',
    level: 'scenario',
    products: ['projects'],
    parents: ['outcome-resource-optimization-projects'],
    children: ['step-assign-team', 'step-balance-workload']
  },
  'scenario-work-order-management': {
    id: 'scenario-work-order-management',
    label: 'Work Order Management',
    level: 'scenario',
    products: ['fieldops'],
    parents: ['outcome-field-service-fieldops'],
    children: ['step-create-work-order', 'step-dispatch-technician']
  },
  'scenario-route-optimization': {
    id: 'scenario-route-optimization',
    label: 'Route Optimization',
    level: 'scenario',
    products: ['fieldops'],
    parents: ['outcome-field-service-fieldops'],
    children: ['step-plan-routes', 'step-optimize-travel']
  },

  // Step Level - Simplified for brevity
  // Financial reporting steps
  'step-generate-reports-sap': {
    id: 'step-generate-reports-sap',
    label: 'Generate Financial Reports',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-financial-reporting-sap'],
    children: ['action-run-report-sap', 'action-export-data-sap']
  },
  'step-consolidate-data-sap': {
    id: 'step-consolidate-data-sap',
    label: 'Consolidate Financial Data',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-financial-reporting-sap'],
    children: ['action-aggregate-accounts-sap', 'action-validate-balances-sap']
  },
  'step-create-dashboards-analytics': {
    id: 'step-create-dashboards-analytics',
    label: 'Create Dashboards',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-financial-reporting-analytics'],
    children: ['action-design-layout-analytics', 'action-add-widgets-analytics']
  },
  'step-analyze-trends-analytics': {
    id: 'step-analyze-trends-analytics',
    label: 'Analyze Trends',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-financial-reporting-analytics'],
    children: ['action-identify-patterns-analytics', 'action-forecast-metrics-analytics']
  },

  // Unified steps for rationalization
  'step-financial-reporting-unified': {
    id: 'step-financial-reporting-unified',
    label: 'Generate Unified Reports',
    level: 'step',
    products: ['sap', 'analytics'],
    parents: ['scenario-financial-reporting-shared'],
    children: ['action-financial-reporting-execute-shared', 'action-financial-reporting-validate-shared']
  },
  'step-customer-360-unified': {
    id: 'step-customer-360-unified',
    label: 'Complete Customer View',
    level: 'step',
    products: ['salesforce', 'analytics'],
    parents: ['scenario-customer-360-shared'],
    children: ['action-customer-360-execute-shared', 'action-customer-360-sync-shared']
  },
  'step-order-processing-unified': {
    id: 'step-order-processing-unified',
    label: 'Integrated Order Processing',
    level: 'step',
    products: ['salesforce', 'sap'],
    parents: ['scenario-order-processing-shared'],
    children: ['action-order-processing-execute-shared', 'action-order-processing-fulfill-shared']
  },
  'step-document-management-unified': {
    id: 'step-document-management-unified',
    label: 'Centralized Document Management',
    level: 'step',
    products: ['ms365', 'projects'],
    parents: ['scenario-document-management-shared'],
    children: ['action-document-management-store-shared', 'action-document-management-share-shared']
  },
  'step-employee-management-unified': {
    id: 'step-employee-management-unified',
    label: 'Integrated Employee Management',
    level: 'step',
    products: ['ms365', 'projects', 'fieldops'],
    parents: ['scenario-employee-management-shared'],
    children: ['action-employee-management-assign-shared', 'action-employee-management-track-shared']
  },

  // Other necessary steps (simplified list)
  'step-create-budget': {
    id: 'step-create-budget',
    label: 'Create Budget',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-budgeting'],
    children: ['action-create-budget-define', 'action-create-budget-approve']
  },
  'step-track-variance': {
    id: 'step-track-variance',
    label: 'Track Variance',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-budgeting'],
    children: ['action-track-variance-analyze', 'action-track-variance-report']
  },
  'step-audit-trail': {
    id: 'step-audit-trail',
    label: 'Maintain Audit Trail',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-compliance'],
    children: ['action-audit-trail-log', 'action-audit-trail-review']
  },
  'step-generate-compliance-reports': {
    id: 'step-generate-compliance-reports',
    label: 'Generate Compliance Reports',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-compliance'],
    children: ['action-compliance-reports-generate', 'action-compliance-reports-submit']
  },
  'step-capture-leads': {
    id: 'step-capture-leads',
    label: 'Capture Leads',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-lead-management'],
    children: ['action-capture-leads-create', 'action-capture-leads-import']
  },
  'step-qualify-leads': {
    id: 'step-qualify-leads',
    label: 'Qualify Leads',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-lead-management'],
    children: ['action-qualify-leads-score', 'action-qualify-leads-convert']
  },
  'step-create-opportunity': {
    id: 'step-create-opportunity',
    label: 'Create Opportunity',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-opportunity-tracking'],
    children: ['action-create-opportunity-new', 'action-create-opportunity-assign']
  },
  'step-update-pipeline': {
    id: 'step-update-pipeline',
    label: 'Update Pipeline',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-opportunity-tracking'],
    children: ['action-update-pipeline-stage', 'action-update-pipeline-forecast']
  },
  'step-create-case': {
    id: 'step-create-case',
    label: 'Create Case',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-case-management'],
    children: ['action-create-case-new', 'action-create-case-assign']
  },
  'step-resolve-case': {
    id: 'step-resolve-case',
    label: 'Resolve Case',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-case-management'],
    children: ['action-resolve-case-solution', 'action-resolve-case-close']
  },
  'step-chat-messaging': {
    id: 'step-chat-messaging',
    label: 'Chat Messaging',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-team-communication'],
    children: ['action-chat-messaging-send', 'action-chat-messaging-create']
  },
  'step-video-meetings': {
    id: 'step-video-meetings',
    label: 'Video Meetings',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-team-communication'],
    children: ['action-video-meetings-schedule', 'action-video-meetings-join']
  },
  'step-create-flows': {
    id: 'step-create-flows',
    label: 'Create Flows',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-workflow-automation'],
    children: ['action-create-flows-design', 'action-create-flows-test']
  },
  'step-trigger-actions': {
    id: 'step-trigger-actions',
    label: 'Trigger Actions',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-workflow-automation'],
    children: ['action-trigger-actions-execute', 'action-trigger-actions-monitor']
  },
  'step-monitor-kpis': {
    id: 'step-monitor-kpis',
    label: 'Monitor KPIs',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-operational-dashboards'],
    children: ['action-monitor-kpis-track', 'action-monitor-kpis-dashboard']
  },
  'step-alert-anomalies': {
    id: 'step-alert-anomalies',
    label: 'Alert on Anomalies',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-operational-dashboards'],
    children: ['action-alert-anomalies-detect', 'action-alert-anomalies-notify']
  },
  'step-build-models': {
    id: 'step-build-models',
    label: 'Build Predictive Models',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-predictive-analytics'],
    children: ['action-build-models-train', 'action-build-models-validate']
  },
  'step-generate-forecasts': {
    id: 'step-generate-forecasts',
    label: 'Generate Forecasts',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-predictive-analytics'],
    children: ['action-generate-forecasts-run', 'action-generate-forecasts-export']
  },
  'step-define-scope': {
    id: 'step-define-scope',
    label: 'Define Scope',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-project-planning'],
    children: ['action-define-scope-document', 'action-define-scope-approve']
  },
  'step-create-schedule': {
    id: 'step-create-schedule',
    label: 'Create Schedule',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-project-planning'],
    children: ['action-create-schedule-tasks', 'action-create-schedule-timeline']
  },
  'step-assign-team': {
    id: 'step-assign-team',
    label: 'Assign Team',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-resource-allocation'],
    children: ['action-assign-team-members', 'action-assign-team-roles']
  },
  'step-balance-workload': {
    id: 'step-balance-workload',
    label: 'Balance Workload',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-resource-allocation'],
    children: ['action-balance-workload-analyze', 'action-balance-workload-adjust']
  },
  'step-create-work-order': {
    id: 'step-create-work-order',
    label: 'Create Work Order',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-work-order-management'],
    children: ['action-create-work-order-new', 'action-create-work-order-schedule']
  },
  'step-dispatch-technician': {
    id: 'step-dispatch-technician',
    label: 'Dispatch Technician',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-work-order-management'],
    children: ['action-dispatch-technician-assign', 'action-dispatch-technician-notify']
  },
  'step-plan-routes': {
    id: 'step-plan-routes',
    label: 'Plan Routes',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-route-optimization'],
    children: ['action-plan-routes-optimize', 'action-plan-routes-map']
  },
  'step-optimize-travel': {
    id: 'step-optimize-travel',
    label: 'Optimize Travel',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-route-optimization'],
    children: ['action-optimize-travel-calculate', 'action-optimize-travel-reroute']
  },

  // Additional steps for duplicate scenarios
  'step-view-interactions-salesforce': {
    id: 'step-view-interactions-salesforce',
    label: 'View Customer Interactions',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-customer-360-salesforce'],
    children: ['action-view-interactions-history', 'action-view-interactions-timeline']
  },
  'step-track-opportunities-salesforce': {
    id: 'step-track-opportunities-salesforce',
    label: 'Track Opportunities',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-customer-360-salesforce'],
    children: ['action-track-opportunities-pipeline', 'action-track-opportunities-forecast']
  },
  'step-analyze-behavior-analytics': {
    id: 'step-analyze-behavior-analytics',
    label: 'Analyze Customer Behavior',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-customer-360-analytics'],
    children: ['action-analyze-behavior-patterns', 'action-analyze-behavior-score']
  },
  'step-segment-customers-analytics': {
    id: 'step-segment-customers-analytics',
    label: 'Segment Customers',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-customer-360-analytics'],
    children: ['action-segment-customers-create', 'action-segment-customers-analyze']
  },
  'step-fulfill-order-sap': {
    id: 'step-fulfill-order-sap',
    label: 'Fulfill Order',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-order-processing-sap'],
    children: ['action-fulfill-order-ship', 'action-fulfill-order-track']
  },
  'step-manage-inventory-sap': {
    id: 'step-manage-inventory-sap',
    label: 'Manage Inventory',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-order-processing-sap'],
    children: ['action-manage-inventory-check', 'action-manage-inventory-update']
  },
  'step-create-order-salesforce': {
    id: 'step-create-order-salesforce',
    label: 'Create Order',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-order-processing-salesforce'],
    children: ['action-create-order-new', 'action-create-order-validate']
  },
  'step-track-order-salesforce': {
    id: 'step-track-order-salesforce',
    label: 'Track Order',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-order-processing-salesforce'],
    children: ['action-view-order-status-salesforce', 'action-check-shipment-salesforce']
  },
  'step-store-documents-ms365': {
    id: 'step-store-documents-ms365',
    label: 'Store Documents',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-document-management-ms365'],
    children: ['action-store-documents-upload', 'action-store-documents-organize']
  },
  'step-share-documents-ms365': {
    id: 'step-share-documents-ms365',
    label: 'Share Documents',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-document-management-ms365'],
    children: ['action-share-documents-grant', 'action-share-documents-link']
  },
  'step-manage-deliverables-projects': {
    id: 'step-manage-deliverables-projects',
    label: 'Manage Deliverables',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-document-management-projects'],
    children: ['action-manage-deliverables-track', 'action-manage-deliverables-approve']
  },
  'step-version-control-projects': {
    id: 'step-version-control-projects',
    label: 'Version Control',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-document-management-projects'],
    children: ['action-version-control-commit', 'action-version-control-tag']
  },
  'step-manage-users-ms365': {
    id: 'step-manage-users-ms365',
    label: 'Manage Users',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-employee-management-ms365'],
    children: ['action-manage-users-create', 'action-manage-users-update']
  },
  'step-provision-access-ms365': {
    id: 'step-provision-access-ms365',
    label: 'Provision Access',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-employee-management-ms365'],
    children: ['action-provision-access-grant', 'action-provision-access-revoke']
  },
  'step-assign-resources-projects': {
    id: 'step-assign-resources-projects',
    label: 'Assign Resources',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-employee-management-projects'],
    children: ['action-assign-resources-allocate', 'action-assign-resources-schedule']
  },
  'step-track-availability-projects': {
    id: 'step-track-availability-projects',
    label: 'Track Availability',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-employee-management-projects'],
    children: ['action-track-availability-check', 'action-track-availability-update']
  },
  'step-schedule-technicians-fieldops': {
    id: 'step-schedule-technicians-fieldops',
    label: 'Schedule Technicians',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-employee-management-fieldops'],
    children: ['action-schedule-technicians-assign', 'action-schedule-technicians-optimize']
  },
  'step-track-location-fieldops': {
    id: 'step-track-location-fieldops',
    label: 'Track Location',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-employee-management-fieldops'],
    children: ['action-track-location-gps', 'action-track-location-update']
  },
  'scenario-inventory-management': {
    id: 'scenario-inventory-management',
    label: 'Inventory Management',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-supply-chain-sap'],
    children: ['step-track-stock', 'step-reorder-items']
  },
  'step-track-stock': {
    id: 'step-track-stock',
    label: 'Track Stock Levels',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-inventory-management'],
    children: ['action-track-stock-monitor', 'action-track-stock-alert']
  },
  'step-reorder-items': {
    id: 'step-reorder-items',
    label: 'Reorder Items',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-inventory-management'],
    children: ['action-reorder-items-create', 'action-reorder-items-approve']
  },
  'scenario-procurement': {
    id: 'scenario-procurement',
    label: 'Procurement',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-supply-chain-sap'],
    children: ['step-create-purchase-order', 'step-manage-vendors']
  },
  'step-create-purchase-order': {
    id: 'step-create-purchase-order',
    label: 'Create Purchase Order',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-procurement'],
    children: ['action-create-purchase-order-new', 'action-create-purchase-order-send']
  },
  'step-manage-vendors': {
    id: 'step-manage-vendors',
    label: 'Manage Vendors',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-procurement'],
    children: ['action-manage-vendors-add', 'action-manage-vendors-evaluate']
  },
  'scenario-knowledge-base': {
    id: 'scenario-knowledge-base',
    label: 'Knowledge Base',
    level: 'scenario',
    products: ['salesforce'],
    parents: ['outcome-customer-service-salesforce'],
    children: ['step-create-articles', 'step-search-solutions']
  },
  'step-create-articles': {
    id: 'step-create-articles',
    label: 'Create Articles',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-knowledge-base'],
    children: ['action-create-articles-write', 'action-create-articles-publish']
  },
  'step-search-solutions': {
    id: 'step-search-solutions',
    label: 'Search Solutions',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-knowledge-base'],
    children: ['action-search-solutions-query', 'action-search-solutions-suggest']
  },
  'scenario-milestone-tracking': {
    id: 'scenario-milestone-tracking',
    label: 'Milestone Tracking',
    level: 'scenario',
    products: ['projects'],
    parents: ['outcome-project-delivery-projects'],
    children: ['step-set-milestones', 'step-track-progress']
  },
  'step-set-milestones': {
    id: 'step-set-milestones',
    label: 'Set Milestones',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-milestone-tracking'],
    children: ['action-set-milestones-define', 'action-set-milestones-schedule']
  },
  'step-track-progress': {
    id: 'step-track-progress',
    label: 'Track Progress',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-milestone-tracking'],
    children: ['action-track-progress-update', 'action-track-progress-report']
  },
  'scenario-capacity-planning': {
    id: 'scenario-capacity-planning',
    label: 'Capacity Planning',
    level: 'scenario',
    products: ['projects'],
    parents: ['outcome-resource-optimization-projects'],
    children: ['step-forecast-demand', 'step-allocate-capacity']
  },
  'step-forecast-demand': {
    id: 'step-forecast-demand',
    label: 'Forecast Demand',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-capacity-planning'],
    children: ['action-forecast-demand-analyze', 'action-forecast-demand-predict']
  },
  'step-allocate-capacity': {
    id: 'step-allocate-capacity',
    label: 'Allocate Capacity',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-capacity-planning'],
    children: ['action-allocate-capacity-assign', 'action-allocate-capacity-balance']
  },
  'scenario-mobile-timesheet': {
    id: 'scenario-mobile-timesheet',
    label: 'Mobile Timesheet',
    level: 'scenario',
    products: ['fieldops'],
    parents: ['outcome-mobile-workforce-fieldops'],
    children: ['step-log-time', 'step-submit-timesheet']
  },
  'step-log-time': {
    id: 'step-log-time',
    label: 'Log Time',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-mobile-timesheet'],
    children: ['action-log-time-enter', 'action-log-time-save']
  },
  'step-submit-timesheet': {
    id: 'step-submit-timesheet',
    label: 'Submit Timesheet',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-mobile-timesheet'],
    children: ['action-submit-timesheet-review', 'action-submit-timesheet-submit']
  },
  'scenario-offline-sync': {
    id: 'scenario-offline-sync',
    label: 'Offline Sync',
    level: 'scenario',
    products: ['fieldops'],
    parents: ['outcome-mobile-workforce-fieldops'],
    children: ['step-cache-data', 'step-sync-changes']
  },
  'step-cache-data': {
    id: 'step-cache-data',
    label: 'Cache Data',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-offline-sync'],
    children: ['action-cache-data-store', 'action-cache-data-update']
  },
  'step-sync-changes': {
    id: 'step-sync-changes',
    label: 'Sync Changes',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-offline-sync'],
    children: ['action-sync-changes-upload', 'action-sync-changes-merge']
  },

  // Action Level - Simplified (only a few examples)
  'action-run-report-sap': {
    id: 'action-run-report-sap',
    label: 'Run Report',
    level: 'action',
    products: ['sap'],
    parents: ['step-generate-reports-sap'],
    children: []
  },
  'action-export-data-sap': {
    id: 'action-export-data-sap',
    label: 'Export Data',
    level: 'action',
    products: ['sap'],
    parents: ['step-generate-reports-sap'],
    children: []
  },
  'action-aggregate-accounts-sap': {
    id: 'action-aggregate-accounts-sap',
    label: 'Aggregate Accounts',
    level: 'action',
    products: ['sap'],
    parents: ['step-consolidate-data-sap'],
    children: []
  },
  'action-validate-balances-sap': {
    id: 'action-validate-balances-sap',
    label: 'Validate Balances',
    level: 'action',
    products: ['sap'],
    parents: ['step-consolidate-data-sap'],
    children: []
  },
  'action-design-layout-analytics': {
    id: 'action-design-layout-analytics',
    label: 'Design Layout',
    level: 'action',
    products: ['analytics'],
    parents: ['step-create-dashboards-analytics'],
    children: []
  },
  'action-add-widgets-analytics': {
    id: 'action-add-widgets-analytics',
    label: 'Add Widgets',
    level: 'action',
    products: ['analytics'],
    parents: ['step-create-dashboards-analytics'],
    children: []
  },
  'action-identify-patterns-analytics': {
    id: 'action-identify-patterns-analytics',
    label: 'Identify Patterns',
    level: 'action',
    products: ['analytics'],
    parents: ['step-analyze-trends-analytics'],
    children: []
  },
  'action-forecast-metrics-analytics': {
    id: 'action-forecast-metrics-analytics',
    label: 'Forecast Metrics',
    level: 'action',
    products: ['analytics'],
    parents: ['step-analyze-trends-analytics'],
    children: []
  },
  
  // Salesforce Actions
  'action-view-order-status-salesforce': {
    id: 'action-view-order-status-salesforce',
    label: 'View Order Status',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-track-order-salesforce'],
    children: []
  },
  'action-check-shipment-salesforce': {
    id: 'action-check-shipment-salesforce',
    label: 'Check Shipment',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-track-order-salesforce'],
    children: []
  }
,

  // === GENERATED ACTIONS ===

  // Unified step actions
  'action-financial-reporting-execute-shared': {
    id: 'action-financial-reporting-execute-shared',
    label: 'Execute Unified Reporting',
    level: 'action',
    products: ['sap', 'analytics'],
    parents: ['step-financial-reporting-unified'],
    children: []
  },
  'action-financial-reporting-validate-shared': {
    id: 'action-financial-reporting-validate-shared',
    label: 'Validate Reports',
    level: 'action',
    products: ['sap', 'analytics'],
    parents: ['step-financial-reporting-unified'],
    children: []
  },
  'action-customer-360-execute-shared': {
    id: 'action-customer-360-execute-shared',
    label: 'Build Customer View',
    level: 'action',
    products: ['salesforce', 'analytics'],
    parents: ['step-customer-360-unified'],
    children: []
  },
  'action-customer-360-sync-shared': {
    id: 'action-customer-360-sync-shared',
    label: 'Sync Customer Data',
    level: 'action',
    products: ['salesforce', 'analytics'],
    parents: ['step-customer-360-unified'],
    children: []
  },
  'action-order-processing-execute-shared': {
    id: 'action-order-processing-execute-shared',
    label: 'Process Order',
    level: 'action',
    products: ['salesforce', 'sap'],
    parents: ['step-order-processing-unified'],
    children: []
  },
  'action-order-processing-fulfill-shared': {
    id: 'action-order-processing-fulfill-shared',
    label: 'Fulfill Order',
    level: 'action',
    products: ['salesforce', 'sap'],
    parents: ['step-order-processing-unified'],
    children: []
  },
  'action-document-management-store-shared': {
    id: 'action-document-management-store-shared',
    label: 'Store Document',
    level: 'action',
    products: ['ms365', 'projects'],
    parents: ['step-document-management-unified'],
    children: []
  },
  'action-document-management-share-shared': {
    id: 'action-document-management-share-shared',
    label: 'Share Document',
    level: 'action',
    products: ['ms365', 'projects'],
    parents: ['step-document-management-unified'],
    children: []
  },
  'action-employee-management-assign-shared': {
    id: 'action-employee-management-assign-shared',
    label: 'Assign Employee',
    level: 'action',
    products: ['ms365', 'projects', 'fieldops'],
    parents: ['step-employee-management-unified'],
    children: []
  },
  'action-employee-management-track-shared': {
    id: 'action-employee-management-track-shared',
    label: 'Track Employee',
    level: 'action',
    products: ['ms365', 'projects', 'fieldops'],
    parents: ['step-employee-management-unified'],
    children: []
  },
  
  // SAP Budget actions
  'action-create-budget-define': {
    id: 'action-create-budget-define',
    label: 'Define Budget',
    level: 'action',
    products: ['sap'],
    parents: ['step-create-budget'],
    children: []
  },
  'action-create-budget-approve': {
    id: 'action-create-budget-approve',
    label: 'Approve Budget',
    level: 'action',
    products: ['sap'],
    parents: ['step-create-budget'],
    children: []
  },
  'action-track-variance-analyze': {
    id: 'action-track-variance-analyze',
    label: 'Analyze Variance',
    level: 'action',
    products: ['sap'],
    parents: ['step-track-variance'],
    children: []
  },
  'action-track-variance-report': {
    id: 'action-track-variance-report',
    label: 'Report Variance',
    level: 'action',
    products: ['sap'],
    parents: ['step-track-variance'],
    children: []
  },
  
  // Compliance actions
  'action-audit-trail-log': {
    id: 'action-audit-trail-log',
    label: 'Log Audit Event',
    level: 'action',
    products: ['sap'],
    parents: ['step-audit-trail'],
    children: []
  },
  'action-audit-trail-review': {
    id: 'action-audit-trail-review',
    label: 'Review Audit Trail',
    level: 'action',
    products: ['sap'],
    parents: ['step-audit-trail'],
    children: []
  },
  'action-compliance-reports-generate': {
    id: 'action-compliance-reports-generate',
    label: 'Generate Report',
    level: 'action',
    products: ['sap'],
    parents: ['step-generate-compliance-reports'],
    children: []
  },
  'action-compliance-reports-submit': {
    id: 'action-compliance-reports-submit',
    label: 'Submit Report',
    level: 'action',
    products: ['sap'],
    parents: ['step-generate-compliance-reports'],
    children: []
  },
  
  // Salesforce Lead actions
  'action-capture-leads-create': {
    id: 'action-capture-leads-create',
    label: 'Create Lead',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-capture-leads'],
    children: []
  },
  'action-capture-leads-import': {
    id: 'action-capture-leads-import',
    label: 'Import Leads',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-capture-leads'],
    children: []
  },
  'action-qualify-leads-score': {
    id: 'action-qualify-leads-score',
    label: 'Score Lead',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-qualify-leads'],
    children: []
  },
  'action-qualify-leads-convert': {
    id: 'action-qualify-leads-convert',
    label: 'Convert Lead',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-qualify-leads'],
    children: []
  },
  
  // Opportunity actions
  'action-create-opportunity-new': {
    id: 'action-create-opportunity-new',
    label: 'New Opportunity',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-opportunity'],
    children: []
  },
  'action-create-opportunity-assign': {
    id: 'action-create-opportunity-assign',
    label: 'Assign Owner',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-opportunity'],
    children: []
  },
  'action-update-pipeline-stage': {
    id: 'action-update-pipeline-stage',
    label: 'Update Stage',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-update-pipeline'],
    children: []
  },
  'action-update-pipeline-forecast': {
    id: 'action-update-pipeline-forecast',
    label: 'Update Forecast',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-update-pipeline'],
    children: []
  },
  
  // Case actions
  'action-create-case-new': {
    id: 'action-create-case-new',
    label: 'New Case',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-case'],
    children: []
  },
  'action-create-case-assign': {
    id: 'action-create-case-assign',
    label: 'Assign Case',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-case'],
    children: []
  },
  'action-resolve-case-solution': {
    id: 'action-resolve-case-solution',
    label: 'Apply Solution',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-resolve-case'],
    children: []
  },
  'action-resolve-case-close': {
    id: 'action-resolve-case-close',
    label: 'Close Case',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-resolve-case'],
    children: []
  },
  
  // MS365 Communication actions
  'action-chat-messaging-send': {
    id: 'action-chat-messaging-send',
    label: 'Send Message',
    level: 'action',
    products: ['ms365'],
    parents: ['step-chat-messaging'],
    children: []
  },
  'action-chat-messaging-create': {
    id: 'action-chat-messaging-create',
    label: 'Create Channel',
    level: 'action',
    products: ['ms365'],
    parents: ['step-chat-messaging'],
    children: []
  },
  'action-video-meetings-schedule': {
    id: 'action-video-meetings-schedule',
    label: 'Schedule Meeting',
    level: 'action',
    products: ['ms365'],
    parents: ['step-video-meetings'],
    children: []
  },
  'action-video-meetings-join': {
    id: 'action-video-meetings-join',
    label: 'Join Meeting',
    level: 'action',
    products: ['ms365'],
    parents: ['step-video-meetings'],
    children: []
  },
  
  // Workflow actions
  'action-create-flows-design': {
    id: 'action-create-flows-design',
    label: 'Design Flow',
    level: 'action',
    products: ['ms365'],
    parents: ['step-create-flows'],
    children: []
  },
  'action-create-flows-test': {
    id: 'action-create-flows-test',
    label: 'Test Flow',
    level: 'action',
    products: ['ms365'],
    parents: ['step-create-flows'],
    children: []
  },
  'action-trigger-actions-execute': {
    id: 'action-trigger-actions-execute',
    label: 'Execute Action',
    level: 'action',
    products: ['ms365'],
    parents: ['step-trigger-actions'],
    children: []
  },
  'action-trigger-actions-monitor': {
    id: 'action-trigger-actions-monitor',
    label: 'Monitor Execution',
    level: 'action',
    products: ['ms365'],
    parents: ['step-trigger-actions'],
    children: []
  },
  
  // Analytics KPI actions
  'action-monitor-kpis-track': {
    id: 'action-monitor-kpis-track',
    label: 'Track KPIs',
    level: 'action',
    products: ['analytics'],
    parents: ['step-monitor-kpis'],
    children: []
  },
  'action-monitor-kpis-dashboard': {
    id: 'action-monitor-kpis-dashboard',
    label: 'View Dashboard',
    level: 'action',
    products: ['analytics'],
    parents: ['step-monitor-kpis'],
    children: []
  },
  'action-alert-anomalies-detect': {
    id: 'action-alert-anomalies-detect',
    label: 'Detect Anomaly',
    level: 'action',
    products: ['analytics'],
    parents: ['step-alert-anomalies'],
    children: []
  },
  'action-alert-anomalies-notify': {
    id: 'action-alert-anomalies-notify',
    label: 'Send Alert',
    level: 'action',
    products: ['analytics'],
    parents: ['step-alert-anomalies'],
    children: []
  },
  
  // Predictive Analytics actions
  'action-build-models-train': {
    id: 'action-build-models-train',
    label: 'Train Model',
    level: 'action',
    products: ['analytics'],
    parents: ['step-build-models'],
    children: []
  },
  'action-build-models-validate': {
    id: 'action-build-models-validate',
    label: 'Validate Model',
    level: 'action',
    products: ['analytics'],
    parents: ['step-build-models'],
    children: []
  },
  'action-generate-forecasts-run': {
    id: 'action-generate-forecasts-run',
    label: 'Run Forecast',
    level: 'action',
    products: ['analytics'],
    parents: ['step-generate-forecasts'],
    children: []
  },
  'action-generate-forecasts-export': {
    id: 'action-generate-forecasts-export',
    label: 'Export Results',
    level: 'action',
    products: ['analytics'],
    parents: ['step-generate-forecasts'],
    children: []
  },
  
  // Project Planning actions
  'action-define-scope-document': {
    id: 'action-define-scope-document',
    label: 'Document Scope',
    level: 'action',
    products: ['projects'],
    parents: ['step-define-scope'],
    children: []
  },
  'action-define-scope-approve': {
    id: 'action-define-scope-approve',
    label: 'Approve Scope',
    level: 'action',
    products: ['projects'],
    parents: ['step-define-scope'],
    children: []
  },
  'action-create-schedule-tasks': {
    id: 'action-create-schedule-tasks',
    label: 'Define Tasks',
    level: 'action',
    products: ['projects'],
    parents: ['step-create-schedule'],
    children: []
  },
  'action-create-schedule-timeline': {
    id: 'action-create-schedule-timeline',
    label: 'Set Timeline',
    level: 'action',
    products: ['projects'],
    parents: ['step-create-schedule'],
    children: []
  },
  
  // Resource actions
  'action-assign-team-members': {
    id: 'action-assign-team-members',
    label: 'Assign Members',
    level: 'action',
    products: ['projects'],
    parents: ['step-assign-team'],
    children: []
  },
  'action-assign-team-roles': {
    id: 'action-assign-team-roles',
    label: 'Define Roles',
    level: 'action',
    products: ['projects'],
    parents: ['step-assign-team'],
    children: []
  },
  'action-balance-workload-analyze': {
    id: 'action-balance-workload-analyze',
    label: 'Analyze Load',
    level: 'action',
    products: ['projects'],
    parents: ['step-balance-workload'],
    children: []
  },
  'action-balance-workload-adjust': {
    id: 'action-balance-workload-adjust',
    label: 'Adjust Allocation',
    level: 'action',
    products: ['projects'],
    parents: ['step-balance-workload'],
    children: []
  },
  
  // Field Ops actions
  'action-create-work-order-new': {
    id: 'action-create-work-order-new',
    label: 'New Work Order',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-create-work-order'],
    children: []
  },
  'action-create-work-order-schedule': {
    id: 'action-create-work-order-schedule',
    label: 'Schedule Work',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-create-work-order'],
    children: []
  },
  'action-dispatch-technician-assign': {
    id: 'action-dispatch-technician-assign',
    label: 'Assign Technician',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-dispatch-technician'],
    children: []
  },
  'action-dispatch-technician-notify': {
    id: 'action-dispatch-technician-notify',
    label: 'Notify Technician',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-dispatch-technician'],
    children: []
  },
  'action-plan-routes-optimize': {
    id: 'action-plan-routes-optimize',
    label: 'Optimize Route',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-plan-routes'],
    children: []
  },
  'action-plan-routes-map': {
    id: 'action-plan-routes-map',
    label: 'Map Route',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-plan-routes'],
    children: []
  },
  'action-optimize-travel-calculate': {
    id: 'action-optimize-travel-calculate',
    label: 'Calculate Time',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-optimize-travel'],
    children: []
  },
  'action-optimize-travel-reroute': {
    id: 'action-optimize-travel-reroute',
    label: 'Suggest Reroute',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-optimize-travel'],
    children: []
  },
  
  // Additional step actions
  'action-view-interactions-history': {
    id: 'action-view-interactions-history',
    label: 'View History',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-view-interactions-salesforce'],
    children: []
  },
  'action-view-interactions-timeline': {
    id: 'action-view-interactions-timeline',
    label: 'View Timeline',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-view-interactions-salesforce'],
    children: []
  },
  'action-track-opportunities-pipeline': {
    id: 'action-track-opportunities-pipeline',
    label: 'View Pipeline',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-track-opportunities-salesforce'],
    children: []
  },
  'action-track-opportunities-forecast': {
    id: 'action-track-opportunities-forecast',
    label: 'View Forecast',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-track-opportunities-salesforce'],
    children: []
  },
  'action-analyze-behavior-patterns': {
    id: 'action-analyze-behavior-patterns',
    label: 'Find Patterns',
    level: 'action',
    products: ['analytics'],
    parents: ['step-analyze-behavior-analytics'],
    children: []
  },
  'action-analyze-behavior-score': {
    id: 'action-analyze-behavior-score',
    label: 'Score Behavior',
    level: 'action',
    products: ['analytics'],
    parents: ['step-analyze-behavior-analytics'],
    children: []
  },
  'action-segment-customers-create': {
    id: 'action-segment-customers-create',
    label: 'Create Segment',
    level: 'action',
    products: ['analytics'],
    parents: ['step-segment-customers-analytics'],
    children: []
  },
  'action-segment-customers-analyze': {
    id: 'action-segment-customers-analyze',
    label: 'Analyze Segment',
    level: 'action',
    products: ['analytics'],
    parents: ['step-segment-customers-analytics'],
    children: []
  },
  'action-fulfill-order-ship': {
    id: 'action-fulfill-order-ship',
    label: 'Ship Order',
    level: 'action',
    products: ['sap'],
    parents: ['step-fulfill-order-sap'],
    children: []
  },
  'action-fulfill-order-track': {
    id: 'action-fulfill-order-track',
    label: 'Track Shipment',
    level: 'action',
    products: ['sap'],
    parents: ['step-fulfill-order-sap'],
    children: []
  },
  'action-manage-inventory-check': {
    id: 'action-manage-inventory-check',
    label: 'Check Stock',
    level: 'action',
    products: ['sap'],
    parents: ['step-manage-inventory-sap'],
    children: []
  },
  'action-manage-inventory-update': {
    id: 'action-manage-inventory-update',
    label: 'Update Stock',
    level: 'action',
    products: ['sap'],
    parents: ['step-manage-inventory-sap'],
    children: []
  },
  'action-create-order-new': {
    id: 'action-create-order-new',
    label: 'New Order',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-order-salesforce'],
    children: []
  },
  'action-create-order-validate': {
    id: 'action-create-order-validate',
    label: 'Validate Order',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-order-salesforce'],
    children: []
  },
  'action-store-documents-upload': {
    id: 'action-store-documents-upload',
    label: 'Upload Document',
    level: 'action',
    products: ['ms365'],
    parents: ['step-store-documents-ms365'],
    children: []
  },
  'action-store-documents-organize': {
    id: 'action-store-documents-organize',
    label: 'Organize Files',
    level: 'action',
    products: ['ms365'],
    parents: ['step-store-documents-ms365'],
    children: []
  },
  'action-share-documents-grant': {
    id: 'action-share-documents-grant',
    label: 'Grant Access',
    level: 'action',
    products: ['ms365'],
    parents: ['step-share-documents-ms365'],
    children: []
  },
  'action-share-documents-link': {
    id: 'action-share-documents-link',
    label: 'Create Link',
    level: 'action',
    products: ['ms365'],
    parents: ['step-share-documents-ms365'],
    children: []
  },
  'action-manage-deliverables-track': {
    id: 'action-manage-deliverables-track',
    label: 'Track Deliverable',
    level: 'action',
    products: ['projects'],
    parents: ['step-manage-deliverables-projects'],
    children: []
  },
  'action-manage-deliverables-approve': {
    id: 'action-manage-deliverables-approve',
    label: 'Approve Deliverable',
    level: 'action',
    products: ['projects'],
    parents: ['step-manage-deliverables-projects'],
    children: []
  },
  'action-version-control-commit': {
    id: 'action-version-control-commit',
    label: 'Commit Version',
    level: 'action',
    products: ['projects'],
    parents: ['step-version-control-projects'],
    children: []
  },
  'action-version-control-tag': {
    id: 'action-version-control-tag',
    label: 'Tag Release',
    level: 'action',
    products: ['projects'],
    parents: ['step-version-control-projects'],
    children: []
  },
  'action-manage-users-create': {
    id: 'action-manage-users-create',
    label: 'Create User',
    level: 'action',
    products: ['ms365'],
    parents: ['step-manage-users-ms365'],
    children: []
  },
  'action-manage-users-update': {
    id: 'action-manage-users-update',
    label: 'Update User',
    level: 'action',
    products: ['ms365'],
    parents: ['step-manage-users-ms365'],
    children: []
  },
  'action-provision-access-grant': {
    id: 'action-provision-access-grant',
    label: 'Grant User Access',
    level: 'action',
    products: ['ms365'],
    parents: ['step-provision-access-ms365'],
    children: []
  },
  'action-provision-access-revoke': {
    id: 'action-provision-access-revoke',
    label: 'Revoke Access',
    level: 'action',
    products: ['ms365'],
    parents: ['step-provision-access-ms365'],
    children: []
  },
  'action-assign-resources-allocate': {
    id: 'action-assign-resources-allocate',
    label: 'Allocate Resource',
    level: 'action',
    products: ['projects'],
    parents: ['step-assign-resources-projects'],
    children: []
  },
  'action-assign-resources-schedule': {
    id: 'action-assign-resources-schedule',
    label: 'Schedule Resource',
    level: 'action',
    products: ['projects'],
    parents: ['step-assign-resources-projects'],
    children: []
  },
  'action-track-availability-check': {
    id: 'action-track-availability-check',
    label: 'Check Availability',
    level: 'action',
    products: ['projects'],
    parents: ['step-track-availability-projects'],
    children: []
  },
  'action-track-availability-update': {
    id: 'action-track-availability-update',
    label: 'Update Calendar',
    level: 'action',
    products: ['projects'],
    parents: ['step-track-availability-projects'],
    children: []
  },
  'action-schedule-technicians-assign': {
    id: 'action-schedule-technicians-assign',
    label: 'Assign Schedule',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-schedule-technicians-fieldops'],
    children: []
  },
  'action-schedule-technicians-optimize': {
    id: 'action-schedule-technicians-optimize',
    label: 'Optimize Schedule',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-schedule-technicians-fieldops'],
    children: []
  },
  'action-track-location-gps': {
    id: 'action-track-location-gps',
    label: 'Track GPS',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-track-location-fieldops'],
    children: []
  },
  'action-track-location-update': {
    id: 'action-track-location-update',
    label: 'Update Location',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-track-location-fieldops'],
    children: []
  },
  'action-track-stock-monitor': {
    id: 'action-track-stock-monitor',
    label: 'Monitor Levels',
    level: 'action',
    products: ['sap'],
    parents: ['step-track-stock'],
    children: []
  },
  'action-track-stock-alert': {
    id: 'action-track-stock-alert',
    label: 'Stock Alert',
    level: 'action',
    products: ['sap'],
    parents: ['step-track-stock'],
    children: []
  },
  'action-reorder-items-create': {
    id: 'action-reorder-items-create',
    label: 'Create Reorder',
    level: 'action',
    products: ['sap'],
    parents: ['step-reorder-items'],
    children: []
  },
  'action-reorder-items-approve': {
    id: 'action-reorder-items-approve',
    label: 'Approve Reorder',
    level: 'action',
    products: ['sap'],
    parents: ['step-reorder-items'],
    children: []
  },
  'action-create-purchase-order-new': {
    id: 'action-create-purchase-order-new',
    label: 'New PO',
    level: 'action',
    products: ['sap'],
    parents: ['step-create-purchase-order'],
    children: []
  },
  'action-create-purchase-order-send': {
    id: 'action-create-purchase-order-send',
    label: 'Send PO',
    level: 'action',
    products: ['sap'],
    parents: ['step-create-purchase-order'],
    children: []
  },
  'action-manage-vendors-add': {
    id: 'action-manage-vendors-add',
    label: 'Add Vendor',
    level: 'action',
    products: ['sap'],
    parents: ['step-manage-vendors'],
    children: []
  },
  'action-manage-vendors-evaluate': {
    id: 'action-manage-vendors-evaluate',
    label: 'Evaluate Vendor',
    level: 'action',
    products: ['sap'],
    parents: ['step-manage-vendors'],
    children: []
  },
  'action-create-articles-write': {
    id: 'action-create-articles-write',
    label: 'Write Article',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-articles'],
    children: []
  },
  'action-create-articles-publish': {
    id: 'action-create-articles-publish',
    label: 'Publish Article',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-create-articles'],
    children: []
  },
  'action-search-solutions-query': {
    id: 'action-search-solutions-query',
    label: 'Search KB',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-search-solutions'],
    children: []
  },
  'action-search-solutions-suggest': {
    id: 'action-search-solutions-suggest',
    label: 'Suggest Solution',
    level: 'action',
    products: ['salesforce'],
    parents: ['step-search-solutions'],
    children: []
  },
  'action-set-milestones-define': {
    id: 'action-set-milestones-define',
    label: 'Define Milestone',
    level: 'action',
    products: ['projects'],
    parents: ['step-set-milestones'],
    children: []
  },
  'action-set-milestones-schedule': {
    id: 'action-set-milestones-schedule',
    label: 'Schedule Milestone',
    level: 'action',
    products: ['projects'],
    parents: ['step-set-milestones'],
    children: []
  },
  'action-track-progress-update': {
    id: 'action-track-progress-update',
    label: 'Update Progress',
    level: 'action',
    products: ['projects'],
    parents: ['step-track-progress'],
    children: []
  },
  'action-track-progress-report': {
    id: 'action-track-progress-report',
    label: 'Report Status',
    level: 'action',
    products: ['projects'],
    parents: ['step-track-progress'],
    children: []
  },
  'action-forecast-demand-analyze': {
    id: 'action-forecast-demand-analyze',
    label: 'Analyze Demand',
    level: 'action',
    products: ['projects'],
    parents: ['step-forecast-demand'],
    children: []
  },
  'action-forecast-demand-predict': {
    id: 'action-forecast-demand-predict',
    label: 'Predict Demand',
    level: 'action',
    products: ['projects'],
    parents: ['step-forecast-demand'],
    children: []
  },
  'action-allocate-capacity-assign': {
    id: 'action-allocate-capacity-assign',
    label: 'Assign Capacity',
    level: 'action',
    products: ['projects'],
    parents: ['step-allocate-capacity'],
    children: []
  },
  'action-allocate-capacity-balance': {
    id: 'action-allocate-capacity-balance',
    label: 'Balance Load',
    level: 'action',
    products: ['projects'],
    parents: ['step-allocate-capacity'],
    children: []
  },
  'action-log-time-enter': {
    id: 'action-log-time-enter',
    label: 'Enter Time',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-log-time'],
    children: []
  },
  'action-log-time-save': {
    id: 'action-log-time-save',
    label: 'Save Entry',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-log-time'],
    children: []
  },
  'action-submit-timesheet-review': {
    id: 'action-submit-timesheet-review',
    label: 'Review Timesheet',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-submit-timesheet'],
    children: []
  },
  'action-submit-timesheet-submit': {
    id: 'action-submit-timesheet-submit',
    label: 'Submit Timesheet',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-submit-timesheet'],
    children: []
  },
  'action-cache-data-store': {
    id: 'action-cache-data-store',
    label: 'Store Offline',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-cache-data'],
    children: []
  },
  'action-cache-data-update': {
    id: 'action-cache-data-update',
    label: 'Update Cache',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-cache-data'],
    children: []
  },
  'action-sync-changes-upload': {
    id: 'action-sync-changes-upload',
    label: 'Upload Changes',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-sync-changes'],
    children: []
  },
  'action-sync-changes-merge': {
    id: 'action-sync-changes-merge',
    label: 'Merge Data',
    level: 'action',
    products: ['fieldops'],
    parents: ['step-sync-changes'],
    children: []
  }

};
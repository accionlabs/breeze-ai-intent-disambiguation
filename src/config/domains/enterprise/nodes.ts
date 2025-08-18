// Enterprise Operations domain functional hierarchy
// Demonstrates integration between packaged and custom applications
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level - Mix of packaged and custom applications
  'product-sap': {
    id: 'product-sap',
    label: 'SAP ERP',
    level: 'product',
    products: ['sap'],
    parents: [],
    children: ['outcome-financial-control-sap', 'outcome-supply-chain-sap']
  },
  'product-salesforce': {
    id: 'product-salesforce',
    label: 'Salesforce CRM',
    level: 'product',
    products: ['salesforce'],
    parents: [],
    children: ['outcome-sales-growth-salesforce', 'outcome-customer-service-salesforce']
  },
  'product-ms365': {
    id: 'product-ms365',
    label: 'Microsoft 365',
    level: 'product',
    products: ['ms365'],
    parents: [],
    children: ['outcome-collaboration-ms365', 'outcome-automation-ms365']
  },
  'product-analytics': {
    id: 'product-analytics',
    label: 'Analytics Platform',
    level: 'product',
    products: ['analytics'],
    parents: [],
    children: ['outcome-business-intelligence-analytics', 'outcome-realtime-insights-analytics']
  },
  'product-projects': {
    id: 'product-projects',
    label: 'Project Hub',
    level: 'product',
    products: ['projects'],
    parents: [],
    children: ['outcome-project-delivery-projects', 'outcome-resource-optimization-projects']
  },
  'product-fieldops': {
    id: 'product-fieldops',
    label: 'Field Operations',
    level: 'product',
    products: ['fieldops'],
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
    label: 'Financial Reporting',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-financial-control-sap'],
    children: ['step-generate-reports-sap', 'step-consolidate-data-sap']
  },
  'scenario-financial-reporting-analytics': {
    id: 'scenario-financial-reporting-analytics',
    label: 'Financial Reporting',
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
    label: 'Order Processing',
    level: 'scenario',
    products: ['sap'],
    parents: ['outcome-supply-chain-sap'],
    children: ['step-fulfill-order-sap', 'step-manage-inventory-sap']
  },
  'scenario-order-processing-salesforce': {
    id: 'scenario-order-processing-salesforce',
    label: 'Order Processing',
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
    label: 'Unified Customer View',
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
    label: 'Unified Financial Reporting',
    level: 'step',
    products: ['sap', 'analytics'],
    parents: ['scenario-financial-reporting-shared'],
    children: []
  },
  'step-customer-360-unified': {
    id: 'step-customer-360-unified',
    label: 'Complete Customer View',
    level: 'step',
    products: ['salesforce', 'analytics'],
    parents: ['scenario-customer-360-shared'],
    children: []
  },
  'step-order-processing-unified': {
    id: 'step-order-processing-unified',
    label: 'Integrated Order Processing',
    level: 'step',
    products: ['salesforce', 'sap'],
    parents: ['scenario-order-processing-shared'],
    children: []
  },
  'step-document-management-unified': {
    id: 'step-document-management-unified',
    label: 'Centralized Document Management',
    level: 'step',
    products: ['ms365', 'projects'],
    parents: ['scenario-document-management-shared'],
    children: []
  },
  'step-employee-management-unified': {
    id: 'step-employee-management-unified',
    label: 'Integrated Employee Management',
    level: 'step',
    products: ['ms365', 'projects', 'fieldops'],
    parents: ['scenario-employee-management-shared'],
    children: []
  },

  // Other necessary steps (simplified list)
  'step-create-budget': {
    id: 'step-create-budget',
    label: 'Create Budget',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-budgeting'],
    children: []
  },
  'step-track-variance': {
    id: 'step-track-variance',
    label: 'Track Variance',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-budgeting'],
    children: []
  },
  'step-audit-trail': {
    id: 'step-audit-trail',
    label: 'Maintain Audit Trail',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-compliance'],
    children: []
  },
  'step-generate-compliance-reports': {
    id: 'step-generate-compliance-reports',
    label: 'Generate Compliance Reports',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-compliance'],
    children: []
  },
  'step-capture-leads': {
    id: 'step-capture-leads',
    label: 'Capture Leads',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-lead-management'],
    children: []
  },
  'step-qualify-leads': {
    id: 'step-qualify-leads',
    label: 'Qualify Leads',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-lead-management'],
    children: []
  },
  'step-create-opportunity': {
    id: 'step-create-opportunity',
    label: 'Create Opportunity',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-opportunity-tracking'],
    children: []
  },
  'step-update-pipeline': {
    id: 'step-update-pipeline',
    label: 'Update Pipeline',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-opportunity-tracking'],
    children: []
  },
  'step-create-case': {
    id: 'step-create-case',
    label: 'Create Case',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-case-management'],
    children: []
  },
  'step-resolve-case': {
    id: 'step-resolve-case',
    label: 'Resolve Case',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-case-management'],
    children: []
  },
  'step-chat-messaging': {
    id: 'step-chat-messaging',
    label: 'Chat Messaging',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-team-communication'],
    children: []
  },
  'step-video-meetings': {
    id: 'step-video-meetings',
    label: 'Video Meetings',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-team-communication'],
    children: []
  },
  'step-create-flows': {
    id: 'step-create-flows',
    label: 'Create Flows',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-workflow-automation'],
    children: []
  },
  'step-trigger-actions': {
    id: 'step-trigger-actions',
    label: 'Trigger Actions',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-workflow-automation'],
    children: []
  },
  'step-monitor-kpis': {
    id: 'step-monitor-kpis',
    label: 'Monitor KPIs',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-operational-dashboards'],
    children: []
  },
  'step-alert-anomalies': {
    id: 'step-alert-anomalies',
    label: 'Alert on Anomalies',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-operational-dashboards'],
    children: []
  },
  'step-build-models': {
    id: 'step-build-models',
    label: 'Build Predictive Models',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-predictive-analytics'],
    children: []
  },
  'step-generate-forecasts': {
    id: 'step-generate-forecasts',
    label: 'Generate Forecasts',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-predictive-analytics'],
    children: []
  },
  'step-define-scope': {
    id: 'step-define-scope',
    label: 'Define Scope',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-project-planning'],
    children: []
  },
  'step-create-schedule': {
    id: 'step-create-schedule',
    label: 'Create Schedule',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-project-planning'],
    children: []
  },
  'step-assign-team': {
    id: 'step-assign-team',
    label: 'Assign Team',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-resource-allocation'],
    children: []
  },
  'step-balance-workload': {
    id: 'step-balance-workload',
    label: 'Balance Workload',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-resource-allocation'],
    children: []
  },
  'step-create-work-order': {
    id: 'step-create-work-order',
    label: 'Create Work Order',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-work-order-management'],
    children: []
  },
  'step-dispatch-technician': {
    id: 'step-dispatch-technician',
    label: 'Dispatch Technician',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-work-order-management'],
    children: []
  },
  'step-plan-routes': {
    id: 'step-plan-routes',
    label: 'Plan Routes',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-route-optimization'],
    children: []
  },
  'step-optimize-travel': {
    id: 'step-optimize-travel',
    label: 'Optimize Travel',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-route-optimization'],
    children: []
  },

  // Additional steps for duplicate scenarios
  'step-view-interactions-salesforce': {
    id: 'step-view-interactions-salesforce',
    label: 'View Customer Interactions',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-customer-360-salesforce'],
    children: []
  },
  'step-track-opportunities-salesforce': {
    id: 'step-track-opportunities-salesforce',
    label: 'Track Opportunities',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-customer-360-salesforce'],
    children: []
  },
  'step-analyze-behavior-analytics': {
    id: 'step-analyze-behavior-analytics',
    label: 'Analyze Customer Behavior',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-customer-360-analytics'],
    children: []
  },
  'step-segment-customers-analytics': {
    id: 'step-segment-customers-analytics',
    label: 'Segment Customers',
    level: 'step',
    products: ['analytics'],
    parents: ['scenario-customer-360-analytics'],
    children: []
  },
  'step-fulfill-order-sap': {
    id: 'step-fulfill-order-sap',
    label: 'Fulfill Order',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-order-processing-sap'],
    children: []
  },
  'step-manage-inventory-sap': {
    id: 'step-manage-inventory-sap',
    label: 'Manage Inventory',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-order-processing-sap'],
    children: []
  },
  'step-create-order-salesforce': {
    id: 'step-create-order-salesforce',
    label: 'Create Order',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-order-processing-salesforce'],
    children: []
  },
  'step-track-order-salesforce': {
    id: 'step-track-order-salesforce',
    label: 'Track Order',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-order-processing-salesforce'],
    children: []
  },
  'step-store-documents-ms365': {
    id: 'step-store-documents-ms365',
    label: 'Store Documents',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-document-management-ms365'],
    children: []
  },
  'step-share-documents-ms365': {
    id: 'step-share-documents-ms365',
    label: 'Share Documents',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-document-management-ms365'],
    children: []
  },
  'step-manage-deliverables-projects': {
    id: 'step-manage-deliverables-projects',
    label: 'Manage Deliverables',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-document-management-projects'],
    children: []
  },
  'step-version-control-projects': {
    id: 'step-version-control-projects',
    label: 'Version Control',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-document-management-projects'],
    children: []
  },
  'step-manage-users-ms365': {
    id: 'step-manage-users-ms365',
    label: 'Manage Users',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-employee-management-ms365'],
    children: []
  },
  'step-provision-access-ms365': {
    id: 'step-provision-access-ms365',
    label: 'Provision Access',
    level: 'step',
    products: ['ms365'],
    parents: ['scenario-employee-management-ms365'],
    children: []
  },
  'step-assign-resources-projects': {
    id: 'step-assign-resources-projects',
    label: 'Assign Resources',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-employee-management-projects'],
    children: []
  },
  'step-track-availability-projects': {
    id: 'step-track-availability-projects',
    label: 'Track Availability',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-employee-management-projects'],
    children: []
  },
  'step-schedule-technicians-fieldops': {
    id: 'step-schedule-technicians-fieldops',
    label: 'Schedule Technicians',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-employee-management-fieldops'],
    children: []
  },
  'step-track-location-fieldops': {
    id: 'step-track-location-fieldops',
    label: 'Track Location',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-employee-management-fieldops'],
    children: []
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
    children: []
  },
  'step-reorder-items': {
    id: 'step-reorder-items',
    label: 'Reorder Items',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-inventory-management'],
    children: []
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
    children: []
  },
  'step-manage-vendors': {
    id: 'step-manage-vendors',
    label: 'Manage Vendors',
    level: 'step',
    products: ['sap'],
    parents: ['scenario-procurement'],
    children: []
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
    children: []
  },
  'step-search-solutions': {
    id: 'step-search-solutions',
    label: 'Search Solutions',
    level: 'step',
    products: ['salesforce'],
    parents: ['scenario-knowledge-base'],
    children: []
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
    children: []
  },
  'step-track-progress': {
    id: 'step-track-progress',
    label: 'Track Progress',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-milestone-tracking'],
    children: []
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
    children: []
  },
  'step-allocate-capacity': {
    id: 'step-allocate-capacity',
    label: 'Allocate Capacity',
    level: 'step',
    products: ['projects'],
    parents: ['scenario-capacity-planning'],
    children: []
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
    children: []
  },
  'step-submit-timesheet': {
    id: 'step-submit-timesheet',
    label: 'Submit Timesheet',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-mobile-timesheet'],
    children: []
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
    children: []
  },
  'step-sync-changes': {
    id: 'step-sync-changes',
    label: 'Sync Changes',
    level: 'step',
    products: ['fieldops'],
    parents: ['scenario-offline-sync'],
    children: []
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
  }
};
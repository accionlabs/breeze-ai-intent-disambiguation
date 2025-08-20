// Healthcare domain - Demonstrates both unique and shared functionality
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level
  'product-ehr': {
    id: 'product-ehr',
    label: 'EHR System',
    level: 'product',
    parents: [],
    children: ['outcome-clinical-care', 'outcome-patient-records', 'workflow-patient-admission', 'workflow-emergency-response', 'workflow-chronic-care']
  },
  'product-pharmacy': {
    id: 'product-pharmacy',
    label: 'PharmaCare',
    level: 'product',
    parents: [],
    children: ['outcome-medication-management', 'outcome-drug-safety', 'workflow-patient-admission', 'workflow-emergency-response', 'workflow-chronic-care']
  },

  // Outcome Level - EHR
  'outcome-clinical-care': {
    id: 'outcome-clinical-care',
    label: 'Clinical Care',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr', 'workflow-emergency-response', 'workflow-chronic-care'],
    children: ['scenario-patient-monitoring-ehr', 'scenario-diagnosis-support']
  },
  'outcome-patient-records': {
    id: 'outcome-patient-records',
    label: 'Patient Records Management',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr', 'workflow-patient-admission', 'workflow-chronic-care'],
    children: ['scenario-medical-history', 'scenario-lab-results']
  },

  // Outcome Level - Pharmacy
  'outcome-medication-management': {
    id: 'outcome-medication-management',
    label: 'Medication Management',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-patient-monitoring-pharmacy', 'scenario-prescription-fulfillment']
  },
  'outcome-drug-safety': {
    id: 'outcome-drug-safety',
    label: 'Drug Safety',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-drug-interactions', 'scenario-inventory-control']
  },

  // ========= UNIQUE SCENARIOS - EHR ONLY =========
  'scenario-diagnosis-support': {
    id: 'scenario-diagnosis-support',
    label: 'Diagnosis Support',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-care'],
    children: ['step-analyze-symptoms', 'step-suggest-diagnosis']
  },
  'scenario-medical-history': {
    id: 'scenario-medical-history',
    label: 'Medical History',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-records'],
    children: ['step-document-visit', 'step-update-conditions']
  },
  'scenario-lab-results': {
    id: 'scenario-lab-results',
    label: 'Lab Results Management',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-records'],
    children: ['step-order-tests', 'step-review-results']
  },

  // ========= UNIQUE SCENARIOS - PHARMACY ONLY =========
  'scenario-prescription-fulfillment': {
    id: 'scenario-prescription-fulfillment',
    label: 'Prescription Fulfillment',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-management'],
    children: ['step-verify-prescription', 'step-dispense-medication']
  },
  'scenario-drug-interactions': {
    id: 'scenario-drug-interactions',
    label: 'Drug Interaction Checking',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-drug-safety'],
    children: ['step-check-interactions', 'step-alert-contraindications']
  },
  'scenario-inventory-control': {
    id: 'scenario-inventory-control',
    label: 'Inventory Control',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-drug-safety'],
    children: ['step-track-inventory', 'step-manage-expiration']
  },

  // ========= DUPLICATE SCENARIOS (for rationalization) =========
  'scenario-patient-monitoring-ehr': {
    id: 'scenario-patient-monitoring-ehr',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-care'],
    children: ['step-track-vitals-ehr', 'step-alert-providers-ehr']
  },
  'scenario-patient-monitoring-pharmacy': {
    id: 'scenario-patient-monitoring-pharmacy',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-management'],
    children: ['step-track-adherence-pharmacy', 'step-alert-providers-pharmacy']
  },

  // Shared Scenario (rationalization)

  // ========= UNIQUE STEPS - EHR ONLY =========
  'step-analyze-symptoms': {
    id: 'step-analyze-symptoms',
    label: 'Analyze Symptoms',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-diagnosis-support'],
    children: ['action-capture-symptoms', 'action-run-assessment']
  },
  'step-suggest-diagnosis': {
    id: 'step-suggest-diagnosis',
    label: 'Suggest Diagnosis',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-diagnosis-support'],
    children: ['action-generate-differential', 'action-recommend-tests']
  },
  'step-document-visit': {
    id: 'step-document-visit',
    label: 'Document Visit',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-medical-history'],
    children: ['action-create-note', 'action-add-diagnosis-code']
  },
  'step-update-conditions': {
    id: 'step-update-conditions',
    label: 'Update Conditions',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-medical-history'],
    children: ['action-add-condition', 'action-update-severity']
  },
  'step-order-tests': {
    id: 'step-order-tests',
    label: 'Order Tests',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-lab-results'],
    children: ['action-select-tests', 'action-submit-order']
  },
  'step-review-results': {
    id: 'step-review-results',
    label: 'Review Results',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-lab-results'],
    children: ['action-view-results', 'action-flag-abnormal']
  },

  // ========= UNIQUE STEPS - PHARMACY ONLY =========
  'step-verify-prescription': {
    id: 'step-verify-prescription',
    label: 'Verify Prescription',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-fulfillment'],
    children: ['action-check-authenticity', 'action-verify-dosage']
  },
  'step-dispense-medication': {
    id: 'step-dispense-medication',
    label: 'Dispense Medication',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-fulfillment'],
    children: ['action-prepare-medication', 'action-label-instructions']
  },
  'step-check-interactions': {
    id: 'step-check-interactions',
    label: 'Check Interactions',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-drug-interactions'],
    children: ['action-analyze-medications', 'action-identify-conflicts']
  },
  'step-alert-contraindications': {
    id: 'step-alert-contraindications',
    label: 'Alert Contraindications',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-drug-interactions'],
    children: ['action-notify-pharmacist', 'action-suggest-alternatives']
  },
  'step-track-inventory': {
    id: 'step-track-inventory',
    label: 'Track Inventory',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-inventory-control'],
    children: ['action-monitor-stock', 'action-reorder-drugs']
  },
  'step-manage-expiration': {
    id: 'step-manage-expiration',
    label: 'Manage Expiration',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-inventory-control'],
    children: ['action-check-dates', 'action-rotate-stock']
  },

  // ========= DUPLICATE STEPS (for rationalization) =========
  'step-track-vitals-ehr': {
    id: 'step-track-vitals-ehr',
    label: 'Track Vital Signs',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr'],
    children: ['action-record-vitals-ehr', 'action-monitor-trends-ehr']
  },
  'step-alert-providers-ehr': {
    id: 'step-alert-providers-ehr',
    label: 'Alert Providers',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr'],
    children: ['action-send-alert-ehr', 'action-escalate-urgent-ehr']
  },
  'step-track-adherence-pharmacy': {
    id: 'step-track-adherence-pharmacy',
    label: 'Track Adherence',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy'],
    children: ['action-monitor-refills-pharmacy', 'action-calculate-compliance-pharmacy']
  },
  'step-alert-providers-pharmacy': {
    id: 'step-alert-providers-pharmacy',
    label: 'Alert Providers',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy'],
    children: ['action-send-alert-pharmacy', 'action-escalate-urgent-pharmacy']
  },

  // Unified Steps

  // ========= UNIQUE ACTIONS - EHR ONLY =========
  'action-capture-symptoms': {
    id: 'action-capture-symptoms',
    label: 'Capture Symptoms',
    level: 'action',
    products: ['ehr'],
    parents: ['step-analyze-symptoms'],
    children: []
  },
  'action-run-assessment': {
    id: 'action-run-assessment',
    label: 'Run Assessment',
    level: 'action',
    products: ['ehr'],
    parents: ['step-analyze-symptoms'],
    children: []
  },
  'action-generate-differential': {
    id: 'action-generate-differential',
    label: 'Generate Differential',
    level: 'action',
    products: ['ehr'],
    parents: ['step-suggest-diagnosis'],
    children: []
  },
  'action-recommend-tests': {
    id: 'action-recommend-tests',
    label: 'Recommend Tests',
    level: 'action',
    products: ['ehr'],
    parents: ['step-suggest-diagnosis'],
    children: []
  },
  'action-create-note': {
    id: 'action-create-note',
    label: 'Create Note',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-visit'],
    children: []
  },
  'action-add-diagnosis-code': {
    id: 'action-add-diagnosis-code',
    label: 'Add Diagnosis Code',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-visit'],
    children: []
  },
  'action-add-condition': {
    id: 'action-add-condition',
    label: 'Add Condition',
    level: 'action',
    products: ['ehr'],
    parents: ['step-update-conditions'],
    children: []
  },
  'action-update-severity': {
    id: 'action-update-severity',
    label: 'Update Severity',
    level: 'action',
    products: ['ehr'],
    parents: ['step-update-conditions'],
    children: []
  },
  'action-select-tests': {
    id: 'action-select-tests',
    label: 'Select Tests',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests'],
    children: []
  },
  'action-submit-order': {
    id: 'action-submit-order',
    label: 'Submit Order',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests'],
    children: []
  },
  'action-view-results': {
    id: 'action-view-results',
    label: 'View Results',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-results'],
    children: []
  },
  'action-flag-abnormal': {
    id: 'action-flag-abnormal',
    label: 'Flag Abnormal',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-results'],
    children: []
  },

  // ========= UNIQUE ACTIONS - PHARMACY ONLY =========
  'action-check-authenticity': {
    id: 'action-check-authenticity',
    label: 'Check Authenticity',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-verify-prescription'],
    children: []
  },
  'action-verify-dosage': {
    id: 'action-verify-dosage',
    label: 'Verify Dosage',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-verify-prescription'],
    children: []
  },
  'action-prepare-medication': {
    id: 'action-prepare-medication',
    label: 'Prepare Medication',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-dispense-medication'],
    children: []
  },
  'action-label-instructions': {
    id: 'action-label-instructions',
    label: 'Label Instructions',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-dispense-medication'],
    children: []
  },
  'action-analyze-medications': {
    id: 'action-analyze-medications',
    label: 'Analyze Medications',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-check-interactions'],
    children: []
  },
  'action-identify-conflicts': {
    id: 'action-identify-conflicts',
    label: 'Identify Conflicts',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-check-interactions'],
    children: []
  },
  'action-notify-pharmacist': {
    id: 'action-notify-pharmacist',
    label: 'Notify Pharmacist',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-alert-contraindications'],
    children: []
  },
  'action-suggest-alternatives': {
    id: 'action-suggest-alternatives',
    label: 'Suggest Alternatives',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-alert-contraindications'],
    children: []
  },
  'action-monitor-stock': {
    id: 'action-monitor-stock',
    label: 'Monitor Stock',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-inventory'],
    children: []
  },
  'action-reorder-drugs': {
    id: 'action-reorder-drugs',
    label: 'Reorder Drugs',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-inventory'],
    children: []
  },
  'action-check-dates': {
    id: 'action-check-dates',
    label: 'Check Dates',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-manage-expiration'],
    children: []
  },
  'action-rotate-stock': {
    id: 'action-rotate-stock',
    label: 'Rotate Stock',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-manage-expiration'],
    children: []
  },

  // ========= DUPLICATE ACTIONS (for rationalization) =========
  'action-record-vitals-ehr': {
    id: 'action-record-vitals-ehr',
    label: 'Record Vitals',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr'],
    children: []
  },
  'action-monitor-trends-ehr': {
    id: 'action-monitor-trends-ehr',
    label: 'Monitor Trends',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr'],
    children: []
  },
  'action-send-alert-ehr': {
    id: 'action-send-alert-ehr',
    label: 'Send Alert',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr'],
    children: []
  },
  'action-escalate-urgent-ehr': {
    id: 'action-escalate-urgent-ehr',
    label: 'Escalate Urgent',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr'],
    children: []
  },
  'action-monitor-refills-pharmacy': {
    id: 'action-monitor-refills-pharmacy',
    label: 'Monitor Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence-pharmacy'],
    children: []
  },
  'action-calculate-compliance-pharmacy': {
    id: 'action-calculate-compliance-pharmacy',
    label: 'Calculate Compliance',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence-pharmacy'],
    children: []
  },
  'action-send-alert-pharmacy': {
    id: 'action-send-alert-pharmacy',
    label: 'Send Alert',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-alert-providers-pharmacy'],
    children: []
  },
  'action-escalate-urgent-pharmacy': {
    id: 'action-escalate-urgent-pharmacy',
    label: 'Escalate Urgent',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-alert-providers-pharmacy'],
    children: []
  },

  // Shared Actions

  // WORKFLOW LEVEL - Cross-product orchestration
  'workflow-patient-admission': {
    id: 'workflow-patient-admission',
    label: 'Patient Admission Orchestration',
    level: 'workflow',
    children: ['outcome-patient-records', 'outcome-billing', 'outcome-medication-pharmacy'],
    parents: [],
    description: 'Coordinate patient admission across EHR, billing, and pharmacy'
  },
  'workflow-emergency-response': {
    id: 'workflow-emergency-response',
    label: 'Emergency Care Coordination',
    level: 'workflow',
    children: ['outcome-clinical-care', 'outcome-diagnostics', 'outcome-medication-pharmacy'],
    parents: [],
    description: 'Orchestrate emergency response across clinical, diagnostic, and pharmacy'
  },
  'workflow-chronic-care': {
    id: 'workflow-chronic-care',
    label: 'Chronic Care Management',
    level: 'workflow',
    children: ['outcome-clinical-care', 'outcome-patient-records', 'outcome-medication-pharmacy', 'outcome-diagnostics'],
    parents: [],
    description: 'Manage chronic patient care across multiple touchpoints'
  },
};
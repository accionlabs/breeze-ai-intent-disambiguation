// Healthcare domain querys - includes both unique and shared functionality
import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ========= OUTCOME LEVEL QUERYS =========
  {
    id: 'query-clinical-care',
    text: 'I need to improve clinical care',
    entryNode: 'outcome-clinical-care',
    entryLevel: 'outcome'
  },
  {
    id: 'query-patient-records',
    text: 'Manage patient records',
    entryNode: 'outcome-patient-records',
    entryLevel: 'outcome'
  },
  {
    id: 'query-medication-management',
    text: 'Help me manage medications',
    entryNode: 'outcome-medication-management',
    entryLevel: 'outcome'
  },
  {
    id: 'query-drug-safety',
    text: 'Ensure drug safety',
    entryNode: 'outcome-drug-safety',
    entryLevel: 'outcome'
  },

  // ========= UNIQUE SCENARIO QUERYS - EHR =========
  {
    id: 'query-diagnosis-support',
    text: 'Help diagnose patient symptoms',
    entryNode: 'scenario-diagnosis-support',
    entryLevel: 'scenario'
  },
  {
    id: 'query-medical-history',
    text: 'Access medical history',
    entryNode: 'scenario-medical-history',
    entryLevel: 'scenario'
  },
  {
    id: 'query-lab-results',
    text: 'Manage lab results',
    entryNode: 'scenario-lab-results',
    entryLevel: 'scenario'
  },

  // ========= UNIQUE SCENARIO QUERYS - PHARMACY =========
  {
    id: 'query-prescription-fulfillment',
    text: 'Fill prescription',
    entryNode: 'scenario-prescription-fulfillment',
    entryLevel: 'scenario'
  },
  {
    id: 'query-drug-interactions',
    text: 'Check drug interactions',
    entryNode: 'scenario-drug-interactions',
    entryLevel: 'scenario'
  },
  {
    id: 'query-inventory-control',
    text: 'Manage pharmacy inventory',
    entryNode: 'scenario-inventory-control',
    entryLevel: 'scenario'
  },

  // ========= DUPLICATE SCENARIO QUERYS (for rationalization) =========
  {
    id: 'query-patient-monitoring-ehr',
    text: 'Monitor patient health status',
    entryNode: 'scenario-patient-monitoring-ehr',
    entryLevel: 'scenario'
  },
  {
    id: 'query-patient-monitoring-pharmacy',
    text: 'Track patient medication compliance',
    entryNode: 'scenario-patient-monitoring-pharmacy',
    entryLevel: 'scenario'
  },
  {
    id: 'query-patient-monitoring-unified',
    text: 'Monitor patient comprehensively',
    entryNode: 'scenario-patient-monitoring-shared',
    entryLevel: 'scenario'
  },

  // ========= UNIQUE STEP QUERYS - EHR =========
  {
    id: 'query-analyze-symptoms',
    text: 'Analyze patient symptoms',
    entryNode: 'step-analyze-symptoms',
    entryLevel: 'step'
  },
  {
    id: 'query-suggest-diagnosis',
    text: 'Get diagnosis suggestions',
    entryNode: 'step-suggest-diagnosis',
    entryLevel: 'step'
  },
  {
    id: 'query-document-visit',
    text: 'Document patient visit',
    entryNode: 'step-document-visit',
    entryLevel: 'step'
  },
  {
    id: 'query-update-conditions',
    text: 'Update medical conditions',
    entryNode: 'step-update-conditions',
    entryLevel: 'step'
  },
  {
    id: 'query-order-tests',
    text: 'Order laboratory tests',
    entryNode: 'step-order-tests',
    entryLevel: 'step'
  },
  {
    id: 'query-review-results',
    text: 'Review test results',
    entryNode: 'step-review-results',
    entryLevel: 'step'
  },

  // ========= UNIQUE STEP QUERYS - PHARMACY =========
  {
    id: 'query-verify-prescription',
    text: 'Verify prescription validity',
    entryNode: 'step-verify-prescription',
    entryLevel: 'step'
  },
  {
    id: 'query-dispense-medication',
    text: 'Dispense medication to patient',
    entryNode: 'step-dispense-medication',
    entryLevel: 'step'
  },
  {
    id: 'query-check-interactions',
    text: 'Check for drug interactions',
    entryNode: 'step-check-interactions',
    entryLevel: 'step'
  },
  {
    id: 'query-alert-contraindications',
    text: 'Alert about contraindications',
    entryNode: 'step-alert-contraindications',
    entryLevel: 'step'
  },
  {
    id: 'query-track-inventory',
    text: 'Track drug inventory',
    entryNode: 'step-track-inventory',
    entryLevel: 'step'
  },
  {
    id: 'query-manage-expiration',
    text: 'Manage medication expiration',
    entryNode: 'step-manage-expiration',
    entryLevel: 'step'
  },

  // ========= DUPLICATE STEP QUERYS =========
  {
    id: 'query-track-vitals',
    text: 'Track vital signs',
    entryNode: 'step-track-vitals-ehr',
    entryLevel: 'step'
  },
  {
    id: 'query-track-adherence',
    text: 'Track medication adherence',
    entryNode: 'step-track-adherence-pharmacy',
    entryLevel: 'step'
  },
  {
    id: 'query-alert-providers-ehr',
    text: 'Alert healthcare providers',
    entryNode: 'step-alert-providers-ehr',
    entryLevel: 'step'
  },
  {
    id: 'query-alert-providers-pharmacy',
    text: 'Notify about medication issues',
    entryNode: 'step-alert-providers-pharmacy',
    entryLevel: 'step'
  },

  // ========= UNIQUE ACTION QUERYS - EHR =========
  {
    id: 'query-capture-symptoms',
    text: 'Capture patient symptoms',
    entryNode: 'action-capture-symptoms',
    entryLevel: 'action'
  },
  {
    id: 'query-run-assessment',
    text: 'Run clinical assessment',
    entryNode: 'action-run-assessment',
    entryLevel: 'action'
  },
  {
    id: 'query-generate-differential',
    text: 'Generate differential diagnosis',
    entryNode: 'action-generate-differential',
    entryLevel: 'action'
  },
  {
    id: 'query-recommend-tests',
    text: 'Recommend diagnostic tests',
    entryNode: 'action-recommend-tests',
    entryLevel: 'action'
  },
  {
    id: 'query-create-note',
    text: 'Create clinical note',
    entryNode: 'action-create-note',
    entryLevel: 'action'
  },
  {
    id: 'query-select-tests',
    text: 'Select lab tests',
    entryNode: 'action-select-tests',
    entryLevel: 'action'
  },
  {
    id: 'query-view-results',
    text: 'View lab results',
    entryNode: 'action-view-results',
    entryLevel: 'action'
  },

  // ========= UNIQUE ACTION QUERYS - PHARMACY =========
  {
    id: 'query-check-authenticity',
    text: 'Check prescription authenticity',
    entryNode: 'action-check-authenticity',
    entryLevel: 'action'
  },
  {
    id: 'query-verify-dosage',
    text: 'Verify medication dosage',
    entryNode: 'action-verify-dosage',
    entryLevel: 'action'
  },
  {
    id: 'query-prepare-medication',
    text: 'Prepare medication for dispensing',
    entryNode: 'action-prepare-medication',
    entryLevel: 'action'
  },
  {
    id: 'query-analyze-medications',
    text: 'Analyze medication combinations',
    entryNode: 'action-analyze-medications',
    entryLevel: 'action'
  },
  {
    id: 'query-monitor-stock',
    text: 'Monitor stock levels',
    entryNode: 'action-monitor-stock',
    entryLevel: 'action'
  },
  {
    id: 'query-check-dates',
    text: 'Check expiration dates',
    entryNode: 'action-check-dates',
    entryLevel: 'action'
  },

  // ========= DUPLICATE ACTION QUERYS =========
  {
    id: 'query-record-vitals',
    text: 'Record patient vitals',
    entryNode: 'action-record-vitals-ehr',
    entryLevel: 'action'
  },
  {
    id: 'query-monitor-trends',
    text: 'Monitor health trends',
    entryNode: 'action-monitor-trends-ehr',
    entryLevel: 'action'
  },
  {
    id: 'query-send-alert-ehr',
    text: 'Send clinical alert',
    entryNode: 'action-send-alert-ehr',
    entryLevel: 'action'
  },
  {
    id: 'query-send-alert-pharmacy',
    text: 'Send medication alert',
    entryNode: 'action-send-alert-pharmacy',
    entryLevel: 'action'
  },
  {
    id: 'query-monitor-refills',
    text: 'Monitor prescription refills',
    entryNode: 'action-monitor-refills-pharmacy',
    entryLevel: 'action'
  },
  {
    id: 'query-calculate-compliance',
    text: 'Calculate medication compliance',
    entryNode: 'action-calculate-compliance-pharmacy',
    entryLevel: 'action'
  }
];
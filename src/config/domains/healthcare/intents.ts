// Healthcare domain intents - includes both unique and shared functionality
import { UserIntent } from '../../../types';

export const USER_INTENTS: UserIntent[] = [
  // ========= OUTCOME LEVEL INTENTS =========
  {
    id: 'intent-clinical-care',
    text: 'I need to improve clinical care',
    entryNode: 'outcome-clinical-care',
    entryLevel: 'outcome'
  },
  {
    id: 'intent-patient-records',
    text: 'Manage patient records',
    entryNode: 'outcome-patient-records',
    entryLevel: 'outcome'
  },
  {
    id: 'intent-medication-management',
    text: 'Help me manage medications',
    entryNode: 'outcome-medication-management',
    entryLevel: 'outcome'
  },
  {
    id: 'intent-drug-safety',
    text: 'Ensure drug safety',
    entryNode: 'outcome-drug-safety',
    entryLevel: 'outcome'
  },

  // ========= UNIQUE SCENARIO INTENTS - EHR =========
  {
    id: 'intent-diagnosis-support',
    text: 'Help diagnose patient symptoms',
    entryNode: 'scenario-diagnosis-support',
    entryLevel: 'scenario'
  },
  {
    id: 'intent-medical-history',
    text: 'Access medical history',
    entryNode: 'scenario-medical-history',
    entryLevel: 'scenario'
  },
  {
    id: 'intent-lab-results',
    text: 'Manage lab results',
    entryNode: 'scenario-lab-results',
    entryLevel: 'scenario'
  },

  // ========= UNIQUE SCENARIO INTENTS - PHARMACY =========
  {
    id: 'intent-prescription-fulfillment',
    text: 'Fill prescription',
    entryNode: 'scenario-prescription-fulfillment',
    entryLevel: 'scenario'
  },
  {
    id: 'intent-drug-interactions',
    text: 'Check drug interactions',
    entryNode: 'scenario-drug-interactions',
    entryLevel: 'scenario'
  },
  {
    id: 'intent-inventory-control',
    text: 'Manage pharmacy inventory',
    entryNode: 'scenario-inventory-control',
    entryLevel: 'scenario'
  },

  // ========= DUPLICATE SCENARIO INTENTS (for rationalization) =========
  {
    id: 'intent-patient-monitoring-ehr',
    text: 'Monitor patient health status',
    entryNode: 'scenario-patient-monitoring-ehr',
    entryLevel: 'scenario'
  },
  {
    id: 'intent-patient-monitoring-pharmacy',
    text: 'Track patient medication compliance',
    entryNode: 'scenario-patient-monitoring-pharmacy',
    entryLevel: 'scenario'
  },
  {
    id: 'intent-patient-monitoring-unified',
    text: 'Monitor patient comprehensively',
    entryNode: 'scenario-patient-monitoring-shared',
    entryLevel: 'scenario'
  },

  // ========= UNIQUE STEP INTENTS - EHR =========
  {
    id: 'intent-analyze-symptoms',
    text: 'Analyze patient symptoms',
    entryNode: 'step-analyze-symptoms',
    entryLevel: 'step'
  },
  {
    id: 'intent-suggest-diagnosis',
    text: 'Get diagnosis suggestions',
    entryNode: 'step-suggest-diagnosis',
    entryLevel: 'step'
  },
  {
    id: 'intent-document-visit',
    text: 'Document patient visit',
    entryNode: 'step-document-visit',
    entryLevel: 'step'
  },
  {
    id: 'intent-update-conditions',
    text: 'Update medical conditions',
    entryNode: 'step-update-conditions',
    entryLevel: 'step'
  },
  {
    id: 'intent-order-tests',
    text: 'Order laboratory tests',
    entryNode: 'step-order-tests',
    entryLevel: 'step'
  },
  {
    id: 'intent-review-results',
    text: 'Review test results',
    entryNode: 'step-review-results',
    entryLevel: 'step'
  },

  // ========= UNIQUE STEP INTENTS - PHARMACY =========
  {
    id: 'intent-verify-prescription',
    text: 'Verify prescription validity',
    entryNode: 'step-verify-prescription',
    entryLevel: 'step'
  },
  {
    id: 'intent-dispense-medication',
    text: 'Dispense medication to patient',
    entryNode: 'step-dispense-medication',
    entryLevel: 'step'
  },
  {
    id: 'intent-check-interactions',
    text: 'Check for drug interactions',
    entryNode: 'step-check-interactions',
    entryLevel: 'step'
  },
  {
    id: 'intent-alert-contraindications',
    text: 'Alert about contraindications',
    entryNode: 'step-alert-contraindications',
    entryLevel: 'step'
  },
  {
    id: 'intent-track-inventory',
    text: 'Track drug inventory',
    entryNode: 'step-track-inventory',
    entryLevel: 'step'
  },
  {
    id: 'intent-manage-expiration',
    text: 'Manage medication expiration',
    entryNode: 'step-manage-expiration',
    entryLevel: 'step'
  },

  // ========= DUPLICATE STEP INTENTS =========
  {
    id: 'intent-track-vitals',
    text: 'Track vital signs',
    entryNode: 'step-track-vitals-ehr',
    entryLevel: 'step'
  },
  {
    id: 'intent-track-adherence',
    text: 'Track medication adherence',
    entryNode: 'step-track-adherence-pharmacy',
    entryLevel: 'step'
  },
  {
    id: 'intent-alert-providers-ehr',
    text: 'Alert healthcare providers',
    entryNode: 'step-alert-providers-ehr',
    entryLevel: 'step'
  },
  {
    id: 'intent-alert-providers-pharmacy',
    text: 'Notify about medication issues',
    entryNode: 'step-alert-providers-pharmacy',
    entryLevel: 'step'
  },

  // ========= UNIQUE ACTION INTENTS - EHR =========
  {
    id: 'intent-capture-symptoms',
    text: 'Capture patient symptoms',
    entryNode: 'action-capture-symptoms',
    entryLevel: 'action'
  },
  {
    id: 'intent-run-assessment',
    text: 'Run clinical assessment',
    entryNode: 'action-run-assessment',
    entryLevel: 'action'
  },
  {
    id: 'intent-generate-differential',
    text: 'Generate differential diagnosis',
    entryNode: 'action-generate-differential',
    entryLevel: 'action'
  },
  {
    id: 'intent-recommend-tests',
    text: 'Recommend diagnostic tests',
    entryNode: 'action-recommend-tests',
    entryLevel: 'action'
  },
  {
    id: 'intent-create-note',
    text: 'Create clinical note',
    entryNode: 'action-create-note',
    entryLevel: 'action'
  },
  {
    id: 'intent-select-tests',
    text: 'Select lab tests',
    entryNode: 'action-select-tests',
    entryLevel: 'action'
  },
  {
    id: 'intent-view-results',
    text: 'View lab results',
    entryNode: 'action-view-results',
    entryLevel: 'action'
  },

  // ========= UNIQUE ACTION INTENTS - PHARMACY =========
  {
    id: 'intent-check-authenticity',
    text: 'Check prescription authenticity',
    entryNode: 'action-check-authenticity',
    entryLevel: 'action'
  },
  {
    id: 'intent-verify-dosage',
    text: 'Verify medication dosage',
    entryNode: 'action-verify-dosage',
    entryLevel: 'action'
  },
  {
    id: 'intent-prepare-medication',
    text: 'Prepare medication for dispensing',
    entryNode: 'action-prepare-medication',
    entryLevel: 'action'
  },
  {
    id: 'intent-analyze-medications',
    text: 'Analyze medication combinations',
    entryNode: 'action-analyze-medications',
    entryLevel: 'action'
  },
  {
    id: 'intent-monitor-stock',
    text: 'Monitor stock levels',
    entryNode: 'action-monitor-stock',
    entryLevel: 'action'
  },
  {
    id: 'intent-check-dates',
    text: 'Check expiration dates',
    entryNode: 'action-check-dates',
    entryLevel: 'action'
  },

  // ========= DUPLICATE ACTION INTENTS =========
  {
    id: 'intent-record-vitals',
    text: 'Record patient vitals',
    entryNode: 'action-record-vitals-ehr',
    entryLevel: 'action'
  },
  {
    id: 'intent-monitor-trends',
    text: 'Monitor health trends',
    entryNode: 'action-monitor-trends-ehr',
    entryLevel: 'action'
  },
  {
    id: 'intent-send-alert-ehr',
    text: 'Send clinical alert',
    entryNode: 'action-send-alert-ehr',
    entryLevel: 'action'
  },
  {
    id: 'intent-send-alert-pharmacy',
    text: 'Send medication alert',
    entryNode: 'action-send-alert-pharmacy',
    entryLevel: 'action'
  },
  {
    id: 'intent-monitor-refills',
    text: 'Monitor prescription refills',
    entryNode: 'action-monitor-refills-pharmacy',
    entryLevel: 'action'
  },
  {
    id: 'intent-calculate-compliance',
    text: 'Calculate medication compliance',
    entryNode: 'action-calculate-compliance-pharmacy',
    entryLevel: 'action'
  }
];
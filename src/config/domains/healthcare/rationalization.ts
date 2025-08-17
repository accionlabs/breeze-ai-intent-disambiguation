// Rationalization configuration for the Healthcare domain
// This file defines how overlapping functionality is resolved across products

// Maps shared/rationalized nodes to their product-specific alternatives
// This shows how duplicate nodes are resolved into shared versions
export const RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>> = {
  // Scenario-level mappings
  'scenario-patient-monitoring-shared': {
    'ehr': 'scenario-patient-monitoring-ehr',
    'pharmacy': 'scenario-patient-monitoring-pharmacy'
  },
  'scenario-appointment-management-shared': {
    'scheduling': 'scenario-appointment-management-scheduling',
    'ehr': 'scenario-appointment-management-ehr'
  },
  'scenario-test-ordering-shared': {
    'lab': 'scenario-test-ordering-lab',
    'ehr': 'scenario-test-ordering-ehr'
  },
  'scenario-insurance-verification-shared': {
    'billing': 'scenario-insurance-verification-billing',
    'scheduling': 'scenario-insurance-verification-scheduling'
  },
  
  // Step-level mappings - Patient monitoring
  'step-track-vitals-shared': {
    'ehr': 'step-track-vitals-ehr',
    'pharmacy': 'step-track-vitals-pharmacy'
  },
  'step-monitor-conditions-shared': {
    'ehr': 'step-monitor-conditions-ehr',
    'pharmacy': 'step-monitor-adherence-pharmacy'
  },
  'step-alert-providers-shared': {
    'ehr': 'step-alert-providers-ehr',
    'pharmacy': 'step-alert-providers-pharmacy'
  },
  
  // Step-level mappings - Appointment management
  'step-schedule-appointment-shared': {
    'scheduling': 'step-schedule-appointment-scheduling',
    'ehr': 'step-schedule-appointment-ehr'
  },
  'step-manage-calendar-shared': {
    'scheduling': 'step-manage-calendar-scheduling'
  },
  'step-send-reminders-shared': {
    'scheduling': 'step-send-reminders-scheduling'
  },
  
  // Step-level mappings - Test ordering
  'step-order-tests-shared': {
    'ehr': 'step-order-tests-ehr'
  },
  'step-track-specimens-shared': {
    'lab': 'step-process-specimens-lab'
  },
  'step-receive-results-shared': {
    'lab': 'step-track-status-lab',
    'ehr': 'step-track-results-ehr'
  },
  
  // Step-level mappings - Insurance verification
  'step-verify-coverage-shared': {
    'billing': 'step-verify-coverage-billing',
    'scheduling': 'step-verify-coverage-scheduling'
  },
  'step-check-eligibility-shared': {
    'billing': 'step-check-eligibility-billing'
  },
  'step-obtain-authorization-shared': {
    'billing': 'step-obtain-authorization-billing'
  },
  
  // Existing mappings
  'step-review-history-shared': {
    'ehr': 'step-review-history-ehr'
  },
  'step-document-findings-shared': {
    'ehr': 'step-document-findings-ehr'
  },
  'step-generate-reports-shared': {
    'ehr': 'step-generate-reports-ehr'
  }
};

// List of nodes that have duplicates across products (for highlighting)
// These duplicate nodes represent the same functionality in different products
// They demonstrate the overlap problem before rationalization
export const DUPLICATE_NODES = [
  // Scenario-level duplicates
  'scenario-patient-monitoring-ehr',
  'scenario-patient-monitoring-pharmacy',
  'scenario-appointment-management-scheduling',
  'scenario-appointment-management-ehr',
  'scenario-test-ordering-lab',
  'scenario-test-ordering-ehr',
  'scenario-insurance-verification-billing',
  'scenario-insurance-verification-scheduling',
  
  // Step-level duplicates - Patient monitoring
  'step-track-vitals-ehr',
  'step-monitor-conditions-ehr',
  'step-alert-providers-ehr',
  'step-track-vitals-pharmacy',
  'step-monitor-adherence-pharmacy',
  'step-alert-providers-pharmacy',
  
  // Step-level duplicates - Appointment management
  'step-schedule-appointment-scheduling',
  'step-manage-calendar-scheduling',
  'step-send-reminders-scheduling',
  'step-schedule-appointment-ehr',
  'step-document-appointment-ehr',
  'step-track-noshows-ehr',
  
  // Step-level duplicates - Test ordering
  'step-receive-orders-lab',
  'step-process-specimens-lab',
  'step-track-status-lab',
  'step-order-tests-ehr',
  'step-track-results-ehr',
  'step-document-results-ehr',
  
  // Step-level duplicates - Insurance verification
  'step-verify-coverage-billing',
  'step-check-eligibility-billing',
  'step-obtain-authorization-billing',
  'step-verify-coverage-scheduling',
  'step-confirm-copay-scheduling',
  'step-notify-patient-scheduling'
];

// List of shared/rationalized nodes (for special display)
// These nodes are created through rationalization and highlighted in the visualization
export const SHARED_NODES = [
  // Shared scenarios (created through rationalization)
  'scenario-patient-monitoring-shared',
  'scenario-appointment-management-shared',
  'scenario-prescription-management-shared',
  'scenario-test-ordering-shared',
  'scenario-result-management-shared',
  'scenario-insurance-verification-shared',
  
  // Shared unified steps (contain union of all capabilities)
  'step-patient-monitoring-unified',
  'step-appointment-management-unified',
  'step-test-ordering-unified',
  'step-insurance-verification-unified',
  'step-prescription-management-unified',
  'step-result-management-unified'
];
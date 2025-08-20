// Sample user queries for testing the healthcare query disambiguation system
import { UserQuery } from '../../../types';

// Example queries for the query input component
export const EXAMPLE_QUERIES = [
  "schedule patient appointment",
  "check lab results",
  "prescribe medication",
  "verify insurance coverage",
  "update patient records",
  "order diagnostic tests",
  "review patient history",
  "process billing claim",
  "manage prescription refills",
  "coordinate care team"
];

// Placeholder text for the query input
export const QUERY_INPUT_PLACEHOLDER = "e.g., schedule appointment for patient";

// Sample user queries with their entry points in the functional graph
export const USER_QUERIES: UserQuery[] = [
  // High-level outcome querys
  {
    id: 'query-clinical-excellence',
    text: 'I need to improve our clinical outcomes and patient diagnosis accuracy',
    entryNode: 'outcome-clinical-excellence-ehr',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'query-patient-care',
    text: 'Help me optimize overall patient care coordination',
    entryNode: 'outcome-patient-care-ehr',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'query-operational-efficiency',
    text: 'I want to improve our clinic operational efficiency',
    entryNode: 'outcome-operational-efficiency-scheduling',
    entryLevel: 'outcome',
    ambiguous: false
  },

  // Scenario-level querys (more specific)
  {
    id: 'query-patient-diagnosis',
    text: 'I need to diagnose a patient with complex symptoms',
    entryNode: 'scenario-patient-diagnosis',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-appointment-management',
    text: 'Manage patient appointments and scheduling',
    entryNode: 'scenario-appointment-management-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between scheduling and EHR
  },
  {
    id: 'query-prescription-management',
    text: 'Handle prescription and medication management',
    entryNode: 'scenario-prescription-management-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between pharmacy and EHR
  },
  {
    id: 'query-insurance-verification',
    text: 'Verify patient insurance and benefits',
    entryNode: 'scenario-insurance-verification-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between billing and scheduling
  },
  {
    id: 'query-test-ordering',
    text: 'Order laboratory tests for a patient',
    entryNode: 'scenario-test-ordering-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between lab and EHR
  },
  {
    id: 'query-result-management',
    text: 'Review and manage test results',
    entryNode: 'scenario-result-management-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between lab and EHR
  },
  {
    id: 'query-claims-processing',
    text: 'Process insurance claims and billing',
    entryNode: 'scenario-claims-processing',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-care-coordination',
    text: 'Coordinate care between multiple providers',
    entryNode: 'scenario-care-coordination',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-patient-monitoring',
    text: 'Monitor patient vital signs and conditions',
    entryNode: 'scenario-patient-monitoring-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between EHR and pharmacy
  },

  // Step-level querys (specific tasks)
  {
    id: 'query-review-history',
    text: 'Review patient medical history',
    entryNode: 'step-review-history-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-schedule-appointment',
    text: 'Schedule an appointment for a patient',
    entryNode: 'step-appointment-management-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step for scheduling and EHR
  },
  {
    id: 'query-prescribe-medication',
    text: 'Prescribe medication to patient',
    entryNode: 'step-prescribe-medications-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-order-tests',
    text: 'Order diagnostic tests',
    entryNode: 'step-order-tests-ehr-diagnosis',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-verify-coverage',
    text: 'Verify insurance coverage',
    entryNode: 'step-insurance-verification-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step for billing and scheduling
  },
  {
    id: 'query-document-visit',
    text: 'Document patient visit notes',
    entryNode: 'step-document-visit-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-update-records',
    text: 'Update patient medical records',
    entryNode: 'step-update-records-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-track-vitals',
    text: 'Track patient vital signs',
    entryNode: 'step-patient-monitoring-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step for EHR and pharmacy
  },
  {
    id: 'query-send-reminders',
    text: 'Send appointment reminders to patients',
    entryNode: 'step-send-reminders-scheduling',
    entryLevel: 'step',
    ambiguous: false
  },

  // Action-level querys (very specific)
  {
    id: 'query-view-records',
    text: 'View patient records',
    entryNode: 'action-view-records-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-check-allergies',
    text: 'Check patient allergies',
    entryNode: 'action-check-allergies-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-select-medication',
    text: 'Select appropriate medication',
    entryNode: 'action-select-medication-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-book-appointment',
    text: 'Book an appointment slot',
    entryNode: 'action-book-appointment-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-send-prescription',
    text: 'Send prescription to pharmacy',
    entryNode: 'action-send-prescription-ehr',
    entryLevel: 'action',
    ambiguous: false
  },

  // Additional action querys
  {
    id: 'query-verify-prescription',
    text: 'Verify prescription details',
    entryNode: 'action-verify-prescription',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-check-insurance',
    text: 'Check insurance details',
    entryNode: 'action-check-insurance-billing',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-run-lab-test',
    text: 'Run laboratory test',
    entryNode: 'action-run-test-lab',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-calculate-copay',
    text: 'Calculate patient copayment',
    entryNode: 'action-calculate-copay-scheduling',
    entryLevel: 'action',
    ambiguous: false
  },

  // ===== UNAMBIGUOUS QUERYS FOR EACH PRODUCT =====
  
  // --- SCHEDULING PRODUCT SPECIFIC ---
  {
    id: 'query-resource-optimization',
    text: 'Optimize clinic resource allocation and scheduling',
    entryNode: 'scenario-resource-optimization',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-manage-calendar',
    text: 'Manage provider calendars and availability',
    entryNode: 'step-manage-calendar-scheduling',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-workflow-automation',
    text: 'Automate scheduling workflows',
    entryNode: 'scenario-workflow-automation',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-track-noshows',
    text: 'Track and manage appointment no-shows',
    entryNode: 'step-track-noshows-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-confirm-copay',
    text: 'Confirm patient copayment amounts',
    entryNode: 'step-confirm-copay-scheduling',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- LAB PRODUCT SPECIFIC ---
  {
    id: 'query-quality-control',
    text: 'Perform laboratory quality control checks',
    entryNode: 'scenario-quality-control',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-process-specimens',
    text: 'Process lab specimens and samples',
    entryNode: 'step-process-specimens-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-interpret-findings',
    text: 'Interpret laboratory test findings',
    entryNode: 'step-interpret-findings-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-notify-providers-lab',
    text: 'Notify providers of critical lab results',
    entryNode: 'step-notify-providers-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-track-status-lab',
    text: 'Track laboratory test status',
    entryNode: 'step-track-status-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- BILLING PRODUCT SPECIFIC ---
  {
    id: 'query-payment-collection',
    text: 'Manage payment collection and processing',
    entryNode: 'scenario-payment-collection',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-billing-compliance',
    text: 'Ensure billing regulatory compliance',
    entryNode: 'scenario-billing-compliance',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-check-eligibility',
    text: 'Check patient insurance eligibility',
    entryNode: 'step-check-eligibility-billing',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-obtain-authorization',
    text: 'Obtain prior authorization for procedures',
    entryNode: 'step-obtain-authorization-billing',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- PHARMACY PRODUCT SPECIFIC ---
  {
    id: 'query-drug-interaction',
    text: 'Check for drug interactions',
    entryNode: 'scenario-drug-interaction',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-inventory-management',
    text: 'Manage pharmacy inventory',
    entryNode: 'scenario-inventory-management',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-dispense-medications',
    text: 'Dispense medications to patients',
    entryNode: 'step-dispense-medications',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-track-adherence',
    text: 'Track medication adherence',
    entryNode: 'step-track-adherence',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-manage-refills',
    text: 'Manage prescription refills',
    entryNode: 'step-manage-refills-pharmacy',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-verify-prescriptions',
    text: 'Verify prescription details and dosage',
    entryNode: 'step-verify-prescriptions-pharmacy',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-monitor-adherence',
    text: 'Monitor medication adherence',
    entryNode: 'step-monitor-adherence-pharmacy',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- EHR PRODUCT SPECIFIC (Additional) ---
  {
    id: 'query-treatment-planning',
    text: 'Create patient treatment plan',
    entryNode: 'scenario-treatment-planning',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-generate-reports',
    text: 'Generate clinical reports',
    entryNode: 'step-generate-reports-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-document-findings',
    text: 'Document clinical findings',
    entryNode: 'step-document-findings-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-document-appointment',
    text: 'Document appointment notes and outcomes',
    entryNode: 'step-document-appointment-ehr',
    entryLevel: 'step',
    ambiguous: false
  }
];
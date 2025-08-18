// Sample user intents for testing the healthcare intent disambiguation system
import { UserIntent } from '../../../types';

// Example queries for the intent input component
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

// Placeholder text for the intent input
export const INTENT_INPUT_PLACEHOLDER = "e.g., schedule appointment for patient";

// Sample user intents with their entry points in the functional graph
export const USER_INTENTS: UserIntent[] = [
  // High-level outcome intents
  {
    id: 'intent-clinical-excellence',
    text: 'I need to improve our clinical outcomes and patient diagnosis accuracy',
    entryNode: 'outcome-clinical-excellence-ehr',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'intent-patient-care',
    text: 'Help me optimize overall patient care coordination',
    entryNode: 'outcome-patient-care-ehr',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'intent-operational-efficiency',
    text: 'I want to improve our clinic operational efficiency',
    entryNode: 'outcome-operational-efficiency-scheduling',
    entryLevel: 'outcome',
    ambiguous: false
  },

  // Scenario-level intents (more specific)
  {
    id: 'intent-patient-diagnosis',
    text: 'I need to diagnose a patient with complex symptoms',
    entryNode: 'scenario-patient-diagnosis',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-appointment-management',
    text: 'Manage patient appointments and scheduling',
    entryNode: 'scenario-appointment-management-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between scheduling and EHR
  },
  {
    id: 'intent-prescription-management',
    text: 'Handle prescription and medication management',
    entryNode: 'scenario-prescription-management-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between pharmacy and EHR
  },
  {
    id: 'intent-insurance-verification',
    text: 'Verify patient insurance and benefits',
    entryNode: 'scenario-insurance-verification-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between billing and scheduling
  },
  {
    id: 'intent-test-ordering',
    text: 'Order laboratory tests for a patient',
    entryNode: 'scenario-test-ordering-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between lab and EHR
  },
  {
    id: 'intent-result-management',
    text: 'Review and manage test results',
    entryNode: 'scenario-result-management-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between lab and EHR
  },
  {
    id: 'intent-claims-processing',
    text: 'Process insurance claims and billing',
    entryNode: 'scenario-claims-processing',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-care-coordination',
    text: 'Coordinate care between multiple providers',
    entryNode: 'scenario-care-coordination',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-patient-monitoring',
    text: 'Monitor patient vital signs and conditions',
    entryNode: 'scenario-patient-monitoring-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between EHR and pharmacy
  },

  // Step-level intents (specific tasks)
  {
    id: 'intent-review-history',
    text: 'Review patient medical history',
    entryNode: 'step-review-history-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-schedule-appointment',
    text: 'Schedule an appointment for a patient',
    entryNode: 'step-appointment-management-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step for scheduling and EHR
  },
  {
    id: 'intent-prescribe-medication',
    text: 'Prescribe medication to patient',
    entryNode: 'step-prescribe-medications-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-order-tests',
    text: 'Order diagnostic tests',
    entryNode: 'step-order-tests-ehr-diagnosis',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-verify-coverage',
    text: 'Verify insurance coverage',
    entryNode: 'step-insurance-verification-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step for billing and scheduling
  },
  {
    id: 'intent-document-visit',
    text: 'Document patient visit notes',
    entryNode: 'step-document-visit-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-update-records',
    text: 'Update patient medical records',
    entryNode: 'step-update-records-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-track-vitals',
    text: 'Track patient vital signs',
    entryNode: 'step-patient-monitoring-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step for EHR and pharmacy
  },
  {
    id: 'intent-send-reminders',
    text: 'Send appointment reminders to patients',
    entryNode: 'step-send-reminders-scheduling',
    entryLevel: 'step',
    ambiguous: false
  },

  // Action-level intents (very specific)
  {
    id: 'intent-view-records',
    text: 'View patient records',
    entryNode: 'action-view-records-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-check-allergies',
    text: 'Check patient allergies',
    entryNode: 'action-check-allergies-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-select-medication',
    text: 'Select appropriate medication',
    entryNode: 'action-select-medication-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-book-appointment',
    text: 'Book an appointment slot',
    entryNode: 'action-book-appointment-ehr',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-send-prescription',
    text: 'Send prescription to pharmacy',
    entryNode: 'action-send-prescription-ehr',
    entryLevel: 'action',
    ambiguous: false
  },

  // Additional action intents
  {
    id: 'intent-verify-prescription',
    text: 'Verify prescription details',
    entryNode: 'action-verify-prescription',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-check-insurance',
    text: 'Check insurance details',
    entryNode: 'action-check-insurance-billing',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-run-lab-test',
    text: 'Run laboratory test',
    entryNode: 'action-run-test-lab',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-calculate-copay',
    text: 'Calculate patient copayment',
    entryNode: 'action-calculate-copay-scheduling',
    entryLevel: 'action',
    ambiguous: false
  },

  // ===== UNAMBIGUOUS INTENTS FOR EACH PRODUCT =====
  
  // --- SCHEDULING PRODUCT SPECIFIC ---
  {
    id: 'intent-resource-optimization',
    text: 'Optimize clinic resource allocation and scheduling',
    entryNode: 'scenario-resource-optimization',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-manage-calendar',
    text: 'Manage provider calendars and availability',
    entryNode: 'step-manage-calendar-scheduling',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-workflow-automation',
    text: 'Automate scheduling workflows',
    entryNode: 'scenario-workflow-automation',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-track-noshows',
    text: 'Track and manage appointment no-shows',
    entryNode: 'step-track-noshows-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-confirm-copay',
    text: 'Confirm patient copayment amounts',
    entryNode: 'step-confirm-copay-scheduling',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- LAB PRODUCT SPECIFIC ---
  {
    id: 'intent-quality-control',
    text: 'Perform laboratory quality control checks',
    entryNode: 'scenario-quality-control',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-process-specimens',
    text: 'Process lab specimens and samples',
    entryNode: 'step-process-specimens-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-interpret-findings',
    text: 'Interpret laboratory test findings',
    entryNode: 'step-interpret-findings-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-notify-providers-lab',
    text: 'Notify providers of critical lab results',
    entryNode: 'step-notify-providers-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-track-status-lab',
    text: 'Track laboratory test status',
    entryNode: 'step-track-status-lab',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- BILLING PRODUCT SPECIFIC ---
  {
    id: 'intent-payment-collection',
    text: 'Manage payment collection and processing',
    entryNode: 'scenario-payment-collection',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-billing-compliance',
    text: 'Ensure billing regulatory compliance',
    entryNode: 'scenario-billing-compliance',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-check-eligibility',
    text: 'Check patient insurance eligibility',
    entryNode: 'step-check-eligibility-billing',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-obtain-authorization',
    text: 'Obtain prior authorization for procedures',
    entryNode: 'step-obtain-authorization-billing',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- PHARMACY PRODUCT SPECIFIC ---
  {
    id: 'intent-drug-interaction',
    text: 'Check for drug interactions',
    entryNode: 'scenario-drug-interaction',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-inventory-management',
    text: 'Manage pharmacy inventory',
    entryNode: 'scenario-inventory-management',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-dispense-medications',
    text: 'Dispense medications to patients',
    entryNode: 'step-dispense-medications',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-track-adherence',
    text: 'Track medication adherence',
    entryNode: 'step-track-adherence',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-manage-refills',
    text: 'Manage prescription refills',
    entryNode: 'step-manage-refills-pharmacy',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-verify-prescriptions',
    text: 'Verify prescription details and dosage',
    entryNode: 'step-verify-prescriptions-pharmacy',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-monitor-adherence',
    text: 'Monitor medication adherence',
    entryNode: 'step-monitor-adherence-pharmacy',
    entryLevel: 'step',
    ambiguous: false
  },
  
  // --- EHR PRODUCT SPECIFIC (Additional) ---
  {
    id: 'intent-treatment-planning',
    text: 'Create patient treatment plan',
    entryNode: 'scenario-treatment-planning',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-generate-reports',
    text: 'Generate clinical reports',
    entryNode: 'step-generate-reports-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-document-findings',
    text: 'Document clinical findings',
    entryNode: 'step-document-findings-ehr',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-document-appointment',
    text: 'Document appointment notes and outcomes',
    entryNode: 'step-document-appointment-ehr',
    entryLevel: 'step',
    ambiguous: false
  }
];
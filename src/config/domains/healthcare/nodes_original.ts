// Functional hierarchy node definitions for the Healthcare domain
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level (Top Level in visualization)
  'product-ehr': {
    id: 'product-ehr',
    label: 'EHR System',
    level: 'product',
    products: ['ehr'],
    parents: [],
    children: ['outcome-clinical-excellence-ehr', 'outcome-patient-care-ehr', 'outcome-compliance-ehr']
  },
  'product-scheduling': {
    id: 'product-scheduling',
    label: 'AppointmentPro',
    level: 'product',
    products: ['scheduling'],
    parents: [],
    children: ['outcome-operational-efficiency-scheduling', 'outcome-patient-experience-scheduling']
  },
  'product-billing': {
    id: 'product-billing',
    label: 'MedBilling',
    level: 'product',
    products: ['billing'],
    parents: [],
    children: ['outcome-revenue-optimization-billing', 'outcome-compliance-billing']
  },
  'product-pharmacy': {
    id: 'product-pharmacy',
    label: 'PharmaCare',
    level: 'product',
    products: ['pharmacy'],
    parents: [],
    children: ['outcome-medication-safety-pharmacy', 'outcome-patient-care-pharmacy']
  },
  'product-lab': {
    id: 'product-lab',
    label: 'LabConnect',
    level: 'product',
    products: ['lab'],
    parents: [],
    children: ['outcome-diagnostic-accuracy-lab', 'outcome-clinical-excellence-lab']
  },

  // Outcome Level - EHR specific
  'outcome-clinical-excellence-ehr': {
    id: 'outcome-clinical-excellence-ehr',
    label: 'Achieve Clinical Excellence',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr'],
    children: ['scenario-patient-diagnosis', 'scenario-treatment-planning', 'scenario-clinical-documentation', 'scenario-prescription-management-shared', 'scenario-result-management-shared']
  },
  'outcome-patient-care-ehr': {
    id: 'outcome-patient-care-ehr',
    label: 'Optimize Patient Care',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr'],
    children: ['scenario-care-coordination', 'scenario-patient-monitoring-ehr', 'scenario-patient-monitoring-shared', 'scenario-appointment-management-ehr', 'scenario-appointment-management-shared', 'scenario-test-ordering-ehr', 'scenario-test-ordering-shared']
  },
  'outcome-compliance-ehr': {
    id: 'outcome-compliance-ehr',
    label: 'Ensure Regulatory Compliance',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr'],
    children: ['scenario-documentation-compliance', 'scenario-privacy-security-ehr']
  },
  // Outcome Level - Scheduling specific
  'outcome-operational-efficiency-scheduling': {
    id: 'outcome-operational-efficiency-scheduling',
    label: 'Improve Operational Efficiency',
    level: 'outcome',
    products: ['scheduling'],
    parents: ['product-scheduling'],
    children: ['scenario-resource-optimization', 'scenario-workflow-automation', 'scenario-appointment-management-scheduling', 'scenario-appointment-management-shared', 'scenario-insurance-verification-scheduling', 'scenario-insurance-verification-shared']
  },
  'outcome-patient-experience-scheduling': {
    id: 'outcome-patient-experience-scheduling',
    label: 'Enhance Patient Experience',
    level: 'outcome',
    products: ['scheduling'],
    parents: ['product-scheduling'],
    children: ['scenario-patient-access', 'scenario-communication']
  },
  // Outcome Level - Billing specific
  'outcome-revenue-optimization-billing': {
    id: 'outcome-revenue-optimization-billing',
    label: 'Maximize Revenue Cycle',
    level: 'outcome',
    products: ['billing'],
    parents: ['product-billing'],
    children: ['scenario-claims-processing', 'scenario-payment-collection', 'scenario-insurance-verification-billing', 'scenario-insurance-verification-shared']
  },
  'outcome-compliance-billing': {
    id: 'outcome-compliance-billing',
    label: 'Ensure Regulatory Compliance',
    level: 'outcome',
    products: ['billing'],
    parents: ['product-billing'],
    children: ['scenario-billing-compliance', 'scenario-privacy-security-billing']
  },
  // Outcome Level - Pharmacy specific
  'outcome-medication-safety-pharmacy': {
    id: 'outcome-medication-safety-pharmacy',
    label: 'Ensure Medication Safety',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-prescription-management-pharmacy', 'scenario-prescription-management-shared', 'scenario-drug-interaction', 'scenario-inventory-management', 'scenario-patient-monitoring-pharmacy', 'scenario-patient-monitoring-shared']
  },
  'outcome-patient-care-pharmacy': {
    id: 'outcome-patient-care-pharmacy',
    label: 'Optimize Patient Care',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-medication-management']
  },
  // Outcome Level - Lab specific
  'outcome-diagnostic-accuracy-lab': {
    id: 'outcome-diagnostic-accuracy-lab',
    label: 'Improve Diagnostic Accuracy',
    level: 'outcome',
    products: ['lab'],
    parents: ['product-lab'],
    children: ['scenario-test-ordering-lab', 'scenario-test-ordering-shared', 'scenario-result-management-lab', 'scenario-result-management-shared', 'scenario-quality-control']
  },
  'outcome-clinical-excellence-lab': {
    id: 'outcome-clinical-excellence-lab',
    label: 'Achieve Lab Excellence',
    level: 'outcome',
    products: ['lab'],
    parents: ['product-lab'],
    children: []
  },

  // Scenario Level
  'scenario-patient-diagnosis': {
    id: 'scenario-patient-diagnosis',
    label: 'Patient Diagnosis',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-excellence-ehr'],
    children: ['step-review-history-ehr', 'step-document-findings-ehr', 'step-order-tests-ehr-diagnosis']
  },
  'scenario-treatment-planning': {
    id: 'scenario-treatment-planning',
    label: 'Treatment Planning',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-excellence-ehr'],
    children: ['step-create-care-plan', 'step-prescribe-medications-ehr', 'step-schedule-followup-ehr']
  },
  'scenario-clinical-documentation': {
    id: 'scenario-clinical-documentation',
    label: 'Clinical Documentation',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-excellence-ehr'],
    children: ['step-document-visit-ehr', 'step-update-records-ehr', 'step-generate-reports-ehr']
  },
  'scenario-care-coordination': {
    id: 'scenario-care-coordination',
    label: 'Care Coordination',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-care-ehr'],
    children: ['step-manage-referrals', 'step-share-records', 'step-coordinate-providers']
  },
  'scenario-medication-management': {
    id: 'scenario-medication-management',
    label: 'Medication Management',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-patient-care-pharmacy'],
    children: ['step-prescribe-medications-pharmacy', 'step-dispense-medications', 'step-track-adherence']
  },
  
  // Shared scenarios - These are created through rationalization and contain union of all capabilities
  // They are highlighted when rationalization is turned on
  'scenario-patient-monitoring-shared': {
    id: 'scenario-patient-monitoring-shared',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['ehr', 'pharmacy'],
    parents: ['outcome-patient-care-ehr', 'outcome-medication-safety-pharmacy'],
    children: [
      // Union of all steps from duplicate scenarios
      'step-track-vitals-ehr',
      'step-monitor-conditions-ehr',
      'step-alert-providers-ehr',
      'step-track-vitals-pharmacy',
      'step-monitor-adherence-pharmacy',
      'step-alert-providers-pharmacy',
      // Shared unified step
      'step-patient-monitoring-unified'
    ]
  },
  'scenario-appointment-management-shared': {
    id: 'scenario-appointment-management-shared',
    label: 'Appointment Management',
    level: 'scenario',
    products: ['scheduling', 'ehr'],
    parents: ['outcome-operational-efficiency-scheduling', 'outcome-patient-care-ehr'],
    children: [
      // Union of all steps from duplicate scenarios
      'step-schedule-appointment-scheduling',
      'step-manage-calendar-scheduling',
      'step-send-reminders-scheduling',
      'step-schedule-appointment-ehr',
      'step-document-appointment-ehr',
      'step-track-noshows-ehr',
      // Shared unified step
      'step-appointment-management-unified'
    ]
  },
  'scenario-test-ordering-shared': {
    id: 'scenario-test-ordering-shared',
    label: 'Test Ordering',
    level: 'scenario',
    products: ['lab', 'ehr'],
    parents: ['outcome-diagnostic-accuracy-lab', 'outcome-patient-care-ehr'],
    children: [
      // Union of all steps from duplicate scenarios
      'step-receive-orders-lab',
      'step-process-specimens-lab',
      'step-track-status-lab',
      'step-order-tests-ehr',
      'step-track-results-ehr',
      'step-document-results-ehr',
      // Shared unified step
      'step-test-ordering-unified'
    ]
  },
  'scenario-insurance-verification-shared': {
    id: 'scenario-insurance-verification-shared',
    label: 'Insurance Verification',
    level: 'scenario',
    products: ['billing', 'scheduling'],
    parents: ['outcome-revenue-optimization-billing', 'outcome-operational-efficiency-scheduling'],
    children: [
      // Union of all steps from duplicate scenarios
      'step-verify-coverage-billing',
      'step-check-eligibility-billing',
      'step-obtain-authorization-billing',
      'step-verify-coverage-scheduling',
      'step-confirm-copay-scheduling',
      'step-notify-patient-scheduling',
      // Shared unified step
      'step-insurance-verification-unified'
    ]
  },
  'scenario-prescription-management-shared': {
    id: 'scenario-prescription-management-shared',
    label: 'Prescription Management',
    level: 'scenario',
    products: ['pharmacy', 'ehr'],
    parents: ['outcome-medication-safety-pharmacy', 'outcome-clinical-excellence-ehr'],
    children: [
      // Union of steps
      'step-receive-prescriptions-pharmacy',
      'step-verify-prescriptions-pharmacy',
      'step-manage-refills-pharmacy',
      'step-prescribe-medications-ehr',
      // Shared unified step
      'step-prescription-management-unified'
    ]
  },
  'scenario-result-management-shared': {
    id: 'scenario-result-management-shared',
    label: 'Result Management',
    level: 'scenario',
    products: ['lab', 'ehr'],
    parents: ['outcome-diagnostic-accuracy-lab', 'outcome-clinical-excellence-ehr'],
    children: [
      // Union of steps
      'step-review-results-lab',
      'step-interpret-findings-lab',
      'step-notify-providers-lab',
      'step-track-results-ehr',
      'step-document-results-ehr',
      // Shared unified step
      'step-result-management-unified'
    ]
  },

  // Additional scenarios
  'scenario-resource-optimization': {
    id: 'scenario-resource-optimization',
    label: 'Resource Optimization',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-operational-efficiency-scheduling'],
    children: ['step-manage-resources', 'step-optimize-schedules', 'step-balance-workload']
  },
  'scenario-workflow-automation': {
    id: 'scenario-workflow-automation',
    label: 'Workflow Automation',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-operational-efficiency-scheduling'],
    children: ['step-automate-tasks', 'step-route-patients', 'step-trigger-alerts']
  },
  'scenario-patient-access': {
    id: 'scenario-patient-access',
    label: 'Patient Access',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-patient-experience-scheduling'],
    children: ['step-online-booking', 'step-self-checkin', 'step-portal-access']
  },
  'scenario-communication': {
    id: 'scenario-communication',
    label: 'Patient Communication',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-patient-experience-scheduling'],
    children: ['step-send-reminders-communication', 'step-communicate-updates', 'step-collect-feedback']
  },
  'scenario-claims-processing': {
    id: 'scenario-claims-processing',
    label: 'Claims Processing',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-revenue-optimization-billing'],
    children: ['step-submit-claims', 'step-track-claims', 'step-manage-denials']
  },
  'scenario-payment-collection': {
    id: 'scenario-payment-collection',
    label: 'Payment Collection',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-revenue-optimization-billing'],
    children: ['step-generate-statements', 'step-process-payments', 'step-manage-collections']
  },
  'scenario-documentation-compliance': {
    id: 'scenario-documentation-compliance',
    label: 'Documentation Compliance',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-compliance-ehr'],
    children: ['step-ensure-completeness', 'step-audit-records', 'step-maintain-standards']
  },
  'scenario-billing-compliance': {
    id: 'scenario-billing-compliance',
    label: 'Billing Compliance',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-compliance-billing'],
    children: ['step-validate-codes', 'step-ensure-accuracy', 'step-prevent-fraud']
  },
  'scenario-privacy-security-ehr': {
    id: 'scenario-privacy-security-ehr',
    label: 'Privacy & Security',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-compliance-ehr'],
    children: ['step-control-access', 'step-encrypt-data', 'step-audit-access']
  },
  'scenario-privacy-security-billing': {
    id: 'scenario-privacy-security-billing',
    label: 'Privacy & Security',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-compliance-billing'],
    children: ['step-control-access-billing', 'step-encrypt-data-billing', 'step-audit-access-billing']
  },
  'scenario-drug-interaction': {
    id: 'scenario-drug-interaction',
    label: 'Drug Interaction Checking',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-safety-pharmacy'],
    children: ['step-check-interactions', 'step-alert-conflicts', 'step-suggest-alternatives']
  },
  'scenario-inventory-management': {
    id: 'scenario-inventory-management',
    label: 'Inventory Management',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-safety-pharmacy'],
    children: ['step-track-inventory', 'step-manage-expiry', 'step-reorder-stock']
  },
  'scenario-quality-control': {
    id: 'scenario-quality-control',
    label: 'Quality Control',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-diagnostic-accuracy-lab'],
    children: ['step-calibrate-equipment', 'step-validate-results', 'step-maintain-standards-lab']
  },

  // Product-specific scenarios for each product's unique functionality
  'scenario-prescription-management-pharmacy': {
    id: 'scenario-prescription-management-pharmacy',
    label: 'Prescription Management',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-safety-pharmacy'],
    children: ['step-receive-prescriptions-pharmacy', 'step-verify-prescriptions-pharmacy', 'step-manage-refills-pharmacy']
  },
  'scenario-result-management-lab': {
    id: 'scenario-result-management-lab',
    label: 'Result Management',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-diagnostic-accuracy-lab'],
    children: ['step-review-results-lab', 'step-interpret-findings-lab', 'step-notify-providers-lab']
  },
  
  // Duplicate Scenario Nodes - These represent overlapping functionality across products
  // These are the "problem" nodes that show why rationalization is needed
  
  // Patient monitoring appears in both EHR and Pharmacy
  'scenario-patient-monitoring-ehr': {
    id: 'scenario-patient-monitoring-ehr',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-care-ehr'],
    children: ['step-track-vitals-ehr', 'step-monitor-conditions-ehr', 'step-alert-providers-ehr']
  },
  'scenario-patient-monitoring-pharmacy': {
    id: 'scenario-patient-monitoring-pharmacy',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-safety-pharmacy'],
    children: ['step-track-vitals-pharmacy', 'step-monitor-adherence-pharmacy', 'step-alert-providers-pharmacy']
  },
  
  // Appointment management appears in both Scheduling and EHR
  'scenario-appointment-management-scheduling': {
    id: 'scenario-appointment-management-scheduling',
    label: 'Appointment Management',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-operational-efficiency-scheduling'],
    children: ['step-schedule-appointment-scheduling', 'step-manage-calendar-scheduling', 'step-send-reminders-scheduling']
  },
  'scenario-appointment-management-ehr': {
    id: 'scenario-appointment-management-ehr',
    label: 'Appointment Management',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-care-ehr'],
    children: ['step-schedule-appointment-ehr', 'step-document-appointment-ehr', 'step-track-noshows-ehr']
  },
  
  // Test ordering appears in both Lab and EHR
  'scenario-test-ordering-lab': {
    id: 'scenario-test-ordering-lab',
    label: 'Test Ordering',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-diagnostic-accuracy-lab'],
    children: ['step-receive-orders-lab', 'step-process-specimens-lab', 'step-track-status-lab']
  },
  'scenario-test-ordering-ehr': {
    id: 'scenario-test-ordering-ehr',
    label: 'Test Ordering',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-care-ehr'],
    children: ['step-order-tests-ehr', 'step-track-results-ehr', 'step-document-results-ehr']
  },
  
  // Insurance verification appears in both Billing and Scheduling
  'scenario-insurance-verification-billing': {
    id: 'scenario-insurance-verification-billing',
    label: 'Insurance Verification',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-revenue-optimization-billing'],
    children: ['step-verify-coverage-billing', 'step-check-eligibility-billing', 'step-obtain-authorization-billing']
  },
  'scenario-insurance-verification-scheduling': {
    id: 'scenario-insurance-verification-scheduling',
    label: 'Insurance Verification',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-operational-efficiency-scheduling'],
    children: ['step-verify-coverage-scheduling', 'step-confirm-copay-scheduling', 'step-notify-patient-scheduling']
  },

  // Step Level - Product-specific steps
  'step-review-history-ehr': {
    id: 'step-review-history-ehr',
    label: 'Review Patient History',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-diagnosis'],
    children: ['action-view-records-ehr', 'action-check-allergies-ehr', 'action-review-medications-ehr']
  },
  'step-document-findings-ehr': {
    id: 'step-document-findings-ehr',
    label: 'Document Clinical Findings',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-diagnosis'],
    children: ['action-record-symptoms', 'action-note-observations', 'action-add-diagnosis']
  },
  'step-create-care-plan': {
    id: 'step-create-care-plan',
    label: 'Create Care Plan',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-treatment-planning'],
    children: ['action-set-goals', 'action-define-interventions', 'action-assign-tasks']
  },
  'step-generate-reports-ehr': {
    id: 'step-generate-reports-ehr',
    label: 'Generate Clinical Reports',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-clinical-documentation'],
    children: ['action-create-summary', 'action-export-data', 'action-share-report']
  },

  // Shared unified steps - Created through rationalization
  'step-patient-monitoring-unified': {
    id: 'step-patient-monitoring-unified',
    label: 'Unified Patient Monitoring',
    level: 'step',
    products: ['ehr', 'pharmacy'],
    parents: ['scenario-patient-monitoring-shared'],
    children: [
      // Union of all actions from duplicate steps
      'action-record-vitals-ehr',
      'action-monitor-trends-ehr',
      'action-flag-abnormal-ehr',
      'action-track-progress-ehr',
      'action-assess-status-ehr',
      'action-update-plan-ehr',
      'action-send-alert-ehr',
      'action-escalate-urgent-ehr',
      'action-notify-team-ehr',
      'action-record-vitals-pharmacy',
      'action-monitor-trends-pharmacy',
      'action-flag-abnormal-pharmacy',
      'action-track-doses-pharmacy',
      'action-check-compliance-pharmacy',
      'action-intervene-gaps-pharmacy',
      'action-send-alert-pharmacy',
      'action-escalate-urgent-pharmacy',
      'action-notify-team-pharmacy'
    ]
  },
  'step-appointment-management-unified': {
    id: 'step-appointment-management-unified',
    label: 'Unified Appointment Management',
    level: 'step',
    products: ['scheduling', 'ehr'],
    parents: ['scenario-appointment-management-shared'],
    children: [
      // Union of all actions
      'action-find-slot-scheduling',
      'action-book-appointment-scheduling',
      'action-confirm-booking-scheduling',
      'action-view-schedule-scheduling',
      'action-block-time-scheduling',
      'action-reschedule-scheduling',
      'action-create-reminder-scheduling',
      'action-send-notification-scheduling',
      'action-track-confirmation-scheduling',
      'action-find-slot-ehr',
      'action-book-appointment-ehr',
      'action-confirm-booking-ehr',
      'action-record-appointment-ehr',
      'action-note-details-ehr',
      'action-update-records-ehr',
      'action-flag-noshow-ehr',
      'action-document-reason-ehr',
      'action-notify-billing-ehr'
    ]
  },
  'step-test-ordering-unified': {
    id: 'step-test-ordering-unified',
    label: 'Unified Test Ordering',
    level: 'step',
    products: ['lab', 'ehr'],
    parents: ['scenario-test-ordering-shared'],
    children: [
      // Union of all actions
      'action-accept-order-lab',
      'action-verify-order-lab',
      'action-queue-test-lab',
      'action-receive-specimen-lab',
      'action-prepare-sample-lab',
      'action-run-test-lab',
      'action-update-status-lab',
      'action-notify-delays-lab',
      'action-send-results-lab',
      'action-select-tests-ehr',
      'action-specify-urgency-ehr',
      'action-add-instructions-ehr',
      'action-check-status-ehr',
      'action-receive-results-ehr',
      'action-flag-critical-ehr',
      'action-record-results-ehr',
      'action-add-interpretation-ehr',
      'action-update-chart-ehr'
    ]
  },
  'step-insurance-verification-unified': {
    id: 'step-insurance-verification-unified',
    label: 'Unified Insurance Verification',
    level: 'step',
    products: ['billing', 'scheduling'],
    parents: ['scenario-insurance-verification-shared'],
    children: [
      // Union of all actions
      'action-check-insurance-billing',
      'action-verify-benefits-billing',
      'action-confirm-copay-billing',
      'action-verify-eligibility-billing',
      'action-check-limits-billing',
      'action-confirm-coverage-billing',
      'action-submit-auth-billing',
      'action-track-approval-billing',
      'action-document-auth-billing',
      'action-check-insurance-scheduling',
      'action-verify-basic-scheduling',
      'action-note-requirements-scheduling',
      'action-calculate-copay-scheduling',
      'action-inform-patient-scheduling',
      'action-collect-copay-scheduling',
      'action-send-notice-scheduling',
      'action-explain-coverage-scheduling',
      'action-update-appointment-scheduling'
    ]
  },
  'step-prescription-management-unified': {
    id: 'step-prescription-management-unified',
    label: 'Unified Prescription Management',
    level: 'step',
    products: ['pharmacy', 'ehr'],
    parents: ['scenario-prescription-management-shared'],
    children: [
      // Union of all actions
      'action-accept-prescription-pharmacy',
      'action-validate-prescription-pharmacy',
      'action-queue-fill-pharmacy',
      'action-check-validity-pharmacy',
      'action-verify-dosage-pharmacy',
      'action-check-interactions-pharmacy',
      'action-track-refills-pharmacy',
      'action-authorize-refills-pharmacy',
      'action-notify-refills-pharmacy',
      'action-select-medication-ehr',
      'action-set-dosage-ehr',
      'action-send-prescription-ehr'
    ]
  },
  'step-result-management-unified': {
    id: 'step-result-management-unified',
    label: 'Unified Result Management',
    level: 'step',
    products: ['lab', 'ehr'],
    parents: ['scenario-result-management-shared'],
    children: [
      // Union of all actions
      'action-analyze-results-lab',
      'action-validate-results-lab',
      'action-approve-results-lab',
      'action-analyze-patterns-lab',
      'action-add-comments-lab',
      'action-flag-abnormals-lab',
      'action-alert-critical-lab',
      'action-follow-up-lab',
      'action-send-results-lab',
      'action-check-status-ehr',
      'action-receive-results-ehr',
      'action-flag-critical-ehr',
      'action-record-results-ehr',
      'action-add-interpretation-ehr',
      'action-update-chart-ehr'
    ]
  },
  
  // Product-specific steps for EHR
  'step-order-tests-ehr-diagnosis': {
    id: 'step-order-tests-ehr-diagnosis',
    label: 'Order Diagnostic Tests',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-diagnosis'],
    children: ['action-select-tests-ehr', 'action-specify-urgency-ehr', 'action-add-instructions-ehr']
  },
  'step-prescribe-medications-ehr': {
    id: 'step-prescribe-medications-ehr',
    label: 'Prescribe Medications',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-treatment-planning'],
    children: ['action-select-medication-ehr', 'action-set-dosage-ehr', 'action-send-prescription-ehr']
  },
  'step-schedule-followup-ehr': {
    id: 'step-schedule-followup-ehr',
    label: 'Schedule Follow-up',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-treatment-planning'],
    children: ['action-book-appointment-ehr', 'action-set-reminder-ehr', 'action-notify-patient-ehr']
  },
  'step-document-visit-ehr': {
    id: 'step-document-visit-ehr',
    label: 'Document Visit',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-clinical-documentation'],
    children: ['action-record-encounter-ehr', 'action-update-problem-list-ehr', 'action-code-visit-ehr']
  },
  'step-update-records-ehr': {
    id: 'step-update-records-ehr',
    label: 'Update Medical Records',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-clinical-documentation'],
    children: ['action-modify-data-ehr', 'action-add-notes-ehr', 'action-attach-files-ehr']
  },
  
  // Product-specific steps for Pharmacy
  'step-receive-prescriptions-pharmacy': {
    id: 'step-receive-prescriptions-pharmacy',
    label: 'Receive Prescriptions',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-management-pharmacy'],
    children: ['action-accept-prescription-pharmacy', 'action-validate-prescription-pharmacy', 'action-queue-fill-pharmacy']
  },
  'step-verify-prescriptions-pharmacy': {
    id: 'step-verify-prescriptions-pharmacy',
    label: 'Verify Prescriptions',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-management-pharmacy'],
    children: ['action-check-validity-pharmacy', 'action-verify-dosage-pharmacy', 'action-check-interactions-pharmacy']
  },
  'step-manage-refills-pharmacy': {
    id: 'step-manage-refills-pharmacy',
    label: 'Manage Refills',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-management-pharmacy'],
    children: ['action-track-refills-pharmacy', 'action-authorize-refills-pharmacy', 'action-notify-refills-pharmacy']
  },
  'step-prescribe-medications-pharmacy': {
    id: 'step-prescribe-medications-pharmacy',
    label: 'Manage Medication Orders',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-medication-management'],
    children: ['action-receive-order-pharmacy', 'action-verify-order-pharmacy', 'action-prepare-order-pharmacy']
  },
  
  // Product-specific steps for Lab
  'step-review-results-lab': {
    id: 'step-review-results-lab',
    label: 'Review Results',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-result-management-lab'],
    children: ['action-analyze-results-lab', 'action-validate-results-lab', 'action-approve-results-lab']
  },
  'step-interpret-findings-lab': {
    id: 'step-interpret-findings-lab',
    label: 'Interpret Findings',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-result-management-lab'],
    children: ['action-analyze-patterns-lab', 'action-add-comments-lab', 'action-flag-abnormals-lab']
  },
  'step-notify-providers-lab': {
    id: 'step-notify-providers-lab',
    label: 'Notify Providers',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-result-management-lab'],
    children: ['action-send-results-lab', 'action-alert-critical-lab', 'action-follow-up-lab']
  },
  
  // Product-specific steps for Scheduling
  'step-send-reminders-communication': {
    id: 'step-send-reminders-communication',
    label: 'Send Reminders',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-communication'],
    children: ['action-create-reminder-scheduling', 'action-send-notification-scheduling', 'action-track-confirmation-scheduling']
  },

  // Additional steps
  'step-manage-referrals': {
    id: 'step-manage-referrals',
    label: 'Manage Referrals',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-care-coordination'],
    children: ['action-create-referral', 'action-track-referral', 'action-receive-feedback']
  },
  'step-share-records': {
    id: 'step-share-records',
    label: 'Share Medical Records',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-care-coordination'],
    children: ['action-export-records', 'action-send-secure', 'action-grant-access']
  },
  'step-coordinate-providers': {
    id: 'step-coordinate-providers',
    label: 'Coordinate Providers',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-care-coordination'],
    children: ['action-communicate-team', 'action-share-updates', 'action-align-plans']
  },
  'step-dispense-medications': {
    id: 'step-dispense-medications',
    label: 'Dispense Medications',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-medication-management'],
    children: ['action-verify-prescription', 'action-prepare-medication', 'action-label-package']
  },
  'step-track-adherence': {
    id: 'step-track-adherence',
    label: 'Track Medication Adherence',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-medication-management'],
    children: ['action-monitor-refills', 'action-check-compliance', 'action-intervene-gaps']
  },

  // Duplicate Step Nodes - These represent overlapping functionality across products
  // These are the "problem" nodes at the step level that show why rationalization is needed
  
  // Patient monitoring steps - EHR version
  'step-track-vitals-ehr': {
    id: 'step-track-vitals-ehr',
    label: 'Track Vital Signs',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr'],
    children: ['action-record-vitals-ehr', 'action-monitor-trends-ehr', 'action-flag-abnormal-ehr']
  },
  'step-monitor-conditions-ehr': {
    id: 'step-monitor-conditions-ehr',
    label: 'Monitor Conditions',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr'],
    children: ['action-track-progress-ehr', 'action-assess-status-ehr', 'action-update-plan-ehr']
  },
  'step-alert-providers-ehr': {
    id: 'step-alert-providers-ehr',
    label: 'Alert Providers',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr'],
    children: ['action-send-alert-ehr', 'action-escalate-urgent-ehr', 'action-notify-team-ehr']
  },
  
  // Patient monitoring steps - Pharmacy version  
  'step-track-vitals-pharmacy': {
    id: 'step-track-vitals-pharmacy',
    label: 'Track Vital Signs',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy'],
    children: ['action-record-vitals-pharmacy', 'action-monitor-trends-pharmacy', 'action-flag-abnormal-pharmacy']
  },
  'step-monitor-adherence-pharmacy': {
    id: 'step-monitor-adherence-pharmacy',
    label: 'Monitor Medication Adherence',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy'],
    children: ['action-track-doses-pharmacy', 'action-check-compliance-pharmacy', 'action-intervene-gaps-pharmacy']
  },
  'step-alert-providers-pharmacy': {
    id: 'step-alert-providers-pharmacy',
    label: 'Alert Providers',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy'],
    children: ['action-send-alert-pharmacy', 'action-escalate-urgent-pharmacy', 'action-notify-team-pharmacy']
  },
  
  // Appointment management steps - Scheduling version
  'step-schedule-appointment-scheduling': {
    id: 'step-schedule-appointment-scheduling',
    label: 'Schedule Appointment',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-appointment-management-scheduling'],
    children: ['action-find-slot-scheduling', 'action-book-appointment-scheduling', 'action-confirm-booking-scheduling']
  },
  'step-manage-calendar-scheduling': {
    id: 'step-manage-calendar-scheduling',
    label: 'Manage Calendar',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-appointment-management-scheduling'],
    children: ['action-view-schedule-scheduling', 'action-block-time-scheduling', 'action-reschedule-scheduling']
  },
  'step-send-reminders-scheduling': {
    id: 'step-send-reminders-scheduling',
    label: 'Send Reminders',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-appointment-management-scheduling'],
    children: ['action-create-reminder-scheduling', 'action-send-notification-scheduling', 'action-track-confirmation-scheduling']
  },
  
  // Appointment management steps - EHR version
  'step-schedule-appointment-ehr': {
    id: 'step-schedule-appointment-ehr',
    label: 'Schedule Appointment',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-appointment-management-ehr'],
    children: ['action-find-slot-ehr', 'action-book-appointment-ehr', 'action-confirm-booking-ehr']
  },
  'step-document-appointment-ehr': {
    id: 'step-document-appointment-ehr',
    label: 'Document Appointment',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-appointment-management-ehr'],
    children: ['action-record-appointment-ehr', 'action-note-details-ehr', 'action-update-records-ehr']
  },
  'step-track-noshows-ehr': {
    id: 'step-track-noshows-ehr',
    label: 'Track No-Shows',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-appointment-management-ehr'],
    children: ['action-flag-noshow-ehr', 'action-document-reason-ehr', 'action-notify-billing-ehr']
  },
  
  // Test ordering steps - Lab version
  'step-receive-orders-lab': {
    id: 'step-receive-orders-lab',
    label: 'Receive Test Orders',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-test-ordering-lab'],
    children: ['action-accept-order-lab', 'action-verify-order-lab', 'action-queue-test-lab']
  },
  'step-process-specimens-lab': {
    id: 'step-process-specimens-lab',
    label: 'Process Specimens',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-test-ordering-lab'],
    children: ['action-receive-specimen-lab', 'action-prepare-sample-lab', 'action-run-test-lab']
  },
  'step-track-status-lab': {
    id: 'step-track-status-lab',
    label: 'Track Test Status',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-test-ordering-lab'],
    children: ['action-update-status-lab', 'action-notify-delays-lab', 'action-send-results-lab']
  },
  
  // Test ordering steps - EHR version
  'step-order-tests-ehr': {
    id: 'step-order-tests-ehr',
    label: 'Order Tests',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-test-ordering-ehr'],
    children: ['action-select-tests-ehr', 'action-specify-urgency-ehr', 'action-add-instructions-ehr']
  },
  'step-track-results-ehr': {
    id: 'step-track-results-ehr',
    label: 'Track Test Results',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-test-ordering-ehr'],
    children: ['action-check-status-ehr', 'action-receive-results-ehr', 'action-flag-critical-ehr']
  },
  'step-document-results-ehr': {
    id: 'step-document-results-ehr',
    label: 'Document Results',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-test-ordering-ehr'],
    children: ['action-record-results-ehr', 'action-add-interpretation-ehr', 'action-update-chart-ehr']
  },
  
  // Insurance verification steps - Billing version
  'step-verify-coverage-billing': {
    id: 'step-verify-coverage-billing',
    label: 'Verify Coverage',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-insurance-verification-billing'],
    children: ['action-check-insurance-billing', 'action-verify-benefits-billing', 'action-confirm-copay-billing']
  },
  'step-check-eligibility-billing': {
    id: 'step-check-eligibility-billing',
    label: 'Check Eligibility',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-insurance-verification-billing'],
    children: ['action-verify-eligibility-billing', 'action-check-limits-billing', 'action-confirm-coverage-billing']
  },
  'step-obtain-authorization-billing': {
    id: 'step-obtain-authorization-billing',
    label: 'Obtain Authorization',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-insurance-verification-billing'],
    children: ['action-submit-auth-billing', 'action-track-approval-billing', 'action-document-auth-billing']
  },
  
  // Insurance verification steps - Scheduling version
  'step-verify-coverage-scheduling': {
    id: 'step-verify-coverage-scheduling',
    label: 'Verify Coverage',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-insurance-verification-scheduling'],
    children: ['action-check-insurance-scheduling', 'action-verify-basic-scheduling', 'action-note-requirements-scheduling']
  },
  'step-confirm-copay-scheduling': {
    id: 'step-confirm-copay-scheduling',
    label: 'Confirm Copay',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-insurance-verification-scheduling'],
    children: ['action-calculate-copay-scheduling', 'action-inform-patient-scheduling', 'action-collect-copay-scheduling']
  },
  'step-notify-patient-scheduling': {
    id: 'step-notify-patient-scheduling',
    label: 'Notify Patient',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-insurance-verification-scheduling'],
    children: ['action-send-notice-scheduling', 'action-explain-coverage-scheduling', 'action-update-appointment-scheduling']
  },

  // Action Level - many are shared across products
  'action-view-records-ehr': {
    id: 'action-view-records-ehr',
    label: 'View Patient Records',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-history-ehr'],
    children: []
  },
  'action-check-allergies-ehr': {
    id: 'action-check-allergies-ehr',
    label: 'Check Allergies',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-history-ehr'],
    children: []
  },
  'action-review-medications-ehr': {
    id: 'action-review-medications-ehr',
    label: 'Review Current Medications',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-history-ehr'],
    children: []
  },
  'action-record-symptoms': {
    id: 'action-record-symptoms',
    label: 'Record Symptoms',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-findings-ehr'],
    children: []
  },
  'action-note-observations': {
    id: 'action-note-observations',
    label: 'Note Clinical Observations',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-findings-ehr'],
    children: []
  },
  'action-add-diagnosis': {
    id: 'action-add-diagnosis',
    label: 'Add Diagnosis',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-findings-ehr'],
    children: []
  },

  // Product-specific actions for steps that were referencing shared actions
  'action-select-medication-ehr': {
    id: 'action-select-medication-ehr',
    label: 'Select Medication',
    level: 'action',
    products: ['ehr'],
    parents: ['step-prescribe-medications-ehr'],
    children: []
  },
  'action-set-dosage-ehr': {
    id: 'action-set-dosage-ehr',
    label: 'Set Dosage',
    level: 'action',
    products: ['ehr'],
    parents: ['step-prescribe-medications-ehr'],
    children: []
  },
  'action-send-prescription-ehr': {
    id: 'action-send-prescription-ehr',
    label: 'Send Prescription',
    level: 'action',
    products: ['ehr'],
    parents: ['step-prescribe-medications-ehr'],
    children: []
  },
  'action-set-reminder-ehr': {
    id: 'action-set-reminder-ehr',
    label: 'Set Reminder',
    level: 'action',
    products: ['ehr'],
    parents: ['step-schedule-followup-ehr'],
    children: []
  },
  'action-notify-patient-ehr': {
    id: 'action-notify-patient-ehr',
    label: 'Notify Patient',
    level: 'action',
    products: ['ehr'],
    parents: ['step-schedule-followup-ehr'],
    children: []
  },
  'action-record-encounter-ehr': {
    id: 'action-record-encounter-ehr',
    label: 'Record Encounter',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-visit-ehr'],
    children: []
  },
  'action-update-problem-list-ehr': {
    id: 'action-update-problem-list-ehr',
    label: 'Update Problem List',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-visit-ehr'],
    children: []
  },
  'action-code-visit-ehr': {
    id: 'action-code-visit-ehr',
    label: 'Code Visit',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-visit-ehr'],
    children: []
  },
  'action-modify-data-ehr': {
    id: 'action-modify-data-ehr',
    label: 'Modify Data',
    level: 'action',
    products: ['ehr'],
    parents: ['step-update-records-ehr'],
    children: []
  },
  'action-add-notes-ehr': {
    id: 'action-add-notes-ehr',
    label: 'Add Notes',
    level: 'action',
    products: ['ehr'],
    parents: ['step-update-records-ehr'],
    children: []
  },
  'action-attach-files-ehr': {
    id: 'action-attach-files-ehr',
    label: 'Attach Files',
    level: 'action',
    products: ['ehr'],
    parents: ['step-update-records-ehr'],
    children: []
  },

  // Missing action nodes for Pharmacy
  'action-accept-prescription-pharmacy': {
    id: 'action-accept-prescription-pharmacy',
    label: 'Accept Prescription',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-receive-prescriptions-pharmacy'],
    children: []
  },
  'action-validate-prescription-pharmacy': {
    id: 'action-validate-prescription-pharmacy',
    label: 'Validate Prescription',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-receive-prescriptions-pharmacy'],
    children: []
  },
  'action-queue-fill-pharmacy': {
    id: 'action-queue-fill-pharmacy',
    label: 'Queue for Filling',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-receive-prescriptions-pharmacy'],
    children: []
  },
  'action-check-validity-pharmacy': {
    id: 'action-check-validity-pharmacy',
    label: 'Check Validity',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-verify-prescriptions-pharmacy'],
    children: []
  },
  'action-verify-dosage-pharmacy': {
    id: 'action-verify-dosage-pharmacy',
    label: 'Verify Dosage',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-verify-prescriptions-pharmacy'],
    children: []
  },
  'action-check-interactions-pharmacy': {
    id: 'action-check-interactions-pharmacy',
    label: 'Check Interactions',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-verify-prescriptions-pharmacy'],
    children: []
  },
  'action-track-refills-pharmacy': {
    id: 'action-track-refills-pharmacy',
    label: 'Track Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-manage-refills-pharmacy'],
    children: []
  },
  'action-authorize-refills-pharmacy': {
    id: 'action-authorize-refills-pharmacy',
    label: 'Authorize Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-manage-refills-pharmacy'],
    children: []
  },
  'action-notify-refills-pharmacy': {
    id: 'action-notify-refills-pharmacy',
    label: 'Notify About Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-manage-refills-pharmacy'],
    children: []
  },
  'action-receive-order-pharmacy': {
    id: 'action-receive-order-pharmacy',
    label: 'Receive Order',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-prescribe-medications-pharmacy'],
    children: []
  },
  'action-verify-order-pharmacy': {
    id: 'action-verify-order-pharmacy',
    label: 'Verify Order',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-prescribe-medications-pharmacy'],
    children: []
  },
  'action-prepare-order-pharmacy': {
    id: 'action-prepare-order-pharmacy',
    label: 'Prepare Order',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-prescribe-medications-pharmacy'],
    children: []
  },
  
  // Missing action nodes for Lab
  'action-analyze-results-lab': {
    id: 'action-analyze-results-lab',
    label: 'Analyze Results',
    level: 'action',
    products: ['lab'],
    parents: ['step-review-results-lab'],
    children: []
  },
  'action-validate-results-lab': {
    id: 'action-validate-results-lab',
    label: 'Validate Results',
    level: 'action',
    products: ['lab'],
    parents: ['step-review-results-lab'],
    children: []
  },
  'action-approve-results-lab': {
    id: 'action-approve-results-lab',
    label: 'Approve Results',
    level: 'action',
    products: ['lab'],
    parents: ['step-review-results-lab'],
    children: []
  },
  'action-analyze-patterns-lab': {
    id: 'action-analyze-patterns-lab',
    label: 'Analyze Patterns',
    level: 'action',
    products: ['lab'],
    parents: ['step-interpret-findings-lab'],
    children: []
  },
  'action-add-comments-lab': {
    id: 'action-add-comments-lab',
    label: 'Add Comments',
    level: 'action',
    products: ['lab'],
    parents: ['step-interpret-findings-lab'],
    children: []
  },
  'action-flag-abnormals-lab': {
    id: 'action-flag-abnormals-lab',
    label: 'Flag Abnormals',
    level: 'action',
    products: ['lab'],
    parents: ['step-interpret-findings-lab'],
    children: []
  },
  'action-alert-critical-lab': {
    id: 'action-alert-critical-lab',
    label: 'Alert Critical',
    level: 'action',
    products: ['lab'],
    parents: ['step-notify-providers-lab'],
    children: []
  },
  'action-send-results-lab': {
    id: 'action-send-results-lab',
    label: 'Send Results',
    level: 'action',
    products: ['lab'],
    parents: ['step-notify-providers-lab'],
    children: []
  },
  'action-follow-up-lab': {
    id: 'action-follow-up-lab',
    label: 'Follow Up',
    level: 'action',
    products: ['lab'],
    parents: ['step-notify-providers-lab'],
    children: []
  },
  
  // Missing action nodes for duplicate steps
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
  'action-flag-abnormal-ehr': {
    id: 'action-flag-abnormal-ehr',
    label: 'Flag Abnormal',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr'],
    children: []
  },
  'action-track-progress-ehr': {
    id: 'action-track-progress-ehr',
    label: 'Track Progress',
    level: 'action',
    products: ['ehr'],
    parents: ['step-monitor-conditions-ehr'],
    children: []
  },
  'action-assess-status-ehr': {
    id: 'action-assess-status-ehr',
    label: 'Assess Status',
    level: 'action',
    products: ['ehr'],
    parents: ['step-monitor-conditions-ehr'],
    children: []
  },
  'action-update-plan-ehr': {
    id: 'action-update-plan-ehr',
    label: 'Update Plan',
    level: 'action',
    products: ['ehr'],
    parents: ['step-monitor-conditions-ehr'],
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
  'action-notify-team-ehr': {
    id: 'action-notify-team-ehr',
    label: 'Notify Team',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr'],
    children: []
  },
  
  // More missing action nodes for pharmacy duplicate steps
  'action-record-vitals-pharmacy': {
    id: 'action-record-vitals-pharmacy',
    label: 'Record Vitals',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-vitals-pharmacy'],
    children: []
  },
  'action-monitor-trends-pharmacy': {
    id: 'action-monitor-trends-pharmacy',
    label: 'Monitor Trends',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-vitals-pharmacy'],
    children: []
  },
  'action-flag-abnormal-pharmacy': {
    id: 'action-flag-abnormal-pharmacy',
    label: 'Flag Abnormal',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-vitals-pharmacy'],
    children: []
  },
  'action-track-doses-pharmacy': {
    id: 'action-track-doses-pharmacy',
    label: 'Track Doses',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-monitor-adherence-pharmacy'],
    children: []
  },
  'action-check-compliance-pharmacy': {
    id: 'action-check-compliance-pharmacy',
    label: 'Check Compliance',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-monitor-adherence-pharmacy'],
    children: []
  },
  'action-intervene-gaps-pharmacy': {
    id: 'action-intervene-gaps-pharmacy',
    label: 'Intervene on Gaps',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-monitor-adherence-pharmacy'],
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
  'action-notify-team-pharmacy': {
    id: 'action-notify-team-pharmacy',
    label: 'Notify Team',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-alert-providers-pharmacy'],
    children: []
  },
  
  // Missing action nodes for scheduling duplicate steps
  'action-find-slot-scheduling': {
    id: 'action-find-slot-scheduling',
    label: 'Find Slot',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-schedule-appointment-scheduling'],
    children: []
  },
  'action-book-appointment-scheduling': {
    id: 'action-book-appointment-scheduling',
    label: 'Book Appointment',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-schedule-appointment-scheduling'],
    children: []
  },
  'action-confirm-booking-scheduling': {
    id: 'action-confirm-booking-scheduling',
    label: 'Confirm Booking',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-schedule-appointment-scheduling'],
    children: []
  },
  'action-view-schedule-scheduling': {
    id: 'action-view-schedule-scheduling',
    label: 'View Schedule',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-manage-calendar-scheduling'],
    children: []
  },
  'action-block-time-scheduling': {
    id: 'action-block-time-scheduling',
    label: 'Block Time',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-manage-calendar-scheduling'],
    children: []
  },
  'action-reschedule-scheduling': {
    id: 'action-reschedule-scheduling',
    label: 'Reschedule',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-manage-calendar-scheduling'],
    children: []
  },
  'action-create-reminder-scheduling': {
    id: 'action-create-reminder-scheduling',
    label: 'Create Reminder',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-send-reminders-scheduling', 'step-send-reminders-communication'],
    children: []
  },
  'action-send-notification-scheduling': {
    id: 'action-send-notification-scheduling',
    label: 'Send Notification',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-send-reminders-scheduling', 'step-send-reminders-communication'],
    children: []
  },
  'action-track-confirmation-scheduling': {
    id: 'action-track-confirmation-scheduling',
    label: 'Track Confirmation',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-send-reminders-scheduling', 'step-send-reminders-communication'],
    children: []
  },
  
  // Missing action nodes for EHR duplicate steps in appointment management
  'action-find-slot-ehr': {
    id: 'action-find-slot-ehr',
    label: 'Find Slot',
    level: 'action',
    products: ['ehr'],
    parents: ['step-schedule-appointment-ehr'],
    children: []
  },
  'action-book-appointment-ehr': {
    id: 'action-book-appointment-ehr',
    label: 'Book Appointment',
    level: 'action',
    products: ['ehr'],
    parents: ['step-schedule-appointment-ehr', 'step-schedule-followup-ehr'],
    children: []
  },
  'action-confirm-booking-ehr': {
    id: 'action-confirm-booking-ehr',
    label: 'Confirm Booking',
    level: 'action',
    products: ['ehr'],
    parents: ['step-schedule-appointment-ehr'],
    children: []
  },
  'action-record-appointment-ehr': {
    id: 'action-record-appointment-ehr',
    label: 'Record Appointment',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-appointment-ehr'],
    children: []
  },
  'action-note-details-ehr': {
    id: 'action-note-details-ehr',
    label: 'Note Details',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-appointment-ehr'],
    children: []
  },
  'action-update-records-ehr': {
    id: 'action-update-records-ehr',
    label: 'Update Records',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-appointment-ehr'],
    children: []
  },
  'action-flag-noshow-ehr': {
    id: 'action-flag-noshow-ehr',
    label: 'Flag No-Show',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-noshows-ehr'],
    children: []
  },
  'action-document-reason-ehr': {
    id: 'action-document-reason-ehr',
    label: 'Document Reason',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-noshows-ehr'],
    children: []
  },
  'action-notify-billing-ehr': {
    id: 'action-notify-billing-ehr',
    label: 'Notify Billing',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-noshows-ehr'],
    children: []
  },
  
  // Missing action nodes for lab duplicate steps
  'action-accept-order-lab': {
    id: 'action-accept-order-lab',
    label: 'Accept Order',
    level: 'action',
    products: ['lab'],
    parents: ['step-receive-orders-lab'],
    children: []
  },
  'action-verify-order-lab': {
    id: 'action-verify-order-lab',
    label: 'Verify Order',
    level: 'action',
    products: ['lab'],
    parents: ['step-receive-orders-lab'],
    children: []
  },
  'action-queue-test-lab': {
    id: 'action-queue-test-lab',
    label: 'Queue Test',
    level: 'action',
    products: ['lab'],
    parents: ['step-receive-orders-lab'],
    children: []
  },
  'action-receive-specimen-lab': {
    id: 'action-receive-specimen-lab',
    label: 'Receive Specimen',
    level: 'action',
    products: ['lab'],
    parents: ['step-process-specimens-lab'],
    children: []
  },
  'action-prepare-sample-lab': {
    id: 'action-prepare-sample-lab',
    label: 'Prepare Sample',
    level: 'action',
    products: ['lab'],
    parents: ['step-process-specimens-lab'],
    children: []
  },
  'action-run-test-lab': {
    id: 'action-run-test-lab',
    label: 'Run Test',
    level: 'action',
    products: ['lab'],
    parents: ['step-process-specimens-lab'],
    children: []
  },
  'action-update-status-lab': {
    id: 'action-update-status-lab',
    label: 'Update Status',
    level: 'action',
    products: ['lab'],
    parents: ['step-track-status-lab'],
    children: []
  },
  'action-notify-delays-lab': {
    id: 'action-notify-delays-lab',
    label: 'Notify Delays',
    level: 'action',
    products: ['lab'],
    parents: ['step-track-status-lab'],
    children: []
  },
  
  // Missing action nodes for EHR test ordering
  'action-select-tests-ehr': {
    id: 'action-select-tests-ehr',
    label: 'Select Tests',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests-ehr', 'step-order-tests-ehr-diagnosis'],
    children: []
  },
  'action-specify-urgency-ehr': {
    id: 'action-specify-urgency-ehr',
    label: 'Specify Urgency',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests-ehr', 'step-order-tests-ehr-diagnosis'],
    children: []
  },
  'action-add-instructions-ehr': {
    id: 'action-add-instructions-ehr',
    label: 'Add Instructions',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests-ehr', 'step-order-tests-ehr-diagnosis'],
    children: []
  },
  'action-check-status-ehr': {
    id: 'action-check-status-ehr',
    label: 'Check Status',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-results-ehr'],
    children: []
  },
  'action-receive-results-ehr': {
    id: 'action-receive-results-ehr',
    label: 'Receive Results',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-results-ehr'],
    children: []
  },
  'action-flag-critical-ehr': {
    id: 'action-flag-critical-ehr',
    label: 'Flag Critical',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-results-ehr'],
    children: []
  },
  'action-record-results-ehr': {
    id: 'action-record-results-ehr',
    label: 'Record Results',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-results-ehr'],
    children: []
  },
  'action-add-interpretation-ehr': {
    id: 'action-add-interpretation-ehr',
    label: 'Add Interpretation',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-results-ehr'],
    children: []
  },
  'action-update-chart-ehr': {
    id: 'action-update-chart-ehr',
    label: 'Update Chart',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-results-ehr'],
    children: []
  },
  
  // Missing action nodes for billing duplicate steps
  'action-check-insurance-billing': {
    id: 'action-check-insurance-billing',
    label: 'Check Insurance',
    level: 'action',
    products: ['billing'],
    parents: ['step-verify-coverage-billing'],
    children: []
  },
  'action-verify-benefits-billing': {
    id: 'action-verify-benefits-billing',
    label: 'Verify Benefits',
    level: 'action',
    products: ['billing'],
    parents: ['step-verify-coverage-billing'],
    children: []
  },
  'action-confirm-copay-billing': {
    id: 'action-confirm-copay-billing',
    label: 'Confirm Copay',
    level: 'action',
    products: ['billing'],
    parents: ['step-verify-coverage-billing'],
    children: []
  },
  'action-verify-eligibility-billing': {
    id: 'action-verify-eligibility-billing',
    label: 'Verify Eligibility',
    level: 'action',
    products: ['billing'],
    parents: ['step-check-eligibility-billing'],
    children: []
  },
  'action-check-limits-billing': {
    id: 'action-check-limits-billing',
    label: 'Check Limits',
    level: 'action',
    products: ['billing'],
    parents: ['step-check-eligibility-billing'],
    children: []
  },
  'action-confirm-coverage-billing': {
    id: 'action-confirm-coverage-billing',
    label: 'Confirm Coverage',
    level: 'action',
    products: ['billing'],
    parents: ['step-check-eligibility-billing'],
    children: []
  },
  'action-submit-auth-billing': {
    id: 'action-submit-auth-billing',
    label: 'Submit Authorization',
    level: 'action',
    products: ['billing'],
    parents: ['step-obtain-authorization-billing'],
    children: []
  },
  'action-track-approval-billing': {
    id: 'action-track-approval-billing',
    label: 'Track Approval',
    level: 'action',
    products: ['billing'],
    parents: ['step-obtain-authorization-billing'],
    children: []
  },
  'action-document-auth-billing': {
    id: 'action-document-auth-billing',
    label: 'Document Authorization',
    level: 'action',
    products: ['billing'],
    parents: ['step-obtain-authorization-billing'],
    children: []
  },
  
  // Missing action nodes for scheduling insurance verification
  'action-check-insurance-scheduling': {
    id: 'action-check-insurance-scheduling',
    label: 'Check Insurance',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-verify-coverage-scheduling'],
    children: []
  },
  'action-verify-basic-scheduling': {
    id: 'action-verify-basic-scheduling',
    label: 'Verify Basic Coverage',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-verify-coverage-scheduling'],
    children: []
  },
  'action-note-requirements-scheduling': {
    id: 'action-note-requirements-scheduling',
    label: 'Note Requirements',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-verify-coverage-scheduling'],
    children: []
  },
  'action-calculate-copay-scheduling': {
    id: 'action-calculate-copay-scheduling',
    label: 'Calculate Copay',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-confirm-copay-scheduling'],
    children: []
  },
  'action-inform-patient-scheduling': {
    id: 'action-inform-patient-scheduling',
    label: 'Inform Patient',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-confirm-copay-scheduling'],
    children: []
  },
  'action-collect-copay-scheduling': {
    id: 'action-collect-copay-scheduling',
    label: 'Collect Copay',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-confirm-copay-scheduling'],
    children: []
  },
  'action-send-notice-scheduling': {
    id: 'action-send-notice-scheduling',
    label: 'Send Notice',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-notify-patient-scheduling'],
    children: []
  },
  'action-explain-coverage-scheduling': {
    id: 'action-explain-coverage-scheduling',
    label: 'Explain Coverage',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-notify-patient-scheduling'],
    children: []
  },
  'action-update-appointment-scheduling': {
    id: 'action-update-appointment-scheduling',
    label: 'Update Appointment',
    level: 'action',
    products: ['scheduling'],
    parents: ['step-notify-patient-scheduling'],
    children: []
  },
  
  // Missing action nodes for other steps
  'action-create-referral': {
    id: 'action-create-referral',
    label: 'Create Referral',
    level: 'action',
    products: ['ehr'],
    parents: ['step-manage-referrals'],
    children: []
  },
  'action-track-referral': {
    id: 'action-track-referral',
    label: 'Track Referral',
    level: 'action',
    products: ['ehr'],
    parents: ['step-manage-referrals'],
    children: []
  },
  'action-receive-feedback': {
    id: 'action-receive-feedback',
    label: 'Receive Feedback',
    level: 'action',
    products: ['ehr'],
    parents: ['step-manage-referrals'],
    children: []
  },
  'action-export-records': {
    id: 'action-export-records',
    label: 'Export Records',
    level: 'action',
    products: ['ehr'],
    parents: ['step-share-records'],
    children: []
  },
  'action-send-secure': {
    id: 'action-send-secure',
    label: 'Send Securely',
    level: 'action',
    products: ['ehr'],
    parents: ['step-share-records'],
    children: []
  },
  'action-grant-access': {
    id: 'action-grant-access',
    label: 'Grant Access',
    level: 'action',
    products: ['ehr'],
    parents: ['step-share-records'],
    children: []
  },
  'action-communicate-team': {
    id: 'action-communicate-team',
    label: 'Communicate with Team',
    level: 'action',
    products: ['ehr'],
    parents: ['step-coordinate-providers'],
    children: []
  },
  'action-share-updates': {
    id: 'action-share-updates',
    label: 'Share Updates',
    level: 'action',
    products: ['ehr'],
    parents: ['step-coordinate-providers'],
    children: []
  },
  'action-align-plans': {
    id: 'action-align-plans',
    label: 'Align Plans',
    level: 'action',
    products: ['ehr'],
    parents: ['step-coordinate-providers'],
    children: []
  },
  'action-verify-prescription': {
    id: 'action-verify-prescription',
    label: 'Verify Prescription',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-dispense-medications'],
    children: []
  },
  'action-prepare-medication': {
    id: 'action-prepare-medication',
    label: 'Prepare Medication',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-dispense-medications'],
    children: []
  },
  'action-label-package': {
    id: 'action-label-package',
    label: 'Label Package',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-dispense-medications'],
    children: []
  },
  'action-monitor-refills': {
    id: 'action-monitor-refills',
    label: 'Monitor Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence'],
    children: []
  },
  'action-check-compliance': {
    id: 'action-check-compliance',
    label: 'Check Compliance',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence'],
    children: []
  },
  'action-intervene-gaps': {
    id: 'action-intervene-gaps',
    label: 'Intervene on Gaps',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence'],
    children: []
  },
  
  // Additional action nodes to complete the hierarchy
  'action-set-goals': {
    id: 'action-set-goals',
    label: 'Set Treatment Goals',
    level: 'action',
    products: ['ehr'],
    parents: ['step-create-care-plan'],
    children: []
  },
  'action-define-interventions': {
    id: 'action-define-interventions',
    label: 'Define Interventions',
    level: 'action',
    products: ['ehr'],
    parents: ['step-create-care-plan'],
    children: []
  },
  'action-assign-tasks': {
    id: 'action-assign-tasks',
    label: 'Assign Care Tasks',
    level: 'action',
    products: ['ehr'],
    parents: ['step-create-care-plan'],
    children: []
  },
  'action-create-summary': {
    id: 'action-create-summary',
    label: 'Create Visit Summary',
    level: 'action',
    products: ['ehr'],
    parents: ['step-generate-reports-ehr'],
    children: []
  },
  'action-export-data': {
    id: 'action-export-data',
    label: 'Export Clinical Data',
    level: 'action',
    products: ['ehr'],
    parents: ['step-generate-reports-ehr'],
    children: []
  },
  'action-share-report': {
    id: 'action-share-report',
    label: 'Share Report',
    level: 'action',
    products: ['ehr'],
    parents: ['step-generate-reports-ehr'],
    children: []
  }
};
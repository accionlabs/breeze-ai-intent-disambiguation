// Simplified Healthcare domain functional hierarchy
// Focus on core workflows with proper rationalization
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level (Top Level)
  'product-ehr': {
    id: 'product-ehr',
    label: 'EHR System',
    level: 'product',
    parents: [],
    children: ['outcome-clinical-care', 'outcome-patient-management']
  },
  'product-scheduling': {
    id: 'product-scheduling',
    label: 'AppointmentPro',
    level: 'product',
    parents: [],
    children: ['outcome-appointment-management', 'outcome-patient-access']
  },
  'product-billing': {
    id: 'product-billing',
    label: 'MedBilling',
    level: 'product',
    parents: [],
    children: ['outcome-revenue-cycle', 'outcome-financial-compliance']
  },
  'product-pharmacy': {
    id: 'product-pharmacy',
    label: 'PharmaCare',
    level: 'product',
    parents: [],
    children: ['outcome-medication-management', 'outcome-pharmacy-operations']
  },
  'product-lab': {
    id: 'product-lab',
    label: 'LabConnect',
    level: 'product',
    parents: [],
    children: ['outcome-diagnostic-services', 'outcome-lab-operations']
  },

  // Outcome Level - EHR
  'outcome-clinical-care': {
    id: 'outcome-clinical-care',
    label: 'Clinical Care',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr'],
    children: ['scenario-patient-diagnosis', 'scenario-treatment-planning', 'scenario-clinical-documentation']
  },
  'outcome-patient-management': {
    id: 'outcome-patient-management',
    label: 'Patient Management',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr'],
    children: ['scenario-patient-monitoring-ehr', 'scenario-care-coordination']
  },

  // Outcome Level - Scheduling
  'outcome-appointment-management': {
    id: 'outcome-appointment-management',
    label: 'Appointment Management',
    level: 'outcome',
    products: ['scheduling'],
    parents: ['product-scheduling'],
    children: ['scenario-appointment-booking', 'scenario-schedule-optimization']
  },
  'outcome-patient-access': {
    id: 'outcome-patient-access',
    label: 'Patient Access',
    level: 'outcome',
    products: ['scheduling'],
    parents: ['product-scheduling'],
    children: ['scenario-self-service', 'scenario-reminders']
  },

  // Outcome Level - Billing
  'outcome-revenue-cycle': {
    id: 'outcome-revenue-cycle',
    label: 'Revenue Cycle',
    level: 'outcome',
    products: ['billing'],
    parents: ['product-billing'],
    children: ['scenario-claims-processing', 'scenario-payment-collection']
  },
  'outcome-financial-compliance': {
    id: 'outcome-financial-compliance',
    label: 'Financial Compliance',
    level: 'outcome',
    products: ['billing'],
    parents: ['product-billing'],
    children: ['scenario-billing-compliance', 'scenario-insurance-verification-billing']
  },

  // Outcome Level - Pharmacy
  'outcome-medication-management': {
    id: 'outcome-medication-management',
    label: 'Medication Management',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-prescription-filling', 'scenario-medication-therapy']
  },
  'outcome-pharmacy-operations': {
    id: 'outcome-pharmacy-operations',
    label: 'Pharmacy Operations',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-inventory-management', 'scenario-patient-monitoring-pharmacy']
  },

  // Outcome Level - Lab
  'outcome-diagnostic-services': {
    id: 'outcome-diagnostic-services',
    label: 'Diagnostic Services',
    level: 'outcome',
    products: ['lab'],
    parents: ['product-lab'],
    children: ['scenario-test-processing', 'scenario-result-reporting']
  },
  'outcome-lab-operations': {
    id: 'outcome-lab-operations',
    label: 'Lab Operations',
    level: 'outcome',
    products: ['lab'],
    parents: ['product-lab'],
    children: ['scenario-quality-control', 'scenario-specimen-management']
  },

  // Scenario Level - EHR
  'scenario-patient-diagnosis': {
    id: 'scenario-patient-diagnosis',
    label: 'Patient Diagnosis',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-care'],
    children: ['step-review-history', 'step-document-findings', 'step-order-tests-ehr']
  },
  'scenario-treatment-planning': {
    id: 'scenario-treatment-planning',
    label: 'Treatment Planning',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-care'],
    children: ['step-create-plan', 'step-prescribe-medications-ehr', 'step-schedule-followup']
  },
  'scenario-clinical-documentation': {
    id: 'scenario-clinical-documentation',
    label: 'Clinical Documentation',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-clinical-care'],
    children: ['step-record-notes', 'step-update-charts', 'step-sign-records']
  },
  'scenario-patient-monitoring-ehr': {
    id: 'scenario-patient-monitoring-ehr',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-management'],
    children: ['step-track-vitals-ehr', 'step-monitor-conditions', 'step-alert-providers-ehr']
  },
  'scenario-care-coordination': {
    id: 'scenario-care-coordination',
    label: 'Care Coordination',
    level: 'scenario',
    products: ['ehr'],
    parents: ['outcome-patient-management'],
    children: ['step-coordinate-team', 'step-share-information', 'step-track-referrals']
  },

  // Scenario Level - Scheduling
  'scenario-appointment-booking': {
    id: 'scenario-appointment-booking',
    label: 'Appointment Booking',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-appointment-management'],
    children: ['step-find-availability', 'step-book-appointment', 'step-confirm-booking']
  },
  'scenario-schedule-optimization': {
    id: 'scenario-schedule-optimization',
    label: 'Schedule Optimization',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-appointment-management'],
    children: ['step-manage-calendar', 'step-balance-resources', 'step-handle-changes']
  },
  'scenario-self-service': {
    id: 'scenario-self-service',
    label: 'Self Service',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-patient-access'],
    children: ['step-online-booking', 'step-self-checkin', 'step-update-info']
  },
  'scenario-reminders': {
    id: 'scenario-reminders',
    label: 'Appointment Reminders',
    level: 'scenario',
    products: ['scheduling'],
    parents: ['outcome-patient-access'],
    children: ['step-create-reminders', 'step-send-notifications', 'step-track-confirmations']
  },

  // Scenario Level - Billing
  'scenario-claims-processing': {
    id: 'scenario-claims-processing',
    label: 'Claims Processing',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-revenue-cycle'],
    children: ['step-submit-claims', 'step-track-claims', 'step-manage-denials']
  },
  'scenario-payment-collection': {
    id: 'scenario-payment-collection',
    label: 'Payment Collection',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-revenue-cycle'],
    children: ['step-generate-statements', 'step-process-payments', 'step-manage-collections']
  },
  'scenario-billing-compliance': {
    id: 'scenario-billing-compliance',
    label: 'Billing Compliance',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-financial-compliance'],
    children: ['step-validate-codes', 'step-ensure-accuracy', 'step-audit-billing']
  },
  'scenario-insurance-verification-billing': {
    id: 'scenario-insurance-verification-billing',
    label: 'Insurance Verification',
    level: 'scenario',
    products: ['billing'],
    parents: ['outcome-financial-compliance'],
    children: ['step-verify-coverage-billing', 'step-check-eligibility', 'step-obtain-authorization']
  },

  // Scenario Level - Pharmacy
  'scenario-prescription-filling': {
    id: 'scenario-prescription-filling',
    label: 'Prescription Filling',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-management'],
    children: ['step-receive-prescription', 'step-verify-prescription', 'step-dispense-medication']
  },
  'scenario-medication-therapy': {
    id: 'scenario-medication-therapy',
    label: 'Medication Therapy',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-medication-management'],
    children: ['step-review-therapy', 'step-check-interactions', 'step-counsel-patient']
  },
  'scenario-inventory-management': {
    id: 'scenario-inventory-management',
    label: 'Inventory Management',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-pharmacy-operations'],
    children: ['step-track-inventory', 'step-manage-expiry', 'step-reorder-stock']
  },
  'scenario-patient-monitoring-pharmacy': {
    id: 'scenario-patient-monitoring-pharmacy',
    label: 'Patient Monitoring',
    level: 'scenario',
    products: ['pharmacy'],
    parents: ['outcome-pharmacy-operations'],
    children: ['step-track-adherence', 'step-monitor-outcomes', 'step-intervene-issues']
  },

  // Scenario Level - Lab
  'scenario-test-processing': {
    id: 'scenario-test-processing',
    label: 'Test Processing',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-diagnostic-services'],
    children: ['step-receive-orders', 'step-process-specimens', 'step-perform-tests']
  },
  'scenario-result-reporting': {
    id: 'scenario-result-reporting',
    label: 'Result Reporting',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-diagnostic-services'],
    children: ['step-validate-results', 'step-interpret-findings', 'step-send-reports']
  },
  'scenario-quality-control': {
    id: 'scenario-quality-control',
    label: 'Quality Control',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-lab-operations'],
    children: ['step-calibrate-equipment', 'step-run-controls', 'step-document-quality']
  },
  'scenario-specimen-management': {
    id: 'scenario-specimen-management',
    label: 'Specimen Management',
    level: 'scenario',
    products: ['lab'],
    parents: ['outcome-lab-operations'],
    children: ['step-receive-specimens', 'step-track-specimens', 'step-store-specimens']
  },

  // SHARED SCENARIOS - For duplicate functionality across products
  'scenario-patient-monitoring-shared': {
    id: 'scenario-patient-monitoring-shared',
    label: 'Unified Patient Monitoring',
    level: 'scenario',
    products: ['ehr', 'pharmacy'],
    parents: ['outcome-patient-management', 'outcome-pharmacy-operations'],
    children: ['step-patient-monitoring-unified']
  },
  'scenario-test-ordering-shared': {
    id: 'scenario-test-ordering-shared',
    label: 'Unified Test Ordering',
    level: 'scenario',
    products: ['ehr', 'lab'],
    parents: ['outcome-clinical-care', 'outcome-diagnostic-services'],
    children: ['step-test-ordering-unified']
  },

  // Step Level - EHR
  'step-review-history': {
    id: 'step-review-history',
    label: 'Review History',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-diagnosis'],
    children: ['action-view-records', 'action-check-allergies', 'action-review-medications']
  },
  'step-document-findings': {
    id: 'step-document-findings',
    label: 'Document Findings',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-diagnosis'],
    children: ['action-record-symptoms', 'action-note-observations', 'action-add-diagnosis']
  },
  'step-order-tests-ehr': {
    id: 'step-order-tests-ehr',
    label: 'Order Tests',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-diagnosis', 'scenario-test-ordering-shared'],
    children: ['action-select-tests', 'action-specify-urgency', 'action-send-order']
  },
  'step-create-plan': {
    id: 'step-create-plan',
    label: 'Create Treatment Plan',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-treatment-planning'],
    children: ['action-define-goals', 'action-set-interventions', 'action-assign-tasks']
  },
  'step-prescribe-medications-ehr': {
    id: 'step-prescribe-medications-ehr',
    label: 'Prescribe Medications',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-treatment-planning'],
    children: ['action-select-medication', 'action-set-dosage', 'action-send-prescription']
  },
  'step-schedule-followup': {
    id: 'step-schedule-followup',
    label: 'Schedule Followup',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-treatment-planning'],
    children: ['action-determine-timing', 'action-book-followup', 'action-set-reminder']
  },
  'step-record-notes': {
    id: 'step-record-notes',
    label: 'Record Clinical Notes',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-clinical-documentation'],
    children: ['action-enter-soap', 'action-add-details', 'action-attach-files']
  },
  'step-update-charts': {
    id: 'step-update-charts',
    label: 'Update Charts',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-clinical-documentation'],
    children: ['action-update-problems', 'action-update-medications', 'action-update-allergies']
  },
  'step-sign-records': {
    id: 'step-sign-records',
    label: 'Sign Records',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-clinical-documentation'],
    children: ['action-review-entries', 'action-add-signature', 'action-lock-record']
  },
  'step-track-vitals-ehr': {
    id: 'step-track-vitals-ehr',
    label: 'Track Vital Signs',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr', 'scenario-patient-monitoring-shared'],
    children: ['action-record-vitals', 'action-monitor-trends', 'action-flag-abnormal']
  },
  'step-monitor-conditions': {
    id: 'step-monitor-conditions',
    label: 'Monitor Conditions',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr', 'scenario-patient-monitoring-shared'],
    children: ['action-track-progress', 'action-assess-status', 'action-update-plan']
  },
  'step-alert-providers-ehr': {
    id: 'step-alert-providers-ehr',
    label: 'Alert Providers',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-patient-monitoring-ehr', 'scenario-patient-monitoring-shared'],
    children: ['action-send-alert', 'action-escalate-urgent', 'action-notify-team']
  },
  'step-coordinate-team': {
    id: 'step-coordinate-team',
    label: 'Coordinate Care Team',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-care-coordination'],
    children: ['action-assign-roles', 'action-share-updates', 'action-track-tasks']
  },
  'step-share-information': {
    id: 'step-share-information',
    label: 'Share Information',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-care-coordination'],
    children: ['action-send-summary', 'action-share-records', 'action-update-team']
  },
  'step-track-referrals': {
    id: 'step-track-referrals',
    label: 'Track Referrals',
    level: 'step',
    products: ['ehr'],
    parents: ['scenario-care-coordination'],
    children: ['action-create-referral', 'action-track-status', 'action-receive-feedback']
  },

  // Step Level - Scheduling
  'step-find-availability': {
    id: 'step-find-availability',
    label: 'Find Availability',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-appointment-booking'],
    children: ['action-search-slots', 'action-check-provider', 'action-check-resources']
  },
  'step-book-appointment': {
    id: 'step-book-appointment',
    label: 'Book Appointment',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-appointment-booking'],
    children: ['action-reserve-slot', 'action-add-details', 'action-confirm-booking']
  },
  'step-confirm-booking': {
    id: 'step-confirm-booking',
    label: 'Confirm Booking',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-appointment-booking'],
    children: ['action-send-confirmation', 'action-update-calendar', 'action-notify-staff']
  },
  'step-manage-calendar': {
    id: 'step-manage-calendar',
    label: 'Manage Calendar',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-schedule-optimization'],
    children: ['action-view-schedule', 'action-block-time', 'action-adjust-slots']
  },
  'step-balance-resources': {
    id: 'step-balance-resources',
    label: 'Balance Resources',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-schedule-optimization'],
    children: ['action-analyze-usage', 'action-redistribute-load', 'action-optimize-schedule']
  },
  'step-handle-changes': {
    id: 'step-handle-changes',
    label: 'Handle Changes',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-schedule-optimization'],
    children: ['action-reschedule', 'action-cancel-appointment', 'action-manage-waitlist']
  },
  'step-online-booking': {
    id: 'step-online-booking',
    label: 'Online Booking',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-self-service'],
    children: ['action-enable-portal', 'action-show-availability', 'action-accept-booking']
  },
  'step-self-checkin': {
    id: 'step-self-checkin',
    label: 'Self Check-in',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-self-service'],
    children: ['action-verify-arrival', 'action-update-status', 'action-notify-provider']
  },
  'step-update-info': {
    id: 'step-update-info',
    label: 'Update Information',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-self-service'],
    children: ['action-collect-info', 'action-verify-insurance', 'action-update-records']
  },
  'step-create-reminders': {
    id: 'step-create-reminders',
    label: 'Create Reminders',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-reminders'],
    children: ['action-set-timing', 'action-customize-message', 'action-schedule-send']
  },
  'step-send-notifications': {
    id: 'step-send-notifications',
    label: 'Send Notifications',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-reminders'],
    children: ['action-send-sms', 'action-send-email', 'action-send-call']
  },
  'step-track-confirmations': {
    id: 'step-track-confirmations',
    label: 'Track Confirmations',
    level: 'step',
    products: ['scheduling'],
    parents: ['scenario-reminders'],
    children: ['action-log-response', 'action-follow-up', 'action-update-appointment']
  },

  // Step Level - Billing
  'step-submit-claims': {
    id: 'step-submit-claims',
    label: 'Submit Claims',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-claims-processing'],
    children: ['action-prepare-claim', 'action-validate-claim', 'action-transmit-claim']
  },
  'step-track-claims': {
    id: 'step-track-claims',
    label: 'Track Claims',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-claims-processing'],
    children: ['action-monitor-status', 'action-check-payment', 'action-identify-issues']
  },
  'step-manage-denials': {
    id: 'step-manage-denials',
    label: 'Manage Denials',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-claims-processing'],
    children: ['action-review-denial', 'action-appeal-claim', 'action-resubmit-claim']
  },
  'step-generate-statements': {
    id: 'step-generate-statements',
    label: 'Generate Statements',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-payment-collection'],
    children: ['action-calculate-balance', 'action-create-statement', 'action-send-statement']
  },
  'step-process-payments': {
    id: 'step-process-payments',
    label: 'Process Payments',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-payment-collection'],
    children: ['action-accept-payment', 'action-apply-payment', 'action-update-balance']
  },
  'step-manage-collections': {
    id: 'step-manage-collections',
    label: 'Manage Collections',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-payment-collection'],
    children: ['action-identify-overdue', 'action-send-notice', 'action-escalate-collection']
  },
  'step-validate-codes': {
    id: 'step-validate-codes',
    label: 'Validate Codes',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-billing-compliance'],
    children: ['action-check-codes', 'action-verify-modifiers', 'action-ensure-compliance']
  },
  'step-ensure-accuracy': {
    id: 'step-ensure-accuracy',
    label: 'Ensure Accuracy',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-billing-compliance'],
    children: ['action-audit-charges', 'action-verify-documentation', 'action-correct-errors']
  },
  'step-audit-billing': {
    id: 'step-audit-billing',
    label: 'Audit Billing',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-billing-compliance'],
    children: ['action-review-practices', 'action-identify-risks', 'action-implement-corrections']
  },
  'step-verify-coverage-billing': {
    id: 'step-verify-coverage-billing',
    label: 'Verify Coverage',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-insurance-verification-billing'],
    children: ['action-check-insurance', 'action-verify-benefits', 'action-confirm-coverage']
  },
  'step-check-eligibility': {
    id: 'step-check-eligibility',
    label: 'Check Eligibility',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-insurance-verification-billing'],
    children: ['action-verify-eligibility', 'action-check-limits', 'action-document-status']
  },
  'step-obtain-authorization': {
    id: 'step-obtain-authorization',
    label: 'Obtain Authorization',
    level: 'step',
    products: ['billing'],
    parents: ['scenario-insurance-verification-billing'],
    children: ['action-submit-auth', 'action-track-approval', 'action-document-auth']
  },

  // Step Level - Pharmacy
  'step-receive-prescription': {
    id: 'step-receive-prescription',
    label: 'Receive Prescription',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-filling'],
    children: ['action-accept-rx', 'action-verify-rx', 'action-queue-rx']
  },
  'step-verify-prescription': {
    id: 'step-verify-prescription',
    label: 'Verify Prescription',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-filling'],
    children: ['action-check-validity', 'action-verify-dosage', 'action-check-insurance']
  },
  'step-dispense-medication': {
    id: 'step-dispense-medication',
    label: 'Dispense Medication',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-prescription-filling'],
    children: ['action-prepare-medication', 'action-label-medication', 'action-deliver-medication']
  },
  'step-review-therapy': {
    id: 'step-review-therapy',
    label: 'Review Therapy',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-medication-therapy'],
    children: ['action-assess-regimen', 'action-identify-issues', 'action-recommend-changes']
  },
  'step-check-interactions': {
    id: 'step-check-interactions',
    label: 'Check Interactions',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-medication-therapy'],
    children: ['action-screen-interactions', 'action-assess-risk', 'action-alert-prescriber']
  },
  'step-counsel-patient': {
    id: 'step-counsel-patient',
    label: 'Counsel Patient',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-medication-therapy'],
    children: ['action-explain-medication', 'action-discuss-side-effects', 'action-provide-instructions']
  },
  'step-track-inventory': {
    id: 'step-track-inventory',
    label: 'Track Inventory',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-inventory-management'],
    children: ['action-monitor-stock', 'action-update-counts', 'action-identify-shortages']
  },
  'step-manage-expiry': {
    id: 'step-manage-expiry',
    label: 'Manage Expiry',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-inventory-management'],
    children: ['action-check-dates', 'action-rotate-stock', 'action-dispose-expired']
  },
  'step-reorder-stock': {
    id: 'step-reorder-stock',
    label: 'Reorder Stock',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-inventory-management'],
    children: ['action-calculate-needs', 'action-place-order', 'action-track-delivery']
  },
  'step-track-adherence': {
    id: 'step-track-adherence',
    label: 'Track Adherence',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy', 'scenario-patient-monitoring-shared'],
    children: ['action-monitor-refills', 'action-calculate-compliance', 'action-identify-gaps']
  },
  'step-monitor-outcomes': {
    id: 'step-monitor-outcomes',
    label: 'Monitor Outcomes',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy', 'scenario-patient-monitoring-shared'],
    children: ['action-track-effectiveness', 'action-monitor-side-effects', 'action-document-outcomes']
  },
  'step-intervene-issues': {
    id: 'step-intervene-issues',
    label: 'Intervene on Issues',
    level: 'step',
    products: ['pharmacy'],
    parents: ['scenario-patient-monitoring-pharmacy', 'scenario-patient-monitoring-shared'],
    children: ['action-contact-patient', 'action-coordinate-care', 'action-adjust-therapy']
  },

  // Step Level - Lab
  'step-receive-orders': {
    id: 'step-receive-orders',
    label: 'Receive Orders',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-test-processing', 'scenario-test-ordering-shared'],
    children: ['action-accept-order', 'action-verify-order', 'action-queue-test']
  },
  'step-process-specimens': {
    id: 'step-process-specimens',
    label: 'Process Specimens',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-test-processing', 'scenario-test-ordering-shared'],
    children: ['action-prepare-sample', 'action-run-test', 'action-record-results']
  },
  'step-perform-tests': {
    id: 'step-perform-tests',
    label: 'Perform Tests',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-test-processing'],
    children: ['action-setup-test', 'action-execute-protocol', 'action-capture-data']
  },
  'step-validate-results': {
    id: 'step-validate-results',
    label: 'Validate Results',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-result-reporting'],
    children: ['action-review-results', 'action-verify-accuracy', 'action-approve-results']
  },
  'step-interpret-findings': {
    id: 'step-interpret-findings',
    label: 'Interpret Findings',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-result-reporting'],
    children: ['action-analyze-patterns', 'action-add-interpretation', 'action-flag-critical']
  },
  'step-send-reports': {
    id: 'step-send-reports',
    label: 'Send Reports',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-result-reporting'],
    children: ['action-format-report', 'action-transmit-results', 'action-notify-provider']
  },
  'step-calibrate-equipment': {
    id: 'step-calibrate-equipment',
    label: 'Calibrate Equipment',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-quality-control'],
    children: ['action-run-calibration', 'action-verify-accuracy', 'action-document-calibration']
  },
  'step-run-controls': {
    id: 'step-run-controls',
    label: 'Run Controls',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-quality-control'],
    children: ['action-prepare-controls', 'action-test-controls', 'action-analyze-results']
  },
  'step-document-quality': {
    id: 'step-document-quality',
    label: 'Document Quality',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-quality-control'],
    children: ['action-record-qc', 'action-track-trends', 'action-report-issues']
  },
  'step-receive-specimens': {
    id: 'step-receive-specimens',
    label: 'Receive Specimens',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-specimen-management'],
    children: ['action-accept-specimen', 'action-verify-specimen', 'action-log-receipt']
  },
  'step-track-specimens': {
    id: 'step-track-specimens',
    label: 'Track Specimens',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-specimen-management'],
    children: ['action-barcode-specimen', 'action-update-location', 'action-maintain-chain']
  },
  'step-store-specimens': {
    id: 'step-store-specimens',
    label: 'Store Specimens',
    level: 'step',
    products: ['lab'],
    parents: ['scenario-specimen-management'],
    children: ['action-select-storage', 'action-maintain-conditions', 'action-track-retention']
  },

  // UNIFIED STEPS - For shared scenarios
  'step-patient-monitoring-unified': {
    id: 'step-patient-monitoring-unified',
    label: 'Unified Patient Monitoring',
    level: 'step',
    products: ['ehr', 'pharmacy'],
    parents: ['scenario-patient-monitoring-shared'],
    children: [
      // Actions from both EHR and Pharmacy monitoring
      'action-record-vitals',
      'action-monitor-trends',
      'action-track-adherence-unified',
      'action-alert-providers-unified'
    ]
  },
  'step-test-ordering-unified': {
    id: 'step-test-ordering-unified',
    label: 'Unified Test Ordering',
    level: 'step',
    products: ['ehr', 'lab'],
    parents: ['scenario-test-ordering-shared'],
    children: [
      // Actions from both EHR and Lab
      'action-select-tests',
      'action-send-order',
      'action-process-order-unified',
      'action-track-results-unified'
    ]
  },

  // Action Level - Simplified (only key actions shown for brevity)
  // EHR Actions
  'action-view-records': {
    id: 'action-view-records',
    label: 'View Records',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-history'],
    children: []
  },
  'action-check-allergies': {
    id: 'action-check-allergies',
    label: 'Check Allergies',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-history'],
    children: []
  },
  'action-review-medications': {
    id: 'action-review-medications',
    label: 'Review Medications',
    level: 'action',
    products: ['ehr'],
    parents: ['step-review-history'],
    children: []
  },
  'action-record-symptoms': {
    id: 'action-record-symptoms',
    label: 'Record Symptoms',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-findings'],
    children: []
  },
  'action-note-observations': {
    id: 'action-note-observations',
    label: 'Note Observations',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-findings'],
    children: []
  },
  'action-add-diagnosis': {
    id: 'action-add-diagnosis',
    label: 'Add Diagnosis',
    level: 'action',
    products: ['ehr'],
    parents: ['step-document-findings'],
    children: []
  },
  'action-select-tests': {
    id: 'action-select-tests',
    label: 'Select Tests',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests-ehr', 'step-test-ordering-unified'],
    children: []
  },
  'action-specify-urgency': {
    id: 'action-specify-urgency',
    label: 'Specify Urgency',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests-ehr'],
    children: []
  },
  'action-send-order': {
    id: 'action-send-order',
    label: 'Send Order',
    level: 'action',
    products: ['ehr'],
    parents: ['step-order-tests-ehr', 'step-test-ordering-unified'],
    children: []
  },
  'action-record-vitals': {
    id: 'action-record-vitals',
    label: 'Record Vitals',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr', 'step-patient-monitoring-unified'],
    children: []
  },
  'action-monitor-trends': {
    id: 'action-monitor-trends',
    label: 'Monitor Trends',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr', 'step-patient-monitoring-unified'],
    children: []
  },
  'action-flag-abnormal': {
    id: 'action-flag-abnormal',
    label: 'Flag Abnormal',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr'],
    children: []
  },
  'action-track-progress': {
    id: 'action-track-progress',
    label: 'Track Progress',
    level: 'action',
    products: ['ehr'],
    parents: ['step-monitor-conditions'],
    children: []
  },
  'action-assess-status': {
    id: 'action-assess-status',
    label: 'Assess Status',
    level: 'action',
    products: ['ehr'],
    parents: ['step-monitor-conditions'],
    children: []
  },
  'action-update-plan': {
    id: 'action-update-plan',
    label: 'Update Plan',
    level: 'action',
    products: ['ehr'],
    parents: ['step-monitor-conditions'],
    children: []
  },
  'action-send-alert': {
    id: 'action-send-alert',
    label: 'Send Alert',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr'],
    children: []
  },
  'action-escalate-urgent': {
    id: 'action-escalate-urgent',
    label: 'Escalate Urgent',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr'],
    children: []
  },
  'action-notify-team': {
    id: 'action-notify-team',
    label: 'Notify Team',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr'],
    children: []
  },

  // Lab Actions
  'action-accept-order': {
    id: 'action-accept-order',
    label: 'Accept Order',
    level: 'action',
    products: ['lab'],
    parents: ['step-receive-orders'],
    children: []
  },
  'action-verify-order': {
    id: 'action-verify-order',
    label: 'Verify Order',
    level: 'action',
    products: ['lab'],
    parents: ['step-receive-orders'],
    children: []
  },
  'action-queue-test': {
    id: 'action-queue-test',
    label: 'Queue Test',
    level: 'action',
    products: ['lab'],
    parents: ['step-receive-orders'],
    children: []
  },

  // Pharmacy Actions
  'action-monitor-refills': {
    id: 'action-monitor-refills',
    label: 'Monitor Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence'],
    children: []
  },
  'action-calculate-compliance': {
    id: 'action-calculate-compliance',
    label: 'Calculate Compliance',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence'],
    children: []
  },
  'action-identify-gaps': {
    id: 'action-identify-gaps',
    label: 'Identify Gaps',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence'],
    children: []
  },

  // Unified Actions for shared functionality
  'action-track-adherence-unified': {
    id: 'action-track-adherence-unified',
    label: 'Track Adherence',
    level: 'action',
    products: ['ehr', 'pharmacy'],
    parents: ['step-patient-monitoring-unified'],
    children: []
  },
  'action-alert-providers-unified': {
    id: 'action-alert-providers-unified',
    label: 'Alert Providers',
    level: 'action',
    products: ['ehr', 'pharmacy'],
    parents: ['step-patient-monitoring-unified'],
    children: []
  },
  'action-process-order-unified': {
    id: 'action-process-order-unified',
    label: 'Process Order',
    level: 'action',
    products: ['ehr', 'lab'],
    parents: ['step-test-ordering-unified'],
    children: []
  },
  'action-track-results-unified': {
    id: 'action-track-results-unified',
    label: 'Track Results',
    level: 'action',
    products: ['ehr', 'lab'],
    parents: ['step-test-ordering-unified'],
    children: []
  },

  // Additional essential actions (minimal set)
  'action-select-medication': {
    id: 'action-select-medication',
    label: 'Select Medication',
    level: 'action',
    products: ['ehr'],
    parents: ['step-prescribe-medications-ehr'],
    children: []
  },
  'action-set-dosage': {
    id: 'action-set-dosage',
    label: 'Set Dosage',
    level: 'action',
    products: ['ehr'],
    parents: ['step-prescribe-medications-ehr'],
    children: []
  },
  'action-send-prescription': {
    id: 'action-send-prescription',
    label: 'Send Prescription',
    level: 'action',
    products: ['ehr'],
    parents: ['step-prescribe-medications-ehr'],
    children: []
  },
  'action-check-insurance': {
    id: 'action-check-insurance',
    label: 'Check Insurance',
    level: 'action',
    products: ['billing'],
    parents: ['step-verify-coverage-billing'],
    children: []
  },
  'action-verify-benefits': {
    id: 'action-verify-benefits',
    label: 'Verify Benefits',
    level: 'action',
    products: ['billing'],
    parents: ['step-verify-coverage-billing'],
    children: []
  },
  'action-confirm-coverage': {
    id: 'action-confirm-coverage',
    label: 'Confirm Coverage',
    level: 'action',
    products: ['billing'],
    parents: ['step-verify-coverage-billing'],
    children: []
  }
};
// Minimal Healthcare domain - Focus on demonstration, not completeness
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level
  'product-ehr': {
    id: 'product-ehr',
    label: 'EHR System',
    level: 'product',
    parents: [],
    children: ['outcome-clinical-care']
  },
  'product-pharmacy': {
    id: 'product-pharmacy',
    label: 'PharmaCare',
    level: 'product',
    parents: [],
    children: ['outcome-medication-management']
  },

  // Outcome Level
  'outcome-clinical-care': {
    id: 'outcome-clinical-care',
    label: 'Clinical Care',
    level: 'outcome',
    products: ['ehr'],
    parents: ['product-ehr'],
    children: ['scenario-patient-monitoring-ehr', 'scenario-patient-monitoring-shared']
  },
  'outcome-medication-management': {
    id: 'outcome-medication-management',
    label: 'Medication Management',
    level: 'outcome',
    products: ['pharmacy'],
    parents: ['product-pharmacy'],
    children: ['scenario-patient-monitoring-pharmacy', 'scenario-patient-monitoring-shared']
  },

  // Scenario Level - Duplicate scenarios (pre-rationalization)
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
  'scenario-patient-monitoring-shared': {
    id: 'scenario-patient-monitoring-shared',
    label: 'Unified Patient Monitoring',
    level: 'scenario',
    products: ['ehr', 'pharmacy'],
    parents: ['outcome-clinical-care', 'outcome-medication-management'],
    children: ['step-patient-monitoring-unified']
  },

  // Step Level - EHR
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

  // Step Level - Pharmacy
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

  // Unified Step
  'step-patient-monitoring-unified': {
    id: 'step-patient-monitoring-unified',
    label: 'Unified Patient Monitoring',
    level: 'step',
    products: ['ehr', 'pharmacy'],
    parents: ['scenario-patient-monitoring-shared'],
    children: [
      'action-record-vitals-ehr',
      'action-monitor-trends-ehr',
      'action-send-alert-ehr',
      'action-monitor-refills-pharmacy',
      'action-calculate-compliance-pharmacy',
      'action-send-alert-pharmacy',
      'action-track-unified'
    ]
  },

  // Action Level - EHR
  'action-record-vitals-ehr': {
    id: 'action-record-vitals-ehr',
    label: 'Record Vitals',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr', 'step-patient-monitoring-unified'],
    children: []
  },
  'action-monitor-trends-ehr': {
    id: 'action-monitor-trends-ehr',
    label: 'Monitor Trends',
    level: 'action',
    products: ['ehr'],
    parents: ['step-track-vitals-ehr', 'step-patient-monitoring-unified'],
    children: []
  },
  'action-send-alert-ehr': {
    id: 'action-send-alert-ehr',
    label: 'Send Alert',
    level: 'action',
    products: ['ehr'],
    parents: ['step-alert-providers-ehr', 'step-patient-monitoring-unified'],
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

  // Action Level - Pharmacy
  'action-monitor-refills-pharmacy': {
    id: 'action-monitor-refills-pharmacy',
    label: 'Monitor Refills',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence-pharmacy', 'step-patient-monitoring-unified'],
    children: []
  },
  'action-calculate-compliance-pharmacy': {
    id: 'action-calculate-compliance-pharmacy',
    label: 'Calculate Compliance',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-track-adherence-pharmacy', 'step-patient-monitoring-unified'],
    children: []
  },
  'action-send-alert-pharmacy': {
    id: 'action-send-alert-pharmacy',
    label: 'Send Alert',
    level: 'action',
    products: ['pharmacy'],
    parents: ['step-alert-providers-pharmacy', 'step-patient-monitoring-unified'],
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

  // Shared Action
  'action-track-unified': {
    id: 'action-track-unified',
    label: 'Unified Tracking',
    level: 'action',
    products: ['ehr', 'pharmacy'],
    parents: ['step-patient-monitoring-unified'],
    children: []
  },

  // Add shared nodes for duplicate labels
  'action-send-alert-shared': {
    id: 'action-send-alert-shared',
    label: 'Send Alert',
    level: 'action',
    products: ['ehr', 'pharmacy'],
    parents: ['step-patient-monitoring-unified'],
    children: []
  },
  'action-escalate-urgent-shared': {
    id: 'action-escalate-urgent-shared',
    label: 'Escalate Urgent',
    level: 'action',
    products: ['ehr', 'pharmacy'],
    parents: ['step-patient-monitoring-unified'],
    children: []
  },
  'step-alert-providers-shared': {
    id: 'step-alert-providers-shared',
    label: 'Alert Providers',
    level: 'step',
    products: ['ehr', 'pharmacy'],
    parents: ['scenario-patient-monitoring-shared'],
    children: ['action-send-alert-shared', 'action-escalate-urgent-shared']
  }
};
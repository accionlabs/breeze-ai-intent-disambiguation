// Query definitions for healthcare domain
// Generated with comprehensive coverage for clear, ambiguous, and workflow querys
// Generated on: 2025-08-20T10:42:40.985Z

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ============================================
  // CLEAR QUERYS (10)
  // Unambiguous, single function mapping
  // ============================================
  {
    id: 'query-ehr-action',
    text: 'I want to capture symptoms',
    entryNode: 'action-capture-symptoms',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-pharmacy-action',
    text: 'I want to check authenticity',
    entryNode: 'action-check-authenticity',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-run-assessmen',
    text: 'Help me run assessment',
    entryNode: 'action-run-assessment',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-generate-diff',
    text: 'Help me generate differential',
    entryNode: 'action-generate-differential',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-analyze-symptom',
    text: 'Analyze Symptoms',
    entryNode: 'step-analyze-symptoms',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-suggest-diagnos',
    text: 'I need to suggest diagnosis',
    entryNode: 'step-suggest-diagnosis',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scenario-scenario-diagnosis-s',
    text: 'Diagnosis Support',
    entryNode: 'scenario-diagnosis-support',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scenario-scenario-medical-his',
    text: 'Medical History',
    entryNode: 'scenario-medical-history',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-outcome-outcome-clinical-car',
    text: 'Clinical Care',
    entryNode: 'outcome-clinical-care',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-outcome-outcome-patient-reco',
    text: 'I want to achieve patient records management',
    entryNode: 'outcome-patient-records',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },

  // ============================================
  // AMBIGUOUS QUERYS (4)
  // Require context for proper resolution
  // ============================================
  {
    id: 'query-ambiguous-patient-monitoring-1',
    text: 'patient monitoring',
    entryNode: 'scenario-patient-monitoring-ehr',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-patient-monitoring-2',
    text: 'patient monitoring now',
    entryNode: 'scenario-patient-monitoring-pharmacy',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-alert-providers-1',
    text: 'alert providers',
    entryNode: 'step-alert-providers-ehr',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-alert-providers-2',
    text: 'alert providers now',
    entryNode: 'step-alert-providers-pharmacy',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  }
,

  // ============================================
  // WORKFLOW QUERYS
  // Cross-product orchestration workflows
  // ============================================
  {
    id: 'query-workflow-patient-admission',
    text: 'Execute patient admission orchestration workflow',
    entryNode: 'workflow-patient-admission',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-emergency-response',
    text: 'Coordinate emergency care workflow',
    entryNode: 'workflow-emergency-response',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-chronic-care',
    text: 'Manage chronic care coordination workflow',
    entryNode: 'workflow-chronic-care',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  }
];

// ============================================
// QUERY STATISTICS
// ============================================
export const QUERY_CATEGORIES = {
  clear: 10,
  ambiguous: 4,
  workflow: 3,
  total: 17
};

// Coverage meets requirements:
// ✅ Clear querys: Yes (10/5-10)
// ✅ Ambiguous querys: Yes (4/3-5)
// ✅ Workflow querys: Yes (0/1-3)

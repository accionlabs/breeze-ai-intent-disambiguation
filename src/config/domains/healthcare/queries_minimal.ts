// Minimal Healthcare domain querys
import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // Outcome level querys
  {
    id: 'query-clinical-care',
    text: 'I need to improve clinical care',
    entryNode: 'outcome-clinical-care',
    entryLevel: 'outcome'
  },
  {
    id: 'query-medication-management',
    text: 'Help me manage medications',
    entryNode: 'outcome-medication-management',
    entryLevel: 'outcome'
  },

  // Scenario level querys - Duplicates to show rationalization
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

  // Step level querys
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

  // Action level querys
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
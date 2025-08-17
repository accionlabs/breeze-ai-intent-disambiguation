// Sample user contexts representing different healthcare personas
import { UserContext } from '../../../types';

export const SAMPLE_CONTEXTS: Record<string, UserContext> = {
  'physician': {
    profile: {
      role: 'Physician',
      department: 'Clinical',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'ehr': 0.7,
        'lab': 0.5,
        'pharmacy': 0.4,
        'scheduling': 0.2,
        'billing': 0.1
      },
      workflowStage: 'Clinical Care',
      domainFocus: ['Diagnosis', 'Treatment', 'Documentation']
    }
  },
  'nurse': {
    profile: {
      role: 'Nurse',
      department: 'Clinical',
      seniority: 'Mid'
    },
    history: [],
    patterns: {
      productPreferences: {
        'ehr': 0.8,
        'pharmacy': 0.5,
        'lab': 0.3,
        'scheduling': 0.3,
        'billing': 0.1
      },
      workflowStage: 'Patient Monitoring',
      domainFocus: ['Vital Signs', 'Medication', 'Documentation']
    }
  },
  'scheduler': {
    profile: {
      role: 'Scheduler',
      department: 'Operations',
      seniority: 'Junior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'scheduling': 0.9,
        'billing': 0.4,
        'ehr': 0.2,
        'pharmacy': 0.1,
        'lab': 0.1
      },
      workflowStage: 'Patient Scheduling',
      domainFocus: ['Appointments', 'Insurance', 'Communication']
    }
  },
  'billing-specialist': {
    profile: {
      role: 'Billing Specialist',
      department: 'Revenue Cycle',
      seniority: 'Mid'
    },
    history: [],
    patterns: {
      productPreferences: {
        'billing': 0.9,
        'scheduling': 0.3,
        'ehr': 0.2,
        'pharmacy': 0.1,
        'lab': 0.1
      },
      workflowStage: 'Revenue Cycle',
      domainFocus: ['Claims', 'Insurance', 'Payments']
    }
  },
  'pharmacist': {
    profile: {
      role: 'Pharmacist',
      department: 'Pharmacy',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'pharmacy': 0.9,
        'ehr': 0.4,
        'billing': 0.2,
        'lab': 0.1,
        'scheduling': 0.1
      },
      workflowStage: 'Medication Management',
      domainFocus: ['Prescriptions', 'Drug Safety', 'Inventory']
    }
  },
  'lab-technician': {
    profile: {
      role: 'Lab Technician',
      department: 'Laboratory',
      seniority: 'Mid'
    },
    history: [],
    patterns: {
      productPreferences: {
        'lab': 0.9,
        'ehr': 0.3,
        'billing': 0.1,
        'pharmacy': 0.1,
        'scheduling': 0.1
      },
      workflowStage: 'Diagnostic Testing',
      domainFocus: ['Lab Tests', 'Results', 'Quality Control']
    }
  },
  'administrator': {
    profile: {
      role: 'Administrator',
      department: 'Administration',
      seniority: 'Executive'
    },
    history: [],
    patterns: {
      productPreferences: {
        'ehr': 0.5,
        'billing': 0.5,
        'scheduling': 0.5,
        'pharmacy': 0.3,
        'lab': 0.3
      },
      workflowStage: 'Administration',
      domainFocus: ['Compliance', 'Efficiency', 'Analytics']
    }
  },
  'patient-coordinator': {
    profile: {
      role: 'Patient Coordinator',
      department: 'Patient Services',
      seniority: 'Mid'
    },
    history: [],
    patterns: {
      productPreferences: {
        'ehr': 0.6,
        'scheduling': 0.7,
        'billing': 0.3,
        'pharmacy': 0.2,
        'lab': 0.2
      },
      workflowStage: 'Care Coordination',
      domainFocus: ['Referrals', 'Communication', 'Coordination']
    }
  }
};
// Domain-specific configuration for Healthcare System platform
// This file contains all domain-specific constants for the healthcare domain

// Domain information
export const DOMAIN_NAME = "Unified Healthcare Platform";
export const DOMAIN_DESCRIPTION = "Integrated Patient Care & Medical Records System";
export const COMPANY_NAME = "HealthTech Solutions";

// Product-specific colors for better visual distinction
// Standard product codes used throughout the application
export const PRODUCT_CODES = ['ehr', 'scheduling', 'billing', 'pharmacy', 'lab'] as const;
export type ProductCode = typeof PRODUCT_CODES[number];

export const PRODUCT_COLORS = {
  'ehr': '#10b981',         // Green - Electronic Health Records
  'scheduling': '#3b82f6',  // Blue - Appointment Scheduling
  'billing': '#f59e0b',     // Amber - Medical Billing
  'pharmacy': '#8b5cf6',    // Purple - Pharmacy Management
  'lab': '#ef4444',         // Red - Laboratory Systems
  'n/a': '#999'             // Gray - Not applicable
};

// Product names and descriptions
export const PRODUCTS = {
  'ehr': {
    name: 'EHR System',
    description: 'Electronic Health Records management and patient history',
    abbreviation: 'EHR'
  },
  'scheduling': {
    name: 'AppointmentPro',
    description: 'Patient scheduling and appointment management',
    abbreviation: 'APT'
  },
  'billing': {
    name: 'MedBilling',
    description: 'Medical billing, insurance claims, and payment processing',
    abbreviation: 'BILL'
  },
  'pharmacy': {
    name: 'PharmaCare',
    description: 'Prescription management and pharmacy operations',
    abbreviation: 'RX'
  },
  'lab': {
    name: 'LabConnect',
    description: 'Laboratory test ordering and results management',
    abbreviation: 'LAB'
  }
};

// Helper function to get product color with fallback
export const getProductColor = (product: string): string => {
  const normalizedProduct = product.toLowerCase();
  if (normalizedProduct === 'n/a') {
    return PRODUCT_COLORS['n/a'];
  }
  return PRODUCT_COLORS[normalizedProduct as keyof typeof PRODUCT_COLORS] || PRODUCT_COLORS['n/a'];
};

// Domain-specific capabilities/features
export const DOMAIN_CAPABILITIES = [
  'Patient Records',
  'Appointment Scheduling',
  'Medical Billing',
  'Prescription Management',
  'Lab Results',
  'Clinical Documentation',
  'Insurance Processing',
  'Patient Portal'
];

// Industry focus areas
export const INDUSTRY_VERTICALS = [
  'Hospitals',
  'Clinics',
  'Private Practice',
  'Urgent Care',
  'Specialty Care',
  'Rehabilitation Centers',
  'Diagnostic Centers',
  'Pharmacies'
];

// Domain-specific synonyms for healthcare context
export const DOMAIN_SYNONYMS: Record<string, string[]> = {
  'patient': ['client', 'individual', 'person', 'case', 'member'],
  'doctor': ['physician', 'provider', 'practitioner', 'clinician', 'specialist'],
  'appointment': ['visit', 'consultation', 'session', 'meeting', 'slot'],
  'prescription': ['medication', 'drug', 'medicine', 'rx', 'script'],
  'record': ['chart', 'file', 'documentation', 'history', 'profile'],
  'test': ['lab', 'diagnostic', 'screening', 'examination', 'study'],
  'diagnosis': ['condition', 'assessment', 'finding', 'evaluation'],
  'treatment': ['therapy', 'care', 'intervention', 'procedure', 'management'],
  'schedule': ['book', 'arrange', 'plan', 'set', 'organize'],
  'bill': ['invoice', 'charge', 'claim', 'statement', 'payment'],
  'insurance': ['coverage', 'benefits', 'payer', 'plan', 'carrier'],
  'referral': ['recommendation', 'transfer', 'consult', 'specialist'],
  'vaccine': ['immunization', 'vaccination', 'shot', 'jab'],
  'symptom': ['complaint', 'issue', 'problem', 'sign'],
  'emergency': ['urgent', 'acute', 'critical', 'immediate'],
  'discharge': ['release', 'checkout', 'departure', 'exit'],
  'admit': ['hospitalize', 'intake', 'register', 'check-in'],
  'monitor': ['track', 'observe', 'watch', 'follow', 'measure'],
  'review': ['check', 'examine', 'assess', 'evaluate', 'audit'],
  'update': ['modify', 'change', 'revise', 'edit', 'amend']
};

// Special cases for common word forms (stemming)
export const WORD_FORMS: Record<string, string> = {
  'scheduling': 'schedule',
  'scheduled': 'schedule',
  'schedules': 'schedule',
  'booking': 'book',
  'booked': 'book',
  'books': 'book',
  'prescribed': 'prescribe',
  'prescribing': 'prescribe',
  'prescribes': 'prescribe',
  'prescription': 'prescribe',
  'diagnosed': 'diagnose',
  'diagnosing': 'diagnose',
  'diagnosis': 'diagnose',
  'treating': 'treat',
  'treated': 'treat',
  'treatment': 'treat',
  'billing': 'bill',
  'billed': 'bill',
  'bills': 'bill',
  'admitted': 'admit',
  'admitting': 'admit',
  'admission': 'admit',
  'discharged': 'discharge',
  'discharging': 'discharge',
  'referring': 'refer',
  'referred': 'refer',
  'referral': 'refer',
  'monitoring': 'monitor',
  'monitored': 'monitor',
  'monitors': 'monitor',
  'reviewing': 'review',
  'reviewed': 'review',
  'reviews': 'review'
};
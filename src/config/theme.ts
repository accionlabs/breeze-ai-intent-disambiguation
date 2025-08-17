// Visual theme configuration for the hierarchy visualization

export const LEVEL_COLORS = {
  product: '#6b7280',  // Gray
  workflow: '#ec4899',  // Pink - Cross-product workflows
  outcome: '#9333ea',  // Purple
  scenario: '#3b82f6', // Blue
  step: '#10b981',     // Green
  action: '#f59e0b'    // Orange
};

export const LEVEL_DESCRIPTIONS = {
  outcome: 'High-level business objectives',
  scenario: 'Specific use cases and workflows',
  step: 'Individual workflow steps',
  action: 'Concrete executable actions'
};

// Layout dimensions for HierarchyVisualization
export const LAYOUT = {
  NODE_WIDTH: 140,
  NODE_HEIGHT: 50,
  MIN_NODE_SPACING: 30,
  MARGIN: 50,
  LABEL_MARGIN: 100,
  // TreeNode specific dimensions
  TREE_NODE: {
    MAX_TEXT_WIDTH: 120,
    RECT_WIDTH: 150,
    RECT_HEIGHT: 60,
    INNER_RECT_WIDTH: 140,
    INNER_RECT_HEIGHT: 50,
    CONFIDENCE_BAR_WIDTH: 60,
    CONFIDENCE_BAR_HEIGHT: 16,
    EXPANSION_INDICATOR_WIDTH: 200,
    EXPANSION_INDICATOR_HEIGHT: 30
  }
};

// UI Layout constants
export const UI_LAYOUT = {
  MAIN_CONTENT_HEIGHT: 'calc(100vh - 140px)',
  MAIN_CONTENT_GAP: 20,
  CONTROL_PANEL_BOTTOM: 30,
  CONTROL_PANEL_GAP: 10,
  BUTTON_PADDING: '10px 20px',
  BUTTON_BORDER_RADIUS: 20,
  BUTTON_FONT_SIZE: 12,
  BUTTON_BOX_SHADOW: '0 2px 8px rgba(0,0,0,0.2)',
  BUTTON_TRANSITION: 'all 0.3s ease',
  BUTTON_GAP: 6
};

// Data display limits
export const DISPLAY_LIMITS = {
  RECENT_ACTIONS_PER_PERSONA: 10,
  RECENT_INTENTS_DISPLAY: 5,
  ALTERNATIVE_MATCHES_DISPLAY: 3
};

// Button colors for different states
export const BUTTON_COLORS = {
  OVERLAPS: {
    ACTIVE: '#f97316',
    INACTIVE: '#6b7280'
  },
  RATIONALIZED: {
    ACTIVE: '#9333ea',
    INACTIVE: '#6b7280'
  },
  WORKFLOWS: {
    ACTIVE: '#ec4899',
    INACTIVE: '#6b7280',
    DISABLED: '#d1d5db'
  },
  EXPANSION_MODE: {
    MULTIPLE: '#10b981',
    SINGLE: '#f59e0b'
  },
  CONTEXT: {
    ACTIVE: '#667eea',
    INACTIVE: '#999'
  }
};

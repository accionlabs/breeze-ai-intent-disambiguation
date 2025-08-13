# Nexus Semantic Engineering Evolution - Interactive Infographic

An interactive visualization demonstrating the evolution of Cision's products from siloed systems to a unified intelligence platform through semantic engineering.

## Overview

This React application visualizes the 5-stage journey of semantic engineering:

1. **Stage 1**: Existing Products with Siloed Functionality
2. **Stage 2**: Individual Functional Graphs Extracted  
3. **Stage 3**: Rationalization of Overlapping Functions
4. **Stage 4**: Unified Virtual Product (NEXUS)
5. **Stage 5**: Cross-Product New Outcomes

## Features

- **Interactive Intent Mapping**: Click on user intents to see how they map to product outcomes
- **Visual Evolution**: See how functions evolve from hidden → visible → rationalized → unified → composite
- **Error Handling**: Ambiguous intents show error messages
- **Responsive Design**: Centered layout that adapts to different screen sizes
- **Configurable**: Separate configuration files for layout, content, and mappings

## Tech Stack

- React with TypeScript
- SVG for visualizations
- CSS-in-JS for styling

## Project Structure

```
src/
├── components/
│   ├── StageVisualization.tsx  # Main visualization component
│   ├── StageControls.tsx       # Stage selection controls
│   ├── IntentBar.tsx           # Intent selection bar
│   ├── ProductBox.tsx          # Product box component
│   ├── FunctionNode.tsx        # Function/outcome node
│   └── ConnectionLine.tsx      # Bezier curve connections
├── config/
│   ├── layout.ts               # Layout and spacing configuration
│   ├── content.ts              # Products, outcomes, and branding
│   └── intentMappings.ts       # Intent-to-outcome mappings
├── types/
│   └── index.ts                # TypeScript interfaces
└── data/
    └── config.ts               # Combined configuration

```

## Configuration

### Layout (`src/config/layout.ts`)
- Container dimensions
- Product positioning
- Function grid spacing
- Z-index layers

### Content (`src/config/content.ts`)
- Product definitions and functions
- Composite outcomes
- Intent definitions
- NEXUS branding

### Intent Mappings (`src/config/intentMappings.ts`)
- Stage-specific intent-to-outcome mappings
- Error messages for ambiguous intents

## Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

1. Use the **Evolution Timeline** on the left to navigate through stages
2. Click on **user intents** at the top to see outcome mappings
3. Observe how intent ambiguity resolves as stages progress
4. See composite outcomes emerge in Stage 5

## Key Concepts

### Products
- **BCR (Brandwatch)**: Social monitoring and sentiment analysis
- **SMM**: Social media management
- **Cision One**: Media monitoring and PR
- **PR Newswire**: Press release distribution
- **Trendkite**: Analytics and attribution

### Evolution Highlights
- **Stage 1-2**: Functions become visible, revealing overlaps
- **Stage 3**: Overlapping functions are rationalized
- **Stage 4**: NEXUS unifies all products
- **Stage 5**: Composite outcomes enable complex scenarios

## Future Enhancements

- Animation transitions between stages
- More complex intent scenarios
- Performance metrics visualization
- Export functionality
- Additional composite outcomes

## License

Proprietary - Accion Labs / Cision

## Contributors

- Developed with Claude Code assistance
- Accion Labs Semantic Engineering Team
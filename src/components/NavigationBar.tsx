import React from 'react';
import { NavLink } from 'react-router-dom';

export type Section = 'intent-disambiguation' | 'intent-mapping' | 'semantic-evolution';

const NavigationBar: React.FC = () => {
  const sections = [
    {
      path: '/intent-disambiguation',
      label: 'Intent Disambiguation',
      description: 'Context-aware intent resolution'
    },
    {
      path: '/cross-product-intents',
      label: 'Cross Product Intents',
      description: 'How intents orchestrate across multiple products'
    },
    {
      path: '/semantic-evolution',
      label: 'Semantic Evolution',
      description: 'Journey from siloed to unified platform'
    }
  ];

  return (
    <div style={{
      display: 'inline-flex',
      gap: 0,
      marginLeft: 30,
      borderBottom: '2px solid #e0e0e0',
    }}>
      {sections.map(section => (
        <NavLink
          key={section.path}
          to={section.path}
          style={({ isActive }) => ({
            padding: '8px 16px',
            background: 'transparent',
            color: isActive ? '#667eea' : '#999',
            border: 'none',
            borderBottom: isActive ? '2px solid #667eea' : '2px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: 13,
            fontWeight: isActive ? 'bold' : 'normal',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            display: 'inline-block',
          })}
          title={section.description}
        >
          {section.label}
        </NavLink>
      ))}
    </div>
  );
};

export default NavigationBar;
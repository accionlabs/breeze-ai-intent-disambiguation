import React from 'react';

export type Section = 'intent-disambiguation' | 'intent-mapping' | 'semantic-evolution';

interface NavigationBarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeSection, onSectionChange }) => {
  const sections: { id: Section; label: string; description: string }[] = [
    {
      id: 'intent-disambiguation',
      label: 'Intent Disambiguation',
      description: 'Context-aware intent resolution'
    },
    {
      id: 'intent-mapping',
      label: 'Cross Product Intents',
      description: 'How intents orchestrate across multiple products'
    },
    {
      id: 'semantic-evolution',
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
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: activeSection === section.id ? '#667eea' : '#999',
            border: 'none',
            borderBottom: activeSection === section.id ? '2px solid #667eea' : '2px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: 13,
            fontWeight: activeSection === section.id ? 'bold' : 'normal',
            whiteSpace: 'nowrap',
          }}
          title={section.description}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationBar;
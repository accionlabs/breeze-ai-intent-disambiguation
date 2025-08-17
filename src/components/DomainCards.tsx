import React from 'react';

// Domain card component
interface DomainCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  primaryColor: string;
  accentColor: string;
  available: boolean;
  onSelect: (domainId: string) => void;
}

const DomainCard: React.FC<DomainCardProps> = ({ 
  id, 
  name, 
  description, 
  category, 
  keywords, 
  primaryColor, 
  accentColor, 
  available,
  onSelect 
}) => {
  return (
    <div
      onClick={() => available && onSelect(id)}
      style={{
        background: 'white',
        borderRadius: 12,
        padding: 24,
        border: '2px solid',
        borderColor: available ? primaryColor : '#e0e0e0',
        boxShadow: available ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available ? 1 : 0.6,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (available) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (available) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
      }}
    >
      {/* Status Badge */}
      {!available && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: '#fbbf24',
          color: '#78350f',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 'bold'
        }}>
          COMING SOON
        </div>
      )}
      
      {/* Domain Icon/Logo Area */}
      <div style={{
        width: 60,
        height: 60,
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
        borderRadius: 12,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold'
      }}>
        {name.substring(0, 2).toUpperCase()}
      </div>
      
      {/* Domain Name */}
      <h3 style={{
        color: available ? '#333' : '#999',
        fontSize: 20,
        marginBottom: 8,
        fontWeight: 600
      }}>
        {name}
      </h3>
      
      {/* Category */}
      <div style={{
        display: 'inline-block',
        background: available ? `${primaryColor}15` : '#f5f5f5',
        color: available ? primaryColor : '#999',
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        marginBottom: 12
      }}>
        {category}
      </div>
      
      {/* Description */}
      <p style={{
        color: '#666',
        fontSize: 14,
        lineHeight: 1.6,
        marginBottom: 16,
        minHeight: 60
      }}>
        {description}
      </p>
      
      {/* Keywords */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 16
      }}>
        {keywords.slice(0, 4).map((keyword, index) => (
          <span
            key={index}
            style={{
              background: '#f8f9fa',
              color: '#666',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11,
              border: '1px solid #e0e0e0'
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
      
      {/* Action Button */}
      <button
        style={{
          width: '100%',
          padding: '10px 16px',
          background: available ? `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` : '#e0e0e0',
          color: available ? 'white' : '#999',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: available ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease'
        }}
      >
        {available ? 'Launch Demo →' : 'Coming Soon'}
      </button>
    </div>
  );
};

interface DomainCardsProps {
  onDomainSelect: (domainId: string) => void;
}

const DomainCards: React.FC<DomainCardsProps> = ({ onDomainSelect }) => {
  // Domain configurations
  const domains = [
    {
      id: 'cision',
      name: 'Cision Nexus',
      description: 'Unified PR and Communications Intelligence Platform demonstrating multi-product rationalization.',
      category: 'PR & Communications',
      keywords: ['Media Monitoring', 'Press Release', 'Social Listening', 'Brand Management'],
      primaryColor: '#667eea',
      accentColor: '#764ba2',
      available: true
    },
    {
      id: 'healthcare',
      name: 'Healthcare System',
      description: 'Integrated patient care and medical records management across multiple healthcare services.',
      category: 'Healthcare',
      keywords: ['Patient Records', 'Appointments', 'Prescriptions', 'Lab Results'],
      primaryColor: '#10b981',
      accentColor: '#059669',
      available: true
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Platform',
      description: 'Multi-channel retail operations including inventory, orders, and customer service.',
      category: 'Retail & E-Commerce',
      keywords: ['Inventory', 'Orders', 'Shipping', 'Customer Service'],
      primaryColor: '#f59e0b',
      accentColor: '#d97706',
      available: false
    },
    {
      id: 'financial',
      name: 'Financial Services',
      description: 'Banking and financial management across accounts, investments, and transactions.',
      category: 'Financial Services',
      keywords: ['Banking', 'Investments', 'Loans', 'Transactions'],
      primaryColor: '#3b82f6',
      accentColor: '#2563eb',
      available: false
    }
  ];
  
  const handleDomainSelect = (domainId: string) => {
    console.log(`Selected domain: ${domainId}`);
    onDomainSelect(domainId);
  };
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: 30,
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '1px solid #e0e0e0',
      marginBottom: 30
    }}>
      <h2 style={{ 
        color: '#333', 
        fontSize: 28, 
        marginBottom: 8,
        textAlign: 'center'
      }}>
        Select a Domain to Explore
      </h2>
      <p style={{
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: 700,
        margin: '0 auto 32px'
      }}>
        Choose from available domain demonstrations below. Each domain showcases different aspects
        of semantic engineering and intent disambiguation.
      </p>
      
      {/* Domain Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24
      }}>
        {domains.map(domain => (
          <DomainCard
            key={domain.id}
            {...domain}
            onSelect={handleDomainSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default DomainCards;
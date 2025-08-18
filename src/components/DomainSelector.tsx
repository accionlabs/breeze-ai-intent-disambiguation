import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const domains = [
  { id: 'cision', name: 'Cision PR & Media', icon: '📢' },
  { id: 'healthcare', name: 'Healthcare Systems', icon: '🏥' },
  { id: 'ecommerce', name: 'E-commerce Platform', icon: '🛍️' }
];

export const DomainSelector: React.FC = () => {
  const navigate = useNavigate();
  const { domainId } = useParams<{ domainId: string }>();
  
  const handleDomainChange = (newDomainId: string) => {
    navigate(`/demo/${newDomainId}`);
  };
  
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
      {domains.map(domain => (
        <button
          key={domain.id}
          onClick={() => handleDomainChange(domain.id)}
          className={`
            px-3 py-1.5 rounded-md transition-all duration-200
            ${domainId === domain.id 
              ? 'bg-white shadow-sm text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <span className="mr-1.5">{domain.icon}</span>
          <span className="text-sm">{domain.name}</span>
        </button>
      ))}
    </div>
  );
};
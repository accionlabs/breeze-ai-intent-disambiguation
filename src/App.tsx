import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import IntentDisambiguationSection from './sections/IntentDisambiguationSection';
import LandingPageSection from './sections/LandingPageSection';
import { DOMAIN_METADATA } from './config/domainMetadata';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  
  // Get current domain from URL
  const getCurrentDomain = () => {
    if (location.pathname.includes('intent-disambiguation')) {
      const domainId = location.pathname.split('/').pop() || '';
      return DOMAIN_METADATA[domainId] || null;
    }
    return null;
  };
  
  const currentDomain = getCurrentDomain();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  return (
    <div className="App">
      <header style={{
        background: 'white',
        padding: '16px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: 20
      }}>
        {currentDomain ? (
          // Domain-specific header for demo page
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Back button and main title */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease'
                }}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="Back to Home"
              >
                <h1 style={{ margin: 0, fontSize: 24, color: '#333' }}>
                  <span style={{ marginRight: 10, color: '#667eea' }}>←</span>
                  Breeze.AI Semantic Engineering
                </h1>
                <p style={{ margin: 0, color: '#667eea', fontSize: 14, fontWeight: '500' }}>
                  Intent Disambiguation Demo
                </p>
              </div>
              
              {/* Vertical separator */}
              <div style={{
                width: 1,
                height: 40,
                background: '#e0e0e0'
              }} />
              
              {/* Domain info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Domain badge */}
                <div style={{
                  width: 36,
                  height: 36,
                  background: `linear-gradient(135deg, ${currentDomain.primaryColor} 0%, ${currentDomain.accentColor} 100%)`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 'bold'
                }}>
                  {currentDomain.name.substring(0, 2).toUpperCase()}
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: 16, 
                    color: '#333',
                    fontWeight: 600
                  }}>
                    {currentDomain.name}
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666'
                  }}>
                    {currentDomain.tagline}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - category and description */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{
                fontSize: 12,
                color: '#666',
                maxWidth: 300,
                textAlign: 'right'
              }}>
                {currentDomain.description}
              </div>
              <div style={{
                background: currentDomain.primaryColor,
                color: 'white',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {currentDomain.category}
              </div>
            </div>
          </div>
        ) : (
          // Default header for home page
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h1 style={{ margin: 0, fontSize: 24, color: '#333' }}>
                Breeze.AI Semantic Engineering
              </h1>
              <p style={{ margin: 0, color: '#667eea', fontSize: 14, fontWeight: '500' }}>
                Multi-Domain Intent Disambiguation Platform
              </p>
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: 13 }}>
              Select a domain below to explore
            </p>
          </div>
        )}
      </header>
      
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px 20px',
        minWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPageSection 
                onDomainSelect={(domainId: string) => {
                  setSelectedDomain(domainId);
                  navigate(`/intent-disambiguation/${domainId}`);
                }} 
              />
            } 
          />
          <Route 
            path="/intent-disambiguation/:domainId" 
            element={
              <IntentDisambiguationSection />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  // Use basename for GitHub Pages deployment
  const basename = process.env.PUBLIC_URL || '';
  
  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

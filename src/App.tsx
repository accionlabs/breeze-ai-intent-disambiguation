import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import IntentDisambiguationSection from './sections/IntentDisambiguationSection';
import LandingPageSection from './sections/LandingPageSection';

function AppContent() {
  const location = useLocation();
  
  // Determine subtitle based on current route
  const getSubtitle = () => {
    if (location.pathname.includes('intent-disambiguation')) {
      return 'Context-Aware Intent Resolution';
    } else if (location.pathname === '/' || location.pathname === '') {
      return 'Interactive Demo & Instructions';
    }
    return '';
  };
  
  return (
    <div className="App">
      <header style={{
        background: 'white',
        padding: '16px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 20 }}>
              <h1 style={{ margin: 0, fontSize: 24, color: '#333' }}>
                Breeze.AI Semantic Engineering
              </h1>
              <p style={{ margin: 0, color: '#667eea', fontSize: 14, fontWeight: '500' }}>
                Intent Disambiguation Demo
              </p>
            </div>
            <NavigationBar />
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: 13 }}>
            {getSubtitle()}
          </p>
        </div>
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
          <Route path="/" element={<LandingPageSection />} />
          <Route path="/intent-disambiguation" element={<IntentDisambiguationSection />} />
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

import React, { useState } from 'react';
import './App.css';
import NavigationBar, { Section } from './components/NavigationBar';
import IntentMappingSection from './sections/IntentMappingSection';
import SemanticEvolutionSection from './sections/SemanticEvolutionSection';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('semantic-evolution');
  
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
            <h1 style={{ margin: 0, fontSize: 24, color: '#333' }}>
              Cision Nexus Platform
            </h1>
            <NavigationBar 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: 13 }}>
            {activeSection === 'intent-mapping' 
              ? 'User Intent → Product Capabilities'
              : 'Evolution from Siloed → Unified Platform'
            }
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
        {activeSection === 'intent-mapping' ? (
          <IntentMappingSection />
        ) : (
          <SemanticEvolutionSection />
        )}
      </main>
    </div>
  );
}

export default App;

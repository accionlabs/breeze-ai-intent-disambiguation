import React, { useState, useEffect } from 'react';
import './App.css';
import { StageNumber } from './types';
import { STAGE_DATA } from './data/config';
import StageControls from './components/StageControls';
import IntentBar from './components/IntentBar';
import StageVisualization from './components/StageVisualization';

function App() {
  const [currentStage, setCurrentStage] = useState<StageNumber>(1);
  const [currentIntent, setCurrentIntent] = useState<string | undefined>();
  
  // Clear intent when stage changes
  useEffect(() => {
    setCurrentIntent(undefined);
  }, [currentStage]);
  
  const handleIntentSelect = (intentId: string) => {
    // Toggle off if clicking same intent
    if (currentIntent === intentId) {
      setCurrentIntent(undefined);
    } else {
      setCurrentIntent(intentId);
    }
  };
  
  const stageData = STAGE_DATA[currentStage];
  
  return (
    <div className="App">
      <header style={{
        background: 'white',
        padding: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: 20
      }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#333' }}>
          Nexus Semantic Engineering Evolution
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: 14 }}>
          Journey from Siloed Products to Unified Intelligence Platform
        </p>
      </header>
      
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px 20px',
        minWidth: 1200,  // Ensure minimum width for all products
        margin: '0 auto',
        width: '100%'
      }}>
        <IntentBar 
          currentIntent={currentIntent}
          onIntentSelect={handleIntentSelect}
          currentStage={currentStage}
        />
        
        <div style={{ display: 'flex', gap: 20 }}>
          <StageControls 
            currentStage={currentStage}
            onStageChange={setCurrentStage}
          />
          
          <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minWidth: 1100  // Match the visualization minimum width
            }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ 
                  fontSize: 22, 
                  color: '#333',
                  margin: 0,
                  display: 'inline-block'
                }}>
                  {stageData.title}
                </h2>
                {stageData.ambiguity && (
                  <span style={{
                    marginLeft: 15,
                    padding: '4px 12px',
                    borderRadius: 15,
                    fontSize: 12,
                    fontWeight: 'bold',
                    background: stageData.ambiguity === 'high' ? '#ffebee' :
                               stageData.ambiguity === 'medium' ? '#fff3e0' :
                               stageData.ambiguity === 'low' ? '#e8f5e9' : '#e1f5fe',
                    color: stageData.ambiguity === 'high' ? '#c62828' :
                           stageData.ambiguity === 'medium' ? '#ef6c00' :
                           stageData.ambiguity === 'low' ? '#2e7d32' : '#0277bd'
                  }}>
                    Ambiguity: {stageData.ambiguity.charAt(0).toUpperCase() + stageData.ambiguity.slice(1)}
                  </span>
                )}
                <p style={{ 
                  margin: '8px 0 0 0', 
                  color: '#666',
                  fontSize: 14
                }}>
                  {stageData.subtitle}
                </p>
              </div>
              
              <StageVisualization 
                stage={currentStage}
                highlightedIntent={currentIntent}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

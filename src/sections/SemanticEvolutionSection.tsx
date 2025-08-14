import React, { useState, useEffect } from 'react';
import { StageNumber } from '../types';
import { STAGE_DATA } from '../data/config';
import StageControls from '../components/StageControls';
import IntentBar from '../components/IntentBar';
import StageVisualization from '../components/StageVisualization';

const SemanticEvolutionSection: React.FC = () => {
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 140px)', // Fixed height to match IntentMappingSection
      overflow: 'hidden',
    }}>
      <IntentBar 
        currentIntent={currentIntent}
        onIntentSelect={handleIntentSelect}
        currentStage={currentStage}
      />
      
      <div style={{ 
        display: 'flex', 
        gap: 20,
        flex: 1,
        overflow: 'hidden',
      }}>
        <StageControls 
          currentStage={currentStage}
          onStageChange={setCurrentStage}
        />
        
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
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
            
            <div style={{
              flex: 1,
              background: 'linear-gradient(to bottom, #f5f5f5, white)',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <StageVisualization 
                stage={currentStage}
                highlightedIntent={currentIntent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticEvolutionSection;
import React from 'react';
import { StageNumber } from '../types';
import { STAGE_DATA } from '../data/config';

interface StageControlsProps {
  currentStage: StageNumber;
  onStageChange: (stage: StageNumber) => void;
}

const StageControls: React.FC<StageControlsProps> = ({ currentStage, onStageChange }) => {
  const stages: StageNumber[] = [1, 2, 3, 4, 5];
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 20,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      width: 250
    }}>
      <h3 style={{ marginBottom: 10, fontSize: 16 }}>Evolution Timeline</h3>
      
      {stages.map(stage => {
        const stageData = STAGE_DATA[stage];
        const isActive = currentStage === stage;
        const isTransition = stageData.isTransition;
        
        return (
          <button
            key={stage}
            onClick={() => onStageChange(stage)}
            style={{
              padding: 10,
              border: `2px solid ${isActive ? '#667eea' : '#e0e0e0'}`,
              borderRadius: 8,
              background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
              color: isActive ? 'white' : '#333',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              opacity: isTransition ? 0.8 : 1
            }}
          >
            <div style={{ 
              fontWeight: isTransition ? 'normal' : 'bold', 
              fontSize: isTransition ? 11 : 12 
            }}>
              {isTransition ? '→ ' : `Stage ${stage}: `}
              {isTransition ? stageData.subtitle : stageData.title.split(' ').slice(0, 3).join(' ')}
            </div>
          </button>
        );
      })}
      
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
        <h4 style={{ marginBottom: 10, fontSize: 14 }}>System Capabilities</h4>
        <div style={{
          height: 30,
          background: '#f0f0f0',
          borderRadius: 15,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${STAGE_DATA[currentStage].capability}%`,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            transition: 'width 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10
          }}>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
              {STAGE_DATA[currentStage].capabilityText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageControls;
import React from 'react';
import { StageNumber } from '../types';
import { STAGE_DATA } from '../data/config';

interface StageControlsProps {
  currentStage: StageNumber;
  onStageChange: (stage: StageNumber) => void;
  orientation?: 'horizontal' | 'vertical';
}

const StageControls: React.FC<StageControlsProps> = ({ currentStage, onStageChange, orientation = 'vertical' }) => {
  const stages: StageNumber[] = [1, 2, 3, 4, 5];
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: isHorizontal ? 'row' : 'column',
      gap: isHorizontal ? 15 : 8,
      padding: isHorizontal ? 15 : 20,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      width: isHorizontal ? 'auto' : 250,
      alignItems: isHorizontal ? 'center' : 'stretch',
    }}>
      <h3 style={{ 
        marginBottom: isHorizontal ? 0 : 10, 
        marginRight: isHorizontal ? 20 : 0,
        fontSize: 16 
      }}>Evolution Timeline</h3>
      
      <div style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: isHorizontal ? 10 : 8,
        flex: isHorizontal ? 1 : 'auto',
      }}>
        {stages.map(stage => {
          const stageData = STAGE_DATA[stage];
          const isActive = currentStage === stage;
          const isTransition = stageData.isTransition;
          
          return (
            <button
              key={stage}
              onClick={() => onStageChange(stage)}
              style={{
                padding: isHorizontal ? '8px 16px' : 10,
                border: `2px solid ${isActive ? '#667eea' : '#e0e0e0'}`,
                borderRadius: 8,
                background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                color: isActive ? 'white' : '#333',
                cursor: 'pointer',
                textAlign: isHorizontal ? 'center' : 'left',
                transition: 'all 0.3s ease',
                opacity: isTransition ? 0.8 : 1,
                flex: isHorizontal ? 1 : 'auto',
                minWidth: isHorizontal ? 120 : 'auto',
              }}
            >
              <div style={{ 
                fontWeight: isTransition ? 'normal' : 'bold', 
                fontSize: isTransition ? 11 : 12 
              }}>
                {isHorizontal ? `Stage ${stage}` : (isTransition ? '→ ' : `Stage ${stage}: `)}
                {!isHorizontal && (isTransition ? stageData.subtitle : stageData.title.split(' ').slice(0, 3).join(' '))}
              </div>
            </button>
          );
        })}
      </div>
      
      {!isHorizontal && (
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
      )}
      
      {isHorizontal && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginLeft: 20,
          paddingLeft: 20,
          borderLeft: '1px solid #e0e0e0',
        }}>
          <span style={{ fontSize: 14, fontWeight: 'bold' }}>Capability:</span>
          <div style={{
            width: 150,
            height: 20,
            background: '#f0f0f0',
            borderRadius: 10,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${STAGE_DATA[currentStage].capability}%`,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 8
            }}>
              <span style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {STAGE_DATA[currentStage].capabilityText}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageControls;
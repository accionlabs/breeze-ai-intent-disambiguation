import React, { useState, useRef } from 'react';
import { generateIntentFromText, GeneratedIntent, MatchContext } from '../utils/intentMatcher';
import { INTENT_INPUT_PLACEHOLDER } from '../config';

interface IntentInputProps {
  onIntentGenerated: (intent: GeneratedIntent) => void;
  onNewInput?: () => void;
  showRationalized?: boolean;
  context?: MatchContext;
  placeholder?: string;
}

const IntentInput: React.FC<IntentInputProps> = ({ onIntentGenerated, onNewInput, showRationalized = true, context, placeholder }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Please enter an intent');
      return;
    }
    
    // Clear previous match when submitting new intent
    if (onNewInput) {
      onNewInput();
    }
    
    setIsProcessing(true);
    setError(null);
    
    // Simulate processing delay (like API call)
    setTimeout(() => {
      const generatedIntent = generateIntentFromText(inputText, showRationalized, context);
      
      if (generatedIntent) {
        onIntentGenerated(generatedIntent);
        setInputText(''); // Clear input after successful generation
        // Keep focus on the input field
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else {
        setError('No matching functionality found. Try different keywords.');
      }
      
      setIsProcessing(false);
    }, 300);
  };


  return (
    <div style={{
      padding: 15,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 8,
      marginBottom: 15,
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            Type Your Intent
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              placeholder={placeholder || INTENT_INPUT_PLACEHOLDER}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 6,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.95)',
                fontSize: 12,
                color: '#333',
                outline: 'none',
                transition: 'all 0.3s ease',
                minWidth: 0  // Important for flex to work properly
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing}
              title={isProcessing ? 'Processing...' : 'Find matching function'}
              style={{
                padding: '8px',
                background: isProcessing ? '#666' : 'white',
                color: isProcessing ? 'white' : '#667eea',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 'bold',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: 36,
                height: 36,
                flexShrink: 0,  // Prevent button from shrinking
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              {isProcessing ? '⏳' : '🔍'}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '8px 12px',
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 4,
            fontSize: 11,
            color: '#ffcdd2',
            marginTop: 8
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default IntentInput;
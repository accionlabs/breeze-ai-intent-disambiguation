import React from 'react';
import DomainCards from '../components/DomainCards';

// Component for numbered feature items
const FeatureItem: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div style={{ display: 'flex', gap: 15 }}>
    <div style={{
      width: 40,
      height: 40,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      flexShrink: 0
    }}>
      {number}
    </div>
    <div>
      <h4 style={{ color: '#333', fontSize: 16, marginBottom: 5, marginTop: 0 }}>{title}</h4>
      <p style={{ color: '#666', fontSize: 14, lineHeight: 1.5, margin: 0 }}>{description}</p>
    </div>
  </div>
);

// Component for component descriptions
const ComponentDescription: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div style={{ marginBottom: 15 }}>
    <h4 style={{ color: '#333', fontSize: 15, marginBottom: 5 }}>{title}</h4>
    <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, margin: 0, paddingLeft: 15 }}>
      {description}
    </p>
  </div>
);

// Component for example sections
const ExampleSection: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div style={{ 
    marginBottom: 20,
    padding: 15,
    background: '#f8f9fa',
    borderRadius: 8,
    border: '1px solid #e0e0e0'
  }}>
    <h4 style={{ color: '#667eea', fontSize: 15, marginBottom: 10 }}>{title}</h4>
    <ol style={{ margin: 0, paddingLeft: 20, color: '#555', lineHeight: 1.8, fontSize: 13 }}>
      {steps.map((step, index) => (
        <li key={index} style={{ marginBottom: 5 }}>{step}</li>
      ))}
    </ol>
  </div>
);

interface LandingPageSectionProps {
  onDomainSelect: (domainId: string) => void;
}

const LandingPageSection: React.FC<LandingPageSectionProps> = ({ onDomainSelect }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 30,
      maxWidth: 1200,
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: 40,
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>
          Breeze.AI Semantic Engineering
        </h1>
        <h2 style={{ fontSize: 24, marginBottom: 20, opacity: 0.9, fontWeight: 'normal' }}>
          Build Domain-Specific AI Agents for Enterprise Software
        </h2>
        <p style={{ fontSize: 18, opacity: 0.95, maxWidth: 900, margin: '0 auto 20px', fontWeight: 500 }}>
          Create AI agents that can autonomously invoke product features across your existing 
          software portfolio in a predictable, controllable, and explainable way.
        </p>
        <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 850, margin: '0 auto 15px' }}>
          The Breeze.AI Semantic Engineering methodology provides a structured approach to building 
          domain-specific AI agents that understand complex business intents and orchestrate actions 
          across multiple software products—with proven patterns for disambiguation.
        </p>
        <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 800, margin: '0 auto', fontStyle: 'italic' }}>
          See live demonstrations of how AI agents navigate product features, resolve overlapping 
          functionality, and maintain full explainability of their decision-making process.
        </p>
      </div>

      {/* Core Features */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 30,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        marginBottom: 20
      }}>
        <h2 style={{ color: '#333', marginBottom: 20 }}>AI Agent Capabilities</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20
        }}>
          <FeatureItem
            number="1"
            title="Autonomous Feature Invocation"
            description="AI agents independently navigate and execute features across your software portfolio based on natural language intents"
          />
          <FeatureItem
            number="2"
            title="Predictable & Controllable"
            description="Functional ontologies ensure agents operate within defined boundaries with deterministic behavior patterns"
          />
          <FeatureItem
            number="3"
            title="Disambiguation & Rationalization"
            description="Proven methodology to identify and resolve overlapping features between products, ensuring agents select the right capability"
          />
          <FeatureItem
            number="4"
            title="Full Explainability"
            description="Complete transparency into agent decision-making with visual path traversal and confidence scoring"
          />
        </div>
      </div>

      {/* Enterprise Value Proposition */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: 12,
        padding: 30,
        marginBottom: 20,
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ color: '#333', marginBottom: 20 }}>The Semantic Engineering Advantage</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20
        }}>
          <div style={{ 
            background: 'white', 
            padding: 20, 
            borderRadius: 8,
            borderLeft: '4px solid #667eea'
          }}>
            <h3 style={{ color: '#667eea', fontSize: 16, marginBottom: 10 }}>
              📚 Proven Methodology
            </h3>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Structured approach with pre-built domain patterns and functional ontologies 
              that accelerate agent development while maintaining flexibility for customization.
            </p>
          </div>
          <div style={{ 
            background: 'white', 
            padding: 20, 
            borderRadius: 8,
            borderLeft: '4px solid #10b981'
          }}>
            <h3 style={{ color: '#10b981', fontSize: 16, marginBottom: 10 }}>
              🔧 Software-Ready Integration
            </h3>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Framework designed to map AI agents to your existing software capabilities, 
              with templates and patterns for common enterprise applications.
            </p>
          </div>
          <div style={{ 
            background: 'white', 
            padding: 20, 
            borderRadius: 8,
            borderLeft: '4px solid #f59e0b'
          }}>
            <h3 style={{ color: '#f59e0b', fontSize: 16, marginBottom: 10 }}>
              🎯 Controlled Autonomy
            </h3>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Agents operate within defined boundaries using functional graphs, ensuring 
              predictable behavior while maintaining the flexibility to handle complex intents.
            </p>
          </div>
        </div>
      </div>

      {/* Domain Selection - Call to Action */}
      <DomainCards onDomainSelect={onDomainSelect} />

      {/* How to Use Section */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 30,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ color: '#333', marginBottom: 20 }}>How to Use the Demo</h2>
        
        {/* Screen Layout Diagram */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ color: '#667eea', fontSize: 18, marginBottom: 15 }}>
            Screen Layout Overview
          </h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: 20,
            padding: 20,
            background: '#f8f9fa',
            borderRadius: 8
          }}>
            <svg width="900" height="400" viewBox="0 0 900 400">
              {/* Persona Bar */}
              <rect x="10" y="10" width="880" height="50" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2" rx="4" />
              <text x="450" y="40" textAnchor="middle" fill="#2e7d32" fontSize="14" fontWeight="bold">
                Persona Bar (Current Persona, Product Usage, Recent Actions)
              </text>
              
              {/* Intent Panel */}
              <rect x="10" y="80" width="250" height="270" fill="#fff3e0" stroke="#ff9800" strokeWidth="2" rx="4" />
              <text x="135" y="105" textAnchor="middle" fill="#e65100" fontSize="14" fontWeight="bold">
                Intent Panel
              </text>
              <text x="135" y="125" textAnchor="middle" fill="#666" fontSize="11">
                • Predefined Examples
              </text>
              <text x="135" y="145" textAnchor="middle" fill="#666" fontSize="11">
                • Type Custom Intent
              </text>
              <text x="135" y="165" textAnchor="middle" fill="#666" fontSize="11">
                • Recent Intents History
              </text>
              
              {/* Graph Visualization */}
              <rect x="280" y="80" width="340" height="270" fill="#f3e5f5" stroke="#9c27b0" strokeWidth="2" rx="4" />
              <text x="450" y="105" textAnchor="middle" fill="#6a1b9a" fontSize="14" fontWeight="bold">
                Graph Visualization
              </text>
              <text x="450" y="125" textAnchor="middle" fill="#666" fontSize="11">
                • Interactive Hierarchy
              </text>
              <text x="450" y="145" textAnchor="middle" fill="#666" fontSize="11">
                • Click to Expand/Collapse
              </text>
              <text x="450" y="165" textAnchor="middle" fill="#666" fontSize="11">
                • Color-Coded Levels
              </text>
              
              {/* Hierarchical representation */}
              <circle cx="450" cy="200" r="15" fill="#9333ea" />
              <text x="450" y="205" textAnchor="middle" fill="white" fontSize="10">O</text>
              
              <line x1="450" y1="215" x2="420" y2="240" stroke="#999" strokeWidth="1" />
              <line x1="450" y1="215" x2="480" y2="240" stroke="#999" strokeWidth="1" />
              
              <circle cx="420" cy="250" r="12" fill="#3b82f6" />
              <text x="420" y="254" textAnchor="middle" fill="white" fontSize="9">S</text>
              
              <circle cx="480" cy="250" r="12" fill="#3b82f6" />
              <text x="480" y="254" textAnchor="middle" fill="white" fontSize="9">S</text>
              
              <line x1="420" y1="262" x2="400" y2="285" stroke="#999" strokeWidth="1" />
              <line x1="420" y1="262" x2="440" y2="285" stroke="#999" strokeWidth="1" />
              
              <circle cx="400" cy="295" r="10" fill="#10b981" />
              <text x="400" y="298" textAnchor="middle" fill="white" fontSize="8">St</text>
              
              <circle cx="440" cy="295" r="10" fill="#10b981" />
              <text x="440" y="298" textAnchor="middle" fill="white" fontSize="8">St</text>
              
              <line x1="400" y1="305" x2="385" y2="325" stroke="#999" strokeWidth="1" />
              <line x1="400" y1="305" x2="415" y2="325" stroke="#999" strokeWidth="1" />
              
              <circle cx="385" cy="330" r="8" fill="#f59e0b" />
              <text x="385" y="333" textAnchor="middle" fill="white" fontSize="7">A</text>
              
              <circle cx="415" cy="330" r="8" fill="#f59e0b" />
              <text x="415" y="333" textAnchor="middle" fill="white" fontSize="7">A</text>
              
              {/* Resolution Panel */}
              <rect x="640" y="80" width="250" height="270" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" rx="4" />
              <text x="765" y="105" textAnchor="middle" fill="#0d47a1" fontSize="14" fontWeight="bold">
                Resolution Panel
              </text>
              <text x="765" y="125" textAnchor="middle" fill="#666" fontSize="11">
                • Resolution Path
              </text>
              <text x="765" y="145" textAnchor="middle" fill="#666" fontSize="11">
                • Confidence Score
              </text>
              <text x="765" y="165" textAnchor="middle" fill="#666" fontSize="11">
                • Alternative Matches
              </text>
              <text x="765" y="185" textAnchor="middle" fill="#666" fontSize="11">
                • Context Influence
              </text>
              
              {/* Control Buttons */}
              <rect x="280" y="365" width="340" height="25" fill="#fce4ec" stroke="#e91e63" strokeWidth="2" rx="4" />
              <text x="450" y="382" textAnchor="middle" fill="#880e4f" fontSize="12" fontWeight="bold">
                Control Toggles (Context, Rationalized, Workflows, Overlaps, Single/Multiple)
              </text>
              
              {/* Legend */}
              <text x="15" y="380" fill="#666" fontSize="10">O = Outcome</text>
              <text x="15" y="395" fill="#666" fontSize="10">S = Scenario</text>
              <text x="90" y="380" fill="#666" fontSize="10">St = Step</text>
              <text x="90" y="395" fill="#666" fontSize="10">A = Action</text>
            </svg>
          </div>
        </div>
        
        {/* Component Descriptions */}
        <h3 style={{ color: '#667eea', fontSize: 18, marginBottom: 15 }}>
          Understanding Each Component
        </h3>
        
        <ComponentDescription
          title="Persona Bar (Top)"
          description="Shows current persona selection, their department, seniority, and domain focus. Product usage percentages update dynamically based on recent actions. The timeline displays the persona's recent activity history."
        />
        
        <ComponentDescription
          title="Intent Panel (Left)"
          description="Contains predefined intent examples and a text input for custom intents. Shows recent intent history with success/failure indicators. Failed intents appear here but don't influence context."
        />
        
        <ComponentDescription
          title="Graph Visualization (Center)"
          description="Interactive hierarchical display of functional nodes. Click nodes to expand/collapse children. Red border indicates entry point, colored fill shows resolution path. Orange dashed borders highlight overlapping functions."
        />
        
        <ComponentDescription
          title="Resolution Panel (Right)"
          description="Displays resolution details including path traversal, confidence scores, and alternative matches. Shows whether context influenced the resolution and lists products involved."
        />
        
        <ComponentDescription
          title="Control Toggles (Bottom)"
          description="Five toggle buttons control the visualization behavior: Context (enables history-based resolution), Rationalized (unifies duplicates), Workflows (shows cross-product orchestration), Overlaps (highlights duplicates), Single/Multiple (expansion mode)."
        />
        
        {/* Demo Walkthrough */}
        <h3 style={{ color: '#667eea', fontSize: 18, marginTop: 30, marginBottom: 15 }}>
          Demo Walkthrough Examples
        </h3>
        
        <ExampleSection
          title="Example 1: Basic Intent Resolution"
          steps={[
            "Select 'Marketing Manager' persona",
            "Click on 'Monitor what people are saying about our brand' from the intent examples",
            "Observe the graph visualization showing the resolution path",
            "Note the resolution panel shows matched nodes and confidence"
          ]}
        />
        
        <ExampleSection
          title="Example 2: Demonstrating Overlapping Functions"
          steps={[
            "Turn ON 'Show Overlaps' toggle (orange button)",
            "Select 'Monitor social media conversations' intent",
            "Notice orange dashed borders on duplicate nodes across products",
            "Turn OFF 'Rationalized' toggle - the resolution will fail",
            "Turn ON 'Rationalized' toggle - the resolution succeeds with unified node"
          ]}
        />
        
        <ExampleSection
          title="Example 3: Context-Based Resolution"
          steps={[
            "Ensure 'Context' toggle is OFF initially",
            "Select several intents to build history (they get added to recent actions)",
            "Type 'track coverage' in the text input",
            "Note which product it resolves to",
            "Turn ON 'Context' toggle",
            "Type the same intent again - it may resolve to a different product based on your history"
          ]}
        />
        
        <ExampleSection
          title="Example 4: Cross-Product Workflows"
          steps={[
            "Turn ON 'Rationalized' toggle first",
            "Turn ON 'Workflows' toggle",
            "Select 'Coordinate multi-channel crisis response' intent",
            "Observe the workflow node (pink) orchestrating across multiple products",
            "Check the resolution panel to see all products involved"
          ]}
        />
      </div>

      {/* Understanding the Visualization */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: 12,
        padding: 30,
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ color: '#333', marginBottom: 20 }}>Understanding the Visualization</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          <div>
            <h3 style={{ color: '#667eea', fontSize: 16, marginBottom: 10 }}>
              Hierarchy Levels
            </h3>
            <LevelIndicator color="#9333ea" label="Outcome" description="High-level business objectives" />
            <LevelIndicator color="#3b82f6" label="Scenario" description="Business situations or use cases" />
            <LevelIndicator color="#10b981" label="Step" description="Process components" />
            <LevelIndicator color="#f59e0b" label="Action" description="Specific operations" />
            <LevelIndicator color="#ec4899" label="Workflow" description="Cross-product orchestration" />
            <LevelIndicator color="#6b7280" label="Product" description="Individual product systems" />
          </div>
          
          <div>
            <h3 style={{ color: '#667eea', fontSize: 16, marginBottom: 10 }}>
              Visual Indicators
            </h3>
            <VisualIndicator
              indicator="Red Border"
              description="Entry point for intent resolution"
            />
            <VisualIndicator
              indicator="Colored Fill"
              description="Node is part of resolution path"
            />
            <VisualIndicator
              indicator="Orange Dashed Border"
              description="Overlapping/duplicate functionality"
            />
            <VisualIndicator
              indicator="Purple Border & Badge"
              description="Rationalized/unified node (when enabled)"
            />
            <VisualIndicator
              indicator="+ / - Button"
              description="Expand/collapse child nodes"
            />
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 30,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ color: '#333', marginBottom: 20 }}>The Problem This Solves</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          <div>
            <h3 style={{ color: '#ef4444', fontSize: 16, marginBottom: 10 }}>
              Without Semantic Engineering
            </h3>
            <ProblemPoint text="Users must know which product to use for each task" />
            <ProblemPoint text="Duplicate functionality across products causes confusion" />
            <ProblemPoint text="No awareness of user context or history" />
            <ProblemPoint text="Workflows require manual coordination across products" />
            <ProblemPoint text="Ambiguous intents lead to failed resolutions" />
          </div>
          
          <div>
            <h3 style={{ color: '#10b981', fontSize: 16, marginBottom: 10 }}>
              With Semantic Engineering
            </h3>
            <SolutionPoint text="Intents automatically map to the right capabilities" />
            <SolutionPoint text="Duplicate functions are unified and rationalized" />
            <SolutionPoint text="Context-aware resolution based on usage patterns" />
            <SolutionPoint text="Automated cross-product workflow orchestration" />
            <SolutionPoint text="Clear resolution paths with confidence scoring" />
          </div>
        </div>
      </div>

      {/* Tips and Tricks */}
      <div style={{
        background: '#fef3c7',
        borderRadius: 12,
        padding: 25,
        border: '1px solid #fbbf24'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
          💡 Pro Tips
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#78350f', lineHeight: 1.8 }}>
          <li>Try the same intent with different personas to see how context affects resolution</li>
          <li>Toggle rationalization OFF to see the duplicate function problem</li>
          <li>Type natural language intents - the system understands synonyms and variations</li>
          <li>Watch how product usage percentages change as you resolve intents</li>
          <li>Failed resolutions still appear in recent intents for learning purposes</li>
          <li>Enable workflows to see cross-product orchestration capabilities</li>
        </ul>
      </div>
    </div>
  );
};


// Component for level indicators
const LevelIndicator: React.FC<{ color: string; label: string; description: string }> = ({ color, label, description }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
    <div style={{
      width: 40,
      height: 24,
      background: color,
      borderRadius: 4
    }} />
    <div>
      <strong style={{ color: '#333', fontSize: 14 }}>{label}</strong>
      <span style={{ color: '#666', fontSize: 13, marginLeft: 8 }}>{description}</span>
    </div>
  </div>
);

// Component for visual indicators
const VisualIndicator: React.FC<{ indicator: string; description: string }> = ({ indicator, description }) => (
  <div style={{ marginBottom: 8 }}>
    <strong style={{ color: '#333', fontSize: 14 }}>{indicator}:</strong>
    <span style={{ color: '#666', fontSize: 13, marginLeft: 8 }}>{description}</span>
  </div>
);

// Component for problem points
const ProblemPoint: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
    <span style={{ color: '#ef4444', fontSize: 16 }}>✗</span>
    <span style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>{text}</span>
  </div>
);

// Component for solution points
const SolutionPoint: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
    <span style={{ color: '#10b981', fontSize: 16 }}>✓</span>
    <span style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>{text}</span>
  </div>
);

export default LandingPageSection;
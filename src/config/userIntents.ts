// User intent mapping data from the document

export interface UserIntent {
  id: string;
  text: string;
  category: 'monitoring' | 'analysis' | 'content' | 'crisis' | 'reporting' | 'engagement';
  productMappings: {
    bcr?: string;
    smm?: string;
    cision?: string;
    prn?: string;
    trendkite?: string;
  };
  workflow?: WorkflowStep[];
  insights?: string[];
}

export interface WorkflowStep {
  product: 'bcr' | 'smm' | 'cision' | 'prn' | 'trendkite';
  action: string;
}

export const USER_INTENTS: UserIntent[] = [
  {
    id: 'monitor-brand',
    text: 'Monitor what people are saying about our brand',
    category: 'monitoring',
    productMappings: {
      bcr: 'Consumer sentiment analysis across 100M+ online sources',
      smm: 'Real-time social listening on major platforms',
      cision: 'Media monitoring across print, TV, radio, podcasts',
      prn: 'Press release performance tracking',
      trendkite: 'Historical trend analysis and reporting'
    },
    insights: ['All products offer monitoring capabilities', 'Significant overlap in functionality']
  },
  {
    id: 'understand-audience',
    text: 'I need to understand our target audience better',
    category: 'analysis',
    productMappings: {
      bcr: 'Deep demographic analysis and persona insights',
      smm: 'Audience analytics and engagement patterns',
      cision: 'Media consumption behavior analysis',
      prn: 'Distribution reach analytics by audience segment',
      trendkite: 'Audience trend analysis over time'
    }
  },
  {
    id: 'track-competitors',
    text: 'Track our competitors\' activities',
    category: 'monitoring',
    productMappings: {
      bcr: 'Competitive intelligence and share of voice',
      smm: 'Competitor social media strategy analysis',
      cision: 'Competitor media coverage tracking',
      prn: 'Competitor press release monitoring',
      trendkite: 'Competitive trend analysis and benchmarking'
    }
  },
  {
    id: 'create-content',
    text: 'Create content about our latest product launch',
    category: 'content',
    productMappings: {
      bcr: 'Consumer insights to inform messaging angles',
      smm: 'Social media content creation and scheduling',
      cision: 'Media list building for outreach',
      prn: 'Press release writing and distribution',
      trendkite: 'Performance reporting template creation'
    }
  },
  {
    id: 'crisis-response',
    text: 'Respond to a brewing crisis quickly',
    category: 'crisis',
    productMappings: {
      bcr: 'Early crisis detection through sentiment spikes',
      smm: 'Pause scheduled content, crisis communication',
      cision: 'Alert system for negative coverage escalation',
      prn: 'Crisis press release distribution',
      trendkite: 'Crisis impact measurement and reporting'
    },
    workflow: [
      { product: 'bcr', action: 'Detect sentiment spike' },
      { product: 'smm', action: 'Pause scheduled content' },
      { product: 'cision', action: 'Escalate monitoring' },
      { product: 'prn', action: 'Distribute response' },
      { product: 'trendkite', action: 'Measure impact' }
    ],
    insights: ['Requires orchestration across all products', 'Sequential workflow critical for effectiveness']
  },
  {
    id: 'find-journalists',
    text: 'Find journalists to pitch our story to',
    category: 'engagement',
    productMappings: {
      bcr: 'Identify trending topics journalists cover',
      smm: 'Find social media influential voices',
      cision: 'Media database with journalist contact info',
      prn: 'Targeted journalist distribution lists',
      trendkite: 'Journalist engagement history analysis'
    }
  },
  {
    id: 'measure-campaign',
    text: 'Measure the success of our campaign',
    category: 'reporting',
    productMappings: {
      bcr: 'Consumer sentiment impact measurement',
      smm: 'Social media engagement and reach metrics',
      cision: 'Earned media coverage analysis',
      prn: 'Press release pickup and distribution metrics',
      trendkite: 'Comprehensive cross-channel campaign reporting'
    },
    insights: ['Each product measures different aspects', 'Unified reporting needed for complete picture']
  },
  {
    id: 'industry-trends',
    text: 'Understand industry trends affecting us',
    category: 'analysis',
    productMappings: {
      bcr: 'Consumer trend analysis in our sector',
      smm: 'Social conversation trending topics',
      cision: 'Industry media coverage patterns',
      prn: 'Industry press release trend analysis',
      trendkite: 'Historical industry analysis and forecasting'
    }
  },
  {
    id: 'get-alerts',
    text: 'Get alerts when something important happens',
    category: 'monitoring',
    productMappings: {
      bcr: 'Custom sentiment threshold alerts',
      smm: 'Social mention and hashtag alerts',
      cision: 'Media coverage spike notifications',
      prn: 'Distribution milestone notifications',
      trendkite: 'Automated trend deviation alerts'
    },
    insights: ['All products have alerting', 'Need unified alert management']
  },
  {
    id: 'executive-report',
    text: 'Create a report for executives',
    category: 'reporting',
    productMappings: {
      bcr: 'Consumer insight executive summaries',
      smm: 'Social media performance dashboards',
      cision: 'Media coverage executive briefings',
      prn: 'PR distribution performance summaries',
      trendkite: 'Executive-level trend and ROI reports'
    }
  },
  {
    id: 'customer-engagement',
    text: 'Find opportunities to engage with customers',
    category: 'engagement',
    productMappings: {
      bcr: 'Consumer conversation analysis for engagement',
      smm: 'Social listening for customer service opportunities',
      cision: 'Media inquiry response opportunities',
      prn: 'Story angle opportunities from news cycle',
      trendkite: 'Engagement opportunity trend identification'
    }
  },
  {
    id: 'content-calendar',
    text: 'Plan our content calendar',
    category: 'content',
    productMappings: {
      bcr: 'Consumer interest trends to inform timing',
      smm: 'Social media content calendar management',
      cision: 'Media event calendar coordination',
      prn: 'Press release scheduling optimization',
      trendkite: 'Historical performance analysis for planning'
    },
    workflow: [
      { product: 'bcr', action: 'Identify consumer trends' },
      { product: 'smm', action: 'Create content calendar' },
      { product: 'cision', action: 'Plan media outreach' },
      { product: 'prn', action: 'Schedule distribution' },
      { product: 'trendkite', action: 'Set measurement framework' }
    ]
  },
  {
    id: 'track-topics',
    text: 'Track specific topics or hashtags',
    category: 'monitoring',
    productMappings: {
      bcr: 'Topic-based consumer conversation analysis',
      smm: 'Hashtag performance tracking and monitoring',
      cision: 'Topic-based media coverage monitoring',
      prn: 'Topic-related press release performance',
      trendkite: 'Topic trend analysis and forecasting'
    }
  },
  {
    id: 'identify-influencers',
    text: 'Identify influencers in our space',
    category: 'engagement',
    productMappings: {
      bcr: 'Consumer opinion leader identification',
      smm: 'Social media influencer discovery and outreach',
      cision: 'Media influencer and thought leader tracking',
      prn: 'Journalist and editor relationship building',
      trendkite: 'Influencer impact trend analysis'
    }
  },
  {
    id: 'sentiment-analysis',
    text: 'Understand sentiment around our latest news',
    category: 'analysis',
    productMappings: {
      bcr: 'Deep sentiment analysis with context and drivers',
      smm: 'Social media sentiment tracking and response',
      cision: 'Media tone analysis across coverage',
      prn: 'Press release reception and pickup sentiment',
      trendkite: 'Sentiment trend analysis over time'
    },
    insights: ['Multiple sentiment analysis capabilities', 'BCR offers deepest analysis']
  },
  {
    id: 'quarterly-comparison',
    text: 'Compare our performance to last quarter',
    category: 'reporting',
    productMappings: {
      bcr: 'Quarter-over-quarter consumer perception analysis',
      smm: 'Social media growth and engagement comparison',
      cision: 'Media coverage volume and sentiment comparison',
      prn: 'Distribution and pickup rate comparison',
      trendkite: 'Comprehensive quarterly performance reporting'
    }
  },
  {
    id: 'spike-investigation',
    text: 'Find out why our brand mention spiked',
    category: 'analysis',
    productMappings: {
      bcr: 'Root cause analysis of conversation volume changes',
      smm: 'Social platform specific spike investigation',
      cision: 'Media event correlation analysis',
      prn: 'Press release correlation with mention spikes',
      trendkite: 'Historical pattern analysis for spike attribution'
    }
  },
  {
    id: 'event-preparation',
    text: 'Get ready for an upcoming industry event',
    category: 'content',
    productMappings: {
      bcr: 'Pre-event consumer conversation analysis',
      smm: 'Social media event promotion and live coverage',
      cision: 'Event media coverage planning and tracking',
      prn: 'Event-related press release strategy',
      trendkite: 'Event ROI planning and measurement framework'
    }
  },
  {
    id: 'geographic-analysis',
    text: 'Understand geographic differences in perception',
    category: 'analysis',
    productMappings: {
      bcr: 'Location-based sentiment and conversation analysis',
      smm: 'Geographic social media performance differences',
      cision: 'Regional media coverage analysis',
      prn: 'Geographic distribution performance analysis',
      trendkite: 'Regional trend analysis and comparison'
    }
  },
  {
    id: 'regulatory-tracking',
    text: 'Track regulatory or policy changes affecting us',
    category: 'monitoring',
    productMappings: {
      bcr: 'Consumer reaction to regulatory news',
      smm: 'Social conversation around policy changes',
      cision: 'Government and regulatory media coverage',
      prn: 'Official statement and response distribution',
      trendkite: 'Regulatory impact trend analysis'
    }
  }
];

export const INTENT_CATEGORIES = [
  { id: 'monitoring', label: 'Monitoring & Tracking', color: '#1976d2' },
  { id: 'analysis', label: 'Analysis & Insights', color: '#7b1fa2' },
  { id: 'content', label: 'Content & Planning', color: '#00897b' },
  { id: 'crisis', label: 'Crisis Management', color: '#d32f2f' },
  { id: 'reporting', label: 'Reporting & Measurement', color: '#f57c00' },
  { id: 'engagement', label: 'Engagement & Outreach', color: '#388e3c' }
];
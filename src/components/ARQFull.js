"use client";
import React, { useState, useEffect, useRef } from 'react';

// Dubai AI Campus Brand Colors
const BRAND = {
  black: '#000000',
  cyan: '#00E5E5',
  cyanDark: '#00B8B8',
  cyanLight: '#4DFAFA',
  white: '#FFFFFF',
  gray: '#888888',
  grayLight: '#CCCCCC',
  grayDark: '#333333',
};

const SCORE_COLORS = {
  1: '#E53935',
  2: '#FB8C00',
  3: '#00B8B8',
  4: '#00D4D4',
  5: '#00E5E5',
};

// Score descriptions
const SCORE_LABELS = {
  1: { label: 'Not Present', short: 'None', description: 'No capability exists. Organization has not started in this area.' },
  2: { label: 'Initial', short: 'Initial', description: 'Ad-hoc efforts. Some awareness but no formal processes.' },
  3: { label: 'Developing', short: 'Developing', description: 'Formal approaches exist but not fully implemented.' },
  4: { label: 'Established', short: 'Established', description: 'Capabilities are implemented and consistently applied.' },
  5: { label: 'Optimized', short: 'Optimized', description: 'Best-in-class. Continuously improving and industry-leading.' }
};

// Countries list
const COUNTRIES = [
  '', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh',
  'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Czech Republic', 'Denmark',
  'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya',
  'Lebanon', 'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
  'Russia', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam', 'Other'
];

// Departments list
const DEPARTMENTS = [
  '', 'Executive / C-Suite', 'Strategy', 'Finance', 'Human Resources', 'Information Technology',
  'Digital / Innovation', 'Operations', 'Marketing', 'Sales', 'Customer Service',
  'Legal / Compliance', 'Risk Management', 'Supply Chain / Logistics', 'Research & Development',
  'Data / Analytics', 'Product Management', 'Engineering', 'Consulting', 'Other'
];

const ARQ_DIMENSIONS = {
  'Data Maturity': {
    weight: 15,
    description: 'Quality, accessibility, governance, and integration of organizational data assets',
    criteria: [
      { id: 'dm1', name: 'Data Quality', description: 'Data is accurate, complete, consistent, and timely across key systems' },
      { id: 'dm2', name: 'Data Accessibility', description: 'Data is easily discoverable and accessible to authorized users' },
      { id: 'dm3', name: 'Data Catalog', description: 'Comprehensive data catalog/dictionary exists and is maintained' },
      { id: 'dm4', name: 'Data Integration', description: 'Data can be combined across systems without major manual effort' },
      { id: 'dm5', name: 'Data Governance', description: 'Clear ownership, stewardship, and quality standards are enforced' },
      { id: 'dm6', name: 'Historical Depth', description: 'Sufficient historical data exists for AI/ML training purposes' },
      { id: 'dm7', name: 'Data Lineage', description: 'Data provenance and transformations are tracked and documented' },
      { id: 'dm8', name: 'Real-time Capability', description: 'Organization can process and act on data in near real-time' },
      { id: 'dm9', name: 'Unstructured Data', description: 'Capability to manage and extract value from unstructured data' },
      { id: 'dm10', name: 'Data Security', description: 'Robust data protection, encryption, and access controls in place' },
    ]
  },
  'Technical Infrastructure': {
    weight: 15,
    description: 'Cloud readiness, compute capabilities, API ecosystem, and security posture',
    criteria: [
      { id: 'ti1', name: 'Cloud Adoption', description: 'Organization has adopted cloud infrastructure (IaaS/PaaS)' },
      { id: 'ti2', name: 'Compute Scalability', description: 'Can scale compute resources up/down based on demand' },
      { id: 'ti3', name: 'API Ecosystem', description: 'Modern APIs exist for key systems enabling integration' },
      { id: 'ti4', name: 'Development Environment', description: 'Proper dev/test/prod environments with CI/CD pipelines' },
      { id: 'ti5', name: 'ML Infrastructure', description: 'MLOps tools and platforms available or easily deployable' },
      { id: 'ti6', name: 'Security Posture', description: 'Security controls meet industry standards (ISO 27001, SOC 2)' },
      { id: 'ti7', name: 'Network Architecture', description: 'Network supports AI workloads (bandwidth, latency)' },
      { id: 'ti8', name: 'Identity Management', description: 'Robust IAM with SSO, MFA, and role-based access' },
      { id: 'ti9', name: 'Monitoring & Logging', description: 'Comprehensive monitoring, logging, and alerting systems' },
      { id: 'ti10', name: 'Disaster Recovery', description: 'Business continuity and disaster recovery plans tested' },
    ]
  },
  'Talent & Skills': {
    weight: 15,
    description: 'AI literacy, technical capability, and organizational learning culture',
    criteria: [
      { id: 'ts1', name: 'AI Literacy (General)', description: 'Employees understand AI concepts, capabilities, and limitations' },
      { id: 'ts2', name: 'AI Literacy (Leadership)', description: 'Leaders can make informed decisions about AI investments' },
      { id: 'ts3', name: 'Data Science Talent', description: 'In-house data scientists or ML engineers available' },
      { id: 'ts4', name: 'Data Engineering', description: 'Capable data engineers to build and maintain pipelines' },
      { id: 'ts5', name: 'Software Engineering', description: 'Strong software development capabilities exist' },
      { id: 'ts6', name: 'Analytics Capability', description: 'Business analysts who can translate needs to requirements' },
      { id: 'ts7', name: 'Learning Culture', description: 'Organization invests in continuous learning and upskilling' },
      { id: 'ts8', name: 'External Partnerships', description: 'Relationships with AI vendors, consultants, or academia' },
      { id: 'ts9', name: 'Hiring Pipeline', description: 'Ability to attract and retain AI/ML talent' },
      { id: 'ts10', name: 'Knowledge Sharing', description: 'Mechanisms exist for sharing AI learnings across teams' },
    ]
  },
  'Leadership Readiness': {
    weight: 12,
    description: 'Vision clarity, risk tolerance, change sponsorship, and investment commitment',
    criteria: [
      { id: 'lr1', name: 'AI Vision', description: 'Clear executive vision for AI role in organizational strategy' },
      { id: 'lr2', name: 'Sponsorship', description: 'Active C-level sponsor championing AI initiatives' },
      { id: 'lr3', name: 'Risk Tolerance', description: 'Willingness to experiment and accept some AI project failures' },
      { id: 'lr4', name: 'Investment Commitment', description: 'Budget allocated specifically for AI/ML initiatives' },
      { id: 'lr5', name: 'Change Leadership', description: 'Leaders actively communicate and model AI adoption' },
      { id: 'lr6', name: 'Decision Speed', description: 'Ability to make timely decisions on AI opportunities' },
      { id: 'lr7', name: 'Cross-functional Alignment', description: 'Alignment across business units on AI priorities' },
      { id: 'lr8', name: 'Long-term Orientation', description: 'Patience for AI initiatives that take time to deliver ROI' },
    ]
  },
  'Process Suitability': {
    weight: 12,
    description: 'Automation potential, decision complexity, and process standardization',
    criteria: [
      { id: 'ps1', name: 'Process Documentation', description: 'Key business processes are documented and understood' },
      { id: 'ps2', name: 'Process Standardization', description: 'Processes are standardized vs. ad-hoc variations' },
      { id: 'ps3', name: 'Automation Readiness', description: 'Processes have clear rules suitable for automation' },
      { id: 'ps4', name: 'Decision Complexity', description: 'Decision points exist where AI can add value' },
      { id: 'ps5', name: 'Volume & Frequency', description: 'Sufficient transaction volume to benefit from AI' },
      { id: 'ps6', name: 'Exception Handling', description: 'Clear protocols for handling edge cases and exceptions' },
      { id: 'ps7', name: 'Feedback Loops', description: 'Mechanisms to capture outcomes and improve over time' },
      { id: 'ps8', name: 'Human-AI Workflow', description: 'Understanding of where humans and AI should collaborate' },
    ]
  },
  'Governance & Ethics': {
    weight: 10,
    description: 'Policy frameworks, compliance posture, and risk management capabilities',
    criteria: [
      { id: 'ge1', name: 'AI Policy Framework', description: 'Policies governing AI use exist or are in development' },
      { id: 'ge2', name: 'Regulatory Compliance', description: 'Understanding of AI-related regulations (UAE AI Ethics, GDPR)' },
      { id: 'ge3', name: 'Risk Management', description: 'AI risks are identified, assessed, and managed' },
      { id: 'ge4', name: 'Ethical Guidelines', description: 'Principles for responsible AI use are articulated' },
      { id: 'ge5', name: 'Bias Awareness', description: 'Understanding of AI bias risks and mitigation approaches' },
      { id: 'ge6', name: 'Transparency Practices', description: 'Ability to explain AI decisions to stakeholders' },
      { id: 'ge7', name: 'Audit Capability', description: 'Can audit AI systems for compliance and performance' },
      { id: 'ge8', name: 'Incident Response', description: 'Protocols for handling AI-related incidents' },
    ]
  },
  'Culture & Change': {
    weight: 10,
    description: 'Innovation appetite, collaboration patterns, and organizational adaptability',
    criteria: [
      { id: 'cc1', name: 'Innovation Culture', description: 'Organization encourages experimentation and new ideas' },
      { id: 'cc2', name: 'Collaboration', description: 'Cross-functional collaboration is the norm, not exception' },
      { id: 'cc3', name: 'Change Adaptability', description: 'Organization has successfully navigated major changes' },
      { id: 'cc4', name: 'Failure Tolerance', description: 'Learning from failures is valued, not punished' },
      { id: 'cc5', name: 'Data-Driven Decisions', description: 'Decisions are based on data rather than intuition alone' },
      { id: 'cc6', name: 'Technology Adoption', description: 'Track record of successfully adopting new technologies' },
      { id: 'cc7', name: 'Employee Engagement', description: 'Employees are engaged and open to new ways of working' },
      { id: 'cc8', name: 'External Orientation', description: 'Organization looks outward for ideas and best practices' },
    ]
  },
  'Strategic Alignment': {
    weight: 11,
    description: 'AI-strategy fit, competitive pressure, and investment capacity',
    criteria: [
      { id: 'sa1', name: 'Strategic Fit', description: 'AI directly supports stated corporate strategy and goals' },
      { id: 'sa2', name: 'Competitive Pressure', description: 'Industry peers are adopting AI, creating urgency' },
      { id: 'sa3', name: 'Customer Expectations', description: 'Customers expect AI-powered products/services' },
      { id: 'sa4', name: 'Value Clarity', description: 'Clear understanding of how AI creates business value' },
      { id: 'sa5', name: 'Use Case Pipeline', description: 'Identified AI use cases with business justification' },
      { id: 'sa6', name: 'Investment Capacity', description: 'Financial resources available for AI investments' },
      { id: 'sa7', name: 'Measurement Framework', description: 'KPIs defined to measure AI initiative success' },
      { id: 'sa8', name: 'Ecosystem Readiness', description: 'Partners, vendors, customers ready to engage with AI' },
    ]
  }
};

const READINESS_LEVELS = [
  { min: 0, max: 20, level: 'Not Ready', color: '#E53935', description: 'Significant foundational work required' },
  { min: 21, max: 40, level: 'Foundational', color: '#FB8C00', description: 'Basic elements in place' },
  { min: 41, max: 60, level: 'Developing', color: '#00B8B8', description: 'Ready for targeted AI pilots' },
  { min: 61, max: 80, level: 'Established', color: '#00D4D4', description: 'Ready for scaled deployment' },
  { min: 81, max: 100, level: 'Optimized', color: '#00E5E5', description: 'Industry-leading readiness' }
];

const STORAGE_KEY = 'arq-assessments-v6';
const DB_KEY = 'arq-full-database';

const TOTAL_QUESTIONS = Object.values(ARQ_DIMENSIONS).reduce((sum, d) => sum + d.criteria.length, 0);

// Logo Component
const Logo = ({ size = 'default' }) => {
  const s = { small: 36, default: 44, large: 52 }[size];
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
        <div className="absolute inset-0 border-2 rounded-sm" style={{ borderColor: BRAND.cyan, transform: 'rotate(45deg)', background: 'linear-gradient(135deg, rgba(0,229,229,0.05) 0%, rgba(0,229,229,0.15) 100%)', boxShadow: '0 0 20px rgba(0,229,229,0.3)' }}>
          <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: BRAND.cyan, opacity: 0.4 }} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs tracking-wider" style={{ color: BRAND.gray, direction: 'rtl' }}>كامبس دبي للذكاء الاصطناعي</span>
        <span className="text-lg font-bold tracking-wide" style={{ color: BRAND.white }}>DUBAI AI CAMPUS</span>
      </div>
    </div>
  );
};

// Wave Background
const WaveBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <svg className="absolute bottom-0 left-0 w-full" height="400" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ opacity: 0.6 }}>
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BRAND.cyanDark} />
          <stop offset="50%" stopColor={BRAND.cyan} />
          <stop offset="100%" stopColor={BRAND.cyanLight} />
        </linearGradient>
      </defs>
      {[...Array(12)].map((_, i) => (
        <path key={i} d={`M0,${350 - i * 8} Q360,${300 - i * 15 + Math.sin(i) * 30} 720,${320 - i * 10} T1440,${280 - i * 12}`} stroke="url(#waveGrad)" strokeWidth="1.5" fill="none" opacity={0.3 + i * 0.05}/>
      ))}
    </svg>
  </div>
);

// Full Scoring Guide with descriptions (for home and assessment pages)
const ScoringGuideFull = () => (
  <div className="rounded-xl p-6" style={{ backgroundColor: BRAND.grayDark, border: `1px solid ${BRAND.gray}40` }}>
    <div className="flex items-center gap-3 mb-5">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BRAND.cyan }} />
      <span className="text-lg font-semibold" style={{ color: BRAND.white }}>Scoring Guide</span>
    </div>
    <div className="grid grid-cols-5 gap-4">
      {Object.entries(SCORE_LABELS).map(([score, data]) => (
        <div key={score} className="text-center">
          <div 
            className="w-14 h-14 rounded-lg flex items-center justify-center font-bold mx-auto text-2xl"
            style={{ backgroundColor: SCORE_COLORS[score], color: parseInt(score) >= 3 ? BRAND.black : BRAND.white }}
          >
            {score}
          </div>
          <div className="mt-3 font-semibold text-base" style={{ color: BRAND.white }}>{data.short}</div>
          <div className="text-sm mt-1 leading-tight" style={{ color: BRAND.gray }}>{data.description}</div>
        </div>
      ))}
    </div>
  </div>
);

// Compact Scoring Guide (for header)
const ScoringGuideCompact = () => (
  <div className="rounded-xl p-3" style={{ backgroundColor: BRAND.grayDark, border: `1px solid ${BRAND.gray}40` }}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: BRAND.cyan }} />
      <span className="text-sm font-semibold" style={{ color: BRAND.white }}>Scoring Guide</span>
    </div>
    <div className="flex justify-between gap-2">
      {Object.entries(SCORE_LABELS).map(([score, data]) => (
        <div key={score} className="text-center flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold mx-auto text-lg"
            style={{ backgroundColor: SCORE_COLORS[score], color: parseInt(score) >= 3 ? BRAND.black : BRAND.white }}
          >
            {score}
          </div>
          <div className="mt-1 font-medium text-xs" style={{ color: BRAND.white }}>{data.short}</div>
        </div>
      ))}
    </div>
  </div>
);

export default function ARQFull() {
  const [currentView, setCurrentView] = useState('home');
  const [assessmentData, setAssessmentData] = useState({
    id: null, organizationName: '', industry: '', employeeCount: '', country: '', department: '',
    assessorName: '', assessorEmail: '', date: new Date().toISOString().split('T')[0],
    responses: {}, completed: false
  });
  const [currentDimension, setCurrentDimension] = useState(0);
  const [savedAssessments, setSavedAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Refs for auto-scrolling
  const questionRefs = useRef({});
  const topRef = useRef(null);

  const dimensions = Object.keys(ARQ_DIMENSIONS);

  useEffect(() => { loadAssessments(); }, []);

  // Scroll to top when dimension changes
  useEffect(() => {
    if (currentView === 'assessment' && topRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentDimension]);

  const loadAssessments = async () => {
    try {
      const result = { value: localStorage.getItem(STORAGE_KEY) };
      if (result?.value) setSavedAssessments(JSON.parse(result.value));
    } catch (e) { setSavedAssessments([]); }
  };

  const saveAssessment = async (assessment) => {
    const updated = [...savedAssessments];
    const idx = updated.findIndex(a => a.id === assessment.id);
    if (idx >= 0) updated[idx] = assessment;
    else updated.push(assessment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedAssessments(updated);
  };

  const saveToDatabase = async (assessment, scores) => {
    try {
      const record = {
        id: assessment.id,
        timestamp: new Date().toISOString(),
        organization: assessment.organizationName,
        industry: assessment.industry,
        country: assessment.country,
        department: assessment.department,
        employeeCount: assessment.employeeCount,
        assessorName: assessment.assessorName,
        assessorEmail: assessment.assessorEmail,
        arqScore: scores.arqScore,
        readinessLevel: scores.readinessLevel.level,
        dimensionScores: Object.entries(scores.dimensionScores).reduce((acc, [k, v]) => {
          acc[k] = v.average;
          return acc;
        }, {}),
        responses: assessment.responses
      };
      
      let database = [];
      try {
        const dbResult = { value: localStorage.getItem(DB_KEY) };
        if (dbResult?.value) database = JSON.parse(dbResult.value);
      } catch (e) { database = []; }
      
      const existingIdx = database.findIndex(r => r.id === record.id);
      if (existingIdx >= 0) database[existingIdx] = record;
      else database.push(record);
      
      localStorage.setItem(DB_KEY, JSON.stringify(database));
      // Save to server API for shared access
      try { await fetch('/api/assessments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'full', record }) }); } catch (e) { console.log('Server save failed, data saved locally'); }
    } catch (e) {
      console.error('Failed to save to database:', e);
    }
  };

  const deleteAssessment = async (id) => {
    const updated = savedAssessments.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedAssessments(updated);
  };

  const calculateScores = (responses) => {
    const dimensionScores = {};
    let totalWeightedScore = 0, totalWeight = 0;
    Object.entries(ARQ_DIMENSIONS).forEach(([dimName, dimData]) => {
      const scores = dimData.criteria.map(c => responses[c.id]).filter(s => s != null);
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        dimensionScores[dimName] = { average: avg, weight: dimData.weight, completion: scores.length / dimData.criteria.length };
        totalWeightedScore += avg * dimData.weight;
        totalWeight += dimData.weight;
      } else {
        dimensionScores[dimName] = { average: 0, weight: dimData.weight, completion: 0 };
      }
    });
    const arqScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 20 : 0;
    const readinessLevel = READINESS_LEVELS.find(r => arqScore >= r.min && arqScore <= r.max) || READINESS_LEVELS[0];
    return { arqScore: Math.round(arqScore * 10) / 10, dimensionScores, readinessLevel };
  };

  const generateAIAnalysis = async (assessment, scores) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessment, scores })
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setAiAnalysis(data);
    } catch (e) {
      console.error('Analysis error:', e);
      const sorted = Object.entries(scores.dimensionScores).filter(([_, d]) => d.completion > 0).sort((a, b) => b[1].average - a[1].average);
      setAiAnalysis({
        executiveSummary: `${assessment.organizationName} demonstrates ${scores.readinessLevel.level.toLowerCase()} AI readiness with a score of ${scores.arqScore}/100. ${scores.arqScore >= 60 ? 'Strong foundation for AI initiatives.' : 'Targeted capability building recommended.'}`,
        keyStrengths: sorted.filter(([_, d]) => d.average >= 3.5).slice(0, 3).map(([n, d]) => ({ area: n, insight: 'Strong capability to leverage', score: d.average })),
        criticalGaps: sorted.filter(([_, d]) => d.average < 3).reverse().slice(0, 3).map(([n, d]) => ({ area: n, insight: 'Requires attention', score: d.average, priority: d.average < 2 ? 'HIGH' : 'MEDIUM' })),
        strategicRecommendations: {
          immediate: [{ action: 'Establish AI governance committee', rationale: 'Foundation for responsible AI', impact: 'High' }],
          shortTerm: [{ action: 'Launch AI literacy program', rationale: 'Enable informed decisions', impact: 'High' }],
          mediumTerm: [{ action: 'Pilot 2-3 AI use cases', rationale: 'Demonstrate value', impact: 'High' }]
        },
        recommendedProgram: { name: scores.arqScore >= 50 ? 'Model B: Rapid Deployment Track' : 'Model A: Sovereign AI Enterprise Initiative', rationale: 'Based on readiness level' }
      });
    }
    setIsAnalyzing(false);
    await saveToDatabase(assessment, scores);
  };

  // Handle score change with auto-scroll
  const handleScoreChange = (criterionId, score, currentIndex, totalCriteria) => {
    setAssessmentData(p => ({ ...p, responses: { ...p.responses, [criterionId]: score } }));
    
    // Auto-scroll to next question if not the last one
    if (currentIndex < totalCriteria - 1) {
      const nextCriterion = ARQ_DIMENSIONS[dimensions[currentDimension]].criteria[currentIndex + 1];
      setTimeout(() => {
        const nextElement = questionRefs.current[nextCriterion.id];
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    const scores = calculateScores(selectedAssessment.responses);
    const { arqScore, dimensionScores, readinessLevel } = scores;
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 2px solid #00E5E5; padding-bottom: 30px; }
    .logo { display: flex; align-items: center; gap: 15px; }
    .logo-text { }
    .logo-arabic { font-size: 12px; color: #ccc; margin-bottom: 4px; }
    .logo-english { font-size: 16px; letter-spacing: 4px; }
    .score-box { text-align: right; }
    .score-number { font-size: 72px; font-weight: bold; color: ${readinessLevel.color}; }
    .score-label { font-size: 18px; color: #888; }
    .title-section { margin-bottom: 40px; }
    .report-title { font-size: 14px; color: #00E5E5; margin-bottom: 10px; }
    .org-name { font-size: 36px; font-weight: bold; margin-bottom: 10px; }
    .org-details { font-size: 16px; color: #888; }
    .readiness-box { background: ${readinessLevel.color}20; border: 1px solid ${readinessLevel.color}; border-radius: 10px; padding: 20px; margin-bottom: 40px; }
    .readiness-label { font-size: 24px; font-weight: bold; display: flex; align-items: center; gap: 10px; }
    .readiness-dot { width: 16px; height: 16px; border-radius: 4px; background: ${readinessLevel.color}; }
    .section { margin-bottom: 40px; }
    .section-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #fff; }
    .dimension-row { display: flex; align-items: center; margin-bottom: 15px; }
    .dimension-name { width: 220px; font-size: 14px; flex-shrink: 0; }
    .dimension-bar { flex: 1; height: 16px; background: #333; border-radius: 8px; margin: 0 15px; }
    .dimension-fill { height: 100%; border-radius: 8px; }
    .dimension-score { width: 60px; text-align: right; font-size: 18px; font-weight: bold; }
    .two-col { display: flex; gap: 30px; margin-bottom: 40px; }
    .col { flex: 1; background: #1a1a1a; border-radius: 10px; padding: 25px; }
    .col-title { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
    .col-title.cyan { color: #00E5E5; }
    .col-title.orange { color: #FB8C00; }
    .item { padding-left: 15px; border-left: 3px solid; margin-bottom: 15px; }
    .item.cyan { border-color: #00E5E5; }
    .item.orange { border-color: #FB8C00; }
    .item-title { font-size: 18px; font-weight: 500; margin-bottom: 5px; }
    .item-desc { font-size: 16px; color: #888; }
    .priority-badge { display: inline-block; font-size: 12px; padding: 3px 10px; border-radius: 4px; margin-left: 10px; }
    .priority-high { background: #E53935; }
    .priority-medium { background: #FB8C00; }
    .rec-phase { margin-bottom: 25px; }
    .phase-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
    .phase-dot { width: 12px; height: 12px; border-radius: 4px; }
    .rec-item { background: #0a0a0a; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
    .rec-action { font-size: 15px; font-weight: 500; margin-bottom: 5px; }
    .rec-rationale { font-size: 13px; color: #888; }
    .program-box { background: linear-gradient(135deg, #00E5E520 0%, #000 100%); border: 1px solid #00E5E540; border-radius: 15px; padding: 30px; }
    .program-title { font-size: 20px; font-weight: bold; color: #00E5E5; margin-bottom: 10px; }
    .program-rationale { font-size: 16px; color: #ccc; }
    .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #333; color: #666; font-size: 14px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div style="width:50px;height:50px;border:2px solid #fff;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
        <div style="width:30px;height:30px;border:1px solid #fff;opacity:0.5;"></div>
      </div>
      <div class="logo-text">
        <div class="logo-arabic">كامبس دبي للذكاء الاصطناعي</div>
        <div class="logo-english">DUBAI AI CAMPUS</div>
      </div>
    </div>
    <div class="score-box">
      <div class="score-number">${arqScore}</div>
      <div class="score-label">out of 100</div>
    </div>
  </div>

  <div class="title-section">
    <div class="report-title">ARQ™ Assessment Results</div>
    <div class="org-name">${selectedAssessment.organizationName}</div>
    <div class="org-details">${[selectedAssessment.industry, selectedAssessment.country, selectedAssessment.department].filter(Boolean).join(' · ')} · ${new Date(selectedAssessment.date).toLocaleDateString()}</div>
  </div>

  <div class="readiness-box">
    <div class="readiness-label">
      <span class="readiness-dot"></span>
      ${readinessLevel.level}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dimension Scores</div>
    ${Object.entries(ARQ_DIMENSIONS).map(([name, data]) => {
      const ds = dimensionScores[name];
      const color = ds.average >= 4 ? '#00E5E5' : ds.average >= 3 ? '#00B8B8' : ds.average >= 2 ? '#FB8C00' : '#E53935';
      return `
        <div class="dimension-row">
          <div class="dimension-name">${name}</div>
          <div class="dimension-bar">
            <div class="dimension-fill" style="width:${(ds.average/5)*100}%;background:${color};"></div>
          </div>
          <div class="dimension-score" style="color:${color}">${ds.average.toFixed(1)}/5</div>
        </div>
      `;
    }).join('')}
  </div>

  ${aiAnalysis ? `
  <div class="section">
    <div class="section-title">Executive Summary</div>
    <p style="font-size:18px;line-height:1.6;color:#ccc;">${aiAnalysis.executiveSummary}</p>
  </div>

  <div class="two-col">
    <div class="col">
      <div class="col-title cyan">Key Strengths</div>
      ${aiAnalysis.keyStrengths?.map(s => `
        <div class="item cyan">
          <div class="item-title">${s.area}</div>
          <div class="item-desc">${s.insight}</div>
        </div>
      `).join('') || '<div class="item-desc">No strong dimensions identified</div>'}
    </div>
    <div class="col">
      <div class="col-title orange">Critical Gaps</div>
      ${aiAnalysis.criticalGaps?.map(g => `
        <div class="item orange">
          <div class="item-title">${g.area}<span class="priority-badge ${g.priority === 'HIGH' ? 'priority-high' : 'priority-medium'}">${g.priority}</span></div>
          <div class="item-desc">${g.insight}</div>
        </div>
      `).join('') || '<div class="item-desc">No critical gaps identified</div>'}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Strategic Recommendations</div>
    ${['immediate', 'shortTerm', 'mediumTerm'].map((phase, i) => `
      <div class="rec-phase">
        <div class="phase-title">
          <span class="phase-dot" style="background:${['#00E5E5', '#00B8B8', '#888'][i]}"></span>
          ${['Immediate (0-30 days)', 'Short-term (30-90 days)', 'Medium-term (90-180 days)'][i]}
        </div>
        ${aiAnalysis.strategicRecommendations?.[phase]?.map(r => `
          <div class="rec-item">
            <div class="rec-action">${r.action}</div>
            <div class="rec-rationale">${r.rationale}</div>
          </div>
        `).join('') || ''}
      </div>
    `).join('')}
  </div>

  ${aiAnalysis.recommendedProgram ? `
  <div class="program-box">
    <div class="section-title">Recommended Program</div>
    <div class="program-title">${aiAnalysis.recommendedProgram.name}</div>
    <div class="program-rationale">${aiAnalysis.recommendedProgram.rationale}</div>
  </div>
  ` : ''}
  ` : ''}

  <div class="footer">
    ARQ™ AI Readiness Assessment · DUBAI AI CAMPUS · DIFC Innovation Hub
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setIsExporting(false);
        }, 500);
      };
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `ARQ_Report_${selectedAssessment.organizationName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      setIsExporting(false);
    }
    
    URL.revokeObjectURL(url);
  };

  const exportToEmail = () => {
    if (!selectedAssessment) return;
    const { arqScore, dimensionScores, readinessLevel } = calculateScores(selectedAssessment.responses);
    
    const subject = encodeURIComponent(`ARQ Full Assessment Results - ${selectedAssessment.organizationName}`);
    const body = encodeURIComponent(`ARQ™ Full Assessment Report
================================

Assessment Date: ${new Date(selectedAssessment.date).toLocaleDateString()}

ORGANIZATION PROFILE
--------------------
Organization: ${selectedAssessment.organizationName}
Industry: ${selectedAssessment.industry || 'Not specified'}
Country: ${selectedAssessment.country || 'Not specified'}
Department: ${selectedAssessment.department || 'Not specified'}
Company Size: ${selectedAssessment.employeeCount || 'Not specified'}
Assessor: ${selectedAssessment.assessorName}

OVERALL RESULTS
---------------
ARQ Score: ${arqScore}/100
Readiness Level: ${readinessLevel.level}
${readinessLevel.description}

DIMENSION SCORES
----------------
${Object.entries(dimensionScores).map(([dim, data]) => `• ${dim}: ${data.average.toFixed(1)}/5.0 (${Math.round(data.average * 20)}%)`).join('\n')}

EXECUTIVE SUMMARY
-----------------
${aiAnalysis?.executiveSummary || 'Analysis not available'}

KEY STRENGTHS
-------------
${(aiAnalysis?.keyStrengths || []).map(s => `• ${s.area}: ${s.insight}`).join('\n')}

CRITICAL GAPS
-------------
${(aiAnalysis?.criticalGaps || []).map(g => `• ${g.area} (${g.priority}): ${g.insight}`).join('\n')}

STRATEGIC RECOMMENDATIONS
-------------------------
Immediate:
${(aiAnalysis?.strategicRecommendations?.immediate || []).map(r => `• ${r.action}: ${r.rationale}`).join('\n')}

Short-term:
${(aiAnalysis?.strategicRecommendations?.shortTerm || []).map(r => `• ${r.action}: ${r.rationale}`).join('\n')}

Medium-term:
${(aiAnalysis?.strategicRecommendations?.mediumTerm || []).map(r => `• ${r.action}: ${r.rationale}`).join('\n')}

RECOMMENDED PROGRAM
-------------------
${aiAnalysis?.recommendedProgram?.name || 'Contact Dubai AI Campus for program recommendations'}
${aiAnalysis?.recommendedProgram?.rationale || ''}

---
Report generated by ARQ™ Full Assessment | Dubai AI Campus | DIFC Innovation Hub
Visit: https://arq-assessment.vercel.app/full
`);
    const email = selectedAssessment.assessorEmail || '';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };


  const startNew = () => {
    setAssessmentData({ id: Date.now().toString(), organizationName: '', industry: '', employeeCount: '', country: '', department: '', assessorName: '', assessorEmail: '', date: new Date().toISOString().split('T')[0], responses: {}, completed: false });
    setCurrentDimension(0);
    setAiAnalysis(null);
    setCurrentView('info');
  };

  // Styles
  const pageStyle = { backgroundColor: BRAND.black, minHeight: '100vh' };
  const cardStyle = { backgroundColor: BRAND.grayDark, border: `1px solid ${BRAND.gray}30` };
  const inputStyle = { backgroundColor: BRAND.black, border: `1px solid ${BRAND.gray}50`, color: BRAND.white };
  const btnPrimary = { backgroundColor: BRAND.cyan, color: BRAND.black };
  const btnSecondary = { backgroundColor: 'transparent', color: BRAND.cyan, border: `1px solid ${BRAND.cyan}` };

  // HOME
  const renderHome = () => (
    <div style={pageStyle} className="relative">
      <WaveBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <Logo />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-6" style={{ color: BRAND.white }}>
            <span style={{ color: BRAND.cyan }}>ARQ</span>™ Assessment
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ color: BRAND.grayLight }}>
            AI Readiness Quotient — Measure your organization's readiness to adopt and scale artificial intelligence
          </p>
          <div className="mt-6 text-lg" style={{ color: BRAND.gray }}>
            {TOTAL_QUESTIONS} questions across 8 dimensions
          </div>
        </div>

        {/* Full Scoring Guide on Home Page */}
        <div className="mb-12">
          <ScoringGuideFull />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <button onClick={startNew} className="group rounded-2xl p-8 text-left transition-all hover:scale-[1.02]" style={{ ...cardStyle, boxShadow: `0 0 60px ${BRAND.cyan}15` }}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: BRAND.cyan }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={BRAND.black} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: BRAND.white }}>Start New Assessment</h2>
            <p className="text-lg" style={{ color: BRAND.gray }}>Evaluate your organization across 8 dimensions with AI-powered insights</p>
          </button>

          <button onClick={() => setCurrentView('list')} className="group rounded-2xl p-8 text-left transition-all hover:scale-[1.02]" style={cardStyle}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.cyan}20` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={BRAND.cyan} strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: BRAND.white }}>View Assessments</h2>
            <p className="text-lg" style={{ color: BRAND.gray }}>Continue in-progress or review completed assessments</p>
            {savedAssessments.length > 0 && (
              <span className="inline-block mt-4 px-4 py-2 rounded-lg text-base font-medium" style={{ backgroundColor: `${BRAND.cyan}20`, color: BRAND.cyan }}>
                {savedAssessments.length} saved
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ARQ_DIMENSIONS).map(([name, data]) => (
            <div key={name} className="rounded-xl p-5 text-center" style={{ backgroundColor: `${BRAND.grayDark}80` }}>
              <div className="text-3xl font-bold mb-1" style={{ color: BRAND.cyan }}>{data.weight}%</div>
              <div className="text-sm font-medium mb-1" style={{ color: BRAND.white }}>{name}</div>
              <div className="text-xs" style={{ color: BRAND.gray }}>{data.criteria.length} questions</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // INFO
  const renderInfo = () => (
    <div style={pageStyle} className="relative">
      <WaveBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => setCurrentView('home')} className="text-lg" style={{ color: BRAND.gray }}>← Back</button>
          <Logo size="small" />
        </div>
        <div className="mb-8"><ScoringGuideFull /></div>
        <div className="rounded-2xl p-8" style={cardStyle}>
          <h2 className="text-3xl font-semibold mb-3" style={{ color: BRAND.white }}>Organization Details</h2>
          <p className="text-lg mb-10" style={{ color: BRAND.gray }}>Enter information about the organization being assessed</p>
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Organization Name *</label>
              <input type="text" value={assessmentData.organizationName} onChange={e => setAssessmentData({ ...assessmentData, organizationName: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle} placeholder="Enter organization name" />
            </div>
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Industry</label>
              <select value={assessmentData.industry} onChange={e => setAssessmentData({ ...assessmentData, industry: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle}>
                {['', 'Financial Services', 'Government', 'Healthcare', 'Retail', 'Manufacturing', 'Energy', 'Technology', 'Telecommunications', 'Real Estate', 'Education', 'Other'].map(o => <option key={o} value={o}>{o || 'Select industry...'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Country</label>
              <select value={assessmentData.country} onChange={e => setAssessmentData({ ...assessmentData, country: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c || 'Select country...'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Department / Function</label>
              <select value={assessmentData.department} onChange={e => setAssessmentData({ ...assessmentData, department: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'Select department...'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Number of Employees</label>
              <select value={assessmentData.employeeCount} onChange={e => setAssessmentData({ ...assessmentData, employeeCount: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle}>
                {['', '1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'].map(o => <option key={o} value={o}>{o || 'Select size...'}</option>)}
              </select>
            </div>
            
            <hr style={{ borderColor: `${BRAND.gray}30`, margin: '30px 0' }} />
            
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Your Name *</label>
              <input type="text" value={assessmentData.assessorName} onChange={e => setAssessmentData({ ...assessmentData, assessorName: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle} placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: BRAND.white }}>Your Email</label>
              <input type="email" value={assessmentData.assessorEmail} onChange={e => setAssessmentData({ ...assessmentData, assessorEmail: e.target.value })} className="w-full rounded-xl px-5 py-4 text-lg focus:outline-none" style={inputStyle} placeholder="Enter your email" />
            </div>
            
            <button onClick={() => assessmentData.organizationName && assessmentData.assessorName && setCurrentView('assessment')} disabled={!assessmentData.organizationName || !assessmentData.assessorName} className="w-full font-bold py-5 rounded-xl text-xl transition-all disabled:opacity-40 mt-8" style={btnPrimary}>
              Begin Assessment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ASSESSMENT
  const renderAssessment = () => {
    const dimName = dimensions[currentDimension];
    const dimData = ARQ_DIMENSIONS[dimName];
    const progress = (currentDimension / dimensions.length) * 100;
    const dimProgress = (dimData.criteria.filter(c => assessmentData.responses[c.id] != null).length / dimData.criteria.length) * 100;

    return (
      <div style={pageStyle}>
        <div ref={topRef} className="sticky top-0 z-20 py-5" style={{ backgroundColor: BRAND.black, borderBottom: `1px solid ${BRAND.gray}30` }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <Logo size="small" />
              <button onClick={async () => { await saveAssessment(assessmentData); alert('Progress saved!'); }} className="px-5 py-2 rounded-lg text-base font-medium" style={btnSecondary}>
                Save Progress
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 rounded-full h-3" style={{ backgroundColor: BRAND.grayDark }}>
                <div className="h-3 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: BRAND.cyan }} />
              </div>
              <span className="text-lg font-medium" style={{ color: BRAND.white }}>{currentDimension + 1}/{dimensions.length}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Full Scoring Guide on Assessment Page */}
          <div className="mb-8"><ScoringGuideFull /></div>

          <div className="rounded-2xl p-8 mb-8" style={cardStyle}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-3xl font-semibold mb-3" style={{ color: BRAND.white }}>{dimName}</h2>
                <p className="text-lg" style={{ color: BRAND.gray }}>{dimData.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-4xl font-bold" style={{ color: BRAND.cyan }}>{dimData.weight}%</div>
                <div className="text-base" style={{ color: BRAND.gray }}>{dimData.criteria.length} questions</div>
              </div>
            </div>
            <div className="mt-6 rounded-full h-2" style={{ backgroundColor: BRAND.grayDark }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${dimProgress}%`, backgroundColor: BRAND.cyanDark }} />
            </div>
          </div>

          <div className="space-y-5 mb-10">
            {dimData.criteria.map((c, i) => (
              <div 
                key={c.id} 
                ref={el => questionRefs.current[c.id] = el}
                className="rounded-2xl p-6" 
                style={cardStyle}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="text-xl font-medium mb-2" style={{ color: BRAND.white }}>{i + 1}. {c.name}</div>
                    <div className="text-base" style={{ color: BRAND.gray }}>{c.description}</div>
                  </div>
                  {assessmentData.responses[c.id] && (
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
                      style={{ backgroundColor: SCORE_COLORS[assessmentData.responses[c.id]], color: assessmentData.responses[c.id] >= 3 ? BRAND.black : BRAND.white }}
                    >
                      {assessmentData.responses[c.id]}
                    </div>
                  )}
                </div>
                {/* Score buttons - 25% bigger with cyan color */}
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button 
                      key={score} 
                      onClick={() => handleScoreChange(c.id, score, i, dimData.criteria.length)} 
                      className="flex-1 py-5 rounded-xl font-bold transition-all"
                      style={{
                        backgroundColor: assessmentData.responses[c.id] === score ? SCORE_COLORS[score] : BRAND.grayDark,
                        color: assessmentData.responses[c.id] === score ? (score >= 3 ? BRAND.black : BRAND.white) : BRAND.cyan,
                        border: `2px solid ${assessmentData.responses[c.id] === score ? SCORE_COLORS[score] : BRAND.cyan}40`,
                        fontSize: '1.5rem'
                      }}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => currentDimension > 0 && setCurrentDimension(currentDimension - 1)} disabled={currentDimension === 0} className="px-8 py-4 rounded-xl text-lg disabled:opacity-30" style={{ color: BRAND.gray }}>
              ← Previous
            </button>
            <button onClick={async () => {
              if (currentDimension < dimensions.length - 1) {
                setCurrentDimension(currentDimension + 1);
              } else {
                const completed = { ...assessmentData, completed: true, completedAt: new Date().toISOString() };
                await saveAssessment(completed);
                setSelectedAssessment(completed);
                generateAIAnalysis(completed, calculateScores(completed.responses));
                setCurrentView('results');
              }
            }} className="font-bold px-10 py-4 rounded-xl text-xl" style={btnPrimary}>
              {currentDimension === dimensions.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // LIST
  const renderList = () => (
    <div style={pageStyle} className="relative">
      <WaveBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => setCurrentView('home')} className="text-lg" style={{ color: BRAND.gray }}>← Back</button>
          <Logo size="small" />
        </div>
        <div className="mb-8"><ScoringGuideFull /></div>
        <h2 className="text-3xl font-semibold mb-8" style={{ color: BRAND.white }}>Saved Assessments</h2>
        {savedAssessments.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={cardStyle}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${BRAND.cyan}20` }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BRAND.cyan} strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </div>
            <h3 className="text-2xl font-medium mb-3" style={{ color: BRAND.white }}>No Assessments Yet</h3>
            <p className="text-lg mb-8" style={{ color: BRAND.gray }}>Start your first assessment</p>
            <button onClick={startNew} className="font-bold px-8 py-4 rounded-xl text-xl" style={btnPrimary}>Start Assessment</button>
          </div>
        ) : (
          <div className="space-y-5">
            {savedAssessments.map(a => {
              const s = calculateScores(a.responses);
              return (
                <div key={a.id} className="rounded-2xl p-8" style={cardStyle}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2" style={{ color: BRAND.white }}>{a.organizationName}</h3>
                      <p className="text-base" style={{ color: BRAND.gray }}>{[a.industry, a.country].filter(Boolean).join(' · ')} · {new Date(a.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold" style={{ color: a.completed ? s.readinessLevel.color : BRAND.cyan }}>{a.completed ? s.arqScore : `${Math.round((Object.keys(a.responses).length / TOTAL_QUESTIONS) * 100)}%`}</div>
                      <div className="text-base" style={{ color: BRAND.gray }}>{a.completed ? s.readinessLevel.level : 'In Progress'}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => { if (a.completed) { setSelectedAssessment(a); generateAIAnalysis(a, calculateScores(a.responses)); setCurrentView('results'); } else { setAssessmentData(a); setCurrentDimension(0); setCurrentView('assessment'); } }} className="px-6 py-3 rounded-xl text-lg font-medium" style={btnPrimary}>
                      {a.completed ? 'View Results' : 'Continue'}
                    </button>
                    <button onClick={() => confirm('Delete?') && deleteAssessment(a.id)} className="px-6 py-3 rounded-xl text-lg" style={{ color: BRAND.gray }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // RESULTS
  const renderResults = () => {
    if (!selectedAssessment) return null;
    const { arqScore, dimensionScores, readinessLevel } = calculateScores(selectedAssessment.responses);

    return (
      <div style={pageStyle} className="relative">
        <WaveBackground />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => setCurrentView('list')} className="text-lg" style={{ color: BRAND.gray }}>← Back</button>
            <div className="flex items-center gap-4">
              <button onClick={exportToPDF} disabled={isExporting} className="px-6 py-3 rounded-xl text-base font-medium flex items-center gap-2" style={btnSecondary}>
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${BRAND.cyan} transparent ${BRAND.cyan} ${BRAND.cyan}` }} />
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Export PDF
                  </>
                )}
              </button>
              <button onClick={exportToEmail} className="px-6 py-3 rounded-xl text-base font-medium flex items-center gap-2" style={btnSecondary}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Report
              </button>
              <Logo size="small" />
            </div>
          </div>

          {/* Score Card */}
          <div className="rounded-2xl p-10 mb-10" style={{ ...cardStyle, boxShadow: `0 0 80px ${BRAND.cyan}15` }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BRAND.cyan }} />
                  <span className="text-lg font-medium" style={{ color: BRAND.cyan }}>ARQ™ Assessment Results</span>
                </div>
                <h1 className="text-4xl font-bold mb-3" style={{ color: BRAND.white }}>{selectedAssessment.organizationName}</h1>
                <p className="text-lg" style={{ color: BRAND.gray }}>{[selectedAssessment.industry, selectedAssessment.country, selectedAssessment.department].filter(Boolean).join(' · ')} · {new Date(selectedAssessment.date).toLocaleDateString()}</p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-7xl font-bold" style={{ color: readinessLevel.color }}>{arqScore}</div>
                <div className="text-xl" style={{ color: BRAND.gray }}>out of 100</div>
              </div>
            </div>
            <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: `${readinessLevel.color}15`, border: `1px solid ${readinessLevel.color}40` }}>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: readinessLevel.color }} />
                <span className="text-2xl font-bold" style={{ color: BRAND.white }}>{readinessLevel.level}</span>
              </div>
            </div>
          </div>

          {/* Dimensions - with full readable names */}
          <div className="rounded-2xl p-8 mb-10" style={cardStyle}>
            <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.white }}>Dimension Scores</h2>
            <div className="space-y-6">
              {Object.entries(ARQ_DIMENSIONS).map(([name, data]) => {
                const ds = dimensionScores[name];
                const color = ds.average >= 4 ? BRAND.cyan : ds.average >= 3 ? BRAND.cyanDark : ds.average >= 2 ? '#FB8C00' : '#E53935';
                return (
                  <div key={name}>
                    {/* Dimension name on its own line */}
                    <div className="text-lg font-medium mb-2" style={{ color: BRAND.white }}>{name}</div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 rounded-full h-4" style={{ backgroundColor: BRAND.grayDark }}>
                        <div className="h-4 rounded-full transition-all" style={{ width: `${(ds.average / 5) * 100}%`, backgroundColor: color }} />
                      </div>
                      <div className="w-24 text-right">
                        <span className="text-xl font-bold" style={{ color }}>{ds.average.toFixed(1)}</span>
                        <span className="text-lg" style={{ color: BRAND.gray }}>/5</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Analysis */}
          {isAnalyzing ? (
            <div className="rounded-2xl p-16 text-center" style={cardStyle}>
              <div className="animate-pulse">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${BRAND.cyan}20` }}>
                  <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${BRAND.cyan} transparent ${BRAND.cyan} ${BRAND.cyan}` }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: BRAND.white }}>Generating AI Analysis</h3>
                <p className="text-lg" style={{ color: BRAND.gray }}>Preparing strategic recommendations...</p>
              </div>
            </div>
          ) : aiAnalysis && (
            <>
              <div className="rounded-2xl p-8 mb-10" style={{ backgroundColor: `${BRAND.cyan}08`, border: `1px solid ${BRAND.cyan}30` }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.white }}>Executive Summary</h2>
                <p className="text-xl leading-relaxed" style={{ color: BRAND.grayLight }}>{aiAnalysis.executiveSummary}</p>
              </div>

              {/* Strengths & Gaps - 20% bigger fonts */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="rounded-2xl p-8" style={{ backgroundColor: `${BRAND.cyanDark}10`, border: `1px solid ${BRAND.cyanDark}40` }}>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND.cyan }}>Key Strengths</h3>
                  <div className="space-y-5">
                    {aiAnalysis.keyStrengths?.map((s, i) => (
                      <div key={i} className="pl-5" style={{ borderLeft: `3px solid ${BRAND.cyan}` }}>
                        <div className="text-xl font-medium" style={{ color: BRAND.white }}>{s.area}</div>
                        <div className="text-lg mt-2" style={{ color: BRAND.gray }}>{s.insight}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-8" style={{ backgroundColor: `#FB8C0010`, border: `1px solid #FB8C0040` }}>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#FB8C00' }}>Critical Gaps</h3>
                  <div className="space-y-5">
                    {aiAnalysis.criticalGaps?.map((g, i) => (
                      <div key={i} className="pl-5" style={{ borderLeft: `3px solid #FB8C00` }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-medium" style={{ color: BRAND.white }}>{g.area}</span>
                          <span className="text-sm px-3 py-1 rounded" style={{ backgroundColor: g.priority === 'HIGH' ? '#E53935' : '#FB8C00', color: BRAND.white }}>{g.priority}</span>
                        </div>
                        <div className="text-lg mt-2" style={{ color: BRAND.gray }}>{g.insight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-8 mb-10" style={cardStyle}>
                <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.white }}>Strategic Recommendations</h2>
                {['immediate', 'shortTerm', 'mediumTerm'].map((phase, i) => (
                  <div key={phase} className="mb-8 last:mb-0">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: [BRAND.cyan, BRAND.cyanDark, BRAND.gray][i] }}>
                      <span className="w-4 h-4 rounded" style={{ backgroundColor: [BRAND.cyan, BRAND.cyanDark, BRAND.gray][i] }} />
                      {['Immediate (0-30 days)', 'Short-term (30-90 days)', 'Medium-term (90-180 days)'][i]}
                    </h4>
                    <div className="space-y-4 ml-7">
                      {aiAnalysis.strategicRecommendations?.[phase]?.map((r, j) => (
                        <div key={j} className="p-5 rounded-xl" style={{ backgroundColor: BRAND.black }}>
                          <div className="text-lg font-medium" style={{ color: BRAND.white }}>{r.action}</div>
                          <div className="text-base mt-2" style={{ color: BRAND.gray }}>{r.rationale}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {aiAnalysis.recommendedProgram && (
                <div className="rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${BRAND.cyan}15 0%, ${BRAND.black} 100%)`, border: `1px solid ${BRAND.cyan}40` }}>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.white }}>Recommended Program</h2>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND.cyan }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 2 L38 20 L20 38 L2 20 Z" stroke={BRAND.black} strokeWidth="2" fill="none"/></svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: BRAND.cyan }}>{aiAnalysis.recommendedProgram.name}</h3>
                      <p className="text-lg mt-3" style={{ color: BRAND.grayLight }}>{aiAnalysis.recommendedProgram.rationale}</p>
                      <button className="mt-6 px-8 py-4 rounded-xl text-lg font-bold" style={btnPrimary}>Learn More →</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-16 text-base" style={{ color: BRAND.gray }}>
            ARQ™ Assessment · DUBAI AI CAMPUS · DIFC Innovation Hub
          </div>
        </div>
      </div>
    );
  };

  switch (currentView) {
    case 'home': return renderHome();
    case 'info': return renderInfo();
    case 'assessment': return renderAssessment();
    case 'list': return renderList();
    case 'results': return renderResults();
    default: return renderHome();
  }
}

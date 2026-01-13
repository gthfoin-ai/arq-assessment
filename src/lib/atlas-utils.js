// ATLAS Recommendation Engine
// Generates tier and module recommendations based on ARQ assessment results

export const generateATLASRecommendation = (arqScore, dimensionScores) => {
  // Determine ATLAS Tier based on ARQ Score
  let tier, tierDescription, coreFocus, typicalDuration;
  
  if (arqScore < 40) {
    tier = 'MOBILIZE';
    tierDescription = 'From Confusion to Clarity';
    coreFocus = 'Build strategic clarity, align executives, and deliver your first AI proof point';
    typicalDuration = '12 weeks';
  } else if (arqScore < 65) {
    tier = 'DEPLOY';
    tierDescription = 'From Strategy to Production';
    coreFocus = 'Turn validated use cases into production AI systems with comprehensive governance';
    typicalDuration = '3-6 months';
  } else {
    tier = 'SCALE';
    tierDescription = 'From Projects to Enterprise Capability';
    coreFocus = 'Establish your AI Center of Excellence and scale AI across the enterprise';
    typicalDuration = '6-12 months';
  }

  // Generate module recommendations based on dimension scores
  const recommendedModules = [];
  
  // Analyze each dimension to identify gaps
  Object.entries(dimensionScores).forEach(([dimension, scoreData]) => {
    const avgScore = scoreData.percentage / 20; // Convert percentage to 1-5 scale
    
    if (avgScore < 2.5) {
      // Identify gap-specific modules
      const dimLower = dimension.toLowerCase();
      
      if (dimLower.includes('data')) {
        recommendedModules.push({
          name: 'Data Strategy & Governance Foundations',
          rationale: 'Address fundamental data quality and accessibility gaps'
        });
      }
      
      if (dimLower.includes('talent') || dimLower.includes('skills') || dimLower.includes('capability')) {
        recommendedModules.push({
          name: 'Executive AI Bootcamp',
          rationale: 'Build AI literacy and capability across leadership team'
        });
      }
      
      if (dimLower.includes('governance') || dimLower.includes('ethics')) {
        recommendedModules.push({
          name: 'Governance Foundations',
          rationale: 'Establish basic policies and risk management framework'
        });
      }
      
      if (dimLower.includes('infrastructure') || dimLower.includes('technical')) {
        recommendedModules.push({
          name: 'Platform Assessment & Architecture',
          rationale: 'Build the technical foundation required for AI deployment'
        });
      }
      
      if (dimLower.includes('use case')) {
        recommendedModules.push({
          name: 'Use Case Discovery & Prioritization',
          rationale: 'Identify and validate high-impact AI opportunities'
        });
      }
    }
  });
  
  // Add tier-specific default modules
  if (tier === 'MOBILIZE') {
    if (!recommendedModules.find(m => m.name.includes('Use Case'))) {
      recommendedModules.push({
        name: 'Use Case Discovery & Prioritization',
        rationale: 'Identify and validate high-impact AI opportunities'
      });
    }
    recommendedModules.push({
      name: 'POC Development (1-2 use cases)',
      rationale: 'Deliver quick wins that demonstrate AI value'
    });
  } else if (tier === 'DEPLOY') {
    recommendedModules.push({
      name: 'MVP Development (2-4 solutions)',
      rationale: 'Build production-ready AI systems with full testing'
    });
    if (!recommendedModules.find(m => m.name.includes('Governance'))) {
      recommendedModules.push({
        name: 'Full Governance & Ethics Board Setup',
        rationale: 'Implement comprehensive AI governance infrastructure'
      });
    }
  } else {
    recommendedModules.push({
      name: 'Production Deployment (3+ solutions)',
      rationale: 'Deploy AI at enterprise scale with full integration'
    });
    recommendedModules.push({
      name: '24-Month Scale Roadmap + Ongoing Advisory',
      rationale: 'Ensure sustained value creation with strategic guidance'
    });
  }
  
  // Limit to top 4 modules to keep display clean
  const topModules = recommendedModules.slice(0, 4);
  
  return {
    tier,
    tierDescription,
    coreFocus,
    typicalDuration,
    modules: topModules,
    nextStep: `Schedule a consultation with Dubai AI Campus to discuss your ${tier} journey`
  };
};

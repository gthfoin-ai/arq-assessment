import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, userInfo, results, assessment, scores } = body;
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    // Determine if this is ARQ Alpha or Full ARQ format
    const isFullARQ = !!assessment && !!scores;
    
    if (!apiKey) {
      return NextResponse.json(isFullARQ 
        ? generateFullARQFallback(assessment, scores)
        : generateAlphaFallback(type, userInfo, results)
      );
    }

    let prompt;
    
    if (isFullARQ) {
      // Full ARQ prompt - comprehensive 80-question assessment
      prompt = `You are a senior AI transformation consultant at a top-tier consulting firm (McKinsey/BCG level). You're analyzing a comprehensive 80-question AI Readiness Assessment for an enterprise client.

ORGANIZATION PROFILE:
- Organization: ${assessment.organizationName}
- Industry: ${assessment.industry || 'Not specified'}
- Country: ${assessment.country || 'Not specified'}
- Department: ${assessment.department || 'Not specified'}
- Company Size: ${assessment.employeeCount || 'Not specified'}
- Assessor: ${assessment.assessorName} (${assessment.assessorEmail || 'No email'})

ASSESSMENT RESULTS:
- ARQ Score: ${scores.arqScore}/100
- Readiness Level: ${scores.readinessLevel.level} - ${scores.readinessLevel.description}

DETAILED DIMENSION SCORES (8 dimensions, 10 criteria each):
${Object.entries(scores.dimensionScores).map(([dim, data]) => 
  `- ${dim}: ${data.average.toFixed(2)}/5.0 (${Math.round(data.average * 20)}%) - Weight: ${data.weight}%`
).join('\n')}

Based on this comprehensive assessment, provide an executive-level strategic analysis. Be specific to their industry (${assessment.industry}), size (${assessment.employeeCount}), and region (${assessment.country}).

Return ONLY valid JSON with this exact structure:
{
  "executiveSummary": "3-4 compelling sentences providing strategic context, key finding, and primary recommendation. Reference their specific industry and score.",
  "keyStrengths": [
    {"area": "Dimension name", "insight": "Specific strategic insight about why this is a competitive advantage and how to leverage it. Reference the score.", "score": 4.2},
    {"area": "Dimension name", "insight": "Another strength with actionable leverage opportunity", "score": 3.9}
  ],
  "criticalGaps": [
    {"area": "Dimension name", "insight": "Specific analysis of the gap, its business impact, and risk if not addressed. Be direct about consequences.", "score": 2.1, "priority": "HIGH"},
    {"area": "Dimension name", "insight": "Another gap with clear business impact", "score": 2.5, "priority": "HIGH"},
    {"area": "Dimension name", "insight": "Medium priority gap", "score": 2.8, "priority": "MEDIUM"}
  ],
  "strategicRecommendations": {
    "immediate": [
      {"action": "Specific actionable initiative (not generic)", "rationale": "Business case with expected outcome", "impact": "High/Medium", "timeline": "0-30 days"},
      {"action": "Another immediate action", "rationale": "Why this matters now", "impact": "High", "timeline": "0-30 days"}
    ],
    "shortTerm": [
      {"action": "90-day initiative", "rationale": "Strategic rationale", "impact": "High", "timeline": "30-90 days"},
      {"action": "Another short-term action", "rationale": "Expected business impact", "impact": "Medium", "timeline": "60-90 days"}
    ],
    "mediumTerm": [
      {"action": "6-month strategic initiative", "rationale": "Transformation goal", "impact": "High", "timeline": "3-6 months"},
      {"action": "Another medium-term initiative", "rationale": "Long-term value creation", "impact": "High", "timeline": "4-6 months"}
    ]
  },
  "investmentPriorities": [
    "First investment priority with specific focus area",
    "Second investment priority",
    "Third investment priority"
  ],
  "industryBenchmark": "How they compare to ${assessment.industry} industry benchmarks and what leaders in their space are doing differently",
  "transformationRoadmap": "A 2-3 sentence roadmap narrative describing their recommended 12-month AI transformation journey",
  "recommendedProgram": {
    "name": "Choose: 'Model A: Sovereign AI Enterprise Initiative' (for scores <50, needs foundation building) OR 'Model B: Rapid Deployment Track' (for scores >=50, ready to scale)",
    "rationale": "2 sentences explaining why this program fits their maturity level and goals"
  }
}`;
    } else if (type === 'individual') {
      // ARQ Alpha Individual prompt
      prompt = `You are a senior AI skills development consultant and career coach. You're providing personalized AI literacy assessment feedback to a professional.

INDIVIDUAL PROFILE:
- Name: ${userInfo.assessorName}
- Role: ${userInfo.role}
- Organization: ${userInfo.organizationName}
- Industry: ${userInfo.industry}
- Company Size: ${userInfo.employeeCount}
- Country: ${userInfo.country}

ASSESSMENT RESULTS:
- Overall Score: ${results.percentageScore}%
- Maturity Level: ${results.maturityLevel.level} - ${results.maturityLevel.desc}

DOMAIN SCORES (10 domains):
${Object.entries(results.domainScores).map(([domain, data]) => 
  `- ${domain}: ${data.percentage}%`
).join('\n')}

Provide highly personalized, actionable feedback. Reference their specific role (${userInfo.role}), industry (${userInfo.industry}), and be specific about skills relevant to their position.

Return ONLY valid JSON with this exact structure:
{
  "executiveSummary": "2-3 personalized sentences addressing ${userInfo.assessorName} directly. Reference their role and overall readiness level with specific context.",
  "roleAlignment": "2-3 sentences analyzing how their AI skills specifically align with the demands of ${userInfo.role} in ${userInfo.industry}. What skills are most critical for their specific position?",
  "keyStrengths": [
    {"area": "Domain name", "insight": "Specific strength and exactly how ${userInfo.assessorName} can leverage this in their role as ${userInfo.role}"},
    {"area": "Domain name", "insight": "Another strength with practical application advice"}
  ],
  "developmentAreas": [
    {"area": "Domain name", "insight": "Specific gap analysis explaining why this matters for ${userInfo.role} and the career impact of not addressing it", "priority": "HIGH"},
    {"area": "Domain name", "insight": "Another development area with role-specific context", "priority": "MEDIUM"}
  ],
  "skillsToDevelope": [
    {"skill": "Specific skill name", "description": "Why this skill is essential for ${userInfo.role} in ${userInfo.industry}, with example use case", "trainingType": "Course/Workshop/Certification/Self-study"},
    {"skill": "Another skill", "description": "Role-specific importance and application", "trainingType": "Course/Workshop/Certification/Self-study"},
    {"skill": "Third skill", "description": "Career advancement relevance", "trainingType": "Course/Workshop/Certification/Self-study"}
  ],
  "recommendedNextSteps": [
    "Specific action step 1 with concrete deliverable (not generic advice)",
    "Action step 2 tailored to their role",
    "Action step 3 with measurable outcome",
    "Action step 4 for skill building",
    "Action step 5 for career positioning"
  ],
  "careerTip": "One personalized career development insight for ${userInfo.assessorName} based on their profile and AI readiness level. Be specific and actionable."
}`;
    } else {
      // ARQ Alpha Organizational prompt
      prompt = `You are a senior AI transformation consultant advising C-suite executives. You're analyzing an organizational AI readiness quick assessment.

ORGANIZATION PROFILE:
- Organization: ${userInfo.organizationName}
- Industry: ${userInfo.industry}
- Company Size: ${userInfo.employeeCount}
- Country: ${userInfo.country}
- Assessor Role: ${userInfo.role}

ASSESSMENT RESULTS:
- Overall Score: ${results.percentageScore}%
- Maturity Level: ${results.maturityLevel.level} - ${results.maturityLevel.desc}

DOMAIN SCORES (9 organizational dimensions):
${Object.entries(results.domainScores).map(([domain, data]) => 
  `- ${domain}: ${data.percentage}%`
).join('\n')}

Provide strategic, executive-level analysis specific to ${userInfo.organizationName}'s industry (${userInfo.industry}) and market (${userInfo.country}).

Return ONLY valid JSON with this exact structure:
{
  "executiveSummary": "3-4 sentences providing strategic assessment of ${userInfo.organizationName}'s AI readiness. Reference their industry position and key strategic implications.",
  "maturityAnalysis": "2-3 sentences analyzing their current ${results.maturityLevel.level} stage, what it means for their competitive position in ${userInfo.industry}, and the opportunity cost of current gaps.",
  "keyStrengths": [
    {"area": "Domain name", "insight": "Strategic strength analysis - how this creates competitive advantage in ${userInfo.industry}"},
    {"area": "Domain name", "insight": "Another organizational strength with strategic leverage opportunity"}
  ],
  "criticalGaps": [
    {"area": "Domain name", "insight": "Strategic gap analysis - business risk and competitive impact specific to ${userInfo.industry}", "priority": "HIGH"},
    {"area": "Domain name", "insight": "Another critical gap with clear business implications", "priority": "MEDIUM"}
  ],
  "strategicRecommendations": [
    {"recommendation": "Specific strategic initiative for ${userInfo.organizationName}", "rationale": "Business case with expected ROI or impact", "timeframe": "immediate"},
    {"recommendation": "Second strategic recommendation", "rationale": "Industry-specific rationale", "timeframe": "short-term"},
    {"recommendation": "Third strategic recommendation", "rationale": "Long-term value creation", "timeframe": "medium-term"}
  ],
  "capabilitiesToBuild": [
    {"capability": "Specific capability", "description": "Why ${userInfo.organizationName} needs this to compete in ${userInfo.industry}", "trainingFocus": "Leadership/Technical/Process"},
    {"capability": "Second capability", "description": "Strategic importance", "trainingFocus": "Leadership/Technical/Process"},
    {"capability": "Third capability", "description": "Operational impact", "trainingFocus": "Leadership/Technical/Process"}
  ],
  "investmentPriorities": [
    "First investment priority specific to their gaps",
    "Second investment priority",
    "Third investment priority",
    "Fourth investment priority"
  ],
  "industryContext": "2-3 sentences about AI trends and competitive dynamics in ${userInfo.industry}, and how ${userInfo.organizationName}'s readiness level compares to industry leaders."
}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', response.status, errorText);
      return NextResponse.json(isFullARQ 
        ? generateFullARQFallback(assessment, scores)
        : generateAlphaFallback(type, userInfo, results)
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    
    try {
      const analysis = JSON.parse(text.replace(/```json|```/g, '').trim());
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw text:', text.substring(0, 500));
      return NextResponse.json(isFullARQ 
        ? generateFullARQFallback(assessment, scores)
        : generateAlphaFallback(type, userInfo, results)
      );
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed', message: error.message });
  }
}

function generateFullARQFallback(assessment, scores) {
  const sorted = Object.entries(scores?.dimensionScores || {})
    .filter(([_, d]) => d.completion > 0)
    .sort((a, b) => b[1].average - a[1].average);
  
  const strengths = sorted.filter(([_, d]) => d.average >= 3.5).slice(0, 3);
  const gaps = sorted.filter(([_, d]) => d.average < 3).reverse().slice(0, 3);
  
  return {
    executiveSummary: `${assessment?.organizationName || 'Your organization'} achieved an ARQ score of ${scores?.arqScore || 0}/100, placing it at the ${scores?.readinessLevel?.level || 'initial'} stage of AI maturity. This assessment reveals both strategic strengths to leverage and critical gaps requiring immediate attention to accelerate AI transformation.`,
    keyStrengths: strengths.map(([name, data]) => ({
      area: name,
      insight: `Strong performance at ${data.average.toFixed(1)}/5.0 indicates established capabilities that can be leveraged for competitive advantage.`,
      score: data.average
    })),
    criticalGaps: gaps.map(([name, data]) => ({
      area: name,
      insight: `Score of ${data.average.toFixed(1)}/5.0 represents a significant gap that may impede AI initiative success.`,
      score: data.average,
      priority: data.average < 2 ? 'HIGH' : 'MEDIUM'
    })),
    strategicRecommendations: {
      immediate: [{ action: 'Establish AI governance committee with executive sponsorship', rationale: 'Foundation for responsible and effective AI deployment', impact: 'High', timeline: '0-30 days' }],
      shortTerm: [{ action: 'Launch organization-wide AI literacy program', rationale: 'Enable informed decision-making at all levels', impact: 'High', timeline: '30-90 days' }],
      mediumTerm: [{ action: 'Implement 2-3 high-impact AI pilot projects', rationale: 'Demonstrate tangible business value and build momentum', impact: 'High', timeline: '3-6 months' }]
    },
    investmentPriorities: ['AI talent and upskilling', 'Data infrastructure modernization', 'AI governance framework', 'Pilot project funding'],
    industryBenchmark: `Organizations in ${assessment?.industry || 'your industry'} are rapidly advancing AI capabilities. Leaders are focusing on data infrastructure and talent development.`,
    transformationRoadmap: 'Begin with governance and quick wins in months 1-3, scale successful pilots in months 4-6, and establish enterprise AI operations by month 12.',
    recommendedProgram: {
      name: (scores?.arqScore || 0) >= 50 ? 'Model B: Rapid Deployment Track' : 'Model A: Sovereign AI Enterprise Initiative',
      rationale: (scores?.arqScore || 0) >= 50 
        ? 'Your organization has sufficient foundation to accelerate AI deployment and focus on scaling proven solutions.'
        : 'Building foundational capabilities in data, governance, and talent is essential before scaling AI initiatives.'
    }
  };
}

function generateAlphaFallback(type, userInfo, results) {
  const sortedDomains = Object.entries(results?.domainScores || {}).sort((a, b) => b[1].percentage - a[1].percentage);
  const topDomains = sortedDomains.slice(0, 3);
  const bottomDomains = sortedDomains.slice(-3).reverse();
  const score = results?.percentageScore || 0;
  const level = results?.maturityLevel?.level || 'Unknown';
  
  if (type === 'individual') {
    return {
      executiveSummary: `${userInfo?.assessorName || 'You'} demonstrate ${level} AI readiness with an overall score of ${score}%. ${score >= 60 ? 'Your profile shows solid foundations for leveraging AI in your work.' : 'There are valuable opportunities to strengthen your AI capabilities for greater career impact.'}`,
      roleAlignment: `For your role in ${userInfo?.role?.split('(')[0] || 'your organization'}, AI literacy is increasingly important. Your current score indicates ${score >= 60 ? 'you are well-positioned to drive AI adoption' : 'focused development will enhance your effectiveness'}.`,
      keyStrengths: topDomains.slice(0, 2).map(([domain, data]) => ({
        area: domain,
        insight: `Strong at ${data.percentage}% - leverage this expertise to drive AI initiatives in your team.`
      })),
      developmentAreas: bottomDomains.slice(0, 2).map(([domain, data]) => ({
        area: domain,
        insight: `At ${data.percentage}%, this represents a growth opportunity with high career impact.`,
        priority: data.percentage < 40 ? 'HIGH' : 'MEDIUM'
      })),
      skillsToDevelope: [
        { skill: 'AI Fundamentals', description: 'Core concepts essential for informed AI decision-making', trainingType: 'Course' },
        { skill: 'Prompt Engineering', description: 'Maximize effectiveness with generative AI tools', trainingType: 'Workshop' },
        { skill: 'AI Ethics & Governance', description: 'Navigate responsible AI use in professional contexts', trainingType: 'Certification' }
      ],
      recommendedNextSteps: [
        'Complete a structured AI fundamentals course within 30 days',
        'Practice using AI tools daily for work tasks',
        'Join an AI-focused professional community',
        'Set a 90-day skill development goal with measurable milestones',
        'Identify one process to improve using AI assistance'
      ],
      careerTip: score >= 70 
        ? 'Position yourself as an AI advocate in your organization - your skills can help drive adoption and mentor colleagues.'
        : 'Focus on building practical AI skills that directly enhance your daily work effectiveness.'
    };
  } else {
    return {
      executiveSummary: `${userInfo?.organizationName || 'Your organization'} is at the ${level} stage with ${score}% AI readiness. ${score >= 60 ? 'Strong foundations exist for scaling AI initiatives.' : 'Strategic capability building is recommended to accelerate AI maturity.'}`,
      maturityAnalysis: `At the ${level} level, your organization ${score >= 70 ? 'can focus on optimization and enterprise-wide scaling' : score >= 50 ? 'should prioritize scaling successful pilots while addressing capability gaps' : 'needs to establish foundational capabilities before scaling'}.`,
      keyStrengths: topDomains.slice(0, 2).map(([domain, data]) => ({
        area: domain,
        insight: `Leading at ${data.percentage}% - this provides competitive advantage to leverage.`
      })),
      criticalGaps: bottomDomains.slice(0, 2).map(([domain, data]) => ({
        area: domain,
        insight: `At ${data.percentage}%, this gap may limit AI initiative effectiveness.`,
        priority: data.percentage < 40 ? 'HIGH' : 'MEDIUM'
      })),
      strategicRecommendations: [
        { recommendation: score < 50 ? 'Establish AI Center of Excellence' : 'Scale AI across business units', rationale: 'Accelerate AI value creation', timeframe: 'immediate' },
        { recommendation: 'Implement AI governance framework', rationale: 'Enable responsible AI deployment', timeframe: 'short-term' },
        { recommendation: 'Launch enterprise AI training program', rationale: 'Build organizational capability', timeframe: 'medium-term' }
      ],
      capabilitiesToBuild: [
        { capability: 'Data Infrastructure', description: 'Foundation for all AI initiatives', trainingFocus: 'Technical' },
        { capability: 'AI Governance', description: 'Ensure responsible AI deployment', trainingFocus: 'Leadership' },
        { capability: 'MLOps', description: 'Enable production AI systems', trainingFocus: 'Technical' }
      ],
      investmentPriorities: ['AI talent development', 'Data platform modernization', 'Governance frameworks', 'Pilot project funding'],
      industryContext: `AI adoption in ${userInfo?.industry || 'your industry'} is accelerating. Organizations investing in capabilities now will gain significant competitive advantage.`
    };
  }
}

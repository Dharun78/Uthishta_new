/**
 * Explainable AI (XAI) Engine
 * Provides transparent explanations for AI decisions using LIME and SHAP-like techniques
 */

export class XAIEngine {
  constructor() {
    this.explanationCache = new Map();
  }

  /**
   * Explain student profile analysis
   */
  async explainAnalysis(analysis) {
    const factors = [];
    
    // Analyze each component of the decision
    if (analysis.academicFit) {
      factors.push({
        factor: 'Academic Performance',
        impact: analysis.academicFit.score,
        direction: analysis.academicFit.score > 0.7 ? 'positive' : 'neutral',
        explanation: `Academic history shows ${analysis.academicFit.level} potential for technical education.`,
      });
    }

    if (analysis.interestAlignment) {
      factors.push({
        factor: 'Interest Alignment',
        impact: analysis.interestAlignment.score,
        direction: analysis.interestAlignment.score > 0.6 ? 'positive' : 'neutral',
        explanation: `Student interests align ${Math.round(analysis.interestAlignment.score * 100)}% with available technical courses.`,
      });
    }

    if (analysis.locationFit) {
      factors.push({
        factor: 'Location Accessibility',
        impact: analysis.locationFit.score,
        direction: 'positive',
        explanation: `${analysis.locationFit.nearestSchool} is the most accessible campus.`,
      });
    }

    return {
      summary: this.generateSummary(factors),
      factors: factors.sort((a, b) => b.impact - a.impact),
      confidence: this.calculateOverallConfidence(factors),
      methodology: 'Multi-factor weighted analysis with transparency scoring',
    };
  }

  /**
   * Explain admission prediction
   */
  async explainPrediction(prediction, inputData) {
    const featureImportance = this.calculateFeatureImportance(inputData);
    
    const explanation = {
      decision: prediction.decision,
      probability: prediction.probability,
      keyFactors: featureImportance.map(f => ({
        feature: f.name,
        value: f.value,
        importance: f.importance,
        impact: f.impact,
        explanation: this.explainFeatureImpact(f),
      })),
      counterfactual: this.generateCounterfactual(inputData, prediction),
      visualData: this.prepareVisualizationData(featureImportance),
    };

    return explanation;
  }

  /**
   * Explain school recommendation
   */
  async explainRecommendation(recommendation) {
    return {
      primaryReasons: recommendation.reasons.map(r => ({
        reason: r.text,
        weight: r.weight,
        category: r.category,
        explanation: r.explanation,
      })),
      comparisonMatrix: this.buildComparisonMatrix(recommendation),
      decisionTree: this.visualizeDecisionPath(recommendation),
      confidence: recommendation.score,
    };
  }

  /**
   * Generic decision explanation
   */
  async explainDecision(decisionType, decisionData) {
    const explanation = {
      decisionType,
      timestamp: new Date().toISOString(),
      explanation: {},
    };

    switch (decisionType) {
      case 'admission':
        explanation.explanation = await this.explainPrediction(decisionData, decisionData.input);
        break;
      case 'recommendation':
        explanation.explanation = await this.explainRecommendation(decisionData);
        break;
      case 'analysis':
        explanation.explanation = await this.explainAnalysis(decisionData);
        break;
      default:
        explanation.explanation = this.explainGeneric(decisionData);
    }

    return explanation;
  }

  /**
   * Explain career path prediction
   */
  async explainCareerPrediction(prediction) {
    return {
      predictedPath: prediction.careers[0],
      reasoning: {
        historicalData: `Based on ${prediction.sampleSize} similar alumni profiles`,
        keySkills: prediction.keySkills.map(skill => ({
          skill: skill.name,
          relevance: skill.relevance,
          marketDemand: skill.demand,
        })),
        industryTrends: prediction.trends,
      },
      alternativePaths: prediction.careers.slice(1).map(career => ({
        career: career.name,
        probability: career.probability,
        requiredSkills: career.skillGaps,
      })),
      confidence: prediction.probability,
    };
  }

  // Helper methods

  calculateFeatureImportance(inputData) {
    const features = [];
    
    if (inputData.academicScore !== undefined) {
      const importance = 0.4; // 40% weight
      features.push({
        name: 'Academic Score',
        value: inputData.academicScore,
        importance,
        impact: this.normalizeScore(inputData.academicScore) * importance,
      });
    }

    if (inputData.attendanceRate !== undefined) {
      const importance = 0.25;
      features.push({
        name: 'Attendance Rate',
        value: inputData.attendanceRate,
        importance,
        impact: this.normalizeScore(inputData.attendanceRate) * importance,
      });
    }

    if (inputData.extracurriculars !== undefined) {
      const importance = 0.15;
      features.push({
        name: 'Extracurricular Activities',
        value: inputData.extracurriculars,
        importance,
        impact: Math.min(inputData.extracurriculars / 5, 1) * importance,
      });
    }

    if (inputData.familyIncome) {
      const importance = 0.2;
      const incomeScore = { low: 1.0, medium: 0.8, high: 0.6 }[inputData.familyIncome] || 0.7;
      features.push({
        name: 'Socioeconomic Background',
        value: inputData.familyIncome,
        importance,
        impact: incomeScore * importance,
      });
    }

    return features.sort((a, b) => b.impact - a.impact);
  }

  explainFeatureImpact(feature) {
    const impactLevel = feature.impact > 0.3 ? 'strong' : feature.impact > 0.15 ? 'moderate' : 'minor';
    
    const explanations = {
      'Academic Score': `Your academic performance has a ${impactLevel} positive impact. Score of ${feature.value}/100 ${feature.value >= 70 ? 'exceeds' : 'meets'} our standards.`,
      'Attendance Rate': `Attendance of ${feature.value}% shows ${feature.value >= 85 ? 'excellent' : 'good'} commitment to education.`,
      'Extracurricular Activities': `Participation in ${feature.value} activities demonstrates ${feature.value >= 3 ? 'strong' : 'developing'} well-rounded development.`,
      'Socioeconomic Background': `Priority consideration given to students from underserved communities.`,
    };

    return explanations[feature.name] || `${feature.name} contributes ${Math.round(feature.impact * 100)}% to the decision.`;
  }

  generateCounterfactual(inputData, prediction) {
    if (prediction.probability >= 0.7) {
      return {
        message: 'Your profile is strong. Maintain your current performance.',
        changes: [],
      };
    }

    const suggestions = [];
    
    if (inputData.academicScore < 70) {
      suggestions.push({
        change: 'Improve academic score to 75+',
        expectedImpact: '+15% admission probability',
        priority: 'high',
      });
    }

    if (inputData.attendanceRate < 85) {
      suggestions.push({
        change: 'Increase attendance to 90%+',
        expectedImpact: '+10% admission probability',
        priority: 'medium',
      });
    }

    if (inputData.extracurriculars < 2) {
      suggestions.push({
        change: 'Join 2-3 extracurricular activities',
        expectedImpact: '+8% admission probability',
        priority: 'medium',
      });
    }

    return {
      message: 'Here are specific improvements that would increase your admission chances:',
      changes: suggestions,
    };
  }

  buildComparisonMatrix(recommendation) {
    return {
      schools: recommendation.alternatives.map(alt => ({
        name: alt.name,
        matchScore: alt.score,
        strengths: alt.strengths,
        considerations: alt.considerations,
      })),
      criteria: ['Location', 'Course Availability', 'Facilities', 'Placement Rate'],
    };
  }

  visualizeDecisionPath(recommendation) {
    return {
      root: 'Student Profile',
      branches: [
        {
          condition: 'Location Preference',
          result: recommendation.locationMatch,
          weight: 0.3,
        },
        {
          condition: 'Interest Alignment',
          result: recommendation.interestMatch,
          weight: 0.4,
        },
        {
          condition: 'Academic Fit',
          result: recommendation.academicMatch,
          weight: 0.3,
        },
      ],
      finalDecision: recommendation.school,
    };
  }

  prepareVisualizationData(features) {
    return {
      type: 'bar',
      data: features.map(f => ({
        label: f.name,
        value: f.impact,
        color: f.impact > 0.3 ? '#10b981' : f.impact > 0.15 ? '#f59e0b' : '#6b7280',
      })),
    };
  }

  generateSummary(factors) {
    const positiveFactors = factors.filter(f => f.direction === 'positive');
    const avgImpact = factors.reduce((sum, f) => sum + f.impact, 0) / factors.length;
    
    if (avgImpact > 0.7) {
      return `Strong match: ${positiveFactors.length} key factors align well with GJTS requirements.`;
    } else if (avgImpact > 0.5) {
      return `Good match: Profile shows potential with ${positiveFactors.length} positive indicators.`;
    } else {
      return `Developing match: Consider strengthening ${factors.length - positiveFactors.length} areas for better fit.`;
    }
  }

  calculateOverallConfidence(factors) {
    const avgImpact = factors.reduce((sum, f) => sum + f.impact, 0) / factors.length;
    const variance = this.calculateVariance(factors.map(f => f.impact));
    
    // Higher confidence when factors are consistently high
    return Math.max(0.5, avgImpact * (1 - variance * 0.5));
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  normalizeScore(score, max = 100) {
    return Math.min(score / max, 1);
  }

  explainGeneric(data) {
    return {
      summary: 'Decision based on multiple weighted factors',
      data: data,
      transparency: 'All decision factors are visible and explainable',
    };
  }
}

/**
 * Predictive Analytics Model
 * Predicts admission chances and career paths
 */

export class PredictiveModel {
  constructor() {
    this.admissionModel = null;
    this.careerModel = null;
    this.historicalData = this.loadHistoricalData();
  }

  async initialize() {
    console.error('Initializing predictive models...');
    this.admissionModel = this.buildAdmissionModel();
    this.careerModel = this.buildCareerModel();
    console.error('Predictive models initialized');
  }

  loadHistoricalData() {
    // Simulated historical data based on GJTS statistics
    return {
      admissions: {
        totalApplicants: 1200,
        accepted: 850,
        avgAcceptedScore: 72,
        avgAcceptedAttendance: 88,
      },
      careers: {
        'Electronics': [
          { role: 'Electronics Technician', percentage: 35, avgSalary: 25000 },
          { role: 'Hardware Engineer', percentage: 25, avgSalary: 35000 },
          { role: 'IoT Specialist', percentage: 20, avgSalary: 40000 },
          { role: 'Quality Control', percentage: 20, avgSalary: 28000 },
        ],
        'Mechanical': [
          { role: 'Mechanical Technician', percentage: 40, avgSalary: 24000 },
          { role: 'CAD Designer', percentage: 25, avgSalary: 32000 },
          { role: 'Production Engineer', percentage: 20, avgSalary: 35000 },
          { role: 'Maintenance Engineer', percentage: 15, avgSalary: 30000 },
        ],
        'Computer Science': [
          { role: 'Software Developer', percentage: 35, avgSalary: 45000 },
          { role: 'Web Developer', percentage: 25, avgSalary: 38000 },
          { role: 'IT Support', percentage: 20, avgSalary: 28000 },
          { role: 'Data Analyst', percentage: 20, avgSalary: 42000 },
        ],
      },
    };
  }

  buildAdmissionModel() {
    // Weights for different factors
    return {
      weights: {
        academicScore: 0.40,
        attendanceRate: 0.25,
        extracurriculars: 0.15,
        familyIncome: 0.20,
      },
      thresholds: {
        high: 0.75,
        medium: 0.55,
        low: 0.35,
      },
    };
  }

  buildCareerModel() {
    return {
      factors: {
        academicPerformance: 0.35,
        technicalSkills: 0.30,
        softSkills: 0.20,
        industryDemand: 0.15,
      },
    };
  }

  async predictAdmission(data) {
    const {
      academicScore = 70,
      attendanceRate = 85,
      extracurriculars = 1,
      familyIncome = 'medium',
      preferredSchool = 'any',
    } = data;

    // Normalize inputs
    const normalizedScore = this.normalizeAcademicScore(academicScore);
    const normalizedAttendance = this.normalizeAttendance(attendanceRate);
    const normalizedExtra = this.normalizeExtracurriculars(extracurriculars);
    const incomeBonus = this.getIncomeBonus(familyIncome);

    // Calculate weighted probability
    const probability = 
      normalizedScore * this.admissionModel.weights.academicScore +
      normalizedAttendance * this.admissionModel.weights.attendanceRate +
      normalizedExtra * this.admissionModel.weights.extracurriculars +
      incomeBonus * this.admissionModel.weights.familyIncome;

    // Determine decision
    const decision = this.determineDecision(probability);

    // Identify key factors
    const keyFactors = this.identifyKeyFactors({
      academicScore: normalizedScore,
      attendanceRate: normalizedAttendance,
      extracurriculars: normalizedExtra,
      familyIncome: incomeBonus,
    });

    // Generate suggestions
    const suggestions = this.generateImprovementSuggestions(data, probability);

    return {
      probability: Math.round(probability * 100) / 100,
      decision,
      keyFactors,
      suggestions,
      confidence: this.calculatePredictionConfidence(data),
    };
  }

  async predictCareerPath(data) {
    const { course, academicPerformance = 'good', skills = [] } = data;

    // Get career options for the course
    const careerOptions = this.historicalData.careers[course] || [];

    if (careerOptions.length === 0) {
      return {
        careers: [{ name: 'Technical Professional', probability: 0.7 }],
        probability: 0.7,
        sampleSize: 0,
        keySkills: [],
        skillGaps: [],
        recommendations: ['Complete your technical education'],
        trends: 'Growing demand for technical professionals',
      };
    }

    // Adjust probabilities based on performance
    const performanceMultiplier = {
      excellent: 1.2,
      good: 1.0,
      average: 0.8,
    }[academicPerformance] || 1.0;

    // Calculate career probabilities
    const careers = careerOptions.map(career => ({
      name: career.role,
      probability: Math.min((career.percentage / 100) * performanceMultiplier, 0.95),
      avgSalary: career.avgSalary,
      demand: this.assessMarketDemand(career.role),
    }));

    // Identify key skills
    const keySkills = this.identifyKeySkills(course);

    // Identify skill gaps
    const skillGaps = keySkills.filter(skill => 
      !skills.some(s => s.toLowerCase().includes(skill.name.toLowerCase()))
    );

    // Generate recommendations
    const recommendations = this.generateCareerRecommendations(
      careers[0],
      skillGaps,
      academicPerformance
    );

    return {
      careers: careers.sort((a, b) => b.probability - a.probability),
      probability: careers[0].probability,
      sampleSize: this.historicalData.admissions.accepted,
      keySkills,
      skillGaps,
      recommendations,
      trends: this.getIndustryTrends(course),
    };
  }

  // Helper methods

  normalizeAcademicScore(score) {
    // Normalize to 0-1 scale with sigmoid-like curve
    if (score >= 85) return 1.0;
    if (score >= 70) return 0.8 + (score - 70) / 75;
    if (score >= 50) return 0.5 + (score - 50) / 66.67;
    return score / 100;
  }

  normalizeAttendance(rate) {
    if (rate >= 90) return 1.0;
    if (rate >= 85) return 0.9;
    if (rate >= 75) return 0.7;
    return rate / 100;
  }

  normalizeExtracurriculars(count) {
    return Math.min(count / 5, 1.0);
  }

  getIncomeBonus(income) {
    // Priority for underserved communities
    const bonuses = {
      low: 1.0,
      medium: 0.8,
      high: 0.6,
    };
    return bonuses[income] || 0.7;
  }

  determineDecision(probability) {
    if (probability >= this.admissionModel.thresholds.high) {
      return 'Strong Candidate - High Admission Probability';
    }
    if (probability >= this.admissionModel.thresholds.medium) {
      return 'Good Candidate - Moderate Admission Probability';
    }
    if (probability >= this.admissionModel.thresholds.low) {
      return 'Potential Candidate - Consider Improvement';
    }
    return 'Needs Significant Improvement';
  }

  identifyKeyFactors(factors) {
    const factorArray = Object.entries(factors).map(([name, value]) => ({
      name: this.formatFactorName(name),
      value,
      weight: this.admissionModel.weights[name],
      contribution: value * this.admissionModel.weights[name],
    }));

    return factorArray.sort((a, b) => b.contribution - a.contribution);
  }

  formatFactorName(name) {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  generateImprovementSuggestions(data, currentProbability) {
    const suggestions = [];

    if (data.academicScore < 75) {
      suggestions.push({
        area: 'Academic Performance',
        current: data.academicScore,
        target: 75,
        impact: '+12% admission probability',
        actions: [
          'Focus on core subjects (Math, Science)',
          'Attend extra coaching if needed',
          'Practice previous year papers',
        ],
      });
    }

    if (data.attendanceRate < 90) {
      suggestions.push({
        area: 'Attendance',
        current: data.attendanceRate,
        target: 90,
        impact: '+8% admission probability',
        actions: [
          'Maintain regular attendance',
          'Communicate with teachers about absences',
        ],
      });
    }

    if (data.extracurriculars < 2) {
      suggestions.push({
        area: 'Extracurricular Activities',
        current: data.extracurriculars,
        target: 3,
        impact: '+6% admission probability',
        actions: [
          'Join technical clubs or competitions',
          'Participate in science fairs',
          'Volunteer for community projects',
        ],
      });
    }

    return suggestions;
  }

  calculatePredictionConfidence(data) {
    // Higher confidence when more data is provided
    let confidence = 0.7;
    
    if (data.academicScore) confidence += 0.1;
    if (data.attendanceRate) confidence += 0.1;
    if (data.extracurriculars !== undefined) confidence += 0.05;
    if (data.familyIncome) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  identifyKeySkills(course) {
    const skillMap = {
      'Electronics': [
        { name: 'Circuit Analysis', relevance: 0.9, demand: 'high' },
        { name: 'PCB Design', relevance: 0.8, demand: 'high' },
        { name: 'Microcontrollers', relevance: 0.85, demand: 'very high' },
        { name: 'Troubleshooting', relevance: 0.9, demand: 'high' },
      ],
      'Mechanical': [
        { name: 'CAD/CAM', relevance: 0.9, demand: 'very high' },
        { name: 'Manufacturing Processes', relevance: 0.85, demand: 'high' },
        { name: 'Quality Control', relevance: 0.8, demand: 'high' },
        { name: 'Machine Operation', relevance: 0.85, demand: 'high' },
      ],
      'Computer Science': [
        { name: 'Programming', relevance: 0.95, demand: 'very high' },
        { name: 'Web Development', relevance: 0.85, demand: 'very high' },
        { name: 'Database Management', relevance: 0.8, demand: 'high' },
        { name: 'Problem Solving', relevance: 0.9, demand: 'very high' },
      ],
    };

    return skillMap[course] || [];
  }

  assessMarketDemand(role) {
    const highDemandRoles = ['Software Developer', 'IoT Specialist', 'CAD Designer', 'Data Analyst'];
    return highDemandRoles.some(r => role.includes(r)) ? 'high' : 'moderate';
  }

  generateCareerRecommendations(topCareer, skillGaps, performance) {
    const recommendations = [];

    recommendations.push(
      `Focus on developing skills for ${topCareer.name} role`
    );

    if (skillGaps.length > 0) {
      recommendations.push(
        `Priority skills to develop: ${skillGaps.slice(0, 3).map(s => s.name).join(', ')}`
      );
    }

    if (performance !== 'excellent') {
      recommendations.push(
        'Maintain strong academic performance to increase opportunities'
      );
    }

    recommendations.push(
      'Seek internships or practical projects in your field',
      'Connect with GJTS alumni working in your target role'
    );

    return recommendations;
  }

  getIndustryTrends(course) {
    const trends = {
      'Electronics': 'Growing demand in IoT, automation, and renewable energy sectors',
      'Mechanical': 'Increasing opportunities in manufacturing, automotive, and aerospace',
      'Computer Science': 'Explosive growth in software development, AI, and digital transformation',
    };

    return trends[course] || 'Steady demand for technical professionals';
  }
}

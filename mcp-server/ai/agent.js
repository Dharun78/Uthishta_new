/**
 * AI Agent System
 * Autonomous agent that can plan, execute, and adapt tasks
 */

import schoolsData from '../../data/schools-data.json' assert { type: 'json' };

export class AIAgent {
  constructor() {
    this.memory = [];
    this.goals = [];
    this.schoolsData = schoolsData;
  }

  /**
   * Analyze student profile with multi-step reasoning
   */
  async analyzeStudentProfile(profile) {
    // Step 1: Understand the profile
    const understanding = this.understandProfile(profile);
    
    // Step 2: Evaluate academic fit
    const academicFit = this.evaluateAcademicFit(profile);
    
    // Step 3: Analyze interests
    const interestAlignment = this.analyzeInterests(profile.interests);
    
    // Step 4: Consider location
    const locationFit = this.evaluateLocation(profile.location);
    
    // Step 5: Generate recommendations
    const recommendations = this.generateRecommendations({
      understanding,
      academicFit,
      interestAlignment,
      locationFit,
    });
    
    // Step 6: Calculate confidence
    const confidence = this.calculateConfidence([
      academicFit.score,
      interestAlignment.score,
      locationFit.score,
    ]);

    return {
      studentName: profile.name,
      understanding,
      academicFit,
      interestAlignment,
      locationFit,
      recommendations,
      confidence,
      nextSteps: this.planNextSteps(recommendations),
    };
  }

  /**
   * Recommend best-fit school
   */
  async recommendSchool(criteria) {
    const schools = this.schoolsData.schools;
    const scores = [];

    for (const school of schools) {
      const score = this.calculateSchoolMatch(school, criteria);
      scores.push({
        school: school.name,
        id: school.id,
        score: score.total,
        reasons: score.reasons,
        locationMatch: score.locationMatch,
        interestMatch: score.interestMatch,
        academicMatch: score.academicMatch,
        strengths: this.identifyStrengths(school),
        considerations: this.identifyConsiderations(school, criteria),
      });
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    return {
      school: scores[0].school,
      score: scores[0].score,
      reasons: scores[0].reasons,
      locationMatch: scores[0].locationMatch,
      interestMatch: scores[0].interestMatch,
      academicMatch: scores[0].academicMatch,
      alternatives: scores.slice(1, 3),
      reasoning: this.explainRecommendation(scores[0], criteria),
    };
  }

  /**
   * Generate personalized study plan
   */
  async generateStudyPlan(params) {
    const { currentGrade, targetCourse, weakSubjects = [], availableHours = 3 } = params;

    // Step 1: Identify learning objectives
    const objectives = this.identifyLearningObjectives(targetCourse, currentGrade);
    
    // Step 2: Prioritize weak subjects
    const priorities = this.prioritizeSubjects(weakSubjects, targetCourse);
    
    // Step 3: Allocate time
    const schedule = this.allocateStudyTime(priorities, availableHours);
    
    // Step 4: Select resources
    const resources = this.selectResources(targetCourse, currentGrade);
    
    // Step 5: Set milestones
    const milestones = this.setMilestones(objectives, currentGrade);

    return {
      plan: {
        grade: currentGrade,
        targetCourse,
        duration: this.calculateDuration(currentGrade),
        weeklySchedule: schedule,
        dailyRoutine: this.createDailyRoutine(schedule),
      },
      objectives,
      priorities,
      resources,
      milestones,
      explanation: this.explainStudyPlan(schedule, priorities),
      adaptationStrategy: this.planAdaptations(),
    };
  }

  // Helper methods for profile analysis

  understandProfile(profile) {
    const ageGroup = profile.age <= 13 ? 'early-teen' : profile.age <= 15 ? 'mid-teen' : 'late-teen';
    const gradeLevel = profile.previousGrades 
      ? profile.previousGrades.reduce((a, b) => a + b, 0) / profile.previousGrades.length 
      : null;

    return {
      ageGroup,
      academicLevel: gradeLevel ? this.categorizeAcademicLevel(gradeLevel) : 'unknown',
      interestCount: profile.interests.length,
      summary: `${profile.name} is a ${ageGroup} student with ${profile.interests.length} identified interests.`,
    };
  }

  evaluateAcademicFit(profile) {
    const avgGrade = profile.previousGrades 
      ? profile.previousGrades.reduce((a, b) => a + b, 0) / profile.previousGrades.length 
      : 70;

    const score = Math.min(avgGrade / 100, 1);
    const level = this.categorizeAcademicLevel(avgGrade);

    return {
      score,
      level,
      avgGrade,
      recommendation: avgGrade >= 70 
        ? 'Strong academic foundation for technical education' 
        : 'Consider additional academic support',
    };
  }

  analyzeInterests(interests) {
    const technicalInterests = ['electronics', 'computers', 'programming', 'robotics', 'mechanics', 'engineering'];
    const matches = interests.filter(interest => 
      technicalInterests.some(tech => interest.toLowerCase().includes(tech))
    );

    const score = Math.min(matches.length / 3, 1);

    return {
      score,
      matches,
      totalInterests: interests.length,
      recommendation: matches.length > 0 
        ? `Strong alignment with ${matches.join(', ')}` 
        : 'Consider exploring technical interests',
    };
  }

  evaluateLocation(location) {
    if (!location) {
      return { score: 0.5, nearestSchool: 'Any GJTS campus', distance: 'unknown' };
    }

    const schools = this.schoolsData.schools;
    const locationLower = location.toLowerCase();
    
    // Find nearest school
    const nearestSchool = schools.find(s => 
      s.location.toLowerCase().includes(locationLower) ||
      locationLower.includes(s.id)
    );

    if (nearestSchool) {
      return {
        score: 1.0,
        nearestSchool: nearestSchool.name,
        distance: 'local',
        accessibility: 'excellent',
      };
    }

    // Find nearby schools
    const regionalSchools = this.findRegionalSchools(location);
    
    return {
      score: 0.7,
      nearestSchool: regionalSchools[0]?.name || 'Multiple options available',
      distance: 'regional',
      accessibility: 'good',
      alternatives: regionalSchools.slice(1, 3).map(s => s.name),
    };
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    // Academic recommendations
    if (analysis.academicFit.score < 0.7) {
      recommendations.push({
        category: 'Academic',
        priority: 'high',
        action: 'Focus on strengthening core subjects (Math, Science)',
        impact: 'Improves admission chances and course readiness',
      });
    }

    // Interest-based recommendations
    if (analysis.interestAlignment.score < 0.5) {
      recommendations.push({
        category: 'Interests',
        priority: 'medium',
        action: 'Explore technical hobbies and projects',
        impact: 'Helps identify best-fit technical course',
      });
    }

    // Location recommendations
    if (analysis.locationFit.score === 1.0) {
      recommendations.push({
        category: 'Enrollment',
        priority: 'high',
        action: `Apply to ${analysis.locationFit.nearestSchool}`,
        impact: 'Local campus offers best accessibility',
      });
    }

    // General recommendations
    recommendations.push({
      category: 'Preparation',
      priority: 'medium',
      action: 'Visit campus and attend orientation sessions',
      impact: 'Better understanding of school environment',
    });

    return recommendations;
  }

  calculateSchoolMatch(school, criteria) {
    let total = 0;
    const reasons = [];

    // Location match (30% weight)
    const locationMatch = this.matchLocation(school, criteria.location);
    total += locationMatch * 0.3;
    if (locationMatch > 0.7) {
      reasons.push({
        text: `Located in ${school.location}`,
        weight: 0.3,
        category: 'location',
        explanation: 'Convenient accessibility',
      });
    }

    // Interest/Course match (40% weight)
    const interestMatch = this.matchInterests(school, criteria.interests);
    total += interestMatch * 0.4;
    if (interestMatch > 0.6) {
      reasons.push({
        text: `Offers courses matching your interests`,
        weight: 0.4,
        category: 'courses',
        explanation: `${school.courses.length} relevant technical programs`,
      });
    }

    // Academic level match (30% weight)
    const academicMatch = this.matchAcademicLevel(school, criteria.academicLevel);
    total += academicMatch * 0.3;
    if (academicMatch > 0.7) {
      reasons.push({
        text: 'Appropriate academic level',
        weight: 0.3,
        category: 'academic',
        explanation: 'Matches your current preparation',
      });
    }

    return {
      total,
      reasons,
      locationMatch,
      interestMatch,
      academicMatch,
    };
  }

  // Study plan helpers

  identifyLearningObjectives(targetCourse, currentGrade) {
    const objectives = {
      8: ['Master basic mathematics', 'Introduction to science concepts', 'Develop study habits'],
      9: ['Advanced mathematics', 'Physics and chemistry fundamentals', 'Technical drawing basics'],
      10: ['Exam preparation', 'Course-specific skills', 'Career planning'],
    };

    const courseSpecific = {
      'Electronics': ['Circuit basics', 'Component identification', 'Soldering skills'],
      'Mechanical': ['Workshop safety', 'Tool usage', 'Technical drawing'],
      'Computer Science': ['Programming basics', 'Computer fundamentals', 'Logical thinking'],
    };

    return [
      ...(objectives[currentGrade] || []),
      ...(courseSpecific[targetCourse] || []),
    ];
  }

  prioritizeSubjects(weakSubjects, targetCourse) {
    const corePriority = ['Mathematics', 'Science', 'English'];
    const coursePriority = {
      'Electronics': ['Physics', 'Mathematics'],
      'Mechanical': ['Physics', 'Mathematics', 'Drawing'],
      'Computer Science': ['Mathematics', 'Logic'],
    };

    const priorities = [];
    
    // Add weak subjects with high priority
    weakSubjects.forEach(subject => {
      const priority = corePriority.includes(subject) ? 'high' : 'medium';
      priorities.push({ subject, priority, reason: 'Needs improvement' });
    });

    // Add course-specific subjects
    (coursePriority[targetCourse] || []).forEach(subject => {
      if (!priorities.find(p => p.subject === subject)) {
        priorities.push({ subject, priority: 'high', reason: 'Essential for course' });
      }
    });

    return priorities;
  }

  allocateStudyTime(priorities, availableHours) {
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    const hoursPerDay = availableHours;
    const highPriority = priorities.filter(p => p.priority === 'high');
    const mediumPriority = priorities.filter(p => p.priority === 'medium');

    // Distribute high priority subjects across week
    const days = Object.keys(schedule);
    highPriority.forEach((priority, index) => {
      const day = days[index % days.length];
      schedule[day].push({
        subject: priority.subject,
        duration: Math.floor(hoursPerDay * 0.6),
        priority: 'high',
      });
    });

    // Add medium priority subjects
    mediumPriority.forEach((priority, index) => {
      const day = days[index % days.length];
      schedule[day].push({
        subject: priority.subject,
        duration: Math.floor(hoursPerDay * 0.4),
        priority: 'medium',
      });
    });

    return schedule;
  }

  selectResources(targetCourse, currentGrade) {
    return {
      textbooks: [`Grade ${currentGrade} NCERT books`, `${targetCourse} introduction guide`],
      onlineResources: ['Khan Academy', 'BYJU\'S', 'YouTube educational channels'],
      practicalTools: targetCourse === 'Computer Science' 
        ? ['Online coding platforms', 'Scratch/Python tutorials']
        : ['Workshop manuals', 'Technical drawing tools'],
      mentorship: 'Connect with GJTS alumni and teachers',
    };
  }

  setMilestones(objectives, currentGrade) {
    const timeToGraduation = (10 - currentGrade + 1) * 12; // months
    const milestones = [];

    objectives.forEach((objective, index) => {
      milestones.push({
        objective,
        targetMonth: Math.floor((index + 1) * (timeToGraduation / objectives.length)),
        assessment: 'Self-assessment and teacher review',
      });
    });

    return milestones;
  }

  // Utility methods

  categorizeAcademicLevel(grade) {
    if (grade >= 85) return 'excellent';
    if (grade >= 70) return 'good';
    if (grade >= 50) return 'average';
    return 'needs-improvement';
  }

  findRegionalSchools(location) {
    // Simplified regional matching
    const regions = {
      north: ['Bagalkot', 'Kalburgi', 'Hubballi'],
      south: ['Mangalore', 'Bhadravati'],
      central: ['Ballari'],
    };

    for (const [region, cities] of Object.entries(regions)) {
      if (cities.some(city => location.toLowerCase().includes(city.toLowerCase()))) {
        return this.schoolsData.schools.filter(s => 
          cities.some(city => s.location.includes(city))
        );
      }
    }

    return this.schoolsData.schools;
  }

  matchLocation(school, location) {
    if (!location) return 0.5;
    const schoolLoc = school.location.toLowerCase();
    const userLoc = location.toLowerCase();
    return schoolLoc.includes(userLoc) || userLoc.includes(school.id) ? 1.0 : 0.3;
  }

  matchInterests(school, interests) {
    if (!interests || interests.length === 0) return 0.5;
    
    const courseKeywords = school.courses.flatMap(c => 
      c.name.toLowerCase().split(' ')
    );
    
    const matches = interests.filter(interest => 
      courseKeywords.some(keyword => interest.toLowerCase().includes(keyword))
    );

    return Math.min(matches.length / interests.length, 1);
  }

  matchAcademicLevel(school, level) {
    // All schools accept various levels, return moderate match
    return 0.8;
  }

  identifyStrengths(school) {
    return [
      `${school.students}+ active students`,
      `${school.courses.length} technical courses`,
      school.facilities.length > 4 ? 'Excellent facilities' : 'Good facilities',
    ];
  }

  identifyConsiderations(school, criteria) {
    const considerations = [];
    
    if (criteria.transportPreference === 'nearby' && this.matchLocation(school, criteria.location) < 0.7) {
      considerations.push('May require transportation arrangements');
    }
    
    return considerations.length > 0 ? considerations : ['None identified'];
  }

  explainRecommendation(topSchool, criteria) {
    return `${topSchool.school} is recommended based on ${topSchool.reasons.length} key factors with ${Math.round(topSchool.score * 100)}% match score.`;
  }

  calculateConfidence(scores) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.min(avg, 1);
  }

  planNextSteps(recommendations) {
    return recommendations
      .filter(r => r.priority === 'high')
      .map(r => r.action);
  }

  calculateDuration(currentGrade) {
    return `${10 - currentGrade + 1} years until graduation`;
  }

  createDailyRoutine(schedule) {
    return {
      morning: 'Review previous day\'s learning',
      afternoon: 'Main study session (2-3 hours)',
      evening: 'Practice and homework',
      night: 'Light reading and preparation for next day',
    };
  }

  explainStudyPlan(schedule, priorities) {
    const highPriorityCount = priorities.filter(p => p.priority === 'high').length;
    return `This plan focuses on ${highPriorityCount} high-priority subjects distributed across the week for optimal learning.`;
  }

  planAdaptations() {
    return {
      weekly: 'Review progress and adjust time allocation',
      monthly: 'Assess milestone completion and update goals',
      quarterly: 'Major review and plan refinement',
    };
  }
}

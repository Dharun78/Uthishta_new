/**
 * RAG (Retrieval Augmented Generation) System
 * Retrieves relevant context from school data for accurate responses
 */

import schoolsData from '../../data/schools-data.json' assert { type: 'json' };

export class RAGSystem {
  constructor() {
    this.documents = [];
    this.embeddings = new Map();
    this.lastSources = [];
  }

  async initialize() {
    console.error('Initializing RAG system...');
    
    // Convert school data into searchable documents
    this.documents = this.createDocuments();
    
    // Create simple embeddings (TF-IDF style)
    this.createEmbeddings();
    
    console.error(`RAG system initialized with ${this.documents.length} documents`);
  }

  createDocuments() {
    const docs = [];

    // General information
    docs.push({
      id: 'general-info',
      type: 'general',
      content: `GJTS Karnataka has ${schoolsData.generalInfo.totalCampuses} campuses with ${schoolsData.generalInfo.totalStudents} students. Placement rate is ${schoolsData.generalInfo.placementRate}. Admission growth is ${schoolsData.generalInfo.admissionGrowth}. Partnership with ${schoolsData.generalInfo.partner}.`,
      metadata: { category: 'overview' },
    });

    // School-specific documents
    schoolsData.schools.forEach(school => {
      docs.push({
        id: `school-${school.id}`,
        type: 'school',
        content: `${school.name} is located in ${school.location}. Established in ${school.established}. Has ${school.students} students. Offers courses: ${school.courses.map(c => c.name).join(', ')}. Facilities: ${school.facilities.join(', ')}.`,
        metadata: { schoolId: school.id, schoolName: school.name },
      });

      // Course documents
      school.courses.forEach(course => {
        docs.push({
          id: `course-${school.id}-${course.name}`,
          type: 'course',
          content: `${course.name} at ${school.name}: ${course.description}. Duration: ${course.duration}.`,
          metadata: { schoolId: school.id, courseName: course.name },
        });
      });

      // Achievements
      docs.push({
        id: `achievements-${school.id}`,
        type: 'achievements',
        content: `${school.name} achievements: ${school.achievements.join('. ')}.`,
        metadata: { schoolId: school.id },
      });
    });

    // Admission information
    docs.push({
      id: 'admissions',
      type: 'admissions',
      content: `Admissions open for grades ${schoolsData.generalInfo.gradesOffered}. ${schoolsData.generalInfo.scholarships}. Support provided: ${schoolsData.generalInfo.supportProvided.join(', ')}.`,
      metadata: { category: 'admissions' },
    });

    return docs;
  }

  createEmbeddings() {
    this.documents.forEach(doc => {
      const words = this.tokenize(doc.content);
      const wordFreq = new Map();
      
      words.forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
      
      this.embeddings.set(doc.id, wordFreq);
    });
  }

  async retrieveContext(query, topK = 3) {
    const queryWords = this.tokenize(query);
    const scores = [];

    this.documents.forEach(doc => {
      const score = this.calculateSimilarity(queryWords, this.embeddings.get(doc.id));
      scores.push({ doc, score });
    });

    // Sort by relevance
    scores.sort((a, b) => b.score - a.score);
    
    // Get top K documents
    const topDocs = scores.slice(0, topK).filter(s => s.score > 0);
    
    // Store sources for explanation
    this.lastSources = topDocs.map(s => ({
      id: s.doc.id,
      type: s.doc.type,
      relevance: s.score,
      metadata: s.doc.metadata,
    }));

    // Combine content
    const context = topDocs.map(s => s.doc.content).join('\n\n');
    
    return context;
  }

  getSources() {
    return this.lastSources;
  }

  calculateSimilarity(queryWords, docEmbedding) {
    if (!docEmbedding) return 0;
    
    let score = 0;
    queryWords.forEach(word => {
      if (docEmbedding.has(word)) {
        score += docEmbedding.get(word);
      }
    });

    return score;
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));
  }

  isStopWord(word) {
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'or', 'for', 'with', 'has', 'have', 'this', 'that']);
    return stopWords.has(word);
  }

  // Advanced retrieval methods

  async retrieveBySchool(schoolName) {
    const docs = this.documents.filter(doc => 
      doc.metadata.schoolName?.toLowerCase().includes(schoolName.toLowerCase()) ||
      doc.metadata.schoolId?.toLowerCase().includes(schoolName.toLowerCase())
    );

    return docs.map(d => d.content).join('\n\n');
  }

  async retrieveByCategory(category) {
    const docs = this.documents.filter(doc => 
      doc.type === category || doc.metadata.category === category
    );

    return docs.map(d => d.content).join('\n\n');
  }

  async hybridRetrieval(query, filters = {}) {
    let candidates = this.documents;

    // Apply filters
    if (filters.schoolId) {
      candidates = candidates.filter(d => d.metadata.schoolId === filters.schoolId);
    }
    if (filters.type) {
      candidates = candidates.filter(d => d.type === filters.type);
    }

    // Calculate similarity on filtered candidates
    const queryWords = this.tokenize(query);
    const scores = candidates.map(doc => ({
      doc,
      score: this.calculateSimilarity(queryWords, this.embeddings.get(doc.id)),
    }));

    scores.sort((a, b) => b.score - a.score);
    
    return scores.slice(0, 3).map(s => s.doc.content).join('\n\n');
  }
}

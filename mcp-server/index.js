#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import AI modules
import { TinyLLMEngine } from './ai/tiny-llm.js';
import { XAIEngine } from './ai/explainable-ai.js';
import { AIAgent } from './ai/agent.js';
import { RAGSystem } from './ai/rag-system.js';
import { SentimentAnalyzer } from './ai/sentiment.js';
import { PredictiveModel } from './ai/predictive.js';

// Initialize AI components
const tinyLLM = new TinyLLMEngine();
const xaiEngine = new XAIEngine();
const aiAgent = new AIAgent();
const ragSystem = new RAGSystem();
const sentimentAnalyzer = new SentimentAnalyzer();
const predictiveModel = new PredictiveModel();

// Create MCP server
const server = new Server(
  {
    name: 'gjts-karnataka-ai-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const tools = [
  {
    name: 'analyze_student_profile',
    description: 'AI-powered analysis of student profile with recommendations. Uses AI Agent + XAI to provide personalized insights.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Student name' },
        age: { type: 'number', description: 'Student age' },
        previousGrades: { type: 'array', items: { type: 'number' }, description: 'Previous academic grades' },
        interests: { type: 'array', items: { type: 'string' }, description: 'Student interests' },
        location: { type: 'string', description: 'Student location' },
      },
      required: ['name', 'age', 'interests'],
    },
  },
  {
    name: 'predict_admission',
    description: 'Predict admission chances with explainable AI. Provides probability score and detailed explanation of factors.',
    inputSchema: {
      type: 'object',
      properties: {
        academicScore: { type: 'number', description: 'Academic score (0-100)' },
        attendanceRate: { type: 'number', description: 'Attendance percentage' },
        extracurriculars: { type: 'number', description: 'Number of extracurricular activities' },
        familyIncome: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Family income bracket' },
        preferredSchool: { type: 'string', description: 'Preferred GJTS school' },
      },
      required: ['academicScore', 'attendanceRate'],
    },
  },
  {
    name: 'recommend_school',
    description: 'AI-powered school recommendation based on student profile, location, and preferences.',
    inputSchema: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'Student location' },
        interests: { type: 'array', items: { type: 'string' }, description: 'Technical interests' },
        academicLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
        transportPreference: { type: 'string', enum: ['nearby', 'any'] },
      },
      required: ['location', 'interests'],
    },
  },
  {
    name: 'explain_decision',
    description: 'Get detailed explanation for any AI decision using Explainable AI (XAI) techniques.',
    inputSchema: {
      type: 'object',
      properties: {
        decisionType: { type: 'string', description: 'Type of decision to explain' },
        decisionData: { type: 'object', description: 'Data related to the decision' },
      },
      required: ['decisionType', 'decisionData'],
    },
  },
  {
    name: 'chat_with_context',
    description: 'RAG-powered contextual chat using Tiny LLM. Retrieves relevant school data and generates accurate responses.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'User message' },
        context: { type: 'string', description: 'Optional context (school name, topic)' },
        conversationHistory: { type: 'array', items: { type: 'object' }, description: 'Previous messages' },
      },
      required: ['message'],
    },
  },
  {
    name: 'analyze_sentiment',
    description: 'Analyze sentiment and emotion in student queries or feedback.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to analyze' },
        includeEmotions: { type: 'boolean', description: 'Include detailed emotion breakdown' },
      },
      required: ['text'],
    },
  },
  {
    name: 'career_path_prediction',
    description: 'Predict career trajectory based on alumni data and student profile.',
    inputSchema: {
      type: 'object',
      properties: {
        course: { type: 'string', description: 'Technical course' },
        academicPerformance: { type: 'string', enum: ['excellent', 'good', 'average'] },
        skills: { type: 'array', items: { type: 'string' }, description: 'Technical skills' },
      },
      required: ['course'],
    },
  },
  {
    name: 'generate_study_plan',
    description: 'AI Agent generates personalized study plan based on student goals and current level.',
    inputSchema: {
      type: 'object',
      properties: {
        currentGrade: { type: 'number', description: 'Current grade (8-10)' },
        targetCourse: { type: 'string', description: 'Target technical course' },
        weakSubjects: { type: 'array', items: { type: 'string' }, description: 'Subjects needing improvement' },
        availableHours: { type: 'number', description: 'Study hours available per day' },
      },
      required: ['currentGrade', 'targetCourse'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'analyze_student_profile': {
        const analysis = await aiAgent.analyzeStudentProfile(args);
        const explanation = await xaiEngine.explainAnalysis(analysis);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                analysis,
                explanation,
                confidence: analysis.confidence,
                recommendations: analysis.recommendations,
              }, null, 2),
            },
          ],
        };
      }

      case 'predict_admission': {
        const prediction = await predictiveModel.predictAdmission(args);
        const explanation = await xaiEngine.explainPrediction(prediction, args);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                admissionProbability: prediction.probability,
                decision: prediction.decision,
                explanation: explanation,
                keyFactors: prediction.keyFactors,
                suggestions: prediction.suggestions,
              }, null, 2),
            },
          ],
        };
      }

      case 'recommend_school': {
        const recommendation = await aiAgent.recommendSchool(args);
        const explanation = await xaiEngine.explainRecommendation(recommendation);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                recommendedSchool: recommendation.school,
                matchScore: recommendation.score,
                reasons: recommendation.reasons,
                explanation: explanation,
                alternatives: recommendation.alternatives,
              }, null, 2),
            },
          ],
        };
      }

      case 'explain_decision': {
        const explanation = await xaiEngine.explainDecision(
          args.decisionType,
          args.decisionData
        );
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(explanation, null, 2),
            },
          ],
        };
      }

      case 'chat_with_context': {
        const relevantContext = await ragSystem.retrieveContext(args.message);
        const response = await tinyLLM.generate(args.message, relevantContext);
        const sources = ragSystem.getSources();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                response: response.text,
                confidence: response.confidence,
                sources: sources,
                contextUsed: relevantContext.length > 0,
              }, null, 2),
            },
          ],
        };
      }

      case 'analyze_sentiment': {
        const sentiment = await sentimentAnalyzer.analyze(args.text);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                sentiment: sentiment.label,
                score: sentiment.score,
                emotions: args.includeEmotions ? sentiment.emotions : undefined,
                urgency: sentiment.urgency,
                suggestedResponse: sentiment.suggestedResponse,
              }, null, 2),
            },
          ],
        };
      }

      case 'career_path_prediction': {
        const prediction = await predictiveModel.predictCareerPath(args);
        const explanation = await xaiEngine.explainCareerPrediction(prediction);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                predictedCareers: prediction.careers,
                probability: prediction.probability,
                explanation: explanation,
                skillGaps: prediction.skillGaps,
                recommendations: prediction.recommendations,
              }, null, 2),
            },
          ],
        };
      }

      case 'generate_study_plan': {
        const studyPlan = await aiAgent.generateStudyPlan(args);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                studyPlan: studyPlan.plan,
                duration: studyPlan.duration,
                milestones: studyPlan.milestones,
                resources: studyPlan.resources,
                explanation: studyPlan.explanation,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  console.error('Starting GJTS Karnataka AI MCP Server...');
  
  // Initialize AI components
  await tinyLLM.initialize();
  await ragSystem.initialize();
  await predictiveModel.initialize();
  
  console.error('AI components initialized successfully');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

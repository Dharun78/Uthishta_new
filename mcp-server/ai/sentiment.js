/**
 * Sentiment Analysis Engine
 * Analyzes emotions and sentiment in student queries
 */

export class SentimentAnalyzer {
  constructor() {
    this.sentimentLexicon = this.buildLexicon();
    this.emotionPatterns = this.buildEmotionPatterns();
  }

  async analyze(text) {
    const tokens = this.tokenize(text);
    
    // Calculate sentiment score
    const sentimentScore = this.calculateSentiment(tokens);
    
    // Detect emotions
    const emotions = this.detectEmotions(text);
    
    // Determine urgency
    const urgency = this.assessUrgency(text, emotions);
    
    // Generate suggested response type
    const suggestedResponse = this.suggestResponseType(sentimentScore, emotions, urgency);

    return {
      label: this.categorizeSentiment(sentimentScore),
      score: sentimentScore,
      emotions,
      urgency,
      suggestedResponse,
      confidence: this.calculateConfidence(tokens.length, emotions.length),
    };
  }

  buildLexicon() {
    return {
      positive: new Map([
        ['good', 1], ['great', 2], ['excellent', 3], ['amazing', 3],
        ['happy', 2], ['excited', 2], ['interested', 1], ['love', 2],
        ['best', 2], ['wonderful', 2], ['fantastic', 3], ['perfect', 2],
        ['thank', 1], ['thanks', 1], ['appreciate', 2],
      ]),
      negative: new Map([
        ['bad', -1], ['poor', -2], ['terrible', -3], ['awful', -3],
        ['sad', -2], ['worried', -2], ['concerned', -1], ['confused', -1],
        ['difficult', -1], ['hard', -1], ['problem', -1], ['issue', -1],
        ['disappointed', -2], ['frustrated', -2], ['angry', -3],
      ]),
    };
  }

  buildEmotionPatterns() {
    return {
      joy: ['happy', 'excited', 'thrilled', 'delighted', 'glad'],
      sadness: ['sad', 'unhappy', 'disappointed', 'depressed'],
      anxiety: ['worried', 'nervous', 'anxious', 'concerned', 'scared'],
      confusion: ['confused', 'unclear', 'don\'t understand', 'not sure'],
      curiosity: ['interested', 'curious', 'want to know', 'wondering'],
      frustration: ['frustrated', 'annoyed', 'irritated'],
      hope: ['hope', 'wish', 'looking forward', 'aspire'],
      gratitude: ['thank', 'grateful', 'appreciate'],
    };
  }

  calculateSentiment(tokens) {
    let score = 0;
    let count = 0;

    tokens.forEach(token => {
      if (this.sentimentLexicon.positive.has(token)) {
        score += this.sentimentLexicon.positive.get(token);
        count++;
      } else if (this.sentimentLexicon.negative.has(token)) {
        score += this.sentimentLexicon.negative.get(token);
        count++;
      }
    });

    // Normalize score
    return count > 0 ? score / count : 0;
  }

  detectEmotions(text) {
    const textLower = text.toLowerCase();
    const detectedEmotions = [];

    for (const [emotion, patterns] of Object.entries(this.emotionPatterns)) {
      const matches = patterns.filter(pattern => textLower.includes(pattern));
      if (matches.length > 0) {
        detectedEmotions.push({
          emotion,
          intensity: Math.min(matches.length / patterns.length, 1),
          indicators: matches,
        });
      }
    }

    return detectedEmotions.sort((a, b) => b.intensity - a.intensity);
  }

  assessUrgency(text, emotions) {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'help', 'please help'];
    const textLower = text.toLowerCase();
    
    const hasUrgentKeywords = urgentKeywords.some(keyword => textLower.includes(keyword));
    const hasNegativeEmotions = emotions.some(e => 
      ['anxiety', 'frustration', 'sadness'].includes(e.emotion) && e.intensity > 0.5
    );
    const hasQuestionMarks = (text.match(/\?/g) || []).length > 1;

    if (hasUrgentKeywords) return 'high';
    if (hasNegativeEmotions && hasQuestionMarks) return 'medium';
    return 'low';
  }

  suggestResponseType(sentimentScore, emotions, urgency) {
    // High urgency or negative sentiment
    if (urgency === 'high' || sentimentScore < -1) {
      return {
        type: 'supportive',
        tone: 'empathetic',
        priority: 'immediate',
        suggestion: 'Provide direct assistance and escalate if needed',
      };
    }

    // Confusion detected
    if (emotions.some(e => e.emotion === 'confusion')) {
      return {
        type: 'explanatory',
        tone: 'clear and simple',
        priority: 'normal',
        suggestion: 'Break down information into simple steps',
      };
    }

    // Curiosity or interest
    if (emotions.some(e => ['curiosity', 'hope'].includes(e.emotion))) {
      return {
        type: 'informative',
        tone: 'encouraging',
        priority: 'normal',
        suggestion: 'Provide detailed information and next steps',
      };
    }

    // Positive sentiment
    if (sentimentScore > 1) {
      return {
        type: 'reinforcing',
        tone: 'enthusiastic',
        priority: 'normal',
        suggestion: 'Encourage and provide additional resources',
      };
    }

    // Neutral
    return {
      type: 'informative',
      tone: 'professional',
      priority: 'normal',
      suggestion: 'Provide clear, factual information',
    };
  }

  categorizeSentiment(score) {
    if (score > 1) return 'very positive';
    if (score > 0.3) return 'positive';
    if (score > -0.3) return 'neutral';
    if (score > -1) return 'negative';
    return 'very negative';
  }

  calculateConfidence(tokenCount, emotionCount) {
    // More tokens and detected emotions = higher confidence
    const tokenConfidence = Math.min(tokenCount / 20, 1);
    const emotionConfidence = Math.min(emotionCount / 3, 1);
    return (tokenConfidence + emotionConfidence) / 2;
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  // Advanced analysis methods

  async analyzeBatch(texts) {
    return Promise.all(texts.map(text => this.analyze(text)));
  }

  async trackSentimentTrend(analyses) {
    const scores = analyses.map(a => a.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return {
      average: avgScore,
      trend: this.determineTrend(scores),
      volatility: this.calculateVolatility(scores),
    };
  }

  determineTrend(scores) {
    if (scores.length < 2) return 'insufficient data';
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.5) return 'improving';
    if (secondAvg < firstAvg - 0.5) return 'declining';
    return 'stable';
  }

  calculateVolatility(scores) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  }
}

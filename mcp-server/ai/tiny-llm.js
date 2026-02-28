/**
 * Tiny LLM Engine using Phi-3 Mini (3.8B parameters)
 * Runs locally for fast, private inference
 */

import { pipeline } from '@xenova/transformers';

export class TinyLLMEngine {
  constructor() {
    this.model = null;
    this.modelName = 'Xenova/phi-3-mini-4k-instruct';
    this.maxTokens = 512;
  }

  async initialize() {
    console.error('Loading Tiny LLM (Phi-3 Mini)...');
    try {
      // Use text-generation pipeline
      this.model = await pipeline('text-generation', this.modelName, {
        quantized: true, // Use quantized model for faster inference
      });
      console.error('Tiny LLM loaded successfully');
    } catch (error) {
      console.error('Failed to load Tiny LLM, using fallback:', error.message);
      // Fallback to simpler model
      this.model = await pipeline('text-generation', 'Xenova/gpt2');
    }
  }

  async generate(prompt, context = '') {
    if (!this.model) {
      await this.initialize();
    }

    try {
      // Build enhanced prompt with context
      const enhancedPrompt = this.buildPrompt(prompt, context);
      
      // Generate response
      const result = await this.model(enhancedPrompt, {
        max_new_tokens: this.maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      });

      // Extract and clean response
      const generatedText = result[0].generated_text;
      const response = this.extractResponse(generatedText, enhancedPrompt);
      
      return {
        text: response,
        confidence: this.calculateConfidence(response),
        model: this.modelName,
      };
    } catch (error) {
      console.error('Generation error:', error);
      return {
        text: this.getFallbackResponse(prompt),
        confidence: 0.5,
        model: 'fallback',
      };
    }
  }

  buildPrompt(userPrompt, context) {
    const systemPrompt = `You are a helpful AI assistant for Government Junior Technical Schools (GJTS) Karnataka. 
You provide accurate, concise information about admissions, courses, facilities, and student support.

Context: ${context}

User Question: ${userPrompt}


Assistant Response:`;
    
    return systemPrompt;
  }

  extractResponse(fullText, prompt) {
    // Remove the prompt from the generated text
    let response = fullText.replace(prompt, '').trim();
    
    // Clean up common artifacts
    response = response.split('\n\n')[0]; // Take first paragraph
    response = response.replace(/^(Assistant:|AI:|Response:)/i, '').trim();
    
    return response || 'I apologize, but I need more information to provide a helpful response.';
  }

  calculateConfidence(response) {
    // Simple confidence calculation based on response quality
    let confidence = 0.7;
    
    if (response.length > 50) confidence += 0.1;
    if (response.includes('GJTS') || response.includes('school')) confidence += 0.1;
    if (!response.includes('I don\'t know')) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  getFallbackResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('admission')) {
      return 'Admissions are open for grades 8-10 at all six GJTS campuses. Please visit our admissions page for detailed information.';
    }
    if (lowerPrompt.includes('course') || lowerPrompt.includes('subject')) {
      return 'We offer courses in Electronics, Mechanical Engineering, Computer Science, and Electrical Engineering across our campuses.';
    }
    if (lowerPrompt.includes('school') || lowerPrompt.includes('campus')) {
      return 'We have six GJTS campuses: Ballari, Bhadravati, Hubballi, Bagalkot, Kalburgi, and Mangalore.';
    }
    
    return 'Thank you for your question. Please use our chatbot or contact us directly for specific information.';
  }
}

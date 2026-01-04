// Gemini Provider Implementation

import type { ILLMProvider, LLMRequest, LLMResponse } from '../types';
import type { LLMProvider } from '../../../types';

/**
 * Gemini provider implementation using OpenAI-compatible API
 * Note: The sandbox environment provides Gemini access via OpenAI-compatible endpoint
 */
export class GeminiProvider implements ILLMProvider {
  readonly provider: LLMProvider = 'openai'; // Using OpenAI-compatible interface
  readonly model: string;
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, model: string = 'gemini-2.5-flash') {
    this.model = model;
    this.apiKey = apiKey;
    // Use the OpenAI-compatible endpoint provided by the sandbox
    this.baseURL = 'https://api.openai.com/v1'; // This will be overridden by environment
  }

  /**
   * Generate completion using Gemini API via OpenAI-compatible interface
   */
  async complete(request: LLMRequest): Promise<LLMResponse> {
    try {
      const messages: Array<{ role: string; content: string }> = [];

      // Add system prompt if provided
      if (request.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.systemPrompt,
        });
      }

      // Add user prompt
      messages.push({
        role: 'user',
        content: request.prompt,
      });

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: request.maxTokens || 2000,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const tokensUsed = data.usage?.total_tokens;

      return {
        text,
        provider: this.provider,
        model: this.model,
        tokensUsed,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
      }
      throw new Error('Unknown Gemini API error');
    }
  }

  /**
   * Test connection to Gemini API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try a minimal completion to test the connection
      const testRequest: LLMRequest = {
        prompt: 'Hello',
        maxTokens: 5,
      };
      await this.complete(testRequest);
      return true;
    } catch (error) {
      return false;
    }
  }
}

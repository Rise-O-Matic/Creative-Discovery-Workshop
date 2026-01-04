// OpenAI Provider Implementation

import OpenAI from 'openai';
import type { ILLMProvider, LLMRequest, LLMResponse } from '../types';
import type { LLMProvider } from '../../../types';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements ILLMProvider {
  readonly provider: LLMProvider = 'openai';
  readonly model: string;
  private client: OpenAI;

  constructor(apiKey: string, model: string = 'gpt-4') {
    this.model = model;
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  /**
   * Generate completion using OpenAI API
   */
  async complete(request: LLMRequest): Promise<LLMResponse> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

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

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
      });

      const text = completion.choices[0]?.message?.content || '';
      const tokensUsed = completion.usage?.total_tokens;

      return {
        text,
        provider: this.provider,
        model: this.model,
        tokensUsed,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw new Error('Unknown OpenAI API error');
    }
  }

  /**
   * Test connection to OpenAI API
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

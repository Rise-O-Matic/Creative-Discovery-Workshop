// Anthropic Provider Implementation

import Anthropic from '@anthropic-ai/sdk';
import type { ILLMProvider, LLMRequest, LLMResponse } from '../types';
import type { LLMProvider } from '../../../types';

/**
 * Anthropic provider implementation
 */
export class AnthropicProvider implements ILLMProvider {
  readonly provider: LLMProvider = 'anthropic';
  readonly model: string;
  private client: Anthropic;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.model = model;
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  /**
   * Generate completion using Anthropic API
   */
  async complete(request: LLMRequest): Promise<LLMResponse> {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt,
        messages: [
          {
            role: 'user',
            content: request.prompt,
          },
        ],
      });

      // Extract text from content blocks
      const text = message.content
        .filter((block) => block.type === 'text')
        .map((block) => (block.type === 'text' ? block.text : ''))
        .join('\n');

      const tokensUsed = message.usage?.input_tokens + message.usage?.output_tokens;

      return {
        text,
        provider: this.provider,
        model: this.model,
        tokensUsed,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Anthropic API error: ${error.message}`);
      }
      throw new Error('Unknown Anthropic API error');
    }
  }

  /**
   * Test connection to Anthropic API
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

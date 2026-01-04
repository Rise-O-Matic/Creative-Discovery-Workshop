// Main LLM Service - Factory and coordination

import type { ILLMProvider, LLMServiceConfig, LLMRequest, LLMResponse, LLMError } from './types';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { AnthropicProvider } from './providers/AnthropicProvider';
import { MockProvider } from './providers/MockProvider';
import type { LLMProvider } from '../../types';

/**
 * Main LLM Service class
 * Handles provider selection, error handling, and retry logic
 */
export class LLMService {
  private provider: ILLMProvider;
  private retryAttempts = 2;
  private retryDelay = 1000; // ms

  constructor(config: LLMServiceConfig) {
    this.provider = this.createProvider(config);
  }

  /**
   * Factory method to create the appropriate provider
   */
  private createProvider(config: LLMServiceConfig): ILLMProvider {
    // If no API key provided, use mock provider for testing
    if (!config.apiKey || config.apiKey === 'mock') {
      return new MockProvider();
    }

    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config.apiKey, config.model);
      case 'anthropic':
        return new AnthropicProvider(config.apiKey, config.model);
      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }

  /**
   * Generate completion with retry logic
   */
  async complete(request: LLMRequest): Promise<LLMResponse> {
    let lastError: LLMError | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.provider.complete(request);
        return response;
      } catch (error) {
        lastError = this.normalizeError(error, this.provider.provider);

        // Don't retry if error is not retryable
        if (!lastError.retryable || attempt === this.retryAttempts) {
          throw lastError;
        }

        // Wait before retry with exponential backoff
        await this.delay(this.retryDelay * Math.pow(2, attempt));
      }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError || new Error('Unknown error occurred');
  }

  /**
   * Test connection to provider
   */
  async testConnection(): Promise<boolean> {
    try {
      return await this.provider.testConnection();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current provider info
   */
  getProviderInfo(): { provider: LLMProvider; model: string } {
    return {
      provider: this.provider.provider,
      model: this.provider.model,
    };
  }

  /**
   * Normalize errors from different providers
   */
  private normalizeError(error: unknown, provider: LLMProvider): LLMError {
    if (error instanceof Error) {
      // Check for rate limiting
      if (error.message.includes('rate_limit') || error.message.includes('429')) {
        return {
          message: 'Rate limit exceeded. Please wait and try again.',
          code: 'RATE_LIMIT',
          provider,
          retryable: true,
        };
      }

      // Check for authentication errors
      if (
        error.message.includes('auth') ||
        error.message.includes('401') ||
        error.message.includes('403')
      ) {
        return {
          message: 'Authentication failed. Please check your API key.',
          code: 'AUTH_ERROR',
          provider,
          retryable: false,
        };
      }

      // Check for network errors
      if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        return {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          provider,
          retryable: true,
        };
      }

      // Generic error
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        provider,
        retryable: true,
      };
    }

    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      provider,
      retryable: false,
    };
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

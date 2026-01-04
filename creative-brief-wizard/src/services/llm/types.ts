// LLM Service Types

import type { LLMProvider } from '../../types';

/**
 * Configuration for LLM requests
 */
export interface LLMRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Response from LLM
 */
export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
  tokensUsed?: number;
}

/**
 * Error from LLM service
 */
export interface LLMError {
  message: string;
  code?: string;
  provider: LLMProvider;
  retryable: boolean;
}

/**
 * Base interface for LLM providers
 */
export interface ILLMProvider {
  readonly provider: LLMProvider;
  readonly model: string;

  /**
   * Generate text completion
   */
  complete(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Test the connection with the provider
   */
  testConnection(): Promise<boolean>;
}

/**
 * Configuration for LLM service
 */
export interface LLMServiceConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
}

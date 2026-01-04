// Synthesis Service - High-level synthesis functions

import { LLMService } from './LLMService';
import type { LLMServiceConfig } from './types';
import type { StickyNote } from '../../types';
import {
  createClusterSynthesisPrompt,
  createCustomerDiscoverySynthesisPrompt,
  createSpotExercisesSynthesisPrompt,
} from './prompts';

/**
 * Service for synthesizing content using LLM
 */
export class SynthesisService {
  private llmService: LLMService;

  constructor(config: LLMServiceConfig) {
    this.llmService = new LLMService(config);
  }

  /**
   * Synthesize a cluster of sticky notes
   */
  async synthesizeCluster(clusterTitle: string, notes: StickyNote[]): Promise<string> {
    if (notes.length === 0) {
      return 'This cluster has no notes yet.';
    }

    const { prompt, systemPrompt } = createClusterSynthesisPrompt(clusterTitle, notes);

    try {
      const response = await this.llmService.complete({
        prompt,
        systemPrompt,
        maxTokens: 500,
        temperature: 0.7,
      });

      return response.text.trim();
    } catch (error) {
      console.error('Error synthesizing cluster:', error);
      throw error;
    }
  }

  /**
   * Synthesize multiple clusters in batch
   */
  async synthesizeClusters(
    clusters: { id: string; title: string; notes: StickyNote[] }[]
  ): Promise<{ id: string; summary: string }[]> {
    const results: { id: string; summary: string }[] = [];

    // Process clusters sequentially to avoid rate limiting
    for (const cluster of clusters) {
      try {
        const summary = await this.synthesizeCluster(cluster.title, cluster.notes);
        results.push({ id: cluster.id, summary });
      } catch (error) {
        console.error(`Error synthesizing cluster ${cluster.id}:`, error);
        results.push({
          id: cluster.id,
          summary: 'Error generating summary. Please try again.',
        });
      }
    }

    return results;
  }

  /**
   * Synthesize customer discovery responses
   */
  async synthesizeCustomerDiscovery(
    whoIsThisFor: string,
    whatIsBeingOffered: string,
    whyNow: string,
    whatIsSuccess: string
  ): Promise<string> {
    const { prompt, systemPrompt } = createCustomerDiscoverySynthesisPrompt(
      whoIsThisFor,
      whatIsBeingOffered,
      whyNow,
      whatIsSuccess
    );

    try {
      const response = await this.llmService.complete({
        prompt,
        systemPrompt,
        maxTokens: 1000,
        temperature: 0.7,
      });

      return response.text.trim();
    } catch (error) {
      console.error('Error synthesizing customer discovery:', error);
      throw error;
    }
  }

  /**
   * Synthesize spot/deliverable exercises
   */
  async synthesizeSpotExercises(exercises: {
    oneSentence?: { makePeopleFeel: string; helpOrganization: string; showThatWe: string };
    viewersInMirror?: { whereWatching: string; feelingBefore: string; stopWatchingIf: string };
    story?: {
      situation: string;
      problem: string;
      tensionReveal: string;
      productRole: string;
      resolution: string;
    };
    failures?: string[];
    promisesAndProofs?: { claim: string; visualProof: string }[];
    constraints?: { description: string; styleImplication: string }[];
  }): Promise<string> {
    const { prompt, systemPrompt } = createSpotExercisesSynthesisPrompt(exercises);

    try {
      const response = await this.llmService.complete({
        prompt,
        systemPrompt,
        maxTokens: 1000,
        temperature: 0.7,
      });

      return response.text.trim();
    } catch (error) {
      console.error('Error synthesizing spot exercises:', error);
      throw error;
    }
  }

  /**
   * Test connection to LLM provider
   */
  async testConnection(): Promise<boolean> {
    return this.llmService.testConnection();
  }

  /**
   * Get provider info
   */
  getProviderInfo() {
    return this.llmService.getProviderInfo();
  }
}

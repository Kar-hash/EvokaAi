/**
 * Represents an AI Agent within the Evoka AI ecosystem.
 */
export interface Agent {
  name: string;
  personality: string;
  background: string;
  expertise?: string[];
  beliefs?: string[];
  quirks?: string[];
  communication?: string;
  traits: string[];
}

/**
 * Configuration for creating a chat room in Evoka AI.
 */
export interface ChatRoomConfig {
  numberOfAgents: number;
  topic: string;
  messagesPerAgent: number;
}

/**
 * Represents a single message within a chat room.
 */
export interface Message {
  role: any;
  agentName: string;
  content: string;
  timestamp: Date;
  metadata?: SessionMetadata;
}

/**
 * Summary of a conversation held in a chat room.
 */
export interface ConversationSummary {
  mainConclusions: string[];
  keyDiscussionPoints: string[];
  disagreements: string[];
  agreements: string[];
  suggestedNextTopics: string[];
  overallTone: string;
}

/**
 * Analytics data for evaluating chat room interactions.
 */
export interface ChatAnalytics {
  mainTopics: string[];
  agentBehaviorAnalysis: Record<string, {
    cognitivePatterns: string;
    emotionalResponses: string;
    biasesObserved: string[];
    adaptabilityScore: number;
    consistencyWithRole: string;
    uniqueCharacteristics: string[];
  }>;
  interactionDynamics: {
    powerDynamics: string;
    influencePatterns: string[];
    groupPolarization: string;
    cognitiveAlignment: string;
  };
  experimentMetrics: {
    ideaDiversity: number;
    conversationDepth: number;
    emotionalIntelligence: number;
    logicalConsistency: number;
    creativityScore: number;
  };
  emergentBehaviors: string[];
  researchImplications: string[];
  summary: {
    mainConclusions: string[];
    keyDiscussionPoints: string[];
    agreements: string[];
    disagreements: string[];
    overallTone: string;
    suggestedNextTopics: string[];
  };
}

/**
 * Options for creating an AI Agent in Evoka AI.
 */
export interface AgentCreationOptions {
  name?: string;
  personality?: string;
  background?: string;
  traits?: string[];
  expertise?: string;
  beliefs?: string;
  quirks?: string;
  communication?: string;
  isRandom: boolean;
  conversationTopic: string;
}

/**
 * Metadata related to the session and system state.
 */
export interface SessionMetadata {
  system: {
    platform: string;
    release: string;
    arch: string;
    cpus: number;
    memory: {
      total: number;
      free: number;
    };
    uptime: number;
    client: {
      platform: string;
      userAgent: string;
      language: string;
      cores: number;
      memory: string;
      connection: string;
      webgl: string;
      renderingEngine: string;
      performanceMode: string;
    };
  };
  request: {
    ip: string;
    userAgent: string;
    timestamp: string;
    protocol: string;
    secure: boolean;
    headers: {
      accept: string;
      language: string;
      encoding: string;
      connection: string;
    };
  };
  services: {
    websocket: {
      protocol: string;
      latency: number;
      connectionId: string;
      status: string;
    };
    api: {
      protocol: string;
      tls: string;
      latency: number;
      status: string;
    };
    openai: {
      model: string;
      version: string;
      contextWindow: string;
      temperature: number;
      status: string;
    };
  };
  performance: {
    startTime: number;
    messageGenerationTimes: number[];
    totalProcessingTime: number;
    metrics: {
      initializationTime: number;
      messageProcessingTime: number;
      averageLatency: number;
    };
  };
}

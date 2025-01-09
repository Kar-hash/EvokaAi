import { Message, ChatAnalytics, Agent } from '../types';

/**
 * Represents a chat room within the Evoka AI ecosystem.
 * This model manages the messages, analytics, and participating agents in a conversation.
 */
export class ChatRoomModel {
  private messages: Message[] = [];
  private analytics: ChatAnalytics | null = null;

  constructor(
    public readonly agents: Agent[],
    public readonly topic: string
  ) {}

  /**
   * Adds a new message to the chat room.
   * @param {Message} message - The message to add.
   */
  public addMessage(message: Message): void {
    this.messages.push(message);
  }

  /**
   * Retrieves all messages from the chat room.
   * @returns {Message[]} - An array of messages.
   */
  public getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Sets the chat analytics for the chat room.
   * @param {ChatAnalytics} analytics - The analytics data to set.
   */
  public setAnalytics(analytics: ChatAnalytics): void {
    this.analytics = analytics;
  }

  /**
   * Retrieves the chat analytics for the chat room.
   * @returns {ChatAnalytics | null} - The analytics data or null if not set.
   */
  public getAnalytics(): ChatAnalytics | null {
    return this.analytics;
  }

  /**
   * Converts the ChatRoomModel instance to a JSON string.
   * @returns {string} - JSON string representation of the chat room.
   */
  public toJSON(): string {
    return JSON.stringify({
      agents: this.agents,
      topic: this.topic,
      messages: this.messages,
      analytics: this.analytics
    }, null, 2);
  }
}

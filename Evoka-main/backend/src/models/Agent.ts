import { Agent } from '../types';

/**
 * Represents an AI Agent in the Evoka AI ecosystem.
 * This model defines the structure and methods associated with an AI Agent.
 */
export class AgentModel implements Agent {
  constructor(
    public name: string,
    public personality: string,
    public background: string,
    public traits: string[]
  ) {}

  /**
   * Converts the AgentModel instance to a JSON string.
   * @returns {string} - JSON string representation of the AgentModel.
   */
  public toJSON(): string {
    return JSON.stringify({
      name: this.name,
      personality: this.personality,
      background: this.background,
      traits: this.traits
    }, null, 2);
  }

  /**
   * Creates an AgentModel instance from a JSON string.
   * @param {string} json - The JSON string to parse.
   * @returns {AgentModel} - An instance of AgentModel.
   */
  public static fromJSON(json: string): AgentModel {
    const data = JSON.parse(json);
    return new AgentModel(
      data.name,
      data.personality,
      data.background,
      data.traits
    );
  }
}

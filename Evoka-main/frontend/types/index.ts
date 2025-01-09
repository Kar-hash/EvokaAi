export interface Message {
  role: 'user' | 'assistant';
  content: string;
  agentName: string;
  timestamp: Date;
}

/**
 * Represents a single page in the application.
 */
export interface Page {
  name: string;
  path: string;
  html: string;
  isActive: boolean;
  children?: Page[];
}

/**
 * Represents a file or directory in a game development project.
 */
export interface GameFile extends Page {
  code: string;
  type: 'file' | 'directory';
  children?: GameFile[];
}

/**
 * Represents the structure of a game project.
 */
export interface GameProject {
  structure: GameFile[];
  currentFile: string;
}

/**
 * Represents a Solana program file or module.
 */
export interface SolanaProgram extends Page {
  code: string;
  type: 'program' | 'module';
  children?: SolanaProgram[];
}

/**
 * Represents a change to a program file or structure.
 */
export interface ProgramChange {
  name: string;
  code: string;
  action: 'create' | 'update' | 'delete';
  reason?: string;
}
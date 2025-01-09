import chalk from 'chalk';

/**
 * Logs a message to the terminal in a styled format.
 * Part of the Evoka AI utility functions.
 * @param {string} message - The message to log.
 */
export const terminalLog = (message: string): void => {
  console.log(chalk.green.dim(message));
};

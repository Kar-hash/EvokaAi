import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Overrides the default Inquirer.js prompt theme to align with Evoka AI's visual style.
 */
const originalPrompt = inquirer.prompt;
(inquirer as any).prompt = async (questions: any, ...rest: any) => {
  if (Array.isArray(questions)) {
    questions = questions.map(q => ({
      ...q,
      prefix: chalk.white('?'), // Standardized question prefix
      message: chalk.white(q.message), // Styled question message
      choices: q.choices?.map((c: any) => 
        typeof c === 'string' 
          ? chalk.white(c) // Style for string choices
          : { ...c, name: chalk.white(c.name) } // Style for object choices
      )
    }));
  }
  return originalPrompt(questions, ...rest);
};

/**
 * Defines Evoka AI's custom Inquirer.js theme.
 */
export const inquirerTheme = {
  input: chalk.white, // Input styling
  question: chalk.white, // Question styling
  prefix: chalk.white('?'), // Prefix styling
};

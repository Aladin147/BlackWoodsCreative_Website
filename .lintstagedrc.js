const path = require('path');

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

const buildPrettierCommand = filenames => `prettier --write ${filenames.join(' ')}`;

module.exports = {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildPrettierCommand, 'git add'],

  // JSON files
  '*.json': [buildPrettierCommand, 'git add'],

  // CSS and styling files
  '*.{css,scss,sass}': [buildPrettierCommand, 'git add'],

  // Markdown files
  '*.{md,mdx}': [buildPrettierCommand, 'git add'],

  // Configuration files
  '*.{yml,yaml}': [buildPrettierCommand, 'git add'],
};

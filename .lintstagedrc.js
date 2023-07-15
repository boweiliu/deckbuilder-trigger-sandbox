export default {
  '*.{ts,tsx,js,jsx}': 'eslint --cache --fix',
  '*.md': 'prettier --write',
  '*.css': 'prettier --write',
  '*.{ts,tsx}': () => 'tsc --skipLibCheck --noEmit',
};

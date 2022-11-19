module.exports = {
  '*.{json,js,ts,jsx,tsx,scss}': 'prettier --write',
  '*.{js,ts,jsx,tsx}': 'eslint --fix --max-warnings=0',
}

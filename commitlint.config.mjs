// Conventional Commits with the types listed in AGENTS.md ("Commits").
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['content', 'docs', 'feat', 'fix', 'chore']],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [1, 'always', 100],
  },
};

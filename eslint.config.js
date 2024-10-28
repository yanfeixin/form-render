const { antfu } = require('@antfu/eslint-config')

module.exports = antfu(
  {
    ignores: ['scripts', 'internal/build/src/utils/message.ts', 'docs/shared-docs', '**/es/', '**/lib/', '**/types/', '**/cdn/']
  },
  {
    rules: {
      'style/comma-dangle': ['error', 'never'],
      'node/prefer-global/process': 'off',
      'unused-imports/no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-return-assign': 'off',
      'prefer-promise-reject-errors': 'off'
    }
  }
)

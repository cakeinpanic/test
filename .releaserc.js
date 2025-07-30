module.exports = {
  branches: [
    'master',
    {
      name: 'katya',  'prerelease': 'alpha'
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits'
      }
    ],
    '@semrel-extra/npm',
    [
      '@semantic-release/github'
    ]
  ],
  verifyConditions: []
}

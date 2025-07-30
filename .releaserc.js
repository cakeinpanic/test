module.exports = {
  branches: [
    {
      name: 'master', 'channel': 'alpha', 'prerelease': 'alpha'
    },
    {
      name: 'katya', 'channel': 'alpha', 'prerelease': 'alpha'
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

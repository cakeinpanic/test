module.exports = {
  branches: [
    {
      name: 'master'
    },
    {
      name: 'katya'
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

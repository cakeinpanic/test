export default {
  branches: [
    {
      name: 'master'
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
      "@semantic-release/github"
    ]
  ],
  verifyConditions: []
}

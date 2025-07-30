console.log(123);
export default {
  branches: [
    'master'
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

module.exports = {
  "branches": [
    "master",
    "katya"
  ],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/github"
    ]
  ],
  "verifyConditions": []
}

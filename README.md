# @cakeinpanic/provenance-test

This library is configured with semantic-release for automated versioning and publishing with npm provenance.

## Automated Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate the package release workflow. This includes:

- Determining the next version number
- Generating release notes
- Publishing to npm with provenance
- Creating GitHub releases

### How it works

1. When code is pushed to the `main` branch, the GitHub Actions workflow is triggered
2. semantic-release analyzes commits since the last release
3. If there are relevant commits, a new version is published based on commit types:
   - `fix:` or `fix(scope):` → patch release (1.0.0 → 1.0.1)
   - `feat:` or `feat(scope):` → minor release (1.0.0 → 1.1.0)
   - `BREAKING CHANGE:` in commit body or footer → major release (1.0.0 → 2.0.0)

### Commit Message Format

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `chore`: Changes to build process or auxiliary tools

### npm Provenance

This package is published with npm provenance, which provides supply chain security by verifying that the package was built from this repository using GitHub Actions.

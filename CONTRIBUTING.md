# Contributing to Daily Amar Desh

First off, thank you for considering contributing to Daily Amar Desh! It's people like you that make this project great.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@amardesh.com](mailto:conduct@amardesh.com).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots and animated GIFs if possible
* Include your environment details (OS, device, app version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful
* List some other applications where this enhancement exists (if applicable)

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these issues:

* **Good first issues** - Issues which should only require a few lines of code
* **Help wanted issues** - Issues which should be a bit more involved

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the TypeScript styleguides
* End all files with a newline
* Document new code based on JSDoc
* Make sure all tests pass

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/amar-desh-mobile.git
   cd amar-desh-mobile
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- user/__tests__/affinityCalculator.test.ts
```

## Development Workflow

### Branch Naming

Use the following naming convention for branches:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

Example: `feature/add-dark-mode`

### Making Changes

1. Make your changes in your feature branch
2. Add or update tests as needed
3. Run tests to ensure nothing is broken:
   ```bash
   npm test
   ```
4. Run linter:
   ```bash
   npm run lint
   ```
5. Commit your changes (see [Commit Messages](#commit-messages))
6. Push to your fork
7. Submit a pull request

## Style Guidelines

### TypeScript

We use TypeScript in strict mode. Follow these guidelines:

* Use interfaces for object types
* Use type annotations for function parameters and return types
* Avoid `any` type - use `unknown` or specific types instead
* Use optional chaining (`?.`) and nullish coalescing (`??`)
* Prefer `const` over `let`, avoid `var`

### React Native

* Use functional components with hooks
* Keep components small and focused
* Extract reusable logic into custom hooks
* Use `StyleSheet.create()` for styles
* Avoid inline styles

### Naming Conventions

* **Components**: PascalCase (e.g., `ArticleCard`)
* **Functions/Variables**: camelCase (e.g., `calculateAffinity`)
* **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
* **Files**: 
  - Components: PascalCase (e.g., `ArticleCard.tsx`)
  - Utilities: camelCase (e.g., `affinityCalculator.ts`)
  - Tests: Same name with `.test.ts` suffix

### Imports

Order imports as follows:

1. React/React Native imports
2. Third-party library imports
3. Local component imports
4. Utility imports
5. Type imports
6. Style imports

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ArticleCard } from '../components/ArticleCard';
import { calculateAffinity } from '../utils/affinityCalculator';

import type { Article } from '../types';
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools

### Examples

```
feat(auth): add Google Sign-In integration

- Implement Google Sign-In using Firebase Auth
- Add migration flow for anonymous users
- Update profile screen with sign-in button

Closes #123
```

```
fix(affinity): correct recency decay calculation

The decay function was using days instead of hours,
causing scores to decay too quickly.

Fixes #456
```

```
docs(readme): update installation instructions

Add prerequisites section and clarify setup steps
for both iOS and Android development.
```

## Pull Request Process

### Before Submitting

1. **Update documentation** - Update README.md, docs, or comments as needed
2. **Add tests** - Ensure new code has adequate test coverage
3. **Run tests** - All tests must pass
4. **Check linting** - No linting errors
5. **Update CHANGELOG** - Add entry for your changes

### PR Template

Use this template for your pull request:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe the tests you ran to verify your changes.

## Screenshots
If applicable, add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** - CI will run tests and linting
2. **Code review** - At least one maintainer must approve
3. **Discussion** - Address any feedback or questions
4. **Merge** - Once approved, a maintainer will merge your PR

## Community

### Communication

* **GitHub Issues** - For bug reports and feature requests
* **GitHub Discussions** - For questions and general discussion
* **Discord** - [Join our Discord](https://discord.gg/amardesh) for real-time chat

### Getting Help

If you need help, you can:

1. Check the [documentation](./docs)
2. Search existing [issues](https://github.com/yourusername/amar-desh-mobile/issues)
3. Ask in [GitHub Discussions](https://github.com/yourusername/amar-desh-mobile/discussions)
4. Join our [Discord](https://discord.gg/amardesh)

### Recognition

Contributors will be recognized in:

* The [CONTRIBUTORS.md](./CONTRIBUTORS.md) file
* Release notes
* Project README (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Daily Amar Desh! 🎉

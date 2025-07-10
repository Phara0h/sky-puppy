# Contributing to Sky Puppy

Thank you for your interest in contributing to Sky Puppy! We welcome contributions from the community and appreciate your help in making Sky Puppy better for everyone.

## 🤝 How to Contribute

There are many ways to contribute to Sky Puppy:

- 🐛 **Report bugs** - Help us identify and fix issues
- 💡 **Suggest features** - Share your ideas for improvements
- 📝 **Improve documentation** - Help make Sky Puppy easier to use
- 🔧 **Submit code** - Fix bugs or add new features
- 🧪 **Write tests** - Help ensure code quality and reliability
- 🌍 **Translate** - Help make Sky Puppy available in more languages
- 📢 **Spread the word** - Tell others about Sky Puppy

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sky-puppy.git
   cd sky-puppy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier to maintain consistent code style. Please ensure your code follows these standards:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix

# Format code
npm run format
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(checkers): add Redis health checker
fix(alerts): resolve Discord webhook template issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear, descriptive title
   - Include a detailed description of your changes
   - Reference any related issues
   - Add screenshots if applicable

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested my changes locally
- [ ] I have added tests for new functionality
- [ ] All existing tests pass

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have updated the documentation
- [ ] I have added comments to my code where necessary
- [ ] My changes generate no new warnings
- [ ] I have tested the changes in different environments

## Related Issues
Closes #(issue number)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "checker tests"
```

### Writing Tests

We use Jest for testing. Here's an example test structure:

```javascript
const MyChecker = require('../src/checkers/my-checker');

describe('MyChecker', () => {
  let checker;

  beforeEach(() => {
    checker = new MyChecker({}, {}, { uri: 'test-uri' });
  });

  afterEach(async () => {
    await checker.close();
  });

  describe('init()', () => {
    it('should initialize successfully with valid settings', async () => {
      await expect(checker.init()).resolves.not.toThrow();
    });

    it('should throw error with invalid settings', async () => {
      checker = new MyChecker({}, {}, {});
      await expect(checker.init()).rejects.toThrow('uri is required');
    });
  });

  describe('check()', () => {
    it('should return healthy status when service is up', async () => {
      await checker.init();
      const result = await checker.check();
      
      expect(result.status).toBe('healthy');
      expect(result.message).toContain('Service is responding');
    });

    it('should return down status when service is unavailable', async () => {
      // Mock service to be down
      await checker.init();
      const result = await checker.check();
      
      expect(result.status).toBe('down');
      expect(result.message).toContain('Service unavailable');
    });
  });
});
```

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up to date with code changes

### Documentation Structure

```
docs/
├── configuration.md      # Configuration guide
├── checkers.md          # Custom checkers guide
├── alerting.md          # Alerting setup guide
├── api.md              # API reference
└── deployment.md       # Deployment guide
```

## 🐛 Bug Reports

### Before Reporting a Bug

1. Check if the issue has already been reported
2. Try to reproduce the issue with the latest version
3. Check the documentation for solutions

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Ubuntu 20.04]
- Node.js version: [e.g. 16.14.0]
- Sky Puppy version: [e.g. 1.3.8]
- Configuration: [relevant parts of your config]

## Additional Information
- Screenshots if applicable
- Error logs
- Configuration files (with sensitive data removed)
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternative Solutions
Any alternative solutions you've considered.

## Additional Context
Any other context, screenshots, or examples.
```

## 🔧 Creating Custom Checkers

If you're creating a custom checker, please follow these guidelines:

1. **Use the template**: Start with [sky-puppy-checker-template](https://github.com/Phara0h/sky-puppy-checker-template)
2. **Follow naming conventions**: Use `sky-puppy-checker-{service-name}` format
3. **Include documentation**: Add README with usage examples
4. **Add tests**: Include comprehensive test coverage
5. **Handle errors gracefully**: Provide meaningful error messages

### Checker Checklist

- [ ] Implements required methods (`init`, `check`, `close`)
- [ ] Validates configuration in `init()`
- [ ] Handles errors gracefully
- [ ] Includes comprehensive tests
- [ ] Has clear documentation
- [ ] Follows security best practices
- [ ] Uses appropriate timeouts
- [ ] Provides meaningful status messages

## 🌍 Internationalization

We welcome translations! To contribute translations:

1. Create a new file in the `locales` directory
2. Follow the existing translation structure
3. Test your translations
4. Submit a pull request

## 📈 Performance Guidelines

When contributing code, consider performance:

- Use efficient algorithms and data structures
- Avoid blocking operations in checkers
- Implement proper connection pooling
- Use timeouts to prevent hanging operations
- Cache results when appropriate

## 🔒 Security Guidelines

- Never commit sensitive data (API keys, passwords, etc.)
- Validate all inputs
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes, backward compatible

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Version is bumped
- [ ] Release notes are written
- [ ] Package is published to npm

## 🎉 Recognition

Contributors are recognized in several ways:

- **Contributors list** on GitHub
- **Changelog mentions** for significant contributions
- **Special thanks** in release notes
- **Contributor badges** for regular contributors

## 📞 Getting Help

If you need help contributing:

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the docs folder for guides
- **Examples**: Look at existing code for patterns

## 📄 License

By contributing to Sky Puppy, you agree that your contributions will be licensed under the same license as the project (GPL-3.0-or-later).

---

Thank you for contributing to Sky Puppy! Your help makes this project better for everyone. 🐕✨ 
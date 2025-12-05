# 🤝 Contributing to AI Chat Bot with RAG

First off, thank you for considering contributing to this project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

- Use the bug report template
- Include detailed steps to reproduce
- Provide environment information
- Add relevant logs and screenshots

### ✨ Suggesting Features

- Use the feature request template
- Explain the use case clearly
- Describe the expected behavior
- Consider backward compatibility

### 💻 Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## 🛠️ Development Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/chat-bot.git
   cd chat-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Install Ollama:**
   ```bash
   ollama pull embeddinggemma
   ```

5. **Run the project:**
   ```bash
   npm start
   ```

## 🔄 Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add tests** for new features
3. **Ensure all tests pass** before submitting
4. **Update README.md** if needed
5. **Follow the PR template** completely
6. **Link related issues** in the PR description
7. **Request review** from maintainers
8. **Address feedback** promptly

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] Added/updated tests
- [ ] All tests passing
- [ ] No new warnings
- [ ] Linked related issues

## 📏 Coding Standards

### JavaScript Style

- Use **ES6+ features** (const, let, arrow functions)
- Use **async/await** over callbacks
- Follow **camelCase** for variables and functions
- Use **PascalCase** for classes
- Add **JSDoc comments** for functions
- Keep functions **small and focused**
- Use **meaningful variable names**

### Example:

```javascript
/**
 * Generates embeddings for the given text
 * @param {string} text - The input text
 * @returns {Promise<number[]>} The embedding vector
 */
async function generateEmbedding(text) {
  const response = await fetch('http://localhost:11434/api/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'embeddinggemma', input: text })
  });
  
  const data = await response.json();
  return data.embeddings[0];
}
```

### File Organization

- Keep files **under 300 lines**
- One component/function per file when possible
- Group related utilities together
- Use clear folder structure

## 📝 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples:

```
feat(chat): add streaming response support

Implemented server-sent events for real-time streaming
of AI responses to improve user experience.

Closes #123
```

```
fix(embeddings): handle empty text input

Added validation to prevent crashes when empty
strings are passed to the embedding function.

Fixes #456
```

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good code coverage
- Test edge cases

```bash
npm test
```

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for functions
- Update API documentation
- Include code examples

## ❓ Questions?

Feel free to open a discussion or reach out to the maintainers!

---

Thank you for contributing! 🙏

# Contributing to Chieftamate

Thank you for contributing to Chieftamate! This document outlines the process for contributing code changes.

---

## Pull Request Requirements

**No PR is merged unless:**

- ✅ **All automated tests pass in CI** (unit + integration + smoke)
- ✅ **The PR has a passing smoke test** that validates critical external integrations (Google APIs, payment gateway, etc.)
- ✅ **At least one code review from a code-owner**; reviewer must verify the PR checklist items
- ✅ **No secrets or credentials checked into git**; all credentials must be stored as project secrets (Vercel/GitHub Secrets/Secret Manager)
- ✅ **Deployment is blocked** unless the release passes a canary/health check for 10 minutes

---

## Required Status Checks

The following status checks must pass before a PR can be merged:

### **Automated Tests:**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Smoke tests pass (validates critical external integrations)

### **Code Review:**
- [ ] At least one code-owner review
- [ ] Reviewer verified PR checklist items
- [ ] No blocking comments

### **Security:**
- [ ] No secrets or credentials in code
- [ ] All credentials stored in project secrets
- [ ] Security scan passed

### **Deployment:**
- [ ] Canary deployment successful
- [ ] Health check passes for 10 minutes
- [ ] No critical errors in canary

---

## Setting Up Required Status Checks

### **GitHub Repository Settings:**

1. Go to: **Settings** → **Branches**
2. Add branch protection rule for `main` (or `master`)
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require pull request reviews before merging
   - ✅ Require at least 1 approving review
   - ✅ Dismiss stale pull request approvals when new commits are pushed

4. **Add required status checks:**
   - `ci / unit-tests`
   - `ci / integration-tests`
   - `ci / smoke-tests`
   - `ci / security-scan`
   - `deployment / canary-health-check`

---

## PR Checklist Template

When creating a PR, use the checklist in `.github/pull_request_template.md`:

- [ ] All tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation updated (if needed)
- [ ] No secrets or credentials in code
- [ ] Smoke tests validate external integrations
- [ ] Ready for code review

---

## Secrets Management

### **Never Commit:**
- API keys
- Passwords
- Access tokens
- Private keys
- Database credentials

### **Use Instead:**
- **Vercel:** Environment Variables (Project Settings)
- **GitHub:** Repository Secrets (Settings → Secrets)
- **Google Cloud:** Secret Manager
- **Local:** `.env.local` (gitignored)

---

## Testing Requirements

### **Unit Tests:**
- Test individual functions/components
- Coverage: Minimum 80%
- Run: `npm test`

### **Integration Tests:**
- Test API endpoints
- Test database interactions
- Test external service integrations
- Run: `npm run test:integration`

### **Smoke Tests:**
- Validate critical external integrations:
  - Google Maps API
  - Google Gemini API
  - Payment gateway (if applicable)
  - Authentication services
- Run: `npm run test:smoke`

---

## Deployment Process

### **Canary Deployment:**
1. Deploy to canary environment
2. Run health checks for 10 minutes
3. Monitor for errors
4. If healthy → Deploy to production
5. If errors → Rollback

### **Health Checks:**
- API endpoints responding
- Database connections working
- External APIs accessible
- No critical errors in logs

---

## Code Review Process

1. **Create PR** with checklist completed
2. **Automated tests run** (CI)
3. **Code owner reviews** PR
4. **Reviewer verifies:**
   - PR checklist items
   - Code quality
   - Security (no secrets)
   - Tests passing
5. **Approval** from code owner
6. **Merge** (if all checks pass)

---

## Getting Help

- **Questions?** Open an issue
- **Bug reports?** Use issue template
- **Feature requests?** Use feature template

---

**Last Updated:** November 22, 2024

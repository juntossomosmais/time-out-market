# ADR 0001: Maintain ESLint v8 for Stability

🗓️ 2025-11-07 · ✍️ [@felipefialho](https://twitter.com/felipefialho_)

## Status

Accepted

## Context

ESLint v9 was released with significant breaking changes, including a new flat configuration format that replaces the legacy `.eslintrc` configuration system. While ESLint v9 offers new features and improvements, it requires substantial migration effort across our monorepo.

Our project uses ESLint extensively across multiple packages with shared configurations. Migrating to ESLint v9 would require:

1. **Configuration Migration**: Converting all `.eslintrc.js` files to the new flat config format (`eslint.config.js`)
2. **Plugin Compatibility**: Ensuring all ESLint plugins support v9 (many were still v8-only when this decision was made)
3. **Rule Changes**: Reviewing and updating rule configurations for v9 compatibility
4. **TypeScript Integration**: Coordinating with @typescript-eslint package upgrades
5. **Developer Workflow**: Training team members on new configuration format
6. **CI/CD Updates**: Updating all pipeline configurations

At the time of this decision (November 2025), we also identified that:
- Some critical plugins (like `eslint-plugin-sonarjs v1`) only support ESLint v8
- The ecosystem was still in transition with mixed v8/v9 support
- Our immediate priority was dependency stability, not ESLint feature adoption

## Decision Drivers

* **Stability Over Features**: Maintaining a stable linting environment is more valuable than adopting new ESLint features
* **Reduced Migration Risk**: ESLint v9 migration is complex and could introduce temporary instability
* **Ecosystem Maturity**: Waiting for the ecosystem to fully stabilize around v9 reduces migration challenges
* **Team Productivity**: Avoiding breaking changes to developer workflow during active development
* **Time Investment**: Large migration effort would delay other priority work
* **Dependency Chain**: ESLint version affects many related packages (TypeScript-ESLint, plugins, etc.)

## Decision

We have decided to **maintain ESLint v8** (`^8.57.1`) as our linting standard until:

1. All critical ESLint plugins we depend on support v9
2. The ecosystem has stabilized (6+ months after v9 release)
3. We have dedicated time for a coordinated migration effort
4. Related dependencies (Nx, TypeScript-ESLint) have stable v9 support

### Locked Version

```json
{
  "devDependencies": {
    "eslint": "^8.57.1"
  }
}
```

### Configuration Standard

All packages will continue using `.eslintrc.js` format:
```javascript
module.exports = {
  extends: ['...'],
  plugins: ['...'],
  rules: { ... }
}
```

## Alternatives Considered

### Alternative 1: Immediate Migration to ESLint v9

**Pros:**
- Access to latest ESLint features
- Future-proof configuration format
- Better performance in some scenarios

**Cons:**
- High migration cost (estimated 2-3 days of work)
- Risk of breaking developer workflows
- Some plugins don't support v9 yet
- Would delay current development priorities

**Decision:** Rejected - cost outweighs benefits at this time

### Alternative 2: Gradual Package-by-Package Migration

**Pros:**
- Spreads migration effort over time
- Allows learning from early packages
- Lower risk per migration

**Cons:**
- Mixed ESLint versions in monorepo creates confusion
- Shared configurations become complex
- Different linting behavior across packages
- Harder to maintain consistency

**Decision:** Rejected - consistency is critical in a monorepo

## Consequences

### Positive

- **Stability**: No unexpected linting changes or configuration issues
- **Productivity**: Developers can focus on feature development
- **Consistency**: All packages use the same ESLint version and configuration format
- **Predictability**: Known behavior makes debugging linting issues easier
- **Time Savings**: Avoid spending 2-3 days on migration work

### Negative

- **Missing Features**: Cannot use new ESLint v9 features (like improved flat config)
- **Technical Debt**: Creates a future migration task that must be addressed
- **Plugin Limitations**: Some newer plugins may only support ESLint v9
- **Deprecation Notices**: ESLint v8 is no longer officially supported (as of October 2024)

### Neutral

- **Security Updates**: ESLint v8 still receives critical security patches, but fewer bug fixes
- **Documentation**: Official ESLint docs focus on v9, may need to reference older docs

## Migration Path to ESLint v9

When ready to migrate (recommended: Q2 2026 or later), follow this plan:

### Phase 1: Preparation (1-2 days)
1. Audit all ESLint plugins for v9 compatibility
2. Review ESLint v9 breaking changes documentation
3. Create migration checklist for each package
4. Set up test environment for migration testing

### Phase 2: Shared Configuration (1 day)
1. Migrate shared ESLint config in `packages/linters` to flat config
2. Create compatibility layer for gradual migration
3. Update documentation and examples

### Phase 3: Package Migration (2-3 days)
1. Migrate packages one by one in dependency order
2. Update `.eslintrc.js` → `eslint.config.js`
3. Test linting behavior matches previous configuration
4. Update package-specific overrides

### Phase 4: Verification (1 day)
1. Run linting across entire monorepo
2. Verify CI/CD pipelines work correctly
3. Update team documentation
4. Conduct team training session

**Total Estimated Effort**: 5-7 days

## Related ADRs

- [ADR 0002: Tooling Dependency Compatibility Matrix](./0002-tooling-dependency-compatibility.md) - Documents version constraints imposed by this decision

## References

- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [ESLint v8 End of Life](https://eslint.org/blog/2024/09/eslint-v8-eol-version-support/)
- [Flat Config Migration](https://eslint.org/docs/latest/use/configure/migration-guide)

## Review Schedule

This ADR should be reviewed:
- **Quarterly** (January, April, July, October): Check ESLint v9 ecosystem maturity
- **After Major Plugin Updates**: When critical plugins announce v9 support
- **Q2 2026**: Actively plan migration to ESLint v9

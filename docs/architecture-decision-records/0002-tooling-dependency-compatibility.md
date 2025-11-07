# ADR 0002: Tooling Dependency Compatibility Matrix

🗓️ 2025-11-07 · ✍️ [@felipefialho](https://twitter.com/felipefialho_)

## Status

Accepted

## Context

Modern JavaScript tooling has complex interdependencies. During our November 2025 dependency update, we encountered multiple compatibility issues:

1. **TypeScript v5.9.3** was incompatible with **@typescript-eslint v7** (requires <5.6.0)
2. **Vite v7** is ESM-only and incompatible with **Nx 22.0.2**
3. **eslint-plugin-sonarjs v3+** requires ESLint v9, but we use ESLint v8
4. **Stylelint v16** requires ESM module support in Jest

The JavaScript ecosystem is rapidly evolving toward ESM-only packages, but our build tooling (particularly Nx) still requires CommonJS compatibility in some areas. Without clear documentation of these constraints, developers might accidentally introduce breaking dependency combinations.

## Decision Drivers

* **Build Stability**: Prevent breaking builds due to incompatible dependency versions
* **Developer Experience**: Clear constraints prevent frustrating debugging sessions
* **CI/CD Reliability**: Consistent dependency versions across all environments
* **Maintenance Efficiency**: Quick reference for dependency update decisions
* **Risk Management**: Understand downstream impacts of version changes

## Decision

We maintain a strict **Dependency Compatibility Matrix** that documents version constraints and their interdependencies. All dependency updates must be validated against this matrix.

## Dependency Compatibility Matrix

### Core Tooling Stack

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **ESLint** | `^8.57.1` | Must stay v8.x | See [ADR 0001](./0001-maintain-eslint-v8.md) | @typescript-eslint, plugins |
| **TypeScript** | `~5.5.4` | Must be <5.6.0 | @typescript-eslint v7 only supports <5.6.0 | @typescript-eslint/* |
| **Vite** | `^6.4.1` | Must stay v6.x | v7 is ESM-only, incompatible with Nx 22 | Nx, build tooling |
| **Nx** | `22.0.2` | Current stable | Nx 22 doesn't support Vite v7 yet | Vite, build pipeline |

### TypeScript Tooling

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **@typescript-eslint/eslint-plugin** | `^7.18.0` | Must be v7.x | ESLint v8 compatible; v8+ requires ESLint v9 | ESLint, TypeScript |
| **@typescript-eslint/parser** | `^7.18.0` | Must be v7.x | Must match eslint-plugin version | ESLint, TypeScript |
| **typescript-eslint** | `^7.18.0` | Must be v7.x | Must match other @typescript-eslint packages | ESLint, TypeScript |

### ESLint Plugins

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **eslint-plugin-sonarjs** | `^1.0.4` | Must be v1.x | v2+ requires ESLint v9 | ESLint |
| **eslint-plugin-import** | `^2.32.0` | v2.x | Stable with ESLint v8 | ESLint |
| **eslint-plugin-react** | `^7.37.5` | v7.x | Stable with ESLint v8 | ESLint, React |
| **eslint-plugin-react-hooks** | `^7.0.1` | v7.x | Stable with ESLint v8 | ESLint, React |

### Styling & Linting

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **Stylelint** | `^16.25.0` | v16.x | Requires ESM support in Jest | Jest, test tooling |
| **Prettier** | `3.6.2` | v3.x | Stable, well-supported | Code formatting |

### Test Tooling

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **Jest** | `^30.2.0` | v30.x | Requires VM modules flag for Stylelint | Stylelint, testing |
| **ts-jest** | `^29.4.5` | v29.x | Compatible with Jest v30 | Jest, TypeScript |

### Build Utilities

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **patch-package** | `^8.0.0` | v8.x | Required by rollup postinstall scripts | Build pipeline |

## Special Configuration Requirements

### 1. Jest with Stylelint v16 ESM Support

**Issue**: Stylelint v16 is ESM-only and Jest requires special configuration to support ESM modules.

**Solution**:
```json
{
  "scripts": {
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest"
  }
}
```

**Location**: `packages/linters/package.json`

**Important**: The `NODE_OPTIONS='--experimental-vm-modules'` flag must also be included in the `test:ci` command in `packages/linters/project.json`:

```json
{
  "test:ci": {
    "executor": "nx:run-commands",
    "options": {
      "cwd": "packages/linters",
      "commands": [
        {
          "command": "NODE_OPTIONS='--experimental-vm-modules' jest --coverage --ci --passWithNoTests"
        }
      ]
    }
  }
}
```

**Why**: Without this flag in CI, tests fail with ESM module errors even though they pass locally with `npm test`.

### 2. Vite CommonJS Compatibility

**Issue**: Vite v6 still supports CommonJS but shows deprecation warnings. Vite v7 is ESM-only.

**Solution**: Stay on Vite v6 until Nx supports v7. Warning is informational only.

**Expected Warning**:
```
The CJS build of Vite's Node API is deprecated.
```

### 3. TypeScript Version Pinning

**Issue**: Using `^5.5.4` allowed npm to install v5.9.3 which broke @typescript-eslint.

**Solution**: Use `~5.5.4` (tilde) to restrict to patch updates only.

## Dependency Update Guidelines

### Before Updating Any Dependency

1. **Check the Matrix**: Verify the dependency is listed and review its constraints
2. **Check Related Packages**: Identify all related packages in "Related To" column
3. **Verify Compatibility**: Check if new version is compatible with related packages
4. **Test Locally**: Run `npm test` and all linters before committing
5. **Update Matrix**: If constraints change, update this ADR

### Update Process

```bash
# 1. Check current versions
npm outdated

# 2. For each package, check this ADR's matrix
# 3. Update package.json respecting constraints
# 4. Clean install
rm -rf node_modules package-lock.json
npm install

# 5. Run full test suite
npm test
npm run lint

# 6. Update this ADR if constraints changed
```

### Red Flags 🚩

These scenarios require extra caution:

- **Major version changes** (e.g., v8 → v9)
- **ESM-only packages** when working with CommonJS code
- **Peer dependency conflicts** in npm install output
- **TypeScript version changes** (affects many packages)
- **Build tool changes** (Vite, Nx, Webpack)

## Known Warnings

These warnings are **expected** and can be safely ignored:

### ⚠️ Vite CJS Deprecation (CI/CD)
```
The CJS build of Vite's Node API is deprecated.
```
**Status**: Informational only
**Impact**: None
**Resolution**: Will be fixed when Nx supports Vite v7

### ⚠️ Stylelint CommonJS API Deprecation
```
DeprecationWarning: The CommonJS Node.js API is deprecated.
```
**Status**: Expected with VM modules support
**Impact**: None
**Resolution**: Tests run successfully with `--experimental-vm-modules`

## Breaking Dependency Combinations

**Never Install Together:**

| Package A | Package B | Reason |
|-----------|-----------|---------|
| ESLint v9.x | @typescript-eslint v7.x | v7 requires ESLint v8 |
| TypeScript v5.6+ | @typescript-eslint v7.x | v7 only supports TypeScript <5.6 |
| Vite v7.x | Nx 22.x | Nx 22 doesn't support Vite v7 ESM-only |
| eslint-plugin-sonarjs v2+ | ESLint v8.x | v2+ requires ESLint v9 |

## Future Migration Paths

### When Nx Supports Vite v7

1. Verify Nx release notes mention Vite v7 support
2. Update Vite: `npm install vite@^7`
3. Update Nx: `npm install -D @nx/vite@latest`
4. Test build pipeline thoroughly
5. Update this ADR

### When Migrating to ESLint v9

See [ADR 0001: Maintain ESLint v8](./0001-maintain-eslint-v8.md) for full migration plan.

**Dependency Update Order:**
1. Update ESLint to v9
2. Update @typescript-eslint to v8
3. Update eslint-plugin-sonarjs to v2+
4. Update TypeScript to v5.6+ (if desired)
5. Migrate all ESLint configurations
6. Update this matrix

## Consequences

### Positive

- **Clear Guidelines**: Developers know exactly which versions are compatible
- **Faster Updates**: Quick reference prevents trial-and-error
- **Prevents Breakage**: Matrix helps avoid incompatible combinations
- **Onboarding Aid**: New developers understand dependency constraints immediately
- **Audit Trail**: Documents why specific versions were chosen

### Negative

- **Maintenance Overhead**: Matrix must be updated when constraints change
- **May Lag Behind**: Some packages may be several minor versions behind latest
- **Documentation Burden**: Requires keeping this ADR in sync with package.json

### Neutral

- **Version Discipline**: Team must respect these constraints during updates
- **Communication**: Matrix must be shared with all developers

## Related ADRs

- [ADR 0001: Maintain ESLint v8](./0001-maintain-eslint-v8.md) - Explains ESLint version constraint

## References

- [TypeScript-ESLint Version Support](https://typescript-eslint.io/users/dependency-versions/)
- [Nx and Vite Compatibility](https://nx.dev/recipes/vite)
- [Vite v7 Breaking Changes](https://vite.dev/guide/migration.html)
- [Stylelint v16 Migration Guide](https://stylelint.io/migration-guide/to-16)
- [npm Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)

## Review Schedule

This ADR should be reviewed:
- **Monthly**: During dependency update cycles
- **Before Major Updates**: Always consult before major version changes
- **After Security Advisories**: When security patches affect these packages
- **When Constraints Change**: Update immediately when compatibility rules change

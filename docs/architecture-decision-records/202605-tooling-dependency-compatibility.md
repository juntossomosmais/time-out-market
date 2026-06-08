# ADR: Tooling Dependency Compatibility Matrix

🗓️ 2026-05-27 · ✍️ [@felipefialho](https://twitter.com/felipefialho_)

## Status

Accepted

## Context

Modern JavaScript tooling has complex interdependencies. To prevent breaking dependency combinations from being introduced accidentally, we document the current version constraints and their interdependencies in a single matrix.

This matrix reflects the state after adopting **ESLint v10** with the flat config (`eslint.config.*`) format as the standard. ESLint v10 removed the legacy eslintrc system entirely (`.eslintrc.*` files are no longer loaded, the `ESLINT_USE_FLAT_CONFIG` environment variable is ignored, and the `LegacyESLint` API was removed). The shared `@juntossomosmais/linters` package requires ESLint v10 (`eslint` peer dependency is `>=10`); consumers are expected to upgrade rather than stay on older versions. The legacy eslintrc exports (`eslint.config.js`, `eslint.config.react.js`) remain published purely as a migration aid for downstream consumers mid-migration; they are not loaded by ESLint v10 and the package does not support being installed against ESLint v8/v9.

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
| **ESLint** | `^10.0.0` | v10.x | Flat config standard; legacy eslintrc exports kept for downstream compatibility | @typescript-eslint, plugins |
| **@eslint/js** | `^10.0.1` | v10.x | Provides `js.configs.recommended` for the flat base config | ESLint |
| **TypeScript** | `~6.0.3` | Pin to patch updates | Tilde pin avoids unexpected minor jumps that can break @typescript-eslint | @typescript-eslint/* |
| **Vite** | `^8.0.14` | v8.x | Compatible with Nx 22.7.x | Nx, build tooling |
| **Nx** | `22.7.4` | Current stable | Supports Vite v8 | Vite, build pipeline |

### TypeScript Tooling

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **@typescript-eslint/eslint-plugin** | `^8.60.0` | v8.x | Compatible with ESLint v8.57+, v9 and v10 | ESLint, TypeScript |
| **@typescript-eslint/parser** | `^8.60.0` | v8.x | Must match eslint-plugin version | ESLint, TypeScript |
| **typescript-eslint** | `^8.60.0` | v8.x | Must match other @typescript-eslint packages | ESLint, TypeScript |

### ESLint Plugins

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **eslint-plugin-sonarjs** | `^4.0.3` | v4.x | Flat config support | ESLint |
| **eslint-plugin-import-x** | `^4.16.2` | v4.x | Used by the flat base for `import-x/order`. Replaces `eslint-plugin-import` on the flat path because the original plugin still calls `SourceCode#getTokenOrCommentAfter`, removed in ESLint v10 | ESLint |
| **eslint-plugin-import** | `^2.32.0` | v2.x | Kept for the published legacy eslintrc exports only (`src/eslint.config.js`); not used by the flat base | ESLint |
| **eslint-plugin-react** | `^7.37.5` | v7.x | Used by the flat React config | ESLint, React |
| **eslint-plugin-react-hooks** | `^7.1.1` | v7.x | Used by the flat React config | ESLint, React |
| **eslint-config-prettier** | `^10.1.8` | v10.x | Disables formatting rules that conflict with Prettier | ESLint, Prettier |
| **globals** | `^17.6.0` | v17.x | Provides global definitions for `languageOptions.globals` | ESLint |

### Styling & Linting

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **Stylelint** | `^16.26.0` | v16.x | Requires ESM support in Jest | Jest, test tooling |
| **Prettier** | `3.8.3` | v3.x | Stable, well-supported | Code formatting |

### Test Tooling

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **Jest** | `^30.4.2` | v30.x | Requires VM modules flag for Stylelint | Stylelint, testing |
| **ts-jest** | `^29.4.11` | v29.x | Compatible with Jest v30 | Jest, TypeScript |

### Build Utilities

| Package | Version | Constraint | Reason | Related To |
|---------|---------|------------|---------|------------|
| **patch-package** | `^8.0.1` | v8.x | Required by rollup postinstall scripts | Build pipeline |

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

**Why**: Without this flag in CI, tests fail with ESM module errors even though they pass locally with `pnpm test`.

### 2. Self-lint config resolution

**Issue**: This repository ships the legacy eslintrc exports as source files literally named `eslint.config.js` (and `eslint.config.react.js`). ESLint v10 discovers those filenames as flat configs during its per-directory config lookup and fails on their eslintrc `env` key.

**Solution**: This repo's lint invocations pass an explicit config, which disables nested config discovery:

```jsonc
// package.json
{
  "scripts": { "lint": "eslint . -c eslint.config.mjs" },
  "lint-staged": { "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --cache --fix -c eslint.config.mjs"] }
}
```

**Note**: Downstream consumers are unaffected because those files live inside `node_modules`, which ESLint never scans for configuration.

### 3. TypeScript Version Pinning

**Issue**: Using a caret range can install a newer TypeScript minor that breaks @typescript-eslint.

**Solution**: Use `~6.0.3` (tilde) to restrict to patch updates only.

## Dependency Update Guidelines

### Before Updating Any Dependency

1. **Check the Matrix**: Verify the dependency is listed and review its constraints
2. **Check Related Packages**: Identify all related packages in "Related To" column
3. **Verify Compatibility**: Check if new version is compatible with related packages
4. **Test Locally**: Run `pnpm test` and `pnpm run lint` before committing
5. **Update Matrix**: If constraints change, update this ADR

### Update Process

```bash
# 1. Check current versions
pnpm outdated

# 2. For each package, check this ADR's matrix
# 3. Update package.json respecting constraints
# 4. Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 5. Run full test suite
pnpm test
pnpm run lint

# 6. Update this ADR if constraints changed
```

> **Note**: Commands updated from `npm` to `pnpm` after the [package manager migration ADR](./202606-package-manager-pnpm.md).

### Red Flags 🚩

These scenarios require extra caution:

- **Major version changes** (e.g., v10 → v11)
- **ESM-only packages** when working with CommonJS code
- **Peer dependency conflicts** in pnpm install output
- **TypeScript version changes** (affects many packages)
- **Build tool changes** (Vite, Nx, Webpack)

## Current Constraints

| Scenario | Note |
|----------|------|
| ESLint v8/v9 install | Not supported. The `eslint` peer dependency is `>=10`; consumers must upgrade to v10 |
| ESLint v10 + legacy `.eslintrc.*` | Not supported. ESLint v10 only loads flat config; consumers must migrate to `eslint.config.*` |
| `eslint-plugin-import` on ESLint v10 (flat path) | Not supported. v2.32.0 still calls `SourceCode#getTokenOrCommentAfter`, removed in ESLint v10; the flat base uses `eslint-plugin-import-x` instead |
| `eslint-plugin-react` on ESLint v10 | Declared peer range may lag behind v10. Verify lint runs end to end after upgrades |

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

## References

- [TypeScript-ESLint Version Support](https://typescript-eslint.io/users/dependency-versions/)
- [ESLint v10 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [Nx and Vite Compatibility](https://nx.dev/recipes/vite)
- [Stylelint v16 Migration Guide](https://stylelint.io/migration-guide/to-16)
- [npm Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)

## Review Schedule

This ADR should be reviewed:
- **Monthly**: During dependency update cycles
- **Before Major Updates**: Always consult before major version changes
- **After Security Advisories**: When security patches affect these packages
- **When Constraints Change**: Update immediately when compatibility rules change

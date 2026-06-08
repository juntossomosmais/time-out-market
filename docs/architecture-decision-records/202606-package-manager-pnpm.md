# ADR: Migrate Package Manager from npm to pnpm

🗓️ 2026-06-02 · ✍️ [@felipefialho](https://twitter.com/felipefialho_)

## Status

Accepted

## Context

The repository used npm as package manager, with workspaces defined in `package.json` and a `package-lock.json` lockfile. CI installs required `npm ci --legacy-peer-deps --include=optional` to work around peer dependency conflicts (ESLint v10 not yet declared by `eslint-plugin-import` and `eslint-plugin-react`) and an npm bug with optional native dependencies.

pnpm offers faster installs, efficient disk usage via a content-addressable store with hard links, and a strict `node_modules` layout that prevents phantom dependencies (importing packages not declared in `package.json`).

## Decision Drivers

* **CI Performance**: Faster installs with built-in caching support in `actions/setup-node`
* **Disk Efficiency**: Hard links from a shared store instead of duplicated `node_modules`
* **Dependency Discipline**: Strict layout surfaces undeclared (phantom) dependencies
* **Peer Dependency Handling**: pnpm warns on unmet peers instead of failing, removing the need for `--legacy-peer-deps`
* **Optional Dependencies**: pnpm installs optional deps correctly by default, removing the need for `--include=optional`

## Decision

We migrated the repository to **pnpm v10**, pinned via the `packageManager` field (`pnpm@10.28.2`).

Key changes:

| Aspect | Before (npm) | After (pnpm) |
|--------|--------------|--------------|
| Lockfile | `package-lock.json` | `pnpm-lock.yaml` (generated with `pnpm import` to preserve resolved versions) |
| Workspaces | `workspaces` field in `package.json` | `pnpm-workspace.yaml` |
| Version overrides | `overrides` field in `package.json` | `overrides` in `pnpm-workspace.yaml` |
| CI install | `npm ci --legacy-peer-deps --include=optional` | `pnpm install --frozen-lockfile` |
| CI cache | Manual `actions/cache` on `~/.npm` | `cache: 'pnpm'` in `actions/setup-node` |
| Enforcement | `engines.yarn: "please-use-npm"` | `engines` + `preinstall: "npx only-allow pnpm"` |
| Publish | `npm publish` (via Nx targets) | Unchanged: `npm publish` works regardless of the installing package manager |

### Dependency Build Scripts

pnpm v10 ignores dependency lifecycle scripts by default. Only the following packages are allowed to run build scripts, via `onlyBuiltDependencies` in `pnpm-workspace.yaml`:

* `@parcel/watcher`
* `@swc/core`
* `nx`
* `unrs-resolver`

If a future dependency needs build scripts, pnpm will warn during install; review and add it to the list deliberately (use `pnpm approve-builds`).

## Consequences

### Positive

- **Faster CI**: Installs drop from minutes to seconds with a warm store
- **No peer dependency flags**: Unmet peers are warnings, tracked in the compatibility matrix ADR
- **Phantom dependency protection**: Workspace packages can only import what they declare
- **Single enforced toolchain**: `packageManager` field + `only-allow` prevent accidental npm/yarn usage

### Negative

- **Onboarding step**: Developers need pnpm installed (`corepack enable pnpm`)
- **Stricter resolution**: Undeclared dependencies that worked under npm hoisting will fail and must be declared explicitly

### Neutral

- **Publishing unchanged**: Nx publish targets still use `npm publish` against the GitHub Package Registry
- **`.npmrc` unchanged**: Registry and auth configuration is compatible with pnpm

## References

- [pnpm Motivation](https://pnpm.io/motivation)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [pnpm Settings (pnpm-workspace.yaml)](https://pnpm.io/settings)
- [ADR: Tooling Dependency Compatibility Matrix](./202605-tooling-dependency-compatibility.md)

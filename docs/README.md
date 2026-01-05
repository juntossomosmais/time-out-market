# Documentation

This directory contains project documentation including Architecture Decision Records (ADRs).

## Architecture Decision Records (ADRs)

ADRs document significant architectural and technical decisions made in this project. They help current and future team members understand why certain choices were made.

### Current ADRs

- [ADR 0001: Maintain ESLint v8](./architecture-decision-records/0001-maintain-eslint-v8.md) - Decision to stay on ESLint v8 for stability
- [ADR 0002: Tooling Dependency Compatibility Matrix](./architecture-decision-records/0002-tooling-dependency-compatibility.md) - Version constraints and compatibility rules

### Creating a New ADR

When making significant technical decisions, create a new ADR:

1. Create a new file in `architecture-decision-records/` with the format: `XXXX-short-title.md`
2. Use the next sequential number (0002, 0003, etc.)
3. Follow the structure:
   - **Title**: ADR XXXX: Descriptive Title
   - **Date and Author**: 🗓️ YYYY-MM-DD · ✍️ [@author](link)
   - **Context**: What is the issue we're facing?
   - **Decision Drivers**: What factors influenced the decision?
   - **Decision**: What did we decide to do?
   - **Consequences**: What are the positive, negative, and neutral outcomes?
   - **References**: Links to relevant resources
   - **Review Schedule** (if applicable): When should this be revisited?

### What Warrants an ADR?

Create an ADR for decisions that:
- Affect project architecture or structure
- Introduce or remove major dependencies
- Establish coding standards or conventions
- Have long-term maintenance implications
- Require significant migration effort
- Impact developer workflow
- Need to be communicated to the entire team

### Updating ADRs

ADRs are historical records and should not be modified after creation. If a decision needs to change:
1. Create a new ADR that supersedes the old one
2. Reference the old ADR in the new one
3. Update the old ADR with a note pointing to the superseding ADR

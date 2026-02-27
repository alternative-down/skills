# Firm App Skill

Query and manage the Firm workspace at `/firm` using provided scripts.

Firm is a text-based work management system. For detailed documentation on Firm concepts, commands, and workflows, see `/firm/AGENTS.md`.

## Quick Reference

### Query Scripts

#### `list-all.sh`
List all entities of a given type.

```bash
./scripts/queries/list-all.sh <entity-type>
```

Examples:
```bash
./scripts/queries/list-all.sh task
./scripts/queries/list-all.sh project
./scripts/queries/list-all.sh person
```

#### `query.sh`
Execute a Firm query with filtering, sorting, and aggregation.

```bash
./scripts/queries/query.sh '<query>'
```

Examples:
```bash
./scripts/queries/query.sh 'from task | where is_completed == false'
./scripts/queries/query.sh 'from project | where status == "active" | count'
./scripts/queries/query.sh 'from person | related task | count'
```

### Workflow Scripts

#### `add-entity.sh`
Create a new entity and commit changes to Git.

```bash
./scripts/workflows/add-entity.sh --type <type> --id <id> --field <name> "<value>"
```

Example:
```bash
./scripts/workflows/add-entity.sh --type task --id my_task --field name "My Task"
```

#### `commit-push.sh`
Commit and push changes in the Firm workspace.

```bash
./scripts/workflows/commit-push.sh "<commit-message>"
```

Example:
```bash
./scripts/workflows/commit-push.sh "feat: update project status"
```

## Workspace Location

All scripts operate on the shared Firm workspace at `/firm`.

Changes are automatically committed and pushed to the `alternative-down/firm` repository.

## For More Information

See `/firm/AGENTS.md` for:
- Complete Firm CLI reference
- Query language syntax and examples
- Schema definitions and customization
- Business relationship modeling
- Integration best practices

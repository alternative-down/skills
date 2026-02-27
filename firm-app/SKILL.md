# Firm App Skill

Manage work, organizations, projects, and tasks using Firm—a text-based business management system.

## What is Firm?

Firm is a plain-text work management system designed for technologists. Your entire business is represented as `.firm` files stored in a Git-versioned workspace. Everything is:

- **Version controlled**: Track all changes via Git
- **Structured**: Define relationships between entities (organizations → projects → tasks)
- **Queryable**: Search and filter data with Firm's CLI
- **AI-ready**: LLMs can read, write, and query your data natively
- **Yours**: No SaaS lock-in; you own your files and tools

## Workspace Location

The Firm workspace lives in `/firm` on the host. This is a shared workspace for all agents.

## Core Concepts

### Entities
Business objects defined in `.firm` files. Examples:
- `organization` - Companies, teams, clients
- `person` - Team members, contacts
- `project` - Work initiatives
- `task` - Individual work items
- Custom types you define

Entities are stored as plain text:
```
person jane_doe {
  name = "Jane Doe"
  email = "jane@example.com"
}
```

### Schemas
Define the structure of entity types (required/optional fields, types):
```
schema task {
  field {
    name = "name"
    type = "string"
    required = true
  }
  field {
    name = "is_completed"
    type = "boolean"
    required = false
  }
}
```

### Relationships
Connect entities using `reference` fields:
```
task my_task {
  name = "Implement feature"
  assignee_ref = person.jane_doe
  project_ref = project.website_redesign
}
```

### Field Types
- `string` - Text
- `boolean` - True/false
- `integer`, `float` - Numbers
- `currency` - Monetary values (e.g., `5000.00 USD`)
- `datetime` - Date and time (e.g., `2025-01-15 at 09:00 UTC`)
- `reference` - Links to other entities
- `list` - Arrays of values
- `enum` - Enumerated values with allowed options
- `path` - File paths

## CLI Commands

### Initialize workspace
```bash
firm init
```
(Interactive setup with default schemas)

### Add entities
Interactive:
```bash
firm add
```

Non-interactive:
```bash
firm add --type task --id my_task --field name "My Task"
```

### View entities
Get a single entity:
```bash
firm get person jane_doe
```

List all of a type:
```bash
firm list task
```

### Query data
Find incomplete tasks:
```bash
firm query 'from task | where is_completed == false'
```

Find tasks assigned to Jane:
```bash
firm query 'from task | where assignee_ref == person.jane_doe'
```

Complex query (tasks for active projects, sorted by due date):
```bash
firm query 'from project | where status == "active" | related(2) task | order due_date | limit 10'
```

Query operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`

Aggregations: `count`, `sum`, `average`, `median`, `select @id, name, ...`

### Related entities
Show all entities connected to one:
```bash
firm related organization acme_corp
```

## File Organization

The Firm workspace is just a directory with `.firm` files. Organize however you like:

```
/firm/
├── .gitignore
├── .git/
├── organizations.firm      # All orgs
├── people.firm             # All people
├── projects/
│   ├── project_a.firm
│   └── project_b.firm
└── tasks/
    ├── sprint_1.firm
    └── sprint_2.firm
```

Firm recursively discovers all `.firm` files in the workspace.

## Git Workflow

**Always commit after making changes:**

```bash
cd /firm
firm add --type task --id new_task ...
git add .
git commit -m "feat: add new task for project X"
git push
```

This ensures all agents have the latest state and changes are auditable.

## For Agents

1. **Read data**: `firm list project` or `firm query '...'`
2. **Make changes**: `firm add` or edit `.firm` files directly
3. **Commit**: `git add . && git commit -m "..."` and `git push`
4. **Query context**: Use `firm query` to understand business state before acting

## Examples

### Daily standup report
```bash
firm query 'from task | where is_completed == false | select @id, name, assignee_ref'
```

### Find all open projects for a client
```bash
firm query 'from organization | where name == "Acme Corp" | related project | where status == "active"'
```

### Summarize effort allocation
```bash
firm query 'from person | related task | count'
```

### Create a sprint
```bash
firm add --type sprint \
  --id sprint_42 \
  --field start_date "2025-02-27" \
  --field end_date "2025-03-13" \
  --field status "planning"
git add . && git commit -m "feat: create sprint 42"
```

## Resources

- **Docs**: https://firm.42futures.com/
- **GitHub**: https://github.com/42futures/firm
- **DSL Reference**: https://firm.42futures.com/reference/dsl-reference.html
- **Query Syntax**: https://firm.42futures.com/guide/querying.html

## Integration with OpenClaw

All agents have access to:
- `/firm` workspace (shared, version-controlled)
- `firm` CLI (installed globally)
- This skill for reference

Agents are expected to:
1. Query Firm to understand business context
2. Make changes via `firm add` or direct .firm file edits
3. Commit and push changes to GitHub after every modification
4. Use Firm query language to extract data for reporting/analysis

## Notes

- Firm graph files (`.firm-graph*`) are excluded from Git
- Customize schemas in `.firm` files to match your business structure
- Relationships are the heart of Firm—link everything together

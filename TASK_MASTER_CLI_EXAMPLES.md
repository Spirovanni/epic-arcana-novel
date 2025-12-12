# Task Master CLI Usage Examples

## Quick Reference

**Remember:** Use `task-master` (not `task-master-ai`) for all CLI commands!

```bash
# ✅ CORRECT
npx task-master <command>

# ❌ WRONG
npx task-master-ai <command>  # This starts MCP server!
```

---

## Basic Task Management

### View All Tasks

```bash
# List all tasks with status overview
npx task-master list

# List only pending tasks
npx task-master list --status=pending

# List with subtasks included
npx task-master list --with-subtasks

# List only high priority tasks
npx task-master list --status=pending | grep "high"
```

### Get Next Task to Work On

```bash
# Show the next available task (respects dependencies)
npx task-master next

# This shows:
# - Task details
# - Implementation instructions
# - Dependencies status
# - Suggested actions
```

### View Specific Task

```bash
# View task by ID
npx task-master show 5

# View subtask (use dot notation)
npx task-master show 1.2

# View with full details
npx task-master show 8 --verbose
```

### Update Task Status

```bash
# Mark task as in-progress
npx task-master set-status --id=5 --status=in-progress

# Mark task as done
npx task-master set-status --id=5 --status=done

# Mark multiple tasks at once
npx task-master set-status --id=5,6,7 --status=done

# Mark subtask as done
npx task-master set-status --id=1.2 --status=done
```

---

## Task Creation & Modification

### Add New Task

```bash
# Add a simple task
npx task-master add-task --prompt="Implement Trionfi deck builder UI"

# Add task with priority
npx task-master add-task --prompt="Add Stripe payment integration" --priority=high

# Add task with dependencies
npx task-master add-task --prompt="Create lore codex search" --dependencies=8,9 --priority=medium

# Add task with research (uses research model)
npx task-master add-task --prompt="Design timeline paradox detection algorithm" --research
```

### Break Down Complex Tasks

```bash
# Expand a task into subtasks
npx task-master expand --id=5

# Expand with specific number of subtasks
npx task-master expand --id=5 --num=8

# Expand with research (more informed breakdown)
npx task-master expand --id=5 --research

# Force replace existing subtasks
npx task-master expand --id=5 --force

# Expand with additional context
npx task-master expand --id=5 --prompt="Focus on ReactFlow integration and paradox detection"
```

### Update Tasks

```bash
# Update a specific task
npx task-master update-task --id=5 --prompt="Changed approach: Using Drizzle ORM instead of Prisma"

# Update multiple future tasks (from task ID onwards)
npx task-master update --from=10 --prompt="Switching to NeonDB instead of Supabase for all database operations"

# Update with research
npx task-master update-task --id=8 --prompt="Add support for MDX rendering in lore entries" --research
```

### Add Subtasks

```bash
# Add subtask to existing task
npx task-master add-subtask --parent=5 --title="Create database migration" --description="Set up timelines table schema"

# Add subtask with dependencies
npx task-master add-subtask --parent=5 --title="Add ReactFlow visualization" --dependencies=5.1

# Convert existing task to subtask
npx task-master add-subtask --parent=5 --task-id=12
```

### Update Subtask Notes

```bash
# Add implementation notes to subtask (appends, doesn't replace)
npx task-master update-subtask --id=5.2 --prompt="Found that ReactFlow requires custom node types for timeline events. Need to create TimelineNode component."

# Add research-backed notes
npx task-master update-subtask --id=5.2 --prompt="Researching paradox detection algorithms" --research
```

---

## Dependency Management

### Add Dependencies

```bash
# Make task 10 depend on task 5
npx task-master add-dependency --id=10 --depends-on=5

# Make task depend on multiple tasks
npx task-master add-dependency --id=15 --depends-on=5,8,12
```

### Remove Dependencies

```bash
# Remove a dependency
npx task-master remove-dependency --id=10 --depends-on=5
```

### Validate Dependencies

```bash
# Check for dependency issues (circular refs, missing tasks)
npx task-master validate-dependencies

# Auto-fix dependency issues
npx task-master fix-dependencies
```

---

## Task Organization

### Move Tasks

```bash
# Move task 5 to become subtask of task 7
npx task-master move --from=5 --to=7

# Move subtask 5.2 to become subtask 7.3
npx task-master move --from=5.2 --to=7.3

# Move subtask to top level
npx task-master move --from=5.2 --to=25

# Move multiple tasks
npx task-master move --from=10,11,12 --to=16,17,18
```

### Remove Tasks

```bash
# Remove a task (with confirmation)
npx task-master remove-task --id=5

# Remove without confirmation
npx task-master remove-task --id=5 --yes

# Remove subtask
npx task-master remove-subtask --id=5.2

# Remove subtask but convert to top-level task
npx task-master remove-subtask --id=5.2 --convert
```

### Clear Subtasks

```bash
# Clear all subtasks from a task
npx task-master clear-subtasks --id=5

# Clear subtasks from multiple tasks
npx task-master clear-subtasks --id=5,8,12

# Clear all subtasks from all tasks
npx task-master clear-subtasks --all
```

---

## Project Analysis

### Analyze Task Complexity

```bash
# Analyze all tasks for complexity
npx task-master analyze-complexity

# Analyze with research (more accurate)
npx task-master analyze-complexity --research

# Set complexity threshold (tasks scoring 7+ will be flagged)
npx task-master analyze-complexity --threshold=7
```

### View Complexity Report

```bash
# Display the complexity analysis report
npx task-master complexity-report

# View report from specific file
npx task-master complexity-report --file=.taskmaster/reports/task-complexity-report.json
```

---

## Configuration

### Manage AI Models

```bash
# View current model configuration
npx task-master models

# Set main model
npx task-master models --set-main=claude-sonnet-4-20250514

# Set research model
npx task-master models --set-research=sonar-pro

# Set fallback model
npx task-master models --set-fallback=gpt-4o

# Interactive setup
npx task-master models --setup

# Set custom Ollama model
npx task-master models --set-main=llama3.2 --ollama

# Set custom OpenRouter model
npx task-master models --set-main=anthropic/claude-3.5-sonnet --openrouter
```

---

## Project Initialization

### Initialize New Project

```bash
# Initialize with defaults
npx task-master init --yes

# Initialize with custom settings
npx task-master init --name="Epic Arcana Novel" --description="Interactive novel platform" --version="1.0.0"
```

### Parse PRD to Generate Tasks

```bash
# Parse PRD file
npx task-master parse-prd .taskmaster/docs/prd.txt

# Parse with specific number of tasks
npx task-master parse-prd .taskmaster/docs/prd.txt --num-tasks=20

# Parse with research (more informed task generation)
npx task-master parse-prd .taskmaster/docs/prd.txt --research

# Force overwrite existing tasks
npx task-master parse-prd .taskmaster/docs/prd.txt --force
```

---

## File Management

### Generate Task Files

```bash
# Generate markdown files for each task
npx task-master generate

# Generate to specific directory
npx task-master generate --output=docs/tasks
```

---

## Real-World Workflow Examples

### Starting a New Feature

```bash
# 1. See what's next
npx task-master next

# 2. Mark as in-progress
npx task-master set-status --id=5 --status=in-progress

# 3. Break down if complex
npx task-master expand --id=5 --research

# 4. Work on subtasks, update as you go
npx task-master update-subtask --id=5.1 --prompt="Completed database schema design"
npx task-master set-status --id=5.1 --status=done

# 5. Mark main task as done when complete
npx task-master set-status --id=5 --status=done
```

### Handling Implementation Changes

```bash
# You discover you need to change approach mid-project
npx task-master update --from=10 --prompt="Switching from Supabase to NeonDB. Update all database-related tasks to use Drizzle ORM with Neon."
```

### Adding Discovered Work

```bash
# You find a new requirement while working
npx task-master add-task --prompt="Add rate limiting to AI API endpoints" --priority=high --dependencies=61
```

### Reviewing Progress

```bash
# Check overall progress
npx task-master list

# See what's blocking
npx task-master list --status=blocked

# See what's ready to work on
npx task-master next
```

---

## Tips & Best Practices

1. **Always use `task-master` not `task-master-ai`**
   ```bash
   # ✅ Good
   npx task-master list
   
   # ❌ Bad
   npx task-master-ai list
   ```

2. **Use `--research` flag for complex tasks** - Gets better AI analysis
   ```bash
   npx task-master expand --id=5 --research
   ```

3. **Update subtasks as you work** - Log your progress
   ```bash
   npx task-master update-subtask --id=5.2 --prompt="Found issue with ReactFlow nodes..."
   ```

4. **Check dependencies before starting** - Make sure prerequisites are done
   ```bash
   npx task-master show 10  # Shows dependencies
   ```

5. **Use `next` command regularly** - It respects dependencies and priorities
   ```bash
   npx task-master next
   ```

---

## Getting Help

```bash
# Show help for any command
npx task-master --help
npx task-master list --help
npx task-master add-task --help
```

---

## Common Commands Cheat Sheet

```bash
# Daily workflow
npx task-master next                    # What to work on
npx task-master list                    # See all tasks
npx task-master show <id>               # Task details
npx task-master set-status --id=<id> --status=done

# Task creation
npx task-master add-task --prompt="..." --priority=high
npx task-master expand --id=<id> --research

# Updates
npx task-master update-subtask --id=<id> --prompt="..."
npx task-master update-task --id=<id> --prompt="..."

# Dependencies
npx task-master add-dependency --id=<id> --depends-on=<id>
npx task-master validate-dependencies
```


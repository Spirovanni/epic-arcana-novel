# Task Master CLI Issue - Resolution

## Problem Identified

The `task-master-ai` command was starting an MCP server instead of running in CLI mode, causing it to hang waiting for a client connection.

## Root Cause

In `node_modules/task-master-ai/package.json`, the binary mappings are:

```json
"bin": {
    "task-master": "dist/task-master.js",        // ✅ CLI (correct)
    "task-master-mcp": "dist/mcp-server.js",     // ✅ MCP server (correct)
    "task-master-ai": "dist/mcp-server.js"       // ❌ WRONG - points to MCP server!
}
```

The `task-master-ai` command is incorrectly mapped to the MCP server instead of the CLI.

## Solution

**Use `task-master` instead of `task-master-ai` for CLI commands.**

### Correct Usage:

```bash
# ✅ CORRECT - Use task-master (without -ai)
npx task-master list
npx task-master next
npx task-master show <id>
npx task-master add-task --prompt="..."

# ✅ Also works with global installation
task-master list
task-master next

# ✅ Direct node execution also works
node node_modules/task-master-ai/dist/task-master.js list
```

### Incorrect Usage:

```bash
# ❌ WRONG - task-master-ai starts MCP server
npx task-master-ai list  # This starts MCP server, not CLI!
```

## Verification

All of the following work correctly:
- ✅ `npx task-master list` - Shows task dashboard
- ✅ `task-master list` (global install) - Shows task dashboard  
- ✅ `node node_modules/task-master-ai/dist/task-master.js list` - Direct execution works

## Documentation

According to the official README (`README-task-master.md`), the correct command is `task-master`:
- Installation: `npm install -g task-master-ai`
- Usage: `task-master init`, `task-master list`, `task-master next`, etc.

## Status

✅ **RESOLVED** - The CLI works perfectly when using the correct command name `task-master`.

## Recommendation

1. **Use `task-master` for all CLI operations** (not `task-master-ai`)
2. The MCP tools in Cursor continue to work perfectly and are the recommended approach
3. This appears to be a packaging issue in task-master-ai v0.37.2 where `task-master-ai` binary incorrectly points to the MCP server

## Alternative: Use MCP Tools

Since you're in Cursor, the MCP tools are the recommended approach and work perfectly:
- `mcp_taskmaster-ai_get_tasks` - List tasks
- `mcp_taskmaster-ai_next_task` - Get next task
- `mcp_taskmaster-ai_set_task_status` - Update status
- And many more...

The MCP tools provide better integration, structured data, and error handling compared to CLI parsing.


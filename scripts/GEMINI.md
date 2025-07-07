# Gemini Context: scripts

This directory contains Node.js scripts for various development and administrative tasks.

## Scripts

-   `seed-lore.mjs`: Seeds the database with the lore data from the `lore/` directory.
-   `test-db-connection.ts`: A script to test the connection to the database.

## Guidelines

-   **Running Scripts:** Use `node --loader ts-node/esm scripts/<script-name>` to run TypeScript scripts. For `.mjs` files, you can use `node scripts/<script-name>`.
-   **Creating Scripts:** When creating new scripts, follow the existing style and conventions. Use TypeScript if the script requires database access or other typed code.

# Gemini Context: src

This directory contains all the source code for the Next.js application.

## Structure

-   `app/`: Contains the pages and API routes for the application, following the Next.js App Router conventions.
-   `components/`: Contains reusable React components.
-   `lib/`: Contains library code, such as database connection utilities and the database schema.
-   `types/`: Contains TypeScript type definitions.

## Guidelines

-   **Component-Based Architecture:** Build the UI using reusable components.
-   **Styling:** Use Tailwind CSS for styling. Avoid writing custom CSS files when possible.
-   **State Management:** For simple state, use React's built-in hooks (`useState`, `useContext`). For more complex state, consider using a library like Zustand or Jotai, but check for existing patterns first.
-   **API Routes:** API routes are located in `src/app/api`. Follow the Next.js conventions for creating API routes.

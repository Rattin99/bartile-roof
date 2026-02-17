# Bartile Roof Configurator

A modern roof tile configurator application built with Next.js, React, TailwindCSS, and Three.js.

## Tech Stack

*   **Frontend:** Next.js 14+ (App Router), React, TailwindCSS, Shadcn UI, Three.js (via @react-three/fiber or raw Three.js)
*   **Backend:** Next.js API Routes
*   **Database:** PostgreSQL (managed via Prisma ORM)
*   **State Management:** React Query, Zustand (or Context)

## Getting Started

### Prerequisites

*   Node.js 18+
*   PostgreSQL Database (local or cloud like Supabase/Vercel Postgres)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repo-url>
    cd bartile-roof
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up the database:
    *   Create a `.env` file in the root directory:
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/bartile?schema=public"
        ```
    *   Run migrations to create the database schema:
        ```bash
        npx prisma migrate dev --name init
        ```
    *   Seed the database with initial data (profiles, colors, textures):
        ```bash
        npm run seed
        ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

*   `src/app`: Next.js App Router pages and API routes.
*   `src/components`: Reusable UI components.
*   `src/lib`: Utility functions and contexts.
*   `src/views`: Legacy page components (migrated to `src/app`).
*   `prisma`: Database schema and seed script.
*   `public`: Static assets (3D models, images).

## Admin Dashboard

Access the admin dashboard at `/admin` to manage:
*   Tile Profiles (upload 3D models)
*   Colors
*   Textures
*   House Previews
*   Quote Requests

## Deployment

This project is ready for deployment on Vercel.
1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add the `DATABASE_URL` environment variable.
4.  Deploy.

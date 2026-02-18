# Project Roadmap: Bartile Roof Designer

This document outlines the project status based on `Bartile Roof Designer Requirements.docx`.

## ✅ Completed Tasks

### 1. Frontend (User Experience)
*   **[x] Layout Options with Thumbnails:** 
    *   `OptionSelector.jsx` now fetches `LayoutOption` entities.
    *   Added support for thumbnail images in option buttons.
*   **[x] Smart House Visualizer (Preview Panel):**
    *   `PreviewPanel.jsx` queries `HousePreview` entities.
    *   Implemented filtering logic to match Profile/Color/Texture.
    *   Added "Simulated Preview" overlay when exact matches aren't found.
*   **[x] 3D Viewer Refinement:**
    *   Refined `TileViewer3D.jsx` with centered geometries.
    *   Fixed horizontal rotation direction.
    *   Added auto-rotate toggle with manual override.
*   **[x] Dynamic Asset Loading:**
    *   All selectors (`Profile`, `Color`, `Texture`) now use dynamic paths (`icon_asset_path`, `hex_code`, `thumbnail_asset_path`) from the API.

### 2. Backend (Functionality)
*   **[x] Real File Uploads:**
    *   Implemented `/api/upload` route for handling multi-part form data.
    *   Integrated file upload into the Quote Request modal.
    *   Updated `base44Client` adapter to use the local upload endpoint.
*   **[x] Quote Request Handling:**
    *   Implemented `/api/entities/quoterequest` to save quotes to the database.
    *   Added structure for email notifications (currently logging to console).

### 3. Infrastructure
*   **[x] Database Setup:**
    *   Upgraded to Prisma v7 with `pg` adapter.
    *   Refactored `schema.prisma` and `seed.js` for compatibility.
    *   Created shared `src/lib/prisma.js` client.

---

## 🚧 Pending / In Progress

### 1. Backend & Security
*   **[ ] Production Authentication:**
    *   Current: Mock auth (`/api/auth/me` returns a static admin user).
    *   Todo: Integrate Supabase Auth, NextAuth.js, or Clerk for real admin security.
*   **[ ] Email Service Integration:**
    *   Current: Logs quote details to the server console.
    *   Todo: Connect Resend, SendGrid, or Nodemailer to send actual emails to sales@bartile.com.

### 2. Content & Data Management
*   **[ ] Database Seeding Execution:**
    *   Current: Scripts are written but local DB connection needs troubleshooting (Port 5432/51213).
    *   Todo: Successfully run `npm run seed` to populate initial profiles and colors.
*   **[ ] Content Population:**
    *   Todo: Use the Admin Dashboard (`/admin`) to:
        *   Upload real 3D models (STL files) for each profile.
        *   Upload real texture thumbnails.
        *   Upload and tag House Preview images.
*   **[ ] Admin UI Refinement:**
    *   Todo: Integrate the file uploader into the Admin forms (Houses, Profiles) so admins don't have to manually paste URLs.

## 📝 Notes
*   **Database:** The project is configured for a local PostgreSQL instance. Ensure the database is running and `DATABASE_URL` is correct in `.env`.
*   **File Storage:** Currently using local disk storage (`public/uploads`). For production (Vercel), switch to Vercel Blob or AWS S3.

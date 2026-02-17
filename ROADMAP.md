# Project Roadmap: Bartile Roof Designer

This document outlines the remaining tasks for both Frontend and Backend, based on the requirements from `Bartile Roof Designer Requirements.docx` and the current Next.js migration status.

## 1. Frontend Tasks (User Experience)

### **A. Layout Options with Thumbnails**
*   **Requirement:** Show "Standard" vs "Cottage/Stagger" layout options with visual thumbnails.
*   **Action:** 
    *   Update `OptionSelector.jsx` to fetch dynamic `LayoutOption` entities from the API.
    *   Implement thumbnail rendering for these options (replacing simple text buttons).

### **B. Smart House Visualizer (Preview Panel)**
*   **Requirement:** Display house photos that match the user's current selection (Tags matching). If no match exists, show "Photo not available".
*   **Action:**
    *   Update `PreviewPanel.jsx` to query `HousePreview` entities from the database.
    *   Implement filtering logic to find a house image that matches the selected `profile_id`, `color_id`, and `texture_id`.

### **C. 3D Viewer Refinement**
*   **Requirement:** 
    *   Center of mass alignment (fixing axis/origin).
    *   Intuitive horizontal rotation (drag left-right rotates left-right).
    *   Auto-rotate toggle behavior (starts on, toggles off on manual interaction).
*   **Action:** Refine `TileViewer3D.jsx` Three.js camera/control logic.

### **D. Dynamic Asset Loading**
*   **Requirement:** Replace hardcoded thumbnails/models with dynamic paths from the database.
*   **Action:** Ensure `ProfileSelector.jsx`, `ColorPicker.jsx`, and `TextureSelector.jsx` use the `asset_path` fields from the API responses.

---

## 2. Backend Tasks (Functionality)

### **A. Real File Uploads**
*   **Requirement:** Users must be able to upload roof plans (PDF/Images) during the Quote Request.
*   **Action:**
    *   Create a Next.js API route (`app/api/upload/route.js`).
    *   Integrate with a storage provider (Vercel Blob, Supabase Storage, or AWS S3).
    *   Update the `base44` shim in `src/api/base44Client.js` to point to this real endpoint.

### **B. Email Notification System**
*   **Requirement:** Admins should be notified when a new quote is submitted.
*   **Action:**
    *   Update `app/api/entities/quoterequest/route.js` (POST method).
    *   Integrate an email service (Resend, Nodemailer, or SendGrid).
    *   Send a summary of the configuration and a link to the uploaded plan to the Bartile team.

### **C. Production Authentication**
*   **Requirement:** Secure the Admin panel.
*   **Action:**
    *   Replace the mock `api/auth/me` with a real provider (e.g., Supabase Auth or NextAuth.js).
    *   Implement a login page for administrators.

---

## 3. Data & Content Management

### **A. Database Seeding & Migration**
*   **Action:**
    *   Run initial migrations: `npx prisma migrate dev`.
    *   Execute `npm run seed` to populate initial data.
    *   Collect correct icon paths and 3D model paths from Joe/Bartile team and update the database via the new Admin UI.

### **B. House Preview Tagging**
*   **Action:** Use the Admin UI (`/admin/houses`) to upload house photos and tag them with the specific combinations of Profile/Color/Texture they represent.

# Bartile Roof Designer - Backend Design

Based on the requirements analysis and the current Base44 implementation, this document outlines the necessary backend architecture.

## 1. Database Schema (Entities)

The application utilizes Base44 Entities for data storage.

### Core Configuration Entities
These entities drive the configurator options.

**1. TileProfile**
*   **Purpose:** Defines the 3D shapes/models available.
*   **Fields:**
    *   `name` (Text): Display name (e.g., "Legendary Slate").
    *   `description` (Text): Marketing copy.
    *   `model_asset_path` (Text): Path to the 3D model file (STL/GLB) in storage.
    *   `icon_asset_path` (Text): Path to the UI thumbnail.
    *   `sort_order` (Number): For UI ordering.
    *   `is_active` (Boolean): specific visibility toggle.

**2. TileColor**
*   **Purpose:** Defines the available color palette.
*   **Fields:**
    *   `name` (Text): Display name (e.g., "Charcoal").
    *   `hex_code` (Text): CSS hex color for UI preview and 3D tinting (e.g., "#333333").
    *   `is_standard` (Boolean): Distinguishes between standard (8) and custom colors.
    *   `sort_order` (Number).

**3. TileTexture**
*   **Purpose:** Defines surface finishes (PBR maps).
*   **Fields:**
    *   `name` (Text): Display name (e.g., "Swirl Brush").
    *   `map_asset_path` (Text): Path to the normal/bump map or texture image.
    *   `thumbnail_asset_path` (Text): UI thumbnail.
    *   `sort_order` (Number).

**4. LayoutOption** (New Requirement)
*   **Purpose:** Defines installation layouts.
*   **Fields:**
    *   `name` (Text): "Standard", "Staggered/Cottage".
    *   `thumbnail_asset_path` (Text): Visual representation of the layout.
    *   `sort_order` (Number).

**5. HousePreview**
*   **Purpose:** Stores pre-rendered house photos for the "Visualizer" aspect (distinct from the 3D tile viewer).
*   **Fields:**
    *   `image_url` (Text): The photo.
    *   `profile_id` (Reference -> TileProfile): Links to the specific tile profile shown.
    *   `color_id` (Reference -> TileColor): Links to the color shown.
    *   `texture_id` (Reference -> TileTexture): Optional link to texture.
    *   `tags` (List<Text>): For flexible filtering if specific IDs aren't enough.

### Business Entities

**6. QuoteRequest**
*   **Purpose:** Captures lead information and project details.
*   **Fields:**
    *   `contact_name` (Text).
    *   `contact_email` (Text).
    *   `contact_phone` (Text).
    *   `project_address` (Text).
    *   `estimated_squares` (Number): Size of the roof.
    *   `plan_file_path` (Text): Path to the uploaded roof plan (PDF/Image) in private storage.
    *   `configuration_snapshot` (JSON): Stores the user's selected Profile, Color, Texture, Layout, etc., at the time of request.
    *   `status` (Text): 'New', 'Processing', 'Completed', 'Archived'.
    *   `created_at` (DateTime).

## 2. Storage Buckets

**1. `public-assets`**
*   **Access:** Public Read.
*   **Content:**
    *   3D Models (`.stl`, `.glb`).
    *   Texture Maps (`.jpg`, `.png`).
    *   UI Icons/Thumbnails.
    *   House Preview Photos.

**2. `quote-uploads`**
*   **Access:** Authenticated Read (Admin only), Public Write (via signed URL or function).
*   **Content:** User-uploaded roof plans/blueprints.

## 3. API Functions & Integrations

**1. `submitQuote`**
*   **Trigger:** User clicks "Submit Quote".
*   **Logic:**
    1.  Validates input data.
    2.  Handles file upload for roof plans (if provided).
    3.  Creates a `QuoteRequest` entity record.
    4.  **Integration:** Triggers an email notification to the Admin team with the quote details and a link to the uploaded plan.

**2. `getAppConfig`** (Optional optimization)
*   **Trigger:** App Load.
*   **Logic:** Returns a consolidated JSON object of all active Profiles, Colors, Textures, and Layouts to reduce network requests.

**3. `Admin Operations`**
*   Standard Base44 CRUD operations are used for the Admin Panel to manage the `Tile*` entities.

## 4. Security & Permissions

*   **Public Access:**
    *   Read access to `TileProfile`, `TileColor`, `TileTexture`, `LayoutOption`, `HousePreview`.
    *   Create access to `QuoteRequest`.
*   **Admin Access:**
    *   Full CRUD on all entities.
    *   Read access to `quote-uploads`.

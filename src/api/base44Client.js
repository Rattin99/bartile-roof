import { createClient } from "@base44/sdk";
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6941d89e14113f3a99197a3c",
  requiresAuth: false, // Ensure authentication is required for all operations
});

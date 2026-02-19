// base44Client.js - Adapter Layer for Migration

import { createClient } from '@/lib/supabase';

// Helper function for fetching from our new Next.js API
const fetchApi = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    cache: 'no-store', // Disable caching for all API calls
  });
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorBody = await res.json();
      if (errorBody.error) errorMessage = errorBody.error;
    } catch (e) {
      // Ignore JSON parse error, fallback to statusText
    }
    throw new Error(`API Error: ${errorMessage}`);
  }
  return res.json();
};

const supabase = createClient();

export const base44 = {
  auth: {
    me: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Not authenticated');
      // Map Supabase user to expected format if needed
      return {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'admin' // Default to admin for initial setup
      };
    },
    login: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.reload(); 
    },
    logout: async () => {
      await supabase.auth.signOut();
      window.location.href = '/login';
    },
    redirectToLogin: () => {
      window.location.href = '/login';
    }
  },
  
  entities: {
    // Generic Entity Handler
    _createHandler: (entityName) => ({
      list: async (sort = 'sort_order') => {
        // Query param sort handling could be added to API later
        const data = await fetchApi(`/api/entities/${entityName}`);
        return data.results || [];
      },
      create: async (data) => {
        return fetchApi(`/api/entities/${entityName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      },
      update: async (id, data) => {
        return fetchApi(`/api/entities/${entityName}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      },
      delete: async (id) => {
        return fetchApi(`/api/entities/${entityName}/${id}`, {
          method: 'DELETE'
        });
      }
    }),
    
    // Define specific entities using the handler
    get TileProfile() { return this._createHandler('tileprofile'); },
    get TileColor() { return this._createHandler('tilecolor'); },
    get TileTexture() { return this._createHandler('tiletexture'); },
    get HousePreview() { return this._createHandler('housepreview'); },
    get QuoteRequest() { return this._createHandler('quoterequest'); },
    get LayoutOption() { return this._createHandler('layoutoption'); },
  },
  
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
      },
      // Mock other integrations as no-ops or logs
      InvokeLLM: async () => {},
      SendEmail: async () => {},
      SendSMS: async () => {},
      GenerateImage: async () => {},
      ExtractDataFromUploadedFile: async () => {},
      CreateFileSignedUrl: async () => {},
      UploadPrivateFile: async () => {}
    }
  },
  
  appLogs: {
      logUserInApp: async (pageName) => {
          console.log(`[Analytics] User visited: ${pageName}`);
      }
  }
};

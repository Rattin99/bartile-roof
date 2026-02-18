// base44Client.js - Adapter Layer for Migration

// Helper function for fetching from our new Next.js API
const fetchApi = async (url, options = {}) => {
  const res = await fetch(url, options);
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

export const base44 = {
  auth: {
    me: async () => {
      // Call our mock auth endpoint
      return fetchApi('/api/auth/me');
    },
    login: async () => {
      console.log('Login called - implementing mock login');
      // Redirect or handle login flow
      window.location.reload(); 
    },
    logout: async () => {
      console.log('Logout called');
      // In a real app, clear cookies/tokens
      window.location.reload();
    },
    redirectToLogin: () => {
      console.log('Redirect to login called');
      // window.location.href = '/login'; // Or just let them proceed as mock admin
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

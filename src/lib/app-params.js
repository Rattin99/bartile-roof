// app-params.js - Simplified for Next.js Migration

const isNode = typeof window === 'undefined';

export const appParams = {
  appId: 'local-app',
  serverUrl: '/api', // Using local Next.js API routes
  token: null,
  functionsVersion: 'v1',
  fromUrl: isNode ? '' : window.location.href
};

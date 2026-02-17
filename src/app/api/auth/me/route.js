import { NextResponse } from 'next/server';

export async function GET() {
  // Mock Auth - Return a user object to bypass auth checks for now
  // In a real app, integrate Supabase Auth or NextAuth.js here
  return NextResponse.json({
    id: 'mock-admin-id',
    email: 'admin@bartile.com',
    role: 'admin', // Ensuring admin access
  });
}

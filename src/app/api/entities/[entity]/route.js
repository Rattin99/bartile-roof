import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  const { entity } = await params;
  const entityName = entity; // e.g., 'tileprofile'
  
  // Map URL param to Prisma model name (PascalCase)
  const modelName = mapEntityToModel(entityName);
  
  if (!modelName || !prisma[modelName]) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }

  try {
    // Basic listing, maybe add sorting query params later
    const data = await prisma[modelName].findMany({
        orderBy: { sort_order: 'asc' } // Default sort
    });
    return NextResponse.json({ results: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { entity } = await params;
  const entityName = entity;
  const modelName = mapEntityToModel(entityName);
  
  if (!modelName || !prisma[modelName]) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const result = await prisma[modelName].create({
      data: body,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to map "tile-profile" or "TileProfile" to "tileProfile" (prisma model camelCase usually? No, schema has PascalCase models but client uses camelCase property)
function mapEntityToModel(urlParam) {
    // Our schema models: TileProfile, TileColor, TileTexture, HousePreview, QuoteRequest
    // Prisma client property: tileProfile, tileColor... (camelCase)
    
    const lower = urlParam.toLowerCase().replace(/-/g, '');
    
    switch (lower) {
        case 'tileprofile': return 'tileProfile';
        case 'tilecolor': return 'tileColor';
        case 'tiletexture': return 'tileTexture';
        case 'housepreview': return 'housePreview';
        case 'quoterequest': return 'quoteRequest';
        case 'layoutoption': return 'layoutOption';
        default: return null;
    }
}

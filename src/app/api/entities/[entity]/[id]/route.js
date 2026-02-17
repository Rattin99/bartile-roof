import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  const { entity, id } = params;
  const modelName = mapEntityToModel(entity);
  
  if (!modelName || !prisma[modelName]) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const result = await prisma[modelName].update({
      where: { id },
      data: body,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { entity, id } = params;
  const modelName = mapEntityToModel(entity);
  
  if (!modelName || !prisma[modelName]) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }

  try {
    const result = await prisma[modelName].delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapEntityToModel(urlParam) {
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

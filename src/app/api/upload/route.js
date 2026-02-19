import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const ALLOWED_MODEL_TYPES = ['.stl', '.obj', '.glb', '.gltf'];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = extname(file.name).toLowerCase();

    let uploadSubDir = '';
    
    if (ALLOWED_IMAGE_TYPES.includes(fileExtension)) {
      uploadSubDir = 'images';
    } else if (ALLOWED_MODEL_TYPES.includes(fileExtension)) {
      uploadSubDir = 'models';
    } else {
        return NextResponse.json({ 
            error: `Unsupported file type: ${fileExtension}. Allowed types are images (${ALLOWED_IMAGE_TYPES.join(', ')}) and models (${ALLOWED_MODEL_TYPES.join(', ')})` 
        }, { status: 400 });
    }

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${safeName}`;
    
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadSubDir);
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if exists
      console.error('Error creating directory:', err);
    }

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return the relative URL path
    const relativeUrl = `/uploads/${uploadSubDir}/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: relativeUrl,
      filename: filename,
      type: uploadSubDir
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

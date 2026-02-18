import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.quoteRequest.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ results: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await prisma.quoteRequest.create({
      data: body,
    });

    // --- Email Notification Logic ---
    // In a real app, use Resend or Nodemailer here:
    /*
    await resend.emails.send({
      from: 'system@bartile.com',
      to: 'sales@bartile.com',
      subject: `New Quote Request: ${result.contact_name}`,
      html: `
        <h1>New Quote Request Received</h1>
        <p><strong>Name:</strong> ${result.contact_name}</p>
        <p><strong>Email:</strong> ${result.contact_email}</p>
        <p><strong>Phone:</strong> ${result.contact_phone || 'N/A'}</p>
        <p><strong>Plan:</strong> ${result.plan_file_path ? `<a href="${result.plan_file_path}">Download Plan</a>` : 'No plan uploaded'}</p>
      `
    });
    */
    console.log(`[Email Mock] Sent notification for quote ${result.id} to sales@bartile.com`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Quote Request Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Save to Database
    const quote = await prisma.quoteRequest.create({
      data: {
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        project_address: data.project_address,
        estimated_squares: data.estimated_squares ? parseFloat(data.estimated_squares) : null,
        plan_file_path: data.plan_file_path,
        configuration_snapshot: data.configuration_snapshot,
        status: 'NEW'
      }
    });

    // Send Email Notification
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Bartile Quotes <onboarding@resend.dev>', // Change to your domain in production
          to: ['sales@bartile.com'], // Ideally env var: process.env.SALES_EMAIL
          subject: `New Quote Request: ${data.contact_name}`,
          html: `
            <h1>New Quote Request</h1>
            <p><strong>Name:</strong> ${data.contact_name}</p>
            <p><strong>Email:</strong> ${data.contact_email}</p>
            <p><strong>Phone:</strong> ${data.contact_phone || 'N/A'}</p>
            <p><strong>Project Address:</strong> ${data.project_address || 'N/A'}</p>
            <p><strong>Estimated Squares:</strong> ${data.estimated_squares || 'N/A'}</p>
            
            <h2>Configuration</h2>
            <pre>${JSON.stringify(data.configuration_snapshot, null, 2)}</pre>
            
            ${data.plan_file_path ? `<p><strong>Plan File:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}${data.plan_file_path}">View File</a></p>` : ''}
            
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/quotes">View in Admin Dashboard</a></p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // We don't fail the request if email fails, but we log it
      }
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Quote Request Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ results: quotes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

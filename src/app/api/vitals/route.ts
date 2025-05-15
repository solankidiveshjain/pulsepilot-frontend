import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests to /api/vitals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.value || !body.id) {
      return NextResponse.json(
        { error: 'Missing required metric data' },
        { status: 400 }
      );
    }
    
    const { name, value, id, href, timeStamp } = body;
    
    // In production, you would store these metrics in:
    // - Analytics platform (GA4, Vercel Analytics, etc)
    // - Monitoring service (Datadog, New Relic, etc)
    // - Log aggregation (CloudWatch, Loggly, etc)
    
    // For now, just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', {
        name,
        value,
        id,
        href,
        timeStamp,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Web Vitals Error]', error);
    return NextResponse.json(
      { error: 'Failed to process web vitals' },
      { status: 500 }
    );
  }
} 
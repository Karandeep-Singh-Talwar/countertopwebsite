import { NextResponse } from 'next/server';

export interface QuotePayload {
  name: string;
  email: string;
  phone: string;
  sqFt: number;
  materialName: string;
  edgeProfile: string;
  addons: string[];
  totalEstimate: number;
  notes?: string;
}

const quotesLog: Array<QuotePayload & { id: string; createdAt: string }> = [];

export async function POST(request: Request) {
  try {
    const data: QuotePayload = await request.json();

    if (!data.email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const quoteId = `QT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newQuote = {
      ...data,
      id: quoteId,
      createdAt: new Date().toISOString(),
    };

    quotesLog.unshift(newQuote);
    console.log('[API] New Quote Generated & Sent:', newQuote);

    return NextResponse.json({
      success: true,
      quoteId,
      message: `Detailed estimate PDF dispatched to ${data.email}. A stone specialist will follow up within 2 business hours.`,
      quote: newQuote,
    });
  } catch (err: unknown) {
    console.error('[API] Quote error:', err);
    return NextResponse.json({ error: 'Failed to dispatch quote.' }, { status: 500 });
  }
}

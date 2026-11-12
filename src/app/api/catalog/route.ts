import { NextResponse } from 'next/server';
import { readCatalog } from '@/lib/catalog-store';

export const revalidate = 0; // Fresh catalogue data

export async function GET() {
  try {
    const items = readCatalog();
    return NextResponse.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (err: unknown) {
    console.error('Failed to fetch catalogue items', err);
    return NextResponse.json(
      { error: 'Failed to retrieve catalogue.' },
      { status: 500 }
    );
  }
}

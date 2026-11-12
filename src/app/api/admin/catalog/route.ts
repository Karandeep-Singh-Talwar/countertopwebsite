import { NextResponse } from 'next/server';
import { readCatalog, upsertProduct, deleteProduct } from '@/lib/catalog-store';
import type { PorcelainMaterial } from '@/data/porcelain-catalog-data';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'verona2026';

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-password');
  return authHeader === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = readCatalog();
  return NextResponse.json({ success: true, items });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product: PorcelainMaterial = await request.json();

    if (!product.id || !product.name) {
      return NextResponse.json(
        { error: 'Product id and name are required.' },
        { status: 400 }
      );
    }

    // Default numeric rates and arrays if missing
    const cleanedProduct: PorcelainMaterial = {
      ...product,
      id: product.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      name: product.name.trim(),
      pricePerSqFt: Number(product.pricePerSqFt) || (product.category === 'porcelain-tile' ? 18 : 28),
      installRatePerSqFt: Number(product.installRatePerSqFt) || (product.category === 'porcelain-tile' ? 12 : 16),
      sqFtPerBox: Number(product.sqFtPerBox) || 15.5,
      weightKgPerBox: Number(product.weightKgPerBox) || 29,
      randomFaces: Number(product.randomFaces) || (product.faces?.length || 4),
      faces: Array.isArray(product.faces) ? product.faces.filter(Boolean) : [],
      application: Array.isArray(product.application) ? product.application : ['Kitchen Countertops', 'Island Waterfalls'],
      dimensions: Array.isArray(product.dimensions) ? product.dimensions : ['600x1200 mm (24x48 in)'],
    };

    const updated = upsertProduct(cleanedProduct);
    return NextResponse.json({ success: true, product: cleanedProduct, totalCount: updated.length });
  } catch (err: unknown) {
    console.error('[Admin API] Error saving product:', err);
    return NextResponse.json({ error: 'Failed to save product.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const updated = deleteProduct(id);
    return NextResponse.json({ success: true, remainingCount: updated.length });
  } catch (err: unknown) {
    console.error('[Admin API] Error deleting product:', err);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}

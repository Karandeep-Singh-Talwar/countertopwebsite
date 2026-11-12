import fs from 'fs';
import path from 'path';
import { PORCELAIN_CATALOG, type PorcelainMaterial } from '@/data/porcelain-catalog-data';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'catalog.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'catalog', 'uploads');

// Ensure initial catalog.json exists
function ensureFile(): void {
  if (!fs.existsSync(DATA_FILE)) {
    // Populate sample multiple faces for items
    const seeded = PORCELAIN_CATALOG.map((item) => {
      // If no faces are explicitly provided, generate 2-4 face references using available slab textures
      const faces = item.faces && item.faces.length > 0
        ? item.faces
        : [
            item.slabImage,
            item.roomImage,
          ];
      return {
        ...item,
        faces,
      };
    });

    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(seeded, null, 2), 'utf8');
    } catch (e) {
      console.error('[CatalogStore] Error writing initial catalog.json:', e);
    }
  }
}

export function readCatalog(): PorcelainMaterial[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('[CatalogStore] Error reading catalog.json, using fallback:', err);
  }
  return PORCELAIN_CATALOG;
}

export function saveCatalog(items: PorcelainMaterial[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[CatalogStore] Failed to save catalog:', err);
    return false;
  }
}

export function getProductById(id: string): PorcelainMaterial | undefined {
  const all = readCatalog();
  return all.find((item) => item.id === id);
}

export function upsertProduct(product: PorcelainMaterial): PorcelainMaterial[] {
  const current = readCatalog();
  const index = current.findIndex((p) => p.id === product.id);

  let updated: PorcelainMaterial[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }

  saveCatalog(updated);
  return updated;
}

export function deleteProduct(id: string): PorcelainMaterial[] {
  const current = readCatalog();
  const filtered = current.filter((p) => p.id !== id);
  saveCatalog(filtered);
  return filtered;
}

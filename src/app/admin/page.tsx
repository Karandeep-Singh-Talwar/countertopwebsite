'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  Image as ImageIcon,
  Layers,
  Lock,
  Unlock,
  Search,
  Check,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Eye,
  RefreshCw,
  X,
} from 'lucide-react';
import type { PorcelainMaterial } from '@/data/porcelain-catalog-data';

const DEFAULT_PASS = 'verona2026';

const EMPTY_PRODUCT: PorcelainMaterial = {
  id: '',
  name: '',
  collection: 'High Gloss',
  category: 'porcelain-countertop',
  palette: 'white',
  description: '',
  application: ['Kitchen Countertops', 'Island Waterfalls', 'Continuous Floor'],
  dimensions: ['600x1200 mm (24x48 in)', '600x600 mm (24x24 in)'],
  thickness: '9 mm (General Contractor Installable)',
  finish: 'Mirror High Gloss',
  randomFaces: 4,
  waterAbsorption: '< 0.04% (Stain & Acid Proof)',
  hardness: 'Min. 5 Mohs',
  thermalResistance: 'Heat & Thermal Shock Proof',
  slabImage: '/catalog/products/slab_calcatta_extra.jpg',
  roomImage: '/catalog/products/room_calcatta_extra.jpg',
  uspHighlight: 'Eliminates stone fabricator delays; installed with standard tile tooling.',
  priceEstimate: '$24 - $38 / sq.ft',
  pricePerSqFt: 28,
  installRatePerSqFt: 16,
  sqFtPerBox: 15.5,
  weightKgPerBox: 29,
  faces: [],
};

export default function AdminCatalogPage() {
  const [password, setPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [items, setItems] = useState<PorcelainMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'porcelain-countertop' | 'porcelain-tile'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<PorcelainMaterial>(EMPTY_PRODUCT);
  const [dimensionsStr, setDimensionsStr] = useState('600x1200 mm (24x48 in), 600x600 mm (24x24 in)');
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // New Face URL / file state
  const [newFaceUrl, setNewFaceUrl] = useState('');
  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);
  const slabFileInputRef = useRef<HTMLInputElement>(null);

  // Load saved session on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('verona_admin_pwd') : null;
    if (stored) {
      setSavedPassword(stored);
      fetchCatalog(stored);
    }
  }, []);

  const fetchCatalog = async (pwd: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/catalog', {
        headers: { 'x-admin-password': pwd },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.items || []);
        setIsAuthenticated(true);
        sessionStorage.setItem('verona_admin_pwd', pwd);
      } else {
        setIsAuthenticated(false);
        setAuthError(data.error || 'Invalid management password.');
        sessionStorage.removeItem('verona_admin_pwd');
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSavedPassword(password.trim());
    fetchCatalog(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('verona_admin_pwd');
    setIsAuthenticated(false);
    setPassword('');
    setSavedPassword('');
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Upload handler helper
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': savedPassword },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      }
      showNotification('error', data.error || 'Failed to upload image');
      return null;
    } catch {
      showNotification('error', 'Network error uploading image');
      return null;
    }
  };

  const handleRoomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading('room');
    const url = await uploadImageFile(file);
    if (url) {
      setFormData((prev) => ({ ...prev, roomImage: url }));
      showNotification('success', 'Room image uploaded');
    }
    setIsUploading(null);
  };

  const handleSlabImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading('slab');
    const url = await uploadImageFile(file);
    if (url) {
      setFormData((prev) => ({ ...prev, slabImage: url }));
      showNotification('success', 'Slab image uploaded');
    }
    setIsUploading(null);
  };

  // Add Face from File
  const handleFaceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading('faces');

    const newUploadedFaces: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImageFile(file);
      if (url) newUploadedFaces.push(url);
    }

    if (newUploadedFaces.length > 0) {
      setFormData((prev) => {
        const updatedFaces = [...(prev.faces || []), ...newUploadedFaces];
        return {
          ...prev,
          faces: updatedFaces,
          randomFaces: Math.max(prev.randomFaces || 1, updatedFaces.length),
        };
      });
      showNotification('success', `Added ${newUploadedFaces.length} face image(s)`);
    }
    setIsUploading(null);
    if (faceFileInputRef.current) faceFileInputRef.current.value = '';
  };

  // Add Face from URL string
  const handleAddFaceUrl = () => {
    if (!newFaceUrl.trim()) return;
    const url = newFaceUrl.trim();
    setFormData((prev) => {
      const updatedFaces = [...(prev.faces || []), url];
      return {
        ...prev,
        faces: updatedFaces,
        randomFaces: Math.max(prev.randomFaces || 1, updatedFaces.length),
      };
    });
    setNewFaceUrl('');
    showNotification('success', 'Face image URL added');
  };

  const handleRemoveFace = (index: number) => {
    setFormData((prev) => {
      const updated = (prev.faces || []).filter((_, i) => i !== index);
      return {
        ...prev,
        faces: updated,
        randomFaces: Math.max(1, updated.length),
      };
    });
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      ...EMPTY_PRODUCT,
      id: `mat-${Date.now().toString(36)}`,
      faces: [
        '/catalog/products/slab_calcatta_extra.jpg',
        '/catalog/products/room_calcatta_extra.jpg',
      ],
    });
    setDimensionsStr('600x1200 mm (24x48 in), 600x600 mm (24x24 in)');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: PorcelainMaterial) => {
    setModalMode('edit');
    setFormData({
      ...item,
      faces: item.faces && item.faces.length > 0 ? item.faces : [item.slabImage, item.roomImage],
    });
    setDimensionsStr((item.dimensions || []).join(', '));
    setIsModalOpen(true);
  };

  // Save Product (POST)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('error', 'Material name is required');
      return;
    }

    const cleanedSlug = formData.id
      ? formData.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-')
      : formData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    const parsedDimensions = dimensionsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: PorcelainMaterial = {
      ...formData,
      id: cleanedSlug,
      name: formData.name.trim(),
      dimensions: parsedDimensions.length > 0 ? parsedDimensions : ['600x1200 mm (24x48 in)'],
      pricePerSqFt: Number(formData.pricePerSqFt) || 28,
      installRatePerSqFt: Number(formData.installRatePerSqFt) || 16,
      sqFtPerBox: Number(formData.sqFtPerBox) || 15.5,
      weightKgPerBox: Number(formData.weightKgPerBox) || 29,
      randomFaces: Number(formData.randomFaces) || (formData.faces?.length || 4),
      priceEstimate: formData.priceEstimate || `$${formData.pricePerSqFt} - $${Math.round(formData.pricePerSqFt * 1.5)} / sq.ft`,
    };

    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': savedPassword,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('success', `Saved ${payload.name} successfully! Live catalog and calculator updated.`);
        setIsModalOpen(false);
        fetchCatalog(savedPassword);
      } else {
        showNotification('error', data.error || 'Failed to save product');
      }
    } catch {
      showNotification('error', 'Error connecting to catalog API');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (item: PorcelainMaterial) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from the catalog? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/catalog?id=${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': savedPassword },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('success', `Deleted ${item.name}.`);
        fetchCatalog(savedPassword);
      } else {
        showNotification('error', data.error || 'Failed to delete product');
      }
    } catch {
      showNotification('error', 'Error deleting product');
    }
  };

  // Filtered view
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchPalette = item.palette?.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        return matchName || matchDesc || matchPalette || matchId;
      }
      return true;
    });
  }, [items, categoryFilter, searchQuery]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] text-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1A1A1A] border border-stone-800 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-800/30 border border-amber-700/50 flex items-center justify-center text-amber-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-white tracking-wide">VERONA Admin</h1>
              <p className="text-xs font-mono text-stone-400">Catalogue &amp; Face Image Management</p>
            </div>
          </div>

          <p className="text-xs text-stone-400 mb-6 leading-relaxed">
            Enter master key to configure porcelain countertop &amp; tile catalogues, multi-face vein images, and contractor calculator rates.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-mono mb-2">
                Master Password (default: <span className="text-amber-400">{DEFAULT_PASS}</span>)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#111111] border border-stone-700 px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-600 font-mono"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 p-2.5 border border-red-900/60">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-800 hover:bg-amber-700 text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-800/80 flex justify-between items-center text-xs text-stone-500 font-mono">
            <Link href="/" className="hover:text-stone-300 flex items-center gap-1.5 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Website</span>
            </Link>
            <span>v2.4 Zero-API Key</span>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans pb-24">
      {/* Top Banner Navigation */}
      <header className="bg-[#121212] text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-amber-800 flex items-center justify-center text-white font-serif font-bold text-lg">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-serif tracking-wider font-semibold">VERONA CATALOG MANAGER</h1>
                <span className="text-[10px] font-mono uppercase bg-amber-900/60 text-amber-300 px-2 py-0.5 border border-amber-700/50">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Directly feeds Website Slabs, Matching Tiles &amp; Contractor Calculator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-3 py-1.5 border border-stone-700 hover:border-stone-500 transition font-mono"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </Link>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Material</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1.5 transition font-mono cursor-pointer"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 shadow-xl flex items-center gap-2 text-xs font-mono transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border border-emerald-700'
              : 'bg-red-900 text-red-100 border border-red-700'
          }`}
        >
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Dashboard Subheader & Controls */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]/10">
          <div>
            <h2 className="text-2xl font-serif text-[#1A1A1A]">Curated Porcelain Materials ({filteredItems.length})</h2>
            <p className="text-xs text-stone-600 mt-1 font-mono">
              Manage items, wholesale $/sq.ft economics, packaging, and non-repeating continuous faces.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search name, palette, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-300 pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-800 font-mono"
              />
            </div>

            <div className="inline-flex p-0.5 bg-stone-200/80 border border-stone-300 text-xs font-mono">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'porcelain-countertop', label: 'Countertops' },
                  { id: 'porcelain-tile', label: 'Tiles' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1 text-xs transition cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-white text-stone-900 font-medium shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchCatalog(savedPassword)}
              disabled={loading}
              className="p-2 border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition cursor-pointer"
              title="Refresh Catalog"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="mt-8 bg-white border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Material Preview</th>
                  <th className="py-3.5 px-4">Name &amp; Category</th>
                  <th className="py-3.5 px-4">Collection &amp; Palette</th>
                  <th className="py-3.5 px-4">Wholesale Rate</th>
                  <th className="py-3.5 px-4">Install Rate</th>
                  <th className="py-3.5 px-4">Faces Available</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400 font-mono">
                      No materials found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((mat) => {
                    const faceCount = (mat.faces && mat.faces.length > 0) ? mat.faces.length : (mat.randomFaces || 1);

                    return (
                      <tr key={mat.id} className="hover:bg-amber-50/40 transition">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="relative w-16 h-12 bg-stone-200 overflow-hidden border border-stone-300">
                            <Image
                              src={mat.roomImage || mat.slabImage}
                              alt={mat.name}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                        </td>

                        {/* Name & Category */}
                        <td className="py-3 px-4">
                          <div className="font-serif text-sm font-semibold text-[#1A1A1A]">{mat.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-stone-500">ID: {mat.id}</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.2 font-mono font-medium ${
                                mat.category === 'porcelain-countertop'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              {mat.category === 'porcelain-countertop' ? 'Countertop Slab' : 'Matching Tile'}
                            </span>
                          </div>
                        </td>

                        {/* Collection & Palette */}
                        <td className="py-3 px-4 font-mono text-stone-700">
                          <div>{mat.collection}</div>
                          <div className="text-[10px] text-stone-500 capitalize">Palette: {mat.palette}</div>
                        </td>

                        {/* Wholesale Rate (powers calculator) */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-semibold text-amber-900">${mat.pricePerSqFt} / sq.ft</div>
                          <div className="text-[10px] text-stone-500">{mat.priceEstimate}</div>
                        </td>

                        {/* Install Rate */}
                        <td className="py-3 px-4 font-mono text-stone-600">
                          ${mat.installRatePerSqFt || 16} / sq.ft
                        </td>

                        {/* Faces */}
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-amber-800" />
                            <span className="font-semibold text-stone-900">{faceCount} faces</span>
                          </div>
                          {mat.faces && mat.faces.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              {mat.faces.slice(0, 4).map((f, i) => (
                                <div
                                  key={i}
                                  className="relative w-4 h-5 border border-stone-300 overflow-hidden shrink-0"
                                  title={`Face ${i + 1}`}
                                >
                                  <Image src={f} alt="" fill className="object-cover" />
                                </div>
                              ))}
                              {mat.faces.length > 4 && (
                                <span className="text-[9px] text-stone-500">+{mat.faces.length - 4}</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(mat)}
                              className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded transition cursor-pointer"
                              title="Edit Material Specs & Faces"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(mat)}
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                              title="Delete Material"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white border border-stone-300 shadow-2xl my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#141414] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-amber-800 flex items-center justify-center text-white text-xs font-mono font-bold">
                  {modalMode === 'create' ? '+' : '✎'}
                </div>
                <div>
                  <h3 className="font-serif text-lg tracking-wide">
                    {modalMode === 'create' ? 'Add New Material to Catalogue' : `Edit ${formData.name}`}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Configure specs, pricing, and multiple non-repeating continuous faces
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-8 flex-1 text-xs">
              {/* Section 1: Core Details */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-3 pb-1 border-b border-stone-200">
                  1. General Material Identity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Material Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Abria Black"
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Unique Slug / ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="e.g. abria-black"
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                    >
                      <option value="porcelain-countertop">Porcelain Countertop Slab</option>
                      <option value="porcelain-tile">Porcelain Matching Tile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">Collection</label>
                    <select
                      value={formData.collection}
                      onChange={(e) => setFormData({ ...formData, collection: e.target.value as any })}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                    >
                      <option value="High Gloss">High Gloss</option>
                      <option value="Crystal">Crystal</option>
                      <option value="Onyx">Onyx</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">Color Palette</label>
                    <select
                      value={formData.palette}
                      onChange={(e) => setFormData({ ...formData, palette: e.target.value as any })}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                    >
                      <option value="white">White Calacatta</option>
                      <option value="green">Emerald &amp; Jade</option>
                      <option value="black">Obsidian &amp; Gold</option>
                      <option value="earth">Amber &amp; Grigio</option>
                      <option value="blue">Labradorite Blue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">Finish</label>
                    <input
                      type="text"
                      value={formData.finish}
                      onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                      placeholder="Mirror High Gloss"
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-mono text-stone-700 mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Velvety midnight pitch accented with delicate golden web veining..."
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-mono text-stone-700 mb-1">
                    Contractor USP Highlight (italic callout)
                  </label>
                  <input
                    type="text"
                    value={formData.uspHighlight}
                    onChange={(e) => setFormData({ ...formData, uspHighlight: e.target.value })}
                    placeholder="Any licensed tile contractor can cut, mitre, and install—eliminating stone fabricator delays."
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              {/* Section 2: Pricing & Contractor Calculator Parameters */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-3 pb-1 border-b border-stone-200">
                  2. Pricing &amp; Contractor Economics (Directly drives Live Calculator)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Wholesale Price ($/sq.ft) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.pricePerSqFt}
                      onChange={(e) => setFormData({ ...formData, pricePerSqFt: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono font-semibold text-amber-900 focus:outline-none focus:border-amber-800"
                    />
                    <p className="text-[10px] text-stone-500 mt-1 font-mono">Used for contractor wholesale quote.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Install Rate ($/sq.ft)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.installRatePerSqFt || 16}
                      onChange={(e) => setFormData({ ...formData, installRatePerSqFt: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                    />
                    <p className="text-[10px] text-stone-500 mt-1 font-mono">Standard general contractor thin-set rate.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Display Price Estimate String
                    </label>
                    <input
                      type="text"
                      value={formData.priceEstimate}
                      onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                      placeholder="$26 - $40 / sq.ft"
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                    />
                    <p className="text-[10px] text-stone-500 mt-1 font-mono">Shown on catalogue badge.</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Physical Specs & Packaging */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-3 pb-1 border-b border-stone-200">
                  3. Format, Thickness &amp; Box Packaging
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">
                      Available Formats (comma separated)
                    </label>
                    <input
                      type="text"
                      value={dimensionsStr}
                      onChange={(e) => setDimensionsStr(e.target.value)}
                      placeholder="600x1200 mm (24x48 in), 600x600 mm (24x24 in)"
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">Thickness</label>
                    <input
                      type="text"
                      value={formData.thickness}
                      onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                      placeholder="9 mm (General Contractor Installable)"
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-700 mb-1">Sq Ft per Box</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sqFtPerBox || 15.5}
                      onChange={(e) => setFormData({ ...formData, sqFtPerBox: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Primary Imagery */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-3 pb-1 border-b border-stone-200">
                  4. Lifestyle &amp; Full Slab Master Images
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Image */}
                  <div className="p-4 bg-stone-50 border border-stone-200">
                    <label className="block text-[11px] font-mono text-stone-800 font-semibold mb-2">
                      Room / Lifestyle Image *
                    </label>
                    <div className="flex gap-4 items-start">
                      <div className="relative w-24 h-24 bg-stone-200 border border-stone-300 shrink-0 overflow-hidden">
                        {formData.roomImage ? (
                          <Image src={formData.roomImage} alt="Room" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={formData.roomImage}
                          onChange={(e) => setFormData({ ...formData, roomImage: e.target.value })}
                          placeholder="/catalog/products/room_sample.jpg"
                          className="w-full bg-white border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            ref={roomFileInputRef}
                            onChange={handleRoomImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => roomFileInputRef.current?.click()}
                            disabled={isUploading === 'room'}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white text-[11px] font-mono transition cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{isUploading === 'room' ? 'Uploading...' : 'Upload File'}</span>
                          </button>
                          <span className="text-[10px] text-stone-500 font-mono">PNG / JPG / WebP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slab Image */}
                  <div className="p-4 bg-stone-50 border border-stone-200">
                    <label className="block text-[11px] font-mono text-stone-800 font-semibold mb-2">
                      Full Slab Image *
                    </label>
                    <div className="flex gap-4 items-start">
                      <div className="relative w-24 h-24 bg-stone-200 border border-stone-300 shrink-0 overflow-hidden">
                        {formData.slabImage ? (
                          <Image src={formData.slabImage} alt="Slab" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={formData.slabImage}
                          onChange={(e) => setFormData({ ...formData, slabImage: e.target.value })}
                          placeholder="/catalog/products/slab_sample.jpg"
                          className="w-full bg-white border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            ref={slabFileInputRef}
                            onChange={handleSlabImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => slabFileInputRef.current?.click()}
                            disabled={isUploading === 'slab'}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white text-[11px] font-mono transition cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{isUploading === 'slab' ? 'Uploading...' : 'Upload File'}</span>
                          </button>
                          <span className="text-[10px] text-stone-500 font-mono">PNG / JPG / WebP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Multiple Faces Management (KEY USER REQUIREMENT) */}
              <div className="p-5 bg-amber-50/60 border border-amber-200">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-amber-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-800" />
                      <h4 className="text-[12px] uppercase tracking-wider font-mono font-bold text-amber-950">
                        5. Multiple Non-Repeating Continuous Faces ({(formData.faces || []).length} Configured)
                      </h4>
                    </div>
                    <p className="text-[11px] text-amber-900/80 font-sans mt-0.5">
                      Vitrified porcelain has multiple non-repeating continuous faces (Face 1, Face 2, etc.) to prevent pattern repetition in large spaces.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={faceFileInputRef}
                      onChange={handleFaceImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => faceFileInputRef.current?.click()}
                      disabled={isUploading === 'faces'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-mono tracking-wider transition cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading === 'faces' ? 'Uploading Faces...' : '+ Upload Multiple Faces'}</span>
                    </button>
                  </div>
                </div>

                {/* Add Face via URL input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newFaceUrl}
                    onChange={(e) => setNewFaceUrl(e.target.value)}
                    placeholder="Or paste image URL (e.g. /catalog/products/slab_face3.jpg)"
                    className="flex-1 bg-white border border-amber-300 px-3 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddFaceUrl}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-mono transition cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Face Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {(formData.faces || []).map((faceUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group bg-white border border-stone-300 shadow-sm p-1 flex flex-col"
                    >
                      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
                        <Image
                          src={faceUrl}
                          alt={`Face ${idx + 1}`}
                          fill
                          className="object-cover object-center"
                        />
                        <span className="absolute top-1 left-1 bg-black/80 text-amber-400 text-[9px] font-mono px-1.5 py-0.5">
                          Face {idx + 1}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-stone-600 px-1 py-0.5">
                        <span className="truncate max-w-[80px]" title={faceUrl}>
                          {faceUrl.split('/').pop()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFace(idx)}
                          className="text-stone-400 hover:text-red-600 p-0.5 transition cursor-pointer"
                          title="Remove Face"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty state placeholder */}
                  {(!formData.faces || formData.faces.length === 0) && (
                    <div className="col-span-full py-6 text-center text-amber-900/60 font-mono border border-dashed border-amber-300 bg-amber-50/40">
                      No faces uploaded yet. Click &quot;Upload Multiple Faces&quot; above to add Face 1, Face 2, Face 3, Face 4...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 font-mono text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-medium uppercase tracking-[0.2em] text-xs transition cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Material &amp; Sync</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

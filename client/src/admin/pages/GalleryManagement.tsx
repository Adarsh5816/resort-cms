import React, { useState, useEffect } from 'react';
import { apiRequest, uploadFile } from '../../services/api';
import { GalleryCategory, GalleryImage } from '../../types';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export const GalleryManagement: React.FC = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgTitle, setNewImgTitle] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/gallery');
      setCategories(data.categories);
      setImages(data.images);
    } catch (err) {
      console.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await apiRequest('/gallery/categories', { method: 'POST', body: { name: newCatName.trim() } });
      setNewCatName('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete category? Images under this category will remain.')) return;
    try {
      await apiRequest(`/gallery/categories/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setNewImgUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl) return alert('Image URL is required');
    try {
      await apiRequest('/gallery/images', {
        method: 'POST',
        body: {
          image_url: newImgUrl,
          title: newImgTitle || null,
          category_id: selectedCatId || null
        }
      });
      setNewImgUrl('');
      setNewImgTitle('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add image');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Delete image from gallery?')) return;
    try {
      await apiRequest(`/gallery/images/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Gallery Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Organize gallery categories and upload high-resolution photos for your public resort website.
        </p>
      </div>

      {/* Categories Bar */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Gallery Categories</h3>
        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="e.g. Resort Grounds, Dining, Pool"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
          <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg">
            Add Category
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map(cat => (
            <span key={cat.id} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-full">
              <span>{cat.name}</span>
              <button onClick={() => handleDeleteCategory(cat.id)} className="text-rose-400 hover:text-rose-300">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Upload Image Form */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Upload / Add Gallery Image</h3>
        <form onSubmit={handleAddImage} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-300 mb-1">Image URL or File Upload</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://..."
                value={newImgUrl}
                onChange={e => setNewImgUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
              <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Browse'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Category</label>
            <select
              value={selectedCatId}
              onChange={e => setSelectedCatId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="">Uncategorized</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow">
              Add Photo to Gallery
            </button>
          </div>
        </form>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img.id} className="relative group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-48">
            <img src={img.image_url} alt={img.title || 'Gallery'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
              <span className="text-xs font-bold text-amber-300 truncate">{img.title || 'Resort Photo'}</span>
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="p-1.5 bg-rose-600 text-white rounded-lg self-end hover:bg-rose-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Testimonial } from '../../types';
import { Plus, Trash2, Star, MessageSquare, RefreshCw, CheckCircle2 } from 'lucide-react';

export const TestimonialManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    location_or_title: 'Guest',
    rating: 5,
    review_text: '',
    avatar_url: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/testimonials');
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncGoogle = async () => {
    setSyncingGoogle(true);
    setSyncSuccessMsg(null);
    try {
      const res = await apiRequest('/testimonials/sync-google', { method: 'POST' });
      setSyncSuccessMsg(res.message || 'Google Reviews synced successfully!');
      loadData();
      setTimeout(() => setSyncSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to sync Google Reviews');
    } finally {
      setSyncingGoogle(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/testimonials', { method: 'POST', body: formData });
      setIsModalOpen(false);
      setFormData({ customer_name: '', location_or_title: 'Guest', rating: 5, review_text: '', avatar_url: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete review?')) return;
    try {
      await apiRequest(`/testimonials/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Testimonials & Google Reviews</h1>
          <p className="text-xs text-slate-400 mt-1">
            Display guest testimonials & auto-sync Google Reviews directly onto your website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncGoogle}
            disabled={syncingGoogle}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncingGoogle ? 'animate-spin' : ''}`} />
            <span>{syncingGoogle ? 'Syncing Google...' : 'Auto-Sync Google Reviews'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Review</span>
          </button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading testimonials...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {(t as any).source === 'google' && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <span>🔵 Google Synced</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-serif italic">"{t.review_text}"</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  {t.avatar_url && (
                    <img src={t.avatar_url} alt={t.customer_name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-white">{t.customer_name}</h5>
                    <p className="text-[10px] text-slate-400">{t.location_or_title}</p>
                  </div>
                </div>

                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-amber-400">Add Guest Review</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Sterling"
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Title</label>
                  <input
                    type="text"
                    placeholder="London, UK"
                    value={formData.location_or_title}
                    onChange={e => setFormData({ ...formData, location_or_title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                    <option value={3}>3 Stars ⭐⭐⭐</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Guest review comments..."
                  value={formData.review_text}
                  onChange={e => setFormData({ ...formData, review_text: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.avatar_url}
                  onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;

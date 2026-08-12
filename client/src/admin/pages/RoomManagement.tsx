import React, { useState, useEffect } from 'react';
import { apiRequest, uploadFile } from '../../services/api';
import { Room, Amenity } from '../../types';
import { Plus, Edit3, Trash2, Check, Image as ImageIcon, Upload, X } from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    discounted_price: 0,
    max_occupancy: '2 Adults',
    bed_type: '1 King Bed',
    room_size: '350 sq.ft',
    primary_image: '',
    amenity_ids: [] as string[]
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const roomData = await apiRequest('/rooms');
      const amenityData = await apiRequest('/amenities');
      setRooms(roomData);
      setAmenities(amenityData);
    } catch (err) {
      console.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: 4500,
      discounted_price: 3999,
      max_occupancy: '2 Adults + 1 Child',
      bed_type: '1 King Bed',
      room_size: '350 sq.ft',
      primary_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      amenity_ids: amenities.slice(0, 3).map(a => a.id)
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      short_description: room.short_description || '',
      price: room.price,
      discounted_price: room.discounted_price || 0,
      max_occupancy: room.max_occupancy || '2 Adults',
      bed_type: room.bed_type || '1 King Bed',
      room_size: room.room_size || '350 sq.ft',
      primary_image: room.primary_image || '',
      amenity_ids: room.amenities ? room.amenities.map(a => a.id) : []
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadFile(file);
      setFormData(prev => ({ ...prev, primary_image: res.url }));
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await apiRequest(`/rooms/${editingRoom.id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        await apiRequest('/rooms', {
          method: 'POST',
          body: formData
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save room');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await apiRequest(`/rooms/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete room');
    }
  };

  const toggleAmenity = (id: string) => {
    setFormData(prev => {
      const exists = prev.amenity_ids.includes(id);
      return {
        ...prev,
        amenity_ids: exists ? prev.amenity_ids.filter(aId => aId !== id) : [...prev.amenity_ids, id]
      };
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Rooms & Rates Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create and edit resort room categories, rates, beds, sizes, and amenities.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading rooms list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 bg-slate-950">
                  <img
                    src={room.primary_image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/90 text-amber-400 font-bold text-xs px-3 py-1 rounded-md border border-amber-500/40">
                    ₹{room.price}/night
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-serif font-bold text-white">{room.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{room.short_description || room.description}</p>
                  
                  <div className="text-[11px] text-slate-300 space-y-1 border-t border-slate-800 pt-3">
                    <p>🛏️ Bed: {room.bed_type || 'King Bed'}</p>
                    <p>👥 Occupancy: {room.max_occupancy || '2 Guests'}</p>
                    <p>📐 Size: {room.room_size || '350 sq.ft'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(room)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Room</span>
                </button>

                <button
                  onClick={() => handleDelete(room.id)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-serif font-bold text-amber-400">
                {editingRoom ? 'Edit Room Details' : 'Create New Room'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe Valley View Suite"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Regular Price (₹/night) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discounted Price (₹/night)</label>
                  <input
                    type="number"
                    value={formData.discounted_price}
                    onChange={e => setFormData({ ...formData, discounted_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Occupancy</label>
                  <input
                    type="text"
                    placeholder="2 Adults + 1 Child"
                    value={formData.max_occupancy}
                    onChange={e => setFormData({ ...formData, max_occupancy: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Beds Information</label>
                  <input
                    type="text"
                    placeholder="1 King Bed"
                    value={formData.bed_type}
                    onChange={e => setFormData({ ...formData, bed_type: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room Size</label>
                  <input
                    type="text"
                    placeholder="350 sq.ft"
                    value={formData.room_size}
                    onChange={e => setFormData({ ...formData, room_size: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Brief highlight snippet..."
                  value={formData.short_description}
                  onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of room features, terrace views, bath amenities..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Primary Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Room Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.primary_image}
                    onChange={e => setFormData({ ...formData, primary_image: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Link Dynamic Amenities */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Room Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  {amenities.map(a => {
                    const selected = formData.amenity_ids.includes(a.id);
                    return (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => toggleAmenity(a.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg text-left transition-all flex items-center justify-between ${
                          selected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{a.name}</span>
                        {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-md"
                >
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

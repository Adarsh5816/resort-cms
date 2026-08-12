import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, Users, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { apiRequest } from '../../services/api';

export const EnquiryModal: React.FC = () => {
  const { siteData, isEnquiryModalOpen, setIsEnquiryModalOpen, selectedRoomForBooking, setSelectedRoomForBooking, activeResortSlug } = useTenant();

  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    phone: '',
    check_in: '',
    check_out: '',
    guests_count: 2,
    room_preference: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRoomForBooking) {
      setFormData(prev => ({ ...prev, room_preference: selectedRoomForBooking.name }));
    }
  }, [selectedRoomForBooking]);

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest(`/public/enquiry?resort=${activeResortSlug}`, {
        method: 'POST',
        body: formData
      });
      setSubmittedSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsEnquiryModalOpen(false);
    setSelectedRoomForBooking(null);
    setSubmittedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-900 border border-gray-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div>
            <h3 className="text-xl font-bold font-serif">Reserve Your Experience</h3>
            <p className="text-xs text-slate-300">
              {siteData?.resort?.name || 'Resort Enquiry'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Enquiry Received!</h4>
            <p className="text-sm text-gray-600">
              Thank you, <span className="font-semibold">{formData.guest_name}</span>. Our reservation desk has received your request and will contact you shortly with availability and pricing details.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-600 border border-rose-200 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.guest_name}
                  onChange={e => setFormData({ ...formData, guest_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 555 123 4567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Check-in Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={formData.check_in}
                    onChange={e => setFormData({ ...formData, check_in: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Check-out Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={formData.check_out}
                    onChange={e => setFormData({ ...formData, check_out: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Room Preference</label>
                <select
                  value={formData.room_preference}
                  onChange={e => setFormData({ ...formData, room_preference: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
                >
                  <option value="">Any Room Category</option>
                  {siteData?.rooms.map(r => (
                    <option key={r.id} value={r.name}>{r.name} (₹{r.price}/night)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Guests</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests_count}
                    onChange={e => setFormData({ ...formData, guests_count: parseInt(e.target.value) || 1 })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Special Requests / Notes</label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="Mention arrival time, dietary needs, or special celebration..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-sm rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Request...' : 'Send Enquiry Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { Enquiry } from '../../types';
import { Mail, Phone, Calendar, User, MessageSquare, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export const EnquiryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/enquiries');
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await apiRequest(`/enquiries/${id}`, {
        method: 'PUT',
        body: { status }
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold rounded-full">NEW ENQUIRY</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold rounded-full">CONTACTED</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold rounded-full">CONFIRMED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold rounded-full">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Guest Enquiries Inbox</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review guest booking requests submitted from your public resort website.
        </p>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          No enquiries received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map(enquiry => (
            <div key={enquiry.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 text-amber-400 border border-amber-500/30 rounded-xl flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{enquiry.guest_name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span>✉️ {enquiry.email}</span>
                      <span>📞 {enquiry.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(enquiry.status)}
                  <select
                    value={enquiry.status}
                    onChange={e => handleUpdateStatus(enquiry.id, e.target.value as any)}
                    className="px-3 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-semibold"
                  >
                    <option value="NEW">Set NEW</option>
                    <option value="CONTACTED">Set CONTACTED</option>
                    <option value="CONFIRMED">Set CONFIRMED</option>
                    <option value="CANCELLED">Set CANCELLED</option>
                    <option value="CLOSED">Set CLOSED</option>
                  </select>

                  <button
                    onClick={async () => {
                      try {
                        await apiRequest('/invoices', {
                          method: 'POST',
                          body: {
                            guest_name: enquiry.guest_name,
                            guest_email: enquiry.email,
                            guest_phone: enquiry.phone,
                            room_name: enquiry.room_preference || '3BHK Private Serviced Villa',
                            check_in_date: enquiry.check_in,
                            check_out_date: enquiry.check_out,
                            num_nights: 1,
                            rate_per_night: 5999,
                            payment_status: 'PAID'
                          }
                        });
                        navigate('/admin/invoices');
                      } catch (err: any) {
                        alert(err.message || 'Failed to generate invoice');
                      }
                    }}
                    className="px-3 py-1 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Dates</span>
                  <span>{enquiry.check_in || 'N/A'} → {enquiry.check_out || 'N/A'}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Room Preference</span>
                  <span>{enquiry.room_preference || 'Any Category'} ({enquiry.guests_count || 1} Guests)</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Received On</span>
                  <span>{new Date(enquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              {enquiry.message && (
                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs text-slate-300 font-serif italic">
                  "{enquiry.message}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

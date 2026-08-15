import React, { useState, useEffect } from 'react';
import { apiRequest, getFullImageUrl } from '../../services/api';
import { Invoice } from '../../types';
import { Plus, Printer, Trash2, CheckCircle2, Clock, DollarSign, FileText, X, Download, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [resortProfile, setResortProfile] = useState<any>({});

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    room_name: '3BHK Private Serviced Villa',
    check_in_date: '',
    check_out_date: '',
    num_nights: 1,
    rate_per_night: 5999,
    additional_charges: 0,
    tax_amount: 0,
    discount_amount: 0,
    payment_status: 'PAID' as 'PAID' | 'PENDING' | 'PARTIAL' | 'CANCELLED',
    payment_method: 'UPI / GPay',
    notes: 'Night Jungle Safari & Homely Food on order included.'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const invData = await apiRequest('/invoices');
      setInvoices(invData);

      const profileData = await apiRequest('/website/settings');
      setResortProfile(profileData);
    } catch (err) {
      console.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateTotal = () => {
    const nights = parseInt(formData.num_nights as any) || 1;
    const rate = parseFloat(formData.rate_per_night as any) || 0;
    const addl = parseFloat(formData.additional_charges as any) || 0;
    const tax = parseFloat(formData.tax_amount as any) || 0;
    const disc = parseFloat(formData.discount_amount as any) || 0;
    return Math.max(0, (nights * rate) + addl + tax - disc);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/invoices', { method: 'POST', body: formData });
      setIsCreateModalOpen(false);
      setFormData({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        room_name: '3BHK Private Serviced Villa',
        check_in_date: '',
        check_out_date: '',
        num_nights: 1,
        rate_per_night: 5999,
        additional_charges: 0,
        tax_amount: 0,
        discount_amount: 0,
        payment_status: 'PAID',
        payment_method: 'UPI / GPay',
        notes: ''
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  const handleToggleStatus = async (invoice: Invoice, newStatus: 'PAID' | 'PENDING') => {
    try {
      await apiRequest(`/invoices/${invoice.id}`, {
        method: 'PUT',
        body: { payment_status: newStatus }
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update invoice status');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice record?')) return;
    try {
      await apiRequest(`/invoices/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete invoice');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Billing & Invoices</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate, print, and track guest booking invoices with automatic GST & total calculation.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Guest Invoice</span>
        </button>
      </div>

      {/* Invoices Grid */}
      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">No Invoices Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Create Guest Invoice" above to generate a new invoice for guest stays.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map(inv => (
            <div key={inv.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-slate-950 text-amber-400 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {inv.invoice_number}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(inv, inv.payment_status === 'PAID' ? 'PENDING' : 'PAID')}
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase transition-colors ${
                      inv.payment_status === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {inv.payment_status}
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-white">{inv.guest_name}</h3>
                  <p className="text-xs text-slate-400">{inv.room_name || 'Serviced Villa Stay'}</p>
                  {(inv.check_in_date || inv.check_out_date) && (
                    <p className="text-[11px] text-slate-400 font-mono mt-1">
                      🗓️ {inv.check_in_date || 'N/A'} → {inv.check_out_date || 'N/A'} ({inv.num_nights} {inv.num_nights === 1 ? 'Night' : 'Nights'})
                    </p>
                  )}
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Amount</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">₹{inv.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Payment Via</p>
                    <p className="text-slate-300 font-medium">{inv.payment_method || 'UPI / GPay'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedInvoiceForPrint(inv)}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View & Print</span>
                </button>

                <button
                  onClick={() => handleDeleteInvoice(inv.id)}
                  className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-amber-400">Generate Guest Booking Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Ramesh"
                    value={formData.guest_name}
                    onChange={e => setFormData({ ...formData, guest_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+91 98470 12345"
                    value={formData.guest_phone}
                    onChange={e => setFormData({ ...formData, guest_phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guest Email</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={formData.guest_email}
                    onChange={e => setFormData({ ...formData, guest_email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room / Accommodation Category</label>
                <input
                  type="text"
                  value={formData.room_name}
                  onChange={e => setFormData({ ...formData, room_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={formData.check_in_date}
                    onChange={e => setFormData({ ...formData, check_in_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={formData.check_out_date}
                    onChange={e => setFormData({ ...formData, check_out_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nights</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.num_nights}
                    onChange={e => setFormData({ ...formData, num_nights: parseInt(e.target.value) || 1 })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Rate / Night (₹)</label>
                  <input
                    type="number"
                    value={formData.rate_per_night}
                    onChange={e => setFormData({ ...formData, rate_per_night: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Safari/Food (₹)</label>
                  <input
                    type="number"
                    value={formData.additional_charges}
                    onChange={e => setFormData({ ...formData, additional_charges: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discount_amount}
                    onChange={e => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="UPI / GPay">UPI / Google Pay / PhonePe</option>
                    <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cash at Desk">Cash at Desk</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Status</label>
                  <select
                    value={formData.payment_status}
                    onChange={e => setFormData({ ...formData, payment_status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                  >
                    <option value="PAID">PAID (Full Payment Received)</option>
                    <option value="PENDING">PENDING (Payment Due)</option>
                    <option value="PARTIAL">PARTIAL (Advance Received)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Calculated Total Bill</span>
                <span className="text-xl font-bold font-mono text-emerald-400">₹{calculateTotal().toLocaleString()}</span>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-lg">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE / PDF INVOICE VIEW MODAL */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-gray-900 rounded-2xl shadow-2xl p-8 space-y-6 my-8 print:p-0 print:shadow-none print:w-full print:max-w-none">
            {/* Modal Controls (Hidden during print) */}
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Official Guest Invoice</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button onClick={() => setSelectedInvoiceForPrint(null)} className="p-1 text-gray-400 hover:text-gray-900">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* PRINT CONTENT BODY */}
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  {resortProfile?.settings?.logo_url ? (
                    <img src={getFullImageUrl(resortProfile.settings.logo_url)} alt="Logo" className="h-14 w-auto object-contain mb-2" />
                  ) : (
                    <h2 className="text-2xl font-serif font-bold text-emerald-950">LEXUR GREEN</h2>
                  )}
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Serviced Villa • Wayanad</p>
                  <p className="text-xs text-gray-600 mt-1">{resortProfile?.contact?.address || 'Valluvady, Sulthan Bathery, Wayanad, Kerala'}</p>
                  <p className="text-xs text-gray-600">Phone: {resortProfile?.contact?.phone || '+91 80787 76634'} | Email: {resortProfile?.contact?.email || 'lexurbooking@gmail.com'}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-2xl font-mono font-bold text-gray-900 block">{selectedInvoiceForPrint.invoice_number}</span>
                  <p className="text-xs text-gray-500 font-mono">Date: {new Date(selectedInvoiceForPrint.created_at).toLocaleDateString()}</p>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
                    selectedInvoiceForPrint.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    STAMP: {selectedInvoiceForPrint.payment_status}
                  </span>
                </div>
              </div>

              {/* Guest & Stay Info Grid */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <div>
                  <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">BILLED TO GUEST</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedInvoiceForPrint.guest_name}</p>
                  {selectedInvoiceForPrint.guest_phone && <p className="text-gray-600 font-mono">📞 {selectedInvoiceForPrint.guest_phone}</p>}
                  {selectedInvoiceForPrint.guest_email && <p className="text-gray-600">✉️ {selectedInvoiceForPrint.guest_email}</p>}
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">RESERVATION DETAILS</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedInvoiceForPrint.room_name || '3BHK Private Villa'}</p>
                  <p className="text-gray-600 font-mono">Check-in: {selectedInvoiceForPrint.check_in_date || 'N/A'}</p>
                  <p className="text-gray-600 font-mono">Check-out: {selectedInvoiceForPrint.check_out_date || 'N/A'}</p>
                  <p className="text-emerald-800 font-bold mt-0.5">Duration: {selectedInvoiceForPrint.num_nights} {selectedInvoiceForPrint.num_nights === 1 ? 'Night' : 'Nights'}</p>
                </div>
              </div>

              {/* Itemized Charges Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900 bg-gray-100 font-bold text-gray-700">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Nights</th>
                    <th className="py-2.5 px-3 text-right">Rate / Night</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900">{selectedInvoiceForPrint.room_name || '3BHK Villa Accommodation'}</p>
                      <p className="text-[11px] text-gray-500">Private Villa, Kitchen & Forest View</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{selectedInvoiceForPrint.num_nights}</td>
                    <td className="py-3 px-3 text-right font-mono">₹{selectedInvoiceForPrint.rate_per_night.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">₹{(selectedInvoiceForPrint.num_nights * selectedInvoiceForPrint.rate_per_night).toLocaleString()}</td>
                  </tr>

                  {selectedInvoiceForPrint.additional_charges > 0 && (
                    <tr>
                      <td className="py-3 px-3" colSpan={3}>
                        <p className="font-bold text-gray-900">Night Jungle Safari / Additional Services</p>
                        <p className="text-[11px] text-gray-500">Wildlife tracking & homely food orders</p>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">₹{selectedInvoiceForPrint.additional_charges.toLocaleString()}</td>
                    </tr>
                  )}

                  {selectedInvoiceForPrint.tax_amount > 0 && (
                    <tr>
                      <td className="py-2 px-3 text-gray-600" colSpan={3}>Taxes & GST</td>
                      <td className="py-2 px-3 text-right font-mono">₹{selectedInvoiceForPrint.tax_amount.toLocaleString()}</td>
                    </tr>
                  )}

                  {selectedInvoiceForPrint.discount_amount > 0 && (
                    <tr>
                      <td className="py-2 px-3 text-emerald-700 font-semibold" colSpan={3}>Direct Booking Discount</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700 font-semibold">- ₹{selectedInvoiceForPrint.discount_amount.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total Calculation & Payment Method */}
              <div className="pt-4 border-t-2 border-gray-900 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Payment Method: <span className="font-bold text-gray-800">{selectedInvoiceForPrint.payment_method || 'UPI / GPay'}</span></p>
                  <p className="text-[11px] text-gray-400 mt-1">Thank you for staying at Lexur Green Serviced Villa!</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Grand Total Paid</span>
                  <span className="text-2xl font-bold font-mono text-emerald-800">₹{selectedInvoiceForPrint.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;

import React from 'react';
import { PublicSiteData, Room } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { WhatsAppCTA } from '../components/WhatsAppCTA';
import { IconHelper } from '../components/IconHelper';
import { MapPin, Phone, Mail, Wifi, Shield, Star, CheckCircle2, ArrowRight } from 'lucide-react';

export const ModernHotelTheme: React.FC<{ data: PublicSiteData }> = ({ data }) => {
  const { resort, settings, sections, rooms, amenities, gallery, experiences, attractions, restaurantItems, testimonials, contact } = data;
  const { setIsEnquiryModalOpen, setSelectedRoomForBooking } = useTenant();

  const handleBookRoom = (room: Room) => {
    setSelectedRoomForBooking(room);
    setIsEnquiryModalOpen(true);
  };

  const renderSection = (secKey: string, title?: string | null, subtitle?: string | null) => {
    switch (secKey) {
      case 'hero':
        return (
          <section key={secKey} className="relative bg-slate-900 text-white py-24 md:py-36 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <img src={rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=80'} alt="Hotel" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-blue-400" />
                  <span>Urban Coastal Hotel</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  {title || resort.name}
                </h1>

                <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                  {subtitle || settings.tagline || 'Experience sleek city luxury, high-speed fiber connectivity, and oceanviews.'}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Check Availability</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <WhatsAppCTA
                    number={contact.whatsapp_number || undefined}
                    resortName={resort.name}
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm rounded-xl border border-slate-700"
                    label="WhatsApp Desk"
                  />
                </div>
              </div>

              {/* Quick Search Card */}
              <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl space-y-4 border border-slate-100">
                <h3 className="text-xl font-bold text-gray-900">Instant Reservation Query</h3>
                <p className="text-xs text-gray-500">Select dates and guest preference to check room availability.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Check-In</label>
                    <input type="date" className="w-full text-xs p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Check-Out</label>
                    <input type="date" className="w-full text-xs p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                  </div>
                </div>
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors shadow-md"
                >
                  Request Room Quote
                </button>
              </div>
            </div>
          </section>
        );

      case 'rooms':
        return (
          <section key={secKey} id="rooms" className="py-20 bg-slate-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
                    {subtitle || 'Select Your Room'}
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                    {title || 'Modern Rooms & Executive Suites'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room: any) => (
                  <div key={room.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <img src={room.primary_image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80'} alt={room.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-md">
                        ₹{room.price}/night
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{room.short_description}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span>👥 {room.max_occupancy}</span>
                        <span>🛏️ {room.bed_type}</span>
                        <span>📐 {room.room_size}</span>
                      </div>

                      <button
                        onClick={() => handleBookRoom(room)}
                        className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                      >
                        Book Room Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'amenities':
        return (
          <section key={secKey} id="amenities" className="py-20 bg-white border-t border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {subtitle || 'Facilities'}
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {title || 'Hotel Features & Business Services'}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((a: any) => (
                  <div key={a.id} className="p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <IconHelper name={a.icon_name} className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{a.name}</h4>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={secKey} id="contact" className="py-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold">{title || 'Contact Hotel Desk'}</h2>
                <p className="text-sm text-slate-300">{contact.address}</p>
                <div className="space-y-2 text-sm text-slate-300 pt-2">
                  <p>📞 Phone: {contact.phone}</p>
                  <p>✉️ Email: {contact.email}</p>
                </div>
              </div>

              <div className="p-8 bg-slate-800 rounded-2xl space-y-4 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400">Have Questions?</h3>
                <p className="text-xs text-slate-300">Submit your enquiry and our front desk will reply immediately.</p>
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors"
                >
                  Open Booking Form
                </button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const isSecEnabled = (key: string) => {
    const sec = sections.find((s: any) => s.section_key === key);
    return sec ? !!sec.is_enabled : true;
  };

  const isRestaurantActive = (settings.restaurant_enabled === 1 || settings.restaurant_enabled === true) && isSecEnabled('restaurant') && restaurantItems.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-extrabold text-xl text-blue-600 tracking-tight">{resort.name}</span>
          <nav className="hidden md:flex gap-8 text-xs font-bold text-gray-600 uppercase tracking-wider">
            {isSecEnabled('rooms') && <a href="#rooms" className="hover:text-blue-600">Rooms & Suites</a>}
            {isSecEnabled('amenities') && <a href="#amenities" className="hover:text-blue-600">Amenities</a>}
            {isSecEnabled('experiences') && <a href="#experiences" className="hover:text-blue-600">Experiences</a>}
            {isSecEnabled('gallery') && <a href="#gallery" className="hover:text-blue-600">Gallery</a>}
            {isRestaurantActive && <a href="#restaurant" className="hover:text-blue-600">Dining</a>}
            {isSecEnabled('contact') && <a href="#contact" className="hover:text-blue-600">Contact</a>}
          </nav>
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Instant Booking
          </button>
        </div>
      </header>

      <main>
        {sections.map((sec: any) => renderSection(sec.section_key, sec.title, sec.subtitle))}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 text-center text-xs">
        <p className="font-bold text-slate-200">{resort.name}</p>
        <p className="mt-1">© {new Date().getFullYear()} {resort.name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

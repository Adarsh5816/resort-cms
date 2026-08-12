import React, { useState } from 'react';
import { PublicSiteData, Room } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { WhatsAppCTA } from '../components/WhatsAppCTA';
import { IconHelper } from '../components/IconHelper';
import { MapPin, Phone, Mail, Clock, Star, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

export const LuxuryDarkTheme: React.FC<{ data: PublicSiteData }> = ({ data }) => {
  const { resort, settings, sections, rooms, amenities, gallery, experiences, attractions, restaurantItems, testimonials, contact } = data;
  const { setIsEnquiryModalOpen, setSelectedRoomForBooking } = useTenant();

  const [activeGalleryCat, setActiveGalleryCat] = useState<string | null>(null);

  const handleBookRoom = (room: Room) => {
    setSelectedRoomForBooking(room);
    setIsEnquiryModalOpen(true);
  };

  const filteredGallery = activeGalleryCat
    ? gallery.images.filter(img => img.category_id === activeGalleryCat)
    : gallery.images;

  // Render individual sections based on section_key
  const renderSection = (secKey: string, title?: string | null, subtitle?: string | null) => {
    switch (secKey) {
      case 'hero':
        return (
          <section key={secKey} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 z-0">
              <img
                src={rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80'}
                alt={resort.name}
                className="w-full h-full object-cover opacity-30 transform scale-105 animate-pulse"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-5xl px-6 text-center space-y-6 pt-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-slate-900/80 text-amber-400 text-xs uppercase tracking-widest font-semibold backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Luxury Oceanside Sanctuary</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-serif font-bold text-slate-100 tracking-tight leading-tight">
                {title || resort.name}
              </h1>

              <p className="text-lg md:text-2xl text-slate-300 font-light max-w-3xl mx-auto italic font-serif">
                {subtitle || settings.tagline || 'Exquisite luxury tailored for discerning travelers.'}
              </p>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-sm uppercase tracking-wider rounded-none shadow-2xl transition-all transform hover:-translate-y-0.5"
                >
                  Reserve Your Suite
                </button>
                <WhatsAppCTA
                  number={contact.whatsapp_number || undefined}
                  resortName={resort.name}
                  className="px-6 py-4 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-sm uppercase tracking-wider"
                  label="Concierge WhatsApp"
                />
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={secKey} id="about" className="py-24 bg-slate-950 text-slate-200 border-b border-slate-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-amber-400 font-semibold text-xs tracking-widest uppercase">
                  {subtitle || 'Unmatched Hospitality'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                  {title || 'A Haven of Refined Elegance'}
                </h2>
                <p className="text-slate-300 text-base leading-relaxed font-light">
                  {settings.full_description || settings.short_description}
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-3xl font-serif font-bold text-amber-400">100%</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Private Suites & Villas</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif font-bold text-amber-400">24/7</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Personalized Butler Service</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 blur-xl" />
                <img
                  src={rooms[1]?.primary_image || rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'}
                  alt="About Resort"
                  className="relative rounded-lg shadow-2xl object-cover w-full h-[480px] border border-amber-500/20"
                />
              </div>
            </div>
          </section>
        );

      case 'rooms':
        return (
          <section key={secKey} id="rooms" className="py-24 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Accommodations'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100">
                  {title || 'Suites & Ocean Villas'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rooms.map(room => (
                  <div
                    key={room.id}
                    className="group bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={room.primary_image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-slate-950/90 border border-amber-500/40 px-3 py-1 text-amber-400 text-xs font-serif font-bold rounded-full">
                        ₹{room.price.toLocaleString()}<span className="text-slate-400 font-sans text-[10px]">/night</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                          {room.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                          {room.short_description || room.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-3">
                        <span>🛏️ {room.bed_type || 'King Bed'}</span>
                        <span>📐 {room.room_size || 'Spacious'}</span>
                        <span>👥 {room.max_occupancy || '2 Guests'}</span>
                        <span>⭐ Premium View</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleBookRoom(room)}
                          className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-colors text-center"
                        >
                          Book Suite
                        </button>
                        <WhatsAppCTA
                          number={contact.whatsapp_number || undefined}
                          resortName={resort.name}
                          roomName={room.name}
                          className="px-3 py-2.5 bg-slate-900 border border-amber-500/40 text-amber-400 text-xs"
                          label=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'amenities':
        return (
          <section key={secKey} id="amenities" className="py-20 bg-slate-950 text-slate-200 border-b border-slate-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Bespoke Services'}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                  {title || 'Curated Resort Amenities'}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {amenities.map(a => (
                  <div key={a.id} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 rounded-xl text-center space-y-3 transition-all hover:bg-slate-900">
                    <div className="w-12 h-12 bg-slate-950 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                      <IconHelper name={a.icon_name} className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100">{a.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'experiences':
        return (
          <section key={secKey} id="experiences" className="py-24 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Unforgettable Moments'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100">
                  {title || 'Curated Experiences'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {experiences.map(exp => (
                  <div key={exp.id} className="relative rounded-2xl overflow-hidden group border border-slate-800">
                    <img
                      src={exp.image_url || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80'}
                      alt={exp.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-8 flex flex-col justify-end">
                      <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                        {exp.duration} • {exp.location}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-white mt-1">{exp.title}</h3>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 font-light">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={secKey} id="gallery" className="py-24 bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-10">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Visual Reflections'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100">
                  {title || 'Resort Photo Gallery'}
                </h2>
              </div>

              {/* Gallery Category Filter */}
              {gallery.categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                  <button
                    onClick={() => setActiveGalleryCat(null)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                      activeGalleryCat === null
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    All Photos
                  </button>
                  {gallery.categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveGalleryCat(cat.id)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                        activeGalleryCat === cat.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map(img => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden border border-slate-900 h-64">
                    <img
                      src={img.image_url}
                      alt={img.title || 'Resort Gallery'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {img.title && (
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                        <p className="text-sm font-serif font-bold text-amber-300">{img.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'restaurant':
        if (restaurantItems.length === 0) return null;
        return (
          <section key={secKey} id="restaurant" className="py-24 bg-slate-900 text-white border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Gourmet Gastronomy'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100">
                  {title || 'Michelin Dining & Lounge'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {restaurantItems.map(item => (
                  <div key={item.id} className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex gap-6 items-center">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-24 h-24 rounded-lg object-cover border border-amber-500/20" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-lg font-serif font-bold text-white">{item.name}</h4>
                        <span className="text-amber-400 font-bold text-sm">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={secKey} id="testimonials" className="py-24 bg-slate-950 text-white">
            <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
              <div className="space-y-3">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Guest Acclaim'}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                  {title || 'What Our Guests Say'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map(t => (
                  <div key={t.id} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-300 font-serif italic leading-relaxed">
                      "{t.review_text}"
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                      {t.avatar_url && (
                        <img src={t.avatar_url} alt={t.customer_name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
                      )}
                      <div>
                        <h5 className="text-xs font-bold text-white">{t.customer_name}</h5>
                        <p className="text-[10px] text-slate-400">{t.location_or_title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={secKey} id="contact" className="py-24 bg-slate-900 text-white border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Concierge'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
                  {title || 'Reach Out To Us'}
                </h2>
                <p className="text-sm text-slate-300 font-light">
                  Our team is available 24/7 to assist with your reservation and special accommodations.
                </p>

                <div className="space-y-4 pt-4 text-sm text-slate-300">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                    <span>{contact.address || 'Ocean Crest Sanctuary, Coastal Highway'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>{contact.phone || '+1 800 555 7692'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>{contact.email || 'concierge@grandroyal.com'}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xl font-serif font-bold text-amber-400">Quick Reservation Request</h3>
                <p className="text-xs text-slate-400">Send an instant request to our reservation desk.</p>
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg"
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
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Luxury Glassmorphic Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo_url && (
              <img src={settings.logo_url} alt={resort.name} className="h-10 w-auto rounded border border-amber-500/30" />
            )}
            <span className="font-serif font-bold text-xl tracking-wider text-slate-100">
              {resort.name}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-300">
            {isSecEnabled('about') && <a href="#about" className="hover:text-amber-400 transition-colors">About</a>}
            {isSecEnabled('rooms') && <a href="#rooms" className="hover:text-amber-400 transition-colors">Villas & Rooms</a>}
            {isSecEnabled('amenities') && <a href="#amenities" className="hover:text-amber-400 transition-colors">Amenities</a>}
            {isSecEnabled('experiences') && <a href="#experiences" className="hover:text-amber-400 transition-colors">Experiences</a>}
            {isSecEnabled('gallery') && <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>}
            {isRestaurantActive && (
              <a href="#restaurant" className="hover:text-amber-400 transition-colors">Dining</a>
            )}
            {isSecEnabled('contact') && <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>}
          </nav>

          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            Book Stay
          </button>
        </div>
      </header>

      {/* Render Dynamic Sections in Order */}
      <main>
        {sections.map((sec: any) => renderSection(sec.section_key, sec.title, sec.subtitle))}
      </main>

      {/* Luxury Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <p className="font-serif font-bold text-slate-200 text-lg">{resort.name}</p>
          <p className="text-slate-500">{contact.address}</p>
          <p className="text-slate-600">© {new Date().getFullYear()} {resort.name}. Powered by Resort Website CMS.</p>
        </div>
      </footer>
    </div>
  );
};

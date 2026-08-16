import React, { useState } from 'react';
import { PublicSiteData, Room } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { WhatsAppCTA } from '../components/WhatsAppCTA';
import { IconHelper } from '../components/IconHelper';
import { MapPin, Phone, Mail, Trees, Sprout, Star } from 'lucide-react';

export const KeralaNatureTheme: React.FC<{ data: PublicSiteData }> = ({ data }) => {
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
          <section key={secKey} className="relative min-h-[90vh] flex items-center justify-center bg-stone-900 text-amber-50 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80'}
                alt={resort.name}
                className="w-full h-full object-cover opacity-40 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl px-6 text-center space-y-6 pt-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-serif italic">
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>Eco Heritage Plantation Sanctuary</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-100 tracking-tight leading-tight">
                {title || resort.name}
              </h1>

              <p className="text-lg md:text-xl text-stone-200 font-serif italic max-w-2xl mx-auto leading-relaxed">
                "{subtitle || settings.tagline || 'Surrender to nature amidst spice plantations and traditional heritage cottages.'}"
              </p>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="px-8 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-serif font-semibold text-sm rounded-full shadow-xl transition-transform hover:scale-105"
                >
                  Reserve Heritage Stay
                </button>
                <WhatsAppCTA
                  number={contact.whatsapp_number || undefined}
                  resortName={resort.name}
                  className="px-6 py-3.5 bg-emerald-900/90 hover:bg-emerald-950 border border-emerald-600/40 text-emerald-100 font-serif text-sm rounded-full"
                  label="Chat on WhatsApp"
                />
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={secKey} id="about" className="py-24 bg-[#F7F3E9] text-stone-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-amber-800 font-serif italic font-bold text-sm tracking-widest uppercase">
                  🌿 {subtitle || 'Our Legacy'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                  {title || 'Authentic Plantation Living'}
                </h2>
                <p className="text-stone-700 leading-relaxed font-serif text-base">
                  {settings.full_description || settings.short_description}
                </p>
                <div className="p-6 bg-amber-100/60 border-l-4 border-amber-800 rounded-r-xl font-serif italic text-sm text-stone-800">
                  "Step into Nalukettu architecture, listen to mountain rain streams, and sample freshly picked cardamom from our organic trails."
                </div>
              </div>

              <div className="relative">
                <img
                  src={rooms[1]?.primary_image || rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'}
                  alt="Plantation"
                  className="rounded-2xl shadow-2xl object-cover w-full h-[450px] border-4 border-amber-900/20"
                />
              </div>
            </div>
          </section>
        );

      case 'rooms':
        return (
          <section key={secKey} id="rooms" className="py-24 bg-[#EFE8D8] text-stone-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-800 font-serif italic font-bold text-sm">
                  {subtitle || 'Heritage Cottages & Villas'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900">
                  {title || 'Traditional Stays'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => (
                  <div key={room.id} className="bg-[#F7F3E9] rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 hover:shadow-2xl transition-all flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img src={room.primary_image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'} alt={room.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-emerald-900 text-emerald-100 text-xs font-serif font-bold px-3 py-1 rounded-full">
                        ₹{room.price}/night
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-stone-900">{room.name}</h3>
                        <p className="text-xs text-stone-600 font-serif mt-2 line-clamp-2">{room.short_description || room.description}</p>
                      </div>

                      <div className="text-xs text-amber-950 font-serif border-t border-amber-900/10 pt-3 space-y-1">
                        <p>🪵 Teakwood Finish • Courtyard Access</p>
                        <p>👥 {room.max_occupancy || '2 Guests'}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookRoom(room)}
                          className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif text-xs font-semibold rounded-lg transition-colors"
                        >
                          Book Stay
                        </button>
                        <WhatsAppCTA
                          number={contact.whatsapp_number || undefined}
                          resortName={resort.name}
                          roomName={room.name}
                          className="px-3 py-2 bg-emerald-900 text-emerald-100 rounded-lg text-xs"
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
          <section key={secKey} id="amenities" className="py-20 bg-[#F7F3E9] text-stone-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-800 font-serif italic text-sm">
                  {subtitle || 'Natural Wellness'}
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-900">
                  {title || 'Resort Amenities & Ayurvedic Rejuvenation'}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {amenities.map(a => (
                  <div key={a.id} className="p-6 bg-[#EFE8D8] border border-amber-900/10 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 bg-amber-800 text-amber-50 rounded-full flex items-center justify-center mx-auto">
                      <IconHelper name={a.icon_name} className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-serif font-bold text-stone-900">{a.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'experiences':
        return (
          <section key={secKey} id="experiences" className="py-24 bg-stone-900 text-amber-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-400 font-serif italic text-sm">
                  {subtitle || 'Plantation Activities'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold">
                  {title || 'Spice Trails & Nature Walks'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {experiences.map(exp => (
                  <div key={exp.id} className="bg-stone-800 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-amber-900/30">
                    {exp.image_url && (
                      <img src={exp.image_url} alt={exp.title} className="w-full md:w-1/2 h-56 md:h-auto object-cover" />
                    )}
                    <div className="p-6 flex-1 space-y-3">
                      <span className="text-amber-400 text-xs font-serif font-semibold">📍 {exp.location || 'On-site'}</span>
                      <h3 className="text-xl font-serif font-bold text-amber-100">{exp.title}</h3>
                      <p className="text-xs text-stone-300 font-serif leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'restaurant':
        if (restaurantItems.length === 0) return null;
        return (
          <section key={secKey} id="restaurant" className="py-24 bg-[#F7F3E9] text-stone-900">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-amber-800 font-serif italic text-sm">
                  {subtitle || 'Banana Leaf Feast'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold">
                  {title || 'Authentic Kerala Dining'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurantItems.map(item => (
                  <div key={item.id} className="p-6 bg-[#EFE8D8] border border-amber-900/10 rounded-2xl flex gap-4 items-center">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />}
                    <div>
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-base font-serif font-bold text-stone-900">{item.name}</h4>
                        <span className="text-amber-800 font-serif font-bold text-sm">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-stone-600 font-serif mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gallery': {
        const images = gallery?.images || [];
        return (
          <section key={secKey} id="gallery" className="py-24 bg-[#EFE8D8] text-stone-900">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-amber-800 font-serif italic text-sm">
                  {subtitle || 'Natural Memories'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900">
                  {title || 'Photo Gallery'}
                </h2>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((img: any) => (
                    <div key={img.id} className="rounded-2xl overflow-hidden border border-amber-900/10 shadow-md aspect-[4/3]">
                      <img src={img.image_url} alt={img.title || 'Resort Photo'} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-stone-500 font-serif text-sm italic">Gallery images coming soon.</p>
              )}
            </div>
          </section>
        );
      }

      case 'contact':
        return (
          <section key={secKey} id="contact" className="py-24 bg-stone-950 text-amber-50">
            <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
              <span className="text-amber-400 font-serif italic text-sm">
                {subtitle || 'Visit Us'}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold">{title || 'Location & Contact'}</h2>
              <p className="text-stone-300 font-serif max-w-xl mx-auto text-sm">{contact.address}</p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="px-8 py-3.5 bg-amber-700 text-amber-50 font-serif font-bold text-sm rounded-full hover:bg-amber-800 transition-colors shadow-lg"
                >
                  Send Reservation Enquiry
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
    <div className="min-h-screen bg-[#F7F3E9] text-stone-900 font-serif">
      <header className="sticky top-0 z-40 bg-[#EFE8D8]/90 backdrop-blur-md border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-serif font-bold text-xl text-amber-950">{resort.name}</span>
          <nav className="hidden md:flex gap-6 text-xs font-bold text-stone-800 uppercase tracking-wider">
            {isSecEnabled('about') && <a href="#about">About</a>}
            {isSecEnabled('rooms') && <a href="#rooms">Cottages & Rooms</a>}
            {isSecEnabled('amenities') && <a href="#amenities">Wellness</a>}
            {isSecEnabled('experiences') && <a href="#experiences">Trails</a>}
            {isRestaurantActive && <a href="#restaurant">Dining</a>}
            {isSecEnabled('contact') && <a href="#contact">Contact</a>}
          </nav>
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md"
          >
            Check Dates
          </button>
        </div>
      </header>

      <main>
        {sections.map((sec: any) => renderSection(sec.section_key, sec.title, sec.subtitle))}
      </main>

      <footer className="bg-stone-950 text-stone-400 py-10 text-center text-xs border-t border-stone-800">
        <p className="font-serif font-bold text-stone-200 text-base">{resort.name}</p>
        <p className="mt-2">© {new Date().getFullYear()} {resort.name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { PublicSiteData, Room } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { WhatsAppCTA } from '../components/WhatsAppCTA';
import { IconHelper } from '../components/IconHelper';
import { LexurLogo } from '../components/LexurLogo';
import { getFullImageUrl } from '../../services/api';
import {
  Trees, Compass, Home, Utensils, Wifi, Car, Flame, Shield, MapPin, Phone, Mail,
  Star, CheckCircle2, ChevronRight, Sparkles, Moon
} from 'lucide-react';

export const LexurForestTheme: React.FC<{ data: PublicSiteData }> = ({ data }) => {
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
          <section key={secKey} className="relative min-h-[92vh] flex items-center justify-center bg-[#071F13] text-white overflow-hidden pt-12">
            {/* Background Forest Image with Deep Forest Emerald Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80'}
                alt="Lexur Green Villa"
                className="w-full h-full object-cover opacity-35 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#071F13]/70 to-[#0A2E1C]/40" />
            </div>

            <div className="relative z-10 max-w-5xl px-6 text-center space-y-6 pt-16">
              {/* Forest Border Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-widest shadow-2xl backdrop-blur-md">
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>Valluvady Forest Border • Wayanad, Kerala</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-emerald-50 tracking-tight leading-tight">
                {title || 'Lexur Green Serviced Villa'}
              </h1>

              <p className="text-lg md:text-2xl text-emerald-100 font-serif italic max-w-3xl mx-auto leading-relaxed">
                "{subtitle || 'Experience the real feel of being deep into nature right near the forest border.'}"
              </p>

              {/* Business Card Quick Features Bar */}
              <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs font-semibold text-emerald-200">
                <span className="px-3 py-1.5 bg-[#0F3822]/90 border border-emerald-600/30 rounded-lg">🏡 3BHK Private Villa</span>
                <span className="px-3 py-1.5 bg-[#0F3822]/90 border border-emerald-600/30 rounded-lg">🍳 Fully Equipped Kitchen</span>
                <span className="px-3 py-1.5 bg-[#0F3822]/90 border border-emerald-600/30 rounded-lg">🐅 Night Jungle Safari</span>
                <span className="px-3 py-1.5 bg-[#0F3822]/90 border border-emerald-600/30 rounded-lg">🚗 Secure Parking</span>
                <span className="px-3 py-1.5 bg-[#0F3822]/90 border border-emerald-600/30 rounded-lg">📶 Free Wi-Fi</span>
                <span className="px-3 py-1.5 bg-[#0F3822]/90 border border-emerald-600/30 rounded-lg">🍲 Homely Food on Order</span>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-2xl transition-transform hover:scale-105"
                >
                  Book 3BHK Villa Stay
                </button>
                <WhatsAppCTA
                  number={contact.whatsapp_number || '918078776634'}
                  resortName={resort.name}
                  className="px-6 py-4 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-semibold text-sm rounded-xl shadow-xl"
                  label="Chat on WhatsApp: 8078 77 66 34"
                />
              </div>

              {/* Business Card OTA Badges */}
              <div className="pt-8 border-t border-emerald-900/60 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 opacity-90">
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">Available On:</span>
                <span className="px-3 py-1 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-bold rounded">make my trip</span>
                <span className="px-3 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-bold rounded">Booking.com</span>
                <span className="px-3 py-1 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold rounded">airbnb</span>
                <span className="px-3 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold rounded">agoda</span>
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={secKey} id="about" className="py-24 bg-[#F4EFE6] text-stone-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/10 text-emerald-900 border border-emerald-900/20 rounded-full text-xs font-serif font-bold">
                  <Trees className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Valluvady Forest Sanctuary • Wayanad</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-950 leading-tight">
                  {title || 'Real Nature Feel Near Forest Border'}
                </h2>

                <p className="text-stone-700 leading-relaxed font-serif text-base">
                  {settings.full_description || settings.short_description}
                </p>

                {/* Card Features List */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-900/10">
                  <div className="p-4 bg-[#EBE4D5] rounded-xl border border-emerald-900/10 space-y-1">
                    <p className="font-serif font-bold text-emerald-950 text-sm">🏡 3BHK Private Villa</p>
                    <p className="text-xs text-stone-600">Exclusive privacy for family & friend groups.</p>
                  </div>
                  <div className="p-4 bg-[#EBE4D5] rounded-xl border border-emerald-900/10 space-y-1">
                    <p className="font-serif font-bold text-emerald-950 text-sm">🐅 Night Jungle Safari</p>
                    <p className="text-xs text-stone-600">Nocturnal wildlife tracking in Valluvady.</p>
                  </div>
                  <div className="p-4 bg-[#EBE4D5] rounded-xl border border-emerald-900/10 space-y-1">
                    <p className="font-serif font-bold text-emerald-950 text-sm">🍳 Fully Equipped Kitchen</p>
                    <p className="text-xs text-stone-600">Cook your own meals or order homely food.</p>
                  </div>
                  <div className="p-4 bg-[#EBE4D5] rounded-xl border border-emerald-900/10 space-y-1">
                    <p className="font-serif font-bold text-emerald-950 text-sm">🍲 Homely Food on Order</p>
                    <p className="text-xs text-stone-600">Authentic Kerala chicken curry & appam.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-900/20 to-emerald-700/20 rounded-3xl blur-lg" />
                <img
                  src={rooms[0]?.primary_image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'}
                  alt="Lexur Green Serviced Villa"
                  className="relative rounded-2xl shadow-2xl object-cover w-full h-[480px] border-4 border-emerald-900/30"
                />
              </div>
            </div>
          </section>
        );

      case 'experiences':
        return (
          <section key={secKey} id="experiences" className="py-24 bg-[#071F13] text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                  {subtitle || 'Valluvady Forest Adventures'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-50">
                  {title || 'Night Jungle Safari & Forest Border Trails'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="bg-[#0D2E1D] rounded-2xl overflow-hidden border border-emerald-800/40 shadow-2xl flex flex-col">
                    {exp.image_url && (
                      <img src={exp.image_url} alt={exp.title} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-emerald-400 text-xs font-semibold uppercase">📍 {exp.location || 'Valluvady'}</span>
                          {exp.price ? <span className="text-emerald-300 font-bold text-sm">₹{exp.price}</span> : null}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mt-1">{exp.title}</h3>
                        <p className="text-xs text-emerald-200 mt-2 font-light leading-relaxed">{exp.description}</p>
                      </div>

                      <button
                        onClick={() => setIsEnquiryModalOpen(true)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors mt-4"
                      >
                        Book Safari Experience
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'rooms':
        return (
          <section key={secKey} id="rooms" className="py-24 bg-[#EBE4D5] text-stone-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-emerald-900 font-serif font-bold text-xs uppercase tracking-widest">
                  {subtitle || 'Serviced Villa Accommodations'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-950">
                  {title || '3BHK Villa & Bedrooms'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {rooms.map((room: any) => (
                  <div key={room.id} className="bg-[#F4EFE6] rounded-2xl overflow-hidden border border-emerald-900/10 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-60 overflow-hidden">
                        <img src={room.primary_image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'} alt={room.name} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-[#071F13] text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/40">
                          ₹{room.price}/night
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-serif font-bold text-emerald-950">{room.name}</h3>
                        <p className="text-xs text-stone-600 line-clamp-2">{room.short_description || room.description}</p>
                        
                        <div className="text-xs text-emerald-900 font-serif border-t border-emerald-900/10 pt-3 space-y-1">
                          <p>🛏️ Bed: {room.bed_type || '3 King Beds'}</p>
                          <p>👥 Occupancy: {room.max_occupancy || '6-10 Guests'}</p>
                          <p>📐 Size: {room.room_size || '1,800 sq.ft'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex gap-2">
                      <button
                        onClick={() => handleBookRoom(room)}
                        className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                      >
                        Book Room
                      </button>
                      <WhatsAppCTA
                        number={contact.whatsapp_number || '918078776634'}
                        resortName={resort.name}
                        roomName={room.name}
                        className="px-3 py-3 bg-[#071F13] text-emerald-300 rounded-lg text-xs"
                        label=""
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'amenities':
        return (
          <section key={secKey} id="amenities" className="py-20 bg-[#F4EFE6] text-stone-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-emerald-900 font-serif font-bold text-xs uppercase tracking-widest">
                  {subtitle || 'Villa Facilities'}
                </span>
                <h2 className="text-3xl font-serif font-bold text-emerald-950">
                  {title || 'Serviced Villa Amenities'}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((a: any) => (
                  <div key={a.id} className="p-6 bg-[#EBE4D5] border border-emerald-900/10 rounded-2xl text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#071F13] text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                      <IconHelper name={a.icon_name} className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-serif font-bold text-emerald-950">{a.name}</h4>
                    <p className="text-xs text-stone-600">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'restaurant':
        if (restaurantItems.length === 0) return null;
        return (
          <section key={secKey} id="restaurant" className="py-24 bg-[#071F13] text-white">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <span className="text-emerald-400 font-serif font-bold text-xs uppercase tracking-widest">
                  {subtitle || 'Homely Kerala Cooking'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-50">
                  {title || 'Homely Food on Order'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurantItems.map((item: any) => (
                  <div key={item.id} className="p-6 bg-[#0D2E1D] border border-emerald-800/40 rounded-2xl flex gap-4 items-center shadow-lg">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-base font-serif font-bold text-white">{item.name}</h4>
                        <span className="text-emerald-400 font-bold text-sm">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-emerald-200 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={secKey} id="contact" className="py-24 bg-[#05180E] text-white border-t border-emerald-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                {settings.logo_url ? (
                  <img src={getFullImageUrl(settings.logo_url)} alt={resort.name} className="h-16 w-auto object-contain" />
                ) : (
                  <LexurLogo className="h-16" variant="white" showSubtitle={true} />
                )}
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-50 leading-tight">
                  {title || 'Reserve Your Forest Stay'}
                </h2>
                
                <div className="space-y-3 text-sm text-emerald-200 pt-2 font-serif">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{contact.address || 'Valluvady, Sulthan Bathery, Wayanad, Kerala'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Phone / WhatsApp: {contact.phone || '+91 80787 76634'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Email: {contact.email || 'lexurbooking@gmail.com'}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#0D2E1D] border border-emerald-800/60 rounded-3xl space-y-4 shadow-2xl">
                <h3 className="text-xl font-serif font-bold text-emerald-300">Send Direct Enquiry</h3>
                <p className="text-xs text-emerald-200">Our desk will confirm availability for your preferred dates.</p>
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg"
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
    <div className="min-h-screen bg-[#071F13] text-white font-serif selection:bg-emerald-600 selection:text-white">
      {/* Lexur Green Header matching Business Card Logo */}
      <header className="sticky top-0 z-40 bg-[#071F13]/95 backdrop-blur-md border-b border-emerald-900/60 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {settings.logo_url ? (
            <img src={getFullImageUrl(settings.logo_url)} alt={resort.name} className="h-12 w-auto object-contain" />
          ) : (
            <LexurLogo className="h-12" variant="white" showSubtitle={true} />
          )}

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-emerald-100 font-sans">
            {isSecEnabled('about') && <a href="#about" className="hover:text-emerald-400">About</a>}
            {isSecEnabled('rooms') && <a href="#rooms" className="hover:text-emerald-400">Villa & Rooms</a>}
            {isSecEnabled('experiences') && <a href="#experiences" className="hover:text-emerald-400">Night Safari</a>}
            {isSecEnabled('amenities') && <a href="#amenities" className="hover:text-emerald-400">Amenities</a>}
            {isSecEnabled('gallery') && <a href="#gallery" className="hover:text-emerald-400">Gallery</a>}
            {isRestaurantActive && (
              <a href="#restaurant" className="hover:text-emerald-400">Homely Food</a>
            )}
            {isSecEnabled('contact') && <a href="#contact" className="hover:text-emerald-400">Contact</a>}
          </nav>

          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg font-sans"
          >
            Enquire Stay
          </button>
        </div>
      </header>

      <main>
        {sections.map((sec: any) => renderSection(sec.section_key, sec.title, sec.subtitle))}
      </main>

      <footer className="bg-[#05180E] text-emerald-400 py-10 text-center text-xs border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-6 space-y-3">
          {settings.logo_url ? (
            <img src={getFullImageUrl(settings.logo_url)} alt={resort.name} className="h-10 w-auto object-contain mx-auto" />
          ) : (
            <LexurLogo className="h-10 mx-auto justify-center" variant="white" showSubtitle={false} />
          )}
          <p className="text-emerald-200">Valluvady, Wayanad, Kerala • www.lexurbooking.in</p>
          <p className="text-emerald-500">© {new Date().getFullYear()} Lexur Green Serviced Villa. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

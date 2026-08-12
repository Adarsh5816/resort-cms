export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'RESORT_ADMIN';
  resort_id: string | null;
  resort?: Resort | null;
}

export interface Resort {
  id: string;
  name: string;
  slug: string;
  custom_domain?: string | null;
  status: 'active' | 'suspended' | 'draft';
  theme_id?: string;
  admin_email?: string;
  admin_name?: string;
}

export interface WebsiteSettings {
  id?: string;
  resort_id?: string;
  logo_url?: string | null;
  favicon_url?: string | null;
  tagline?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image_url?: string | null;
  canonical_url?: string | null;
  restaurant_enabled?: number | boolean;
  draft_mode?: number | boolean;
}

export interface ThemeSettings {
  id?: string;
  resort_id?: string;
  theme_id: 'luxury-dark' | 'kerala-nature' | 'modern-hotel' | string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_family?: string;
  border_radius?: string;
  header_style?: string;
  hero_style?: string;
}

export interface HomepageSection {
  id: string;
  resort_id?: string;
  section_key: 'hero' | 'about' | 'rooms' | 'amenities' | 'experiences' | 'gallery' | 'restaurant' | 'testimonials' | 'contact' | string;
  title: string;
  subtitle?: string | null;
  is_enabled: number | boolean;
  display_order: number;
}

export interface RoomImage {
  id: string;
  image_url: string;
  caption?: string | null;
  display_order?: number;
}

export interface Amenity {
  id: string;
  resort_id?: string;
  name: string;
  icon_name: string;
  description?: string | null;
  is_featured?: number | boolean;
  is_active?: number | boolean;
  display_order?: number;
}

export interface Room {
  id: string;
  resort_id?: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  discounted_price?: number | null;
  max_occupancy?: string | null;
  bed_type?: string | null;
  room_size?: string | null;
  primary_image?: string | null;
  display_order?: number;
  is_active?: number | boolean;
  images?: RoomImage[];
  amenities?: Amenity[];
}

export interface GalleryCategory {
  id: string;
  name: string;
  display_order?: number;
}

export interface GalleryImage {
  id: string;
  category_id?: string | null;
  image_url: string;
  title?: string | null;
  alt_text?: string | null;
  display_order?: number;
}

export interface Experience {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  price?: number | null;
  duration?: string | null;
  location?: string | null;
  is_active?: number | boolean;
  display_order?: number;
}

export interface Attraction {
  id: string;
  name: string;
  description?: string | null;
  distance?: string | null;
  travel_time?: string | null;
  image_url?: string | null;
  google_maps_url?: string | null;
  display_order?: number;
}

export interface RestaurantItem {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
  is_vegetarian?: number | boolean;
  is_active?: number | boolean;
  display_order?: number;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  location_or_title?: string | null;
  rating: number;
  review_text: string;
  avatar_url?: string | null;
  review_date?: string | null;
  is_active?: number | boolean;
  display_order?: number;
}

export interface ContactInformation {
  id?: string;
  phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  address?: string | null;
  google_maps_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  cancellation_policy?: string | null;
  terms_and_conditions?: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Enquiry {
  id: string;
  guest_name: string;
  email: string;
  phone: string;
  check_in?: string | null;
  check_out?: string | null;
  guests_count?: number;
  room_preference?: string | null;
  message?: string | null;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED' | 'CLOSED';
  admin_notes?: string | null;
  created_at: string;
}

export interface PublicSiteData {
  resort: Resort;
  settings: WebsiteSettings;
  theme: ThemeSettings;
  sections: HomepageSection[];
  rooms: Room[];
  amenities: Amenity[];
  gallery: {
    categories: GalleryCategory[];
    images: GalleryImage[];
  };
  experiences: Experience[];
  attractions: Attraction[];
  restaurantItems: RestaurantItem[];
  testimonials: Testimonial[];
  contact: ContactInformation;
  socialLinks: SocialLink[];
}

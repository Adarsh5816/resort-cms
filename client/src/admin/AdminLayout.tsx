import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WebsitePreviewModal } from './components/WebsitePreviewModal';
import {
  LayoutDashboard,
  Building,
  BedDouble,
  Sparkles,
  Image as ImageIcon,
  Compass,
  MapPin,
  UtensilsCrossed,
  MessageSquare,
  Mail,
  FileText,
  Palette,
  Eye,
  LogOut,
  ChevronRight,
  Shield,
  Home
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    ...(user?.role === 'SUPER_ADMIN' ? [{ label: 'All Resorts (Platform)', path: '/admin/resorts', icon: Building }] : []),
    { label: 'Resort Profile', path: '/admin/profile', icon: Building },
    { label: 'Website & Themes', path: '/admin/website', icon: Palette },
    { label: 'Rooms & Rates', path: '/admin/rooms', icon: BedDouble },
    { label: 'Amenities', path: '/admin/amenities', icon: Sparkles },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Experiences', path: '/admin/experiences', icon: Compass },
    { label: 'Attractions', path: '/admin/attractions', icon: MapPin },
    { label: 'Restaurant & Menu', path: '/admin/restaurant', icon: UtensilsCrossed },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Enquiries', path: '/admin/enquiries', icon: Mail },
    { label: 'Invoices & Billing', path: '/admin/invoices', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg">
              R
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-100 leading-tight">Resort CMS</h1>
              <p className="text-[10px] text-slate-400 font-mono">
                {user?.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user?.resort?.name || 'RESORT ADMIN'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Website</span>
          </button>

          <Link
            to="/"
            className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-lg text-[11px] font-medium flex items-center justify-center gap-2 transition-colors border border-slate-800"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 border-b border-slate-800 px-8 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Logged in as:</span>
            <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              {user?.name} ({user?.email})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Website</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Live Preview Drawer / Modal */}
      <WebsitePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
};

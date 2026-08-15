import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

import { TenantBar } from './public/components/TenantBar';
import { SectionRenderer } from './public/components/SectionRenderer';
import { EnquiryModal } from './public/components/EnquiryModal';

import { Login } from './admin/pages/Login';
import { AdminLayout } from './admin/AdminLayout';
import { DashboardOverview } from './admin/pages/DashboardOverview';
import { SuperAdminResorts } from './admin/pages/SuperAdminResorts';
import { ResortProfile } from './admin/pages/ResortProfile';
import { RoomManagement } from './admin/pages/RoomManagement';
import { AmenityManagement } from './admin/pages/AmenityManagement';
import { GalleryManagement } from './admin/pages/GalleryManagement';
import { ExperienceManagement } from './admin/pages/ExperienceManagement';
import { AttractionManagement } from './admin/pages/AttractionManagement';
import { RestaurantManagement } from './admin/pages/RestaurantManagement';
import { TestimonialManagement } from './admin/pages/TestimonialManagement';
import { EnquiryManagement } from './admin/pages/EnquiryManagement';
import { InvoiceManagement } from './admin/pages/InvoiceManagement';
import { WebsiteCustomizer } from './admin/pages/WebsiteCustomizer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-xs">Authenticating user...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicSiteView: React.FC = () => {
  return (
    <div>
      <TenantBar />
      <SectionRenderer />
      <EnquiryModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TenantProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Resort Website Entry */}
            <Route path="/" element={<PublicSiteView />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin CMS SaaS Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="resorts" element={<SuperAdminResorts />} />
              <Route path="profile" element={<ResortProfile />} />
              <Route path="website" element={<WebsiteCustomizer />} />
              <Route path="rooms" element={<RoomManagement />} />
              <Route path="amenities" element={<AmenityManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="experiences" element={<ExperienceManagement />} />
              <Route path="attractions" element={<AttractionManagement />} />
              <Route path="restaurant" element={<RestaurantManagement />} />
              <Route path="testimonials" element={<TestimonialManagement />} />
              <Route path="enquiries" element={<EnquiryManagement />} />
              <Route path="invoices" element={<InvoiceManagement />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TenantProvider>
    </AuthProvider>
  );
};

export default App;

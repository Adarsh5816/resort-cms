import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import publicRoutes from './routes/publicRoutes';
import resortRoutes from './routes/resortRoutes';
import roomRoutes from './routes/roomRoutes';
import amenityRoutes from './routes/amenityRoutes';
import galleryRoutes from './routes/galleryRoutes';
import experienceRoutes from './routes/experienceRoutes';
import attractionRoutes from './routes/attractionRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import websiteRoutes from './routes/websiteRoutes';
import uploadRoutes from './routes/uploadRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import { seedDatabase } from './db/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes Wiring
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/resorts', resortRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Boot Database and Express Server
async function startServer() {
  try {
    console.log('🚀 Initializing database...');
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Multi-Tenant Resort CMS Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();

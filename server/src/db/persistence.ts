import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getDb } from './index';

const backupFilePath = path.join(__dirname, '../../data/persistent_backup.json');

/**
 * Saves a complete snapshot of all customer data, uploaded images, theme settings, and custom configurations to persistent_backup.json
 */
export async function createBackupSnapshot(): Promise<boolean> {
  try {
    const db = await getDb();

    const data = {
      timestamp: new Date().toISOString(),
      resorts: await db.all('SELECT * FROM resorts'),
      users: await db.all('SELECT * FROM users'),
      website_settings: await db.all('SELECT * FROM website_settings'),
      theme_settings: await db.all('SELECT * FROM theme_settings'),
      homepage_sections: await db.all('SELECT * FROM homepage_sections'),
      rooms: await db.all('SELECT * FROM rooms'),
      room_images: await db.all('SELECT * FROM room_images'),
      amenities: await db.all('SELECT * FROM amenities'),
      room_amenities: await db.all('SELECT * FROM room_amenities'),
      gallery_categories: await db.all('SELECT * FROM gallery_categories'),
      gallery_images: await db.all('SELECT * FROM gallery_images'),
      experiences: await db.all('SELECT * FROM experiences'),
      attractions: await db.all('SELECT * FROM attractions'),
      restaurant_items: await db.all('SELECT * FROM restaurant_items'),
      testimonials: await db.all('SELECT * FROM testimonials'),
      contact_information: await db.all('SELECT * FROM contact_information'),
      social_links: await db.all('SELECT * FROM social_links'),
      enquiries: await db.all('SELECT * FROM enquiries'),
      invoices: await db.all('SELECT * FROM invoices')
    };

    const dir = path.dirname(backupFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(backupFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('💾 Persistent database backup snapshot saved successfully.');
    return true;
  } catch (err) {
    console.error('Failed to create persistent backup snapshot:', err);
    return false;
  }
}

/**
 * Checks if persistent_backup.json exists and restores customer data if the DB was reset
 */
export async function restoreBackupSnapshotIfAvailable(): Promise<boolean> {
  try {
    if (!fs.existsSync(backupFilePath)) {
      return false;
    }

    const raw = fs.readFileSync(backupFilePath, 'utf-8');
    const data = JSON.parse(raw);

    if (!data || !Array.isArray(data.resorts) || data.resorts.length === 0) {
      return false;
    }

    const db = await getDb();
    console.log('🔄 Found persistent backup snapshot! Restoring customer images, settings, and content...');

    const tables = [
      'invoices', 'enquiries', 'social_links', 'contact_information',
      'testimonials', 'restaurant_items', 'attractions', 'experiences',
      'gallery_images', 'gallery_categories', 'room_amenities', 'amenities',
      'room_images', 'rooms', 'homepage_sections', 'theme_settings',
      'website_settings', 'users', 'resorts'
    ];

    for (const table of tables) {
      await db.exec(`DELETE FROM ${table}`);
    }

    // Insert restored data helper
    const insertRows = async (tableName: string, rows: any[]) => {
      if (!Array.isArray(rows) || rows.length === 0) return;
      for (const row of rows) {
        const keys = Object.keys(row);
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => row[k]);
        const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
        await db.run(sql, values);
      }
    };

    await insertRows('resorts', data.resorts);
    await insertRows('users', data.users);
    await insertRows('website_settings', data.website_settings);
    await insertRows('theme_settings', data.theme_settings);
    await insertRows('homepage_sections', data.homepage_sections);
    await insertRows('rooms', data.rooms);
    await insertRows('room_images', data.room_images);
    await insertRows('amenities', data.amenities);
    await insertRows('room_amenities', data.room_amenities);
    await insertRows('gallery_categories', data.gallery_categories);
    await insertRows('gallery_images', data.gallery_images);
    await insertRows('experiences', data.experiences);
    await insertRows('attractions', data.attractions);
    await insertRows('restaurant_items', data.restaurant_items);
    await insertRows('testimonials', data.testimonials);
    await insertRows('contact_information', data.contact_information);
    await insertRows('social_links', data.social_links);
    await insertRows('enquiries', data.enquiries);
    await insertRows('invoices', data.invoices);

    // Auto-repair core admin password hashes to guarantee login access
    const superPassHash = await bcrypt.hash('lock@Jyothika5816', 10);
    const akashPassHash = await bcrypt.hash('8606778603', 10);
    await db.run('UPDATE users SET password_hash = ? WHERE email = ?', [superPassHash, 'adarsh.m.sasi@gmail.com']);
    await db.run('UPDATE users SET password_hash = ? WHERE email = ?', [akashPassHash, 'akashvalluvady@gmail.com']);

    console.log('✅ Customer data and admin logins restored 100% successfully from persistent backup snapshot.');
    return true;
  } catch (err) {
    console.error('Failed to restore backup snapshot:', err);
    return false;
  }
}

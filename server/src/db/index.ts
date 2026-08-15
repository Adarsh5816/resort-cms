import sqlite3 from 'sqlite3';
import { open, Database as SqliteDatabase } from 'sqlite';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

let sqliteDbInstance: SqliteDatabase | null = null;
let pgPoolInstance: Pool | null = null;

// Convert SQLite '?' placeholders to PostgreSQL '$1, $2, $3...'
function convertSqlPlaceholders(sql: string): string {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

export async function getDb(): Promise<any> {
  const databaseUrl = process.env.DATABASE_URL;

  // Use PostgreSQL (Supabase / Render Database) if DATABASE_URL is set
  if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
    if (!pgPoolInstance) {
      pgPoolInstance = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });
      console.log('🔗 Connected to persistent PostgreSQL / Supabase Database!');
    }

    return {
      all: async (sql: string, params: any[] = []) => {
        const pgSql = convertSqlPlaceholders(sql);
        const res = await pgPoolInstance!.query(pgSql, params);
        return res.rows;
      },
      get: async (sql: string, params: any[] = []) => {
        const pgSql = convertSqlPlaceholders(sql);
        const res = await pgPoolInstance!.query(pgSql, params);
        return res.rows[0] || null;
      },
      run: async (sql: string, params: any[] = []) => {
        const pgSql = convertSqlPlaceholders(sql);
        const res = await pgPoolInstance!.query(pgSql, params);
        return { changes: res.rowCount };
      },
      exec: async (sql: string) => {
        await pgPoolInstance!.query(sql);
      }
    };
  }

  // Fallback to SQLite for local development
  if (sqliteDbInstance) return sqliteDbInstance;

  const dbDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'resort_cms.sqlite');
  sqliteDbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await sqliteDbInstance.run('PRAGMA foreign_keys = ON;');
  return sqliteDbInstance;
}

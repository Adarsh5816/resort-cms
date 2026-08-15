import sqlite3 from 'sqlite3';
import { open, Database as SqliteDatabase } from 'sqlite';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

let sqliteDbInstance: SqliteDatabase | null = null;
let pgPoolInstance: Pool | null = null;
let pgFailed = false;

// Convert SQLite '?' placeholders to PostgreSQL '$1, $2, $3...'
function convertSqlPlaceholders(sql: string): string {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

export async function getDb(): Promise<any> {
  const databaseUrl = process.env.DATABASE_URL;

  // Try PostgreSQL (Supabase / Render Database) if DATABASE_URL is set and hasn't failed auth
  if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) && !pgFailed) {
    try {
      if (!pgPoolInstance) {
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
          connectionTimeoutMillis: 5000
        });

        // Test connection
        const client = await pool.connect();
        client.release();

        pgPoolInstance = pool;
        console.log('🔗 Connected successfully to persistent PostgreSQL / Supabase Database!');
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
          const pgSql = convertSqlPlaceholders(sql);
          await pgPoolInstance!.query(pgSql);
        }
      };
    } catch (err: any) {
      console.warn(`⚠️ PostgreSQL connection failed (${err.message || 'auth error'}). Falling back to SQLite database.`);
      pgFailed = true;
      if (pgPoolInstance) {
        pgPoolInstance.end().catch(() => {});
        pgPoolInstance = null;
      }
    }
  }

  // Fallback to SQLite for local development or fallback
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

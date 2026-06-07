import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from 'crypto';

const envPath = path.resolve(process.cwd(), '.env');
console.log(`[Environmental Config] Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('[Environmental Config] Failed to load .env file:', result.error);
} else {
  console.log('[Environmental Config] .env file loaded successfully.');
}

// Specify high-fidelity database structures
export interface Medicine {
  id: string;
  name: string;
  price: number;
  imgGradient?: string;
  imgUrl?: string; // For added / custom images
  category: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon';
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;
  items: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
}

// Support seamless local development fallback matching Turso schema perfectly:
// If live env vars are missing, we fall back to local sqlite db named 'local_turso.db' in the backend folder
const dbUrl = process.env.TURSO_CONNECTION_URL || `file:${path.join(process.cwd(), 'backend', 'local_turso.db')}`;
const dbToken = process.env.TURSO_AUTH_TOKEN || '';

console.log(`[Turso DB] Connecting to libSQL client at address: ${dbUrl}`);

let activeClient = createClient({
  url: dbUrl,
  authToken: dbToken,
});

// Create a Proxy around the active client so database calls dynamically delegate to whichever client is active (remote vs local fallback)
export const db = new Proxy({} as any, {
  get(target, prop, receiver) {
    const val = Reflect.get(activeClient, prop, receiver);
    if (typeof val === 'function') {
      const boundFn = val.bind(activeClient);

      // If the function is execute, transaction, or batch, wrap it with automatic connection fallback
      if (prop === 'execute' || prop === 'transaction' || prop === 'batch') {
        return async function(...args: any[]) {
          try {
            return await boundFn(...args);
          } catch (error: any) {
            const isConnectionError = error?.message?.includes('fetch failed') || 
                                      error?.message?.includes('ConnectTimeoutError') ||
                                      error?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                                      error?.message?.includes('Connect Timeout');

            if (isConnectionError && !dbUrl.startsWith('file:') && !usingLocalFallback) {
              console.warn(`[Turso DB] Query failed due to connection error: ${error.message}. Switching to local SQLite database...`);
              usingLocalFallback = true;
              const localDbUrl = `file:${path.join(process.cwd(), 'backend', 'local_turso.db')}`;
              activeClient = createClient({
                url: localDbUrl,
              });

              // Re-initialize the local database schema before retrying the query
              isInitialized = false;
              await initializeDB();

              // Now retry the database operation using the new local client
              const newBoundFn = activeClient[prop as keyof typeof activeClient] as Function;
              return await newBoundFn.bind(activeClient)(...args);
            }
            throw error;
          }
        };
      }
      return boundFn;
    }
    return val;
  }
});

// Async lock or trigger to prevent double initialization race conditions
let isInitialized = false;
let usingLocalFallback = false;

export async function initializeDB() {
  if (isInitialized) return;

  try {
    // 0. Create admin_sessions table schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        token TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // 1. Create medicines table schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS medicines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        imgGradient TEXT,
        imgUrl STRING,
        category TEXT NOT NULL,
        stock INTEGER NOT NULL,
        status TEXT NOT NULL
      )
    `);

    // 2. Create orders table schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL
      )
    `);

    // Create settings table schema for persistent configurations (e.g., custom shop images)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // 3. Populate default medicines if the table is currently empty
    const medsCheck = await db.execute('SELECT count(*) as count FROM medicines');
    const medsCount = Number(medsCheck.rows[0]?.count || 0);

    if (medsCount === 0) {
      console.log('[Turso DB] Table medicines is empty. Initializing with default PMDC-certified retail products...');
      const defaultMeds: Medicine[] = [
        { id: 'panadol', name: 'Panadol 500mg', price: 120, imgGradient: 'from-rose-50 to-rose-100 text-rose-500', category: 'All Medicines', stock: 150, status: 'In Stock' },
        { id: 'brufen', name: 'Brufen 400mg', price: 150, imgGradient: 'from-indigo-50 to-indigo-100 text-indigo-500', category: 'All Medicines', stock: 85, status: 'Low Stock' },
        { id: 'augmentin', name: 'Augmentin 625mg', price: 280, imgGradient: 'from-emerald-50 to-emerald-100 text-[#10b981]', category: 'All Medicines', stock: 60, status: 'Low Stock' },
        { id: 'caltrate', name: 'Caltrate Plus', price: 950, imgGradient: 'from-amber-50 to-amber-100 text-amber-500', category: 'Vitamins & Supplements', stock: 110, status: 'In Stock' },
        { id: 'supradyn', name: 'Supradyn', price: 850, imgGradient: 'from-sky-50 to-sky-100 text-sky-500', category: 'Vitamins & Supplements', stock: 95, status: 'In Stock' },
        { id: 'surbex', name: 'Surbex Z (35 Tablets)', price: 850, imgGradient: 'from-orange-50 to-orange-100 text-orange-500', category: 'Vitamins & Supplements', stock: 40, status: 'Low Stock' }
      ];

      for (const m of defaultMeds) {
        await db.execute({
          sql: `INSERT INTO medicines (id, name, price, imgGradient, imgUrl, category, stock, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [m.id, m.name, m.price, m.imgGradient || '', m.imgUrl || '', m.category, m.stock, m.status]
        });
      }
    }

    // 4. Populate default orders if the table is empty
    const ordersCheck = await db.execute('SELECT count(*) as count FROM orders');
    const ordersCount = Number(ordersCheck.rows[0]?.count || 0);

    if (ordersCount === 0) {
      console.log('[Turso DB] Table orders is empty. Seeding initial queue records...');
      const defaultOrders: Order[] = [
        { id: 'ORD-9912', customerName: 'Zainab Bibi', createdAt: '10 mins ago', items: '2x Panadol 500mg, 1x Caltrate Plus', total: 1190, status: 'Pending' },
        { id: 'ORD-8822', customerName: 'Muhammad Salman', createdAt: '1 hour ago', items: '1x Augmentin 625mg', total: 280, status: 'Confirmed' },
        { id: 'ORD-7561', customerName: 'Ayesha Khan', createdAt: '4 hours ago', items: '3x Brufen 400mg', total: 450, status: 'Delivered' }
      ];

      for (const o of defaultOrders) {
        await db.execute({
          sql: `INSERT INTO orders (id, customerName, createdAt, items, total, status)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [o.id, o.customerName, o.createdAt, o.items, o.total, o.status]
        });
      }
    }

    isInitialized = true;
    console.log('[Turso DB] Schema configuration and state synchronization ready!');
  } catch (error) {
    console.error('[Turso DB] Error during schema and data initialization:', error);

    // If we are attempting a remote connection and have not fallen back yet, trigger fallback to local SQLite
    if (!dbUrl.startsWith('file:') && !usingLocalFallback) {
      console.warn('[Turso DB] Remote database connection failed. Falling back to local SQLite database...');
      usingLocalFallback = true;
      const localDbUrl = `file:${path.join(process.cwd(), 'backend', 'local_turso.db')}`;
      activeClient = createClient({
        url: localDbUrl,
      });
      // Reset isInitialized and retry initialization with the local client
      isInitialized = false;
      await initializeDB();
    } else {
      console.error('[Turso DB] Database initialization failed completely.');
    }
  }
}

// Fetch All Medicines
export async function getMedicines(): Promise<Medicine[]> {
  await initializeDB();
  const res = await db.execute('SELECT * FROM medicines ORDER BY name ASC');
  return res.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    price: Number(row.price),
    imgGradient: String(row.imgGradient || ''),
    imgUrl: String(row.imgUrl || ''),
    category: String(row.category),
    stock: Number(row.stock),
    status: row.status as any
  }));
}

// Add or Edit Medicine
export async function saveMedicine(m: Medicine): Promise<void> {
  await initializeDB();
  await db.execute({
    sql: `INSERT INTO medicines (id, name, price, imgGradient, imgUrl, category, stock, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            price = excluded.price,
            imgGradient = excluded.imgGradient,
            imgUrl = excluded.imgUrl,
            category = excluded.category,
            stock = excluded.stock,
            status = excluded.status`,
    args: [m.id, m.name, m.price, m.imgGradient || '', m.imgUrl || '', m.category, m.stock, m.status]
  });
}

// Bulk Add or Edit Medicines
export async function bulkSaveMedicines(medicines: Medicine[]): Promise<void> {
  await initializeDB();
  const transaction = await db.transaction('write');
  try {
    for (const m of medicines) {
      await transaction.execute({
        sql: `INSERT INTO medicines (id, name, price, imgGradient, imgUrl, category, stock, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                price = excluded.price,
                imgGradient = excluded.imgGradient,
                imgUrl = excluded.imgUrl,
                category = excluded.category,
                stock = excluded.stock,
                status = excluded.status`,
        args: [m.id, m.name, m.price, m.imgGradient || '', m.imgUrl || '', m.category, m.stock, m.status]
      });
    }
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Delete Medicine
export async function deleteMedicine(id: string): Promise<void> {
  await initializeDB();
  await db.execute({
    sql: 'DELETE FROM medicines WHERE id = ?',
    args: [id]
  });
}

// Fetch All Orders
export async function getOrders(): Promise<Order[]> {
  await initializeDB();
  const res = await db.execute('SELECT * FROM orders ORDER BY rowid DESC');
  return res.rows.map(row => ({
    id: String(row.id),
    customerName: String(row.customerName),
    createdAt: String(row.createdAt),
    items: String(row.items),
    total: Number(row.total),
    status: row.status as any
  }));
}

// Add New Order
export async function saveOrder(o: Order): Promise<void> {
  await initializeDB();
  await db.execute({
    sql: `INSERT INTO orders (id, customerName, createdAt, items, total, status)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [o.id, o.customerName, o.createdAt, o.items, o.total, o.status]
  });
}

// Update Order Status
export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await initializeDB();
  await db.execute({
    sql: 'UPDATE orders SET status = ? WHERE id = ?',
    args: [status, id]
  });
}

// Admin Sessions Database Operations
export interface AdminSession {
  token: string;
  email: string;
  createdAt: string;
}

export async function createAdminSession(email: string): Promise<string> {
  await initializeDB();
  const token = randomUUID();
  const createdAt = new Date().toISOString();
  await db.execute({
    sql: 'INSERT INTO admin_sessions (token, email, createdAt) VALUES (?, ?, ?)',
    args: [token, email, createdAt]
  });
  return token;
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  await initializeDB();
  try {
    const res = await db.execute({
      sql: 'SELECT email FROM admin_sessions WHERE token = ?',
      args: [token]
    });
    return res.rows.length > 0;
  } catch (err) {
    console.error('[Verify Session Error]:', err);
    return false;
  }
}

export async function deleteAdminSession(token: string): Promise<void> {
  await initializeDB();
  try {
    await db.execute({
      sql: 'DELETE FROM admin_sessions WHERE token = ?',
      args: [token]
    });
  } catch (err) {
    console.error('[Delete Session Error]:', err);
  }
}

// Persistent Settings Operations
export async function getSetting(key: string): Promise<string | null> {
  await initializeDB();
  try {
    const res = await db.execute({
      sql: 'SELECT value FROM settings WHERE key = ?',
      args: [key]
    });
    return res.rows[0]?.value ? String(res.rows[0].value) : null;
  } catch (err) {
    console.error('[Get Setting Error]:', err);
    return null;
  }
}

export async function saveSetting(key: string, value: string): Promise<void> {
  await initializeDB();
  try {
    await db.execute({
      sql: 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      args: [key, value]
    });
  } catch (err) {
    console.error('[Save Setting Error]:', err);
  }
}


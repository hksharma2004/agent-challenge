import { Pool } from 'pg';
import 'dotenv/config';


declare global {
  var dbPool: Pool;
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  if (!global.dbPool) {
    global.dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = global.dbPool;
}

export default pool;

import { Pool } from 'pg';

const pool = new Pool({
  host: 'ywstorage.synology.me',
  port: 25432,
  database: 'postgres',
  user: 'cheonwoongkim',
  password: '0908zxCV!!',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;

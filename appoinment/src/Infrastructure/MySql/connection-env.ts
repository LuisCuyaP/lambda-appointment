import mysql, { Pool } from 'mysql2/promise';

let poolPE: Pool | null = null;
let poolCL: Pool | null = null;

function buildPoolFromEnv(prefix: 'PE' | 'CL') {
  const host = process.env[`${prefix}_DB_HOST`];
  const port = Number(process.env[`${prefix}_DB_PORT`] || '3306');
  const user = process.env[`${prefix}_DB_USER`];
  const password = process.env[`${prefix}_DB_PASS`];
  const database = process.env[`${prefix}_DB_NAME`];

  if (!host || !user || !password || !database) {
    throw new Error(`Faltan variables de entorno para ${prefix} (host/user/pass/name)`);
  }

  return mysql.createPool({
    host, port, user, password, database,
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0,
    connectTimeout: 10_000
  });
}

export async function getPoolByCountry(countryISO: 'PE' | 'CL') {
  if (countryISO === 'PE') {
    if (!poolPE) poolPE = buildPoolFromEnv('PE');
    return poolPE;
  } else {
    if (!poolCL) poolCL = buildPoolFromEnv('CL');
    return poolCL;
  }
}

import mysql from "mysql2/promise";

async function main() {
  const conn = await mysql.createConnection({
    host: "dbappointment.c2jccqskykox.us-east-1.rds.amazonaws.com", 
    port: 3306,
    user: "admin",
    password: "Softtek#2023"
  });

  // Crear DBs
  await conn.query(`CREATE DATABASE IF NOT EXISTS app_pe`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS app_cl`);

  // Crear tabla en PE
  await conn.query(`
    CREATE TABLE IF NOT EXISTS app_pe.appointment_audit (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      appointment_id VARCHAR(64) NOT NULL,
      insured_id VARCHAR(16) NOT NULL,
      schedule_id INT NOT NULL,
      country_iso ENUM('PE','CL') NOT NULL,
      status VARCHAR(16) NOT NULL,
      created_at DATETIME NOT NULL,
      payload JSON NULL
    )
  `);

  // Crear tabla en CL copiando estructura
  await conn.query(`CREATE TABLE IF NOT EXISTS app_cl.appointment_audit LIKE app_pe.appointment_audit`);

  console.log("Bases y tablas creadas correctamente");
  await conn.end();
}

main().catch((err) => {
  console.error("Error inicializando DB:", err);
  process.exit(1);
});

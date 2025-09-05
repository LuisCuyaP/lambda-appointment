import mysql from "mysql2/promise";

(async () => {
  const conn = await mysql.createConnection({
    host: "dbappointment.c2jccqskykox.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "Softtek#2023"
  });

  const [dbs] = await conn.query("SHOW DATABASES");
  console.log("Databases disponibles:", dbs);
  
  const [tablesPE] = await conn.query("SHOW TABLES FROM app_pe");
  console.log("Tablas en app_pe:", tablesPE);

  // Listar tablas en app_cl
  const [tablesCL] = await conn.query("SHOW TABLES FROM app_cl");
  console.log("Tablas en app_cl:", tablesCL);

  const [pe] = await conn.query("SELECT * FROM app_pe.appointment_audit ORDER BY id DESC LIMIT 5");
  console.log("Ultimos en app_pe:", pe);

  const [cl] = await conn.query("SELECT * FROM app_cl.appointment_audit ORDER BY id DESC LIMIT 5");
  console.log("Ultimos en app_cl:", cl);

  await conn.end();
})();
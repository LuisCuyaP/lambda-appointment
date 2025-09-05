import { getPoolByCountry } from './connection-env';

type Row = {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
  status: string;
  createdAt: string;
  payload?: any;
};

export async function writeAudit(row: Row) {
  const pool = await getPoolByCountry(row.countryISO);
  await pool.execute(
    `INSERT INTO appointment_audit
     (appointment_id, insured_id, schedule_id, country_iso, status, created_at, payload)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      row.appointmentId,
      row.insuredId,
      row.scheduleId,
      row.countryISO,
      row.status,
      row.createdAt.replace('T',' ').replace('Z',''),
      JSON.stringify(row.payload ?? null)
    ]
  );
}

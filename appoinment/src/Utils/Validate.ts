import { CreateAppointmentInput } from '../Domain/types';

export function validateCreate(input: any): asserts input is CreateAppointmentInput {
  if (!input) throw new Error('Body requerido');
  const { insuredId, scheduleId, countryISO } = input;

  if (!insuredId || !/^\d{5}$/.test(String(insuredId))) {
    throw new Error('insuredId debe ser string de 5 dígitos');
  }
  if (typeof scheduleId !== 'number' || Number.isNaN(scheduleId)) {
    throw new Error('scheduleId debe ser number');
  }
  if (countryISO !== 'PE' && countryISO !== 'CL') {
    throw new Error('countryISO debe ser "PE" o "CL"');
  }
}
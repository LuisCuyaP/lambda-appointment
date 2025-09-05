export type CountryISO = 'PE' | 'CL';

export interface CreateAppointmentInput {
  insuredId: string;     
  scheduleId: number;
  countryISO: CountryISO;
}

export interface Appointment extends CreateAppointmentInput {
  appointmentId: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt?: string;
}
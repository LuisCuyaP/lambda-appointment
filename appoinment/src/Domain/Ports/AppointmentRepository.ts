import { Appointment } from '../types';

export interface AppointmentRepository {
  createPending(a: Appointment): Promise<void>;
  complete(appointmentId: string): Promise<void>;
  listByInsured(insuredId: string): Promise<Appointment[]>;
}
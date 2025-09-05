import { AppointmentRepository } from '../../Domain/Ports/AppointmentRepository';
import { Appointment } from '../../Domain/types';

export class ListAppointments {
  constructor(private repo: AppointmentRepository) {}

  async exec(insuredId: string): Promise<Appointment[]> {
    return this.repo.listByInsured(insuredId);
  }
}
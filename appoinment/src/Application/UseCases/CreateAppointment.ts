import { Appointment, CreateAppointmentInput } from '../../Domain/types';
import { AppointmentRepository } from '../../Domain/Ports/AppointmentRepository';
import { EventBus } from '../../Domain/Ports/EventBus';
import crypto from 'crypto';

export class CreateAppointment {
  constructor(
    private repo: AppointmentRepository,
    private bus: EventBus
  ) {}

  async exec(input: CreateAppointmentInput): Promise<string> {
    const appointmentId = crypto.randomUUID();
    const item: Appointment = {
      appointmentId,
      insuredId: String(input.insuredId),
      scheduleId: Number(input.scheduleId),
      countryISO: input.countryISO,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await this.repo.createPending(item);
    await this.bus.publish('AppointmentCreated', item, { countryISO: item.countryISO });

    return appointmentId;
  }
}
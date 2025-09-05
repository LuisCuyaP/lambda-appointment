
import { AppointmentRepository } from "../../../Domain/Ports/AppointmentRepository";
import { EventBus } from "../../../Domain/Ports/EventBus";
import { CreateAppointment } from "../CreateAppointment";

const repo: jest.Mocked<AppointmentRepository> = {
  createPending: jest.fn().mockResolvedValue(undefined),
  complete: jest.fn().mockResolvedValue(undefined),
  listByInsured: jest.fn().mockResolvedValue([]),
};

const bus: jest.Mocked<EventBus> = {
  publish: jest.fn().mockResolvedValue(undefined),
};

describe('CreateAppointment', () => {
  it('crea pending y publica evento con atributo countryISO', async () => {
    const uc = new CreateAppointment(repo, bus);

    const appointmentId = await uc.exec({
      insuredId: '01234',
      scheduleId: 101,
      countryISO: 'PE',
    });

    expect(appointmentId).toBeTruthy();
    expect(repo.createPending).toHaveBeenCalledWith(
      expect.objectContaining({
        insuredId: '01234',
        scheduleId: 101,
        countryISO: 'PE',
        status: 'pending',
      })
    );

    expect(bus.publish).toHaveBeenCalledWith(
      'AppointmentCreated',
      expect.objectContaining({ countryISO: 'PE' }),
      { countryISO: 'PE' }
    );
  });
});

import { AppointmentRepository } from '../../../Domain/Ports/AppointmentRepository';
import { ListAppointments } from '../ListAppointments';


const now = new Date().toISOString();

const repo: jest.Mocked<AppointmentRepository> = {
  createPending: jest.fn(),
  complete: jest.fn(),
  listByInsured: jest.fn().mockResolvedValue([
    { appointmentId: 'a1', insuredId: '01234', scheduleId: 10, countryISO: 'PE', status: 'pending', createdAt: now }
  ]),
};

describe('ListAppointments', () => {
  it('lista desde repo', async () => {
    const uc = new ListAppointments(repo);
    const res = await uc.exec('01234');

    expect(repo.listByInsured).toHaveBeenCalledWith('01234');
    expect(res).toHaveLength(1);
    expect(res[0].appointmentId).toBe('a1');
  });
});

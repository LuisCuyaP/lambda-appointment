
const mem: any[] = [];

jest.mock('../../../Infrastructure/DynamoDb/DynamoAppointmentRepository', () => {
  return {
    DynamoAppointmentRepository: class {
      async createPending(a: any) { mem.push(a); }
      async complete(id: string) {
        const it = mem.find(x => x.appointmentId === id);
        if (it) { it.status = 'completed'; it.updatedAt = new Date().toISOString(); }
      }
      async listByInsured(insuredId: string) {
        return mem.filter(x => x.insuredId === insuredId);
      }
    }
  };
});

const publishSpy = jest.fn().mockResolvedValue(undefined);
jest.mock('../../../Infrastructure/Sns/SnsEventBus', () => {
  return {
    SnsEventBus: class {
      publish = publishSpy;
    }
  };
});


import { router } from '../appointment';
import { APIGatewayProxyEventV2, Context, Callback } from 'aws-lambda';

const dummyContext = {} as unknown as Context;
const dummyCallback = (() => undefined) as unknown as Callback;

describe('appointment.router (Option A with dummy context/callback)', () => {
  beforeEach(() => { mem.splice(0, mem.length); publishSpy.mockClear(); });

  it('POST /appointments -> 202 y publica evento', async () => {
    const event = {
      requestContext: { http: { method: 'POST', path: '/appointments' } },
      body: JSON.stringify({ insuredId: '01234', scheduleId: 55, countryISO: 'PE' })
    } as unknown as APIGatewayProxyEventV2;

    const res = await (router as any)(event, dummyContext, dummyCallback);

    expect(res.statusCode).toBe(202);
    const body = JSON.parse(res.body);
    expect(body.appointmentId).toBeTruthy();
    expect(publishSpy).toHaveBeenCalled();
  });

  it('GET /appointments/{insuredId} -> 200 con items', async () => {
    mem.push({
      appointmentId: 't1',
      insuredId: '01234',
      scheduleId: 55,
      countryISO: 'PE',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    const event = {
      requestContext: { http: { method: 'GET', path: '/appointments/01234' } },
      pathParameters: { insuredId: '01234' }
    } as unknown as APIGatewayProxyEventV2;

    const res = await (router as any)(event, dummyContext, dummyCallback);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.items.length).toBeGreaterThan(0);
  });

  it('procesa SQS_CONFIRMATION y completa en repo', async () => {
    mem.push({
      appointmentId: 't2',
      insuredId: '01234',
      scheduleId: 77,
      countryISO: 'CL',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    const sqsEvent = {
      Records: [
        { body: JSON.stringify({ detail: { appointmentId: 't2' } }) }
      ]
    };

    const res = await (router as any)(sqsEvent, dummyContext, dummyCallback);

    expect(res.statusCode).toBe(200);
    const it = mem.find(x => x.appointmentId === 't2');
    expect(it.status).toBe('completed');
    expect(it.updatedAt).toBeTruthy();
  });
});

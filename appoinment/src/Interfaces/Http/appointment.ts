// APPOINMENT/src/Interfaces/Http/appointment.ts
import { APIGatewayProxyHandlerV2, SQSEvent } from 'aws-lambda';
import { ok, bad } from '../../Utils/Response';
import { validateCreate } from '../../Utils/Validate';
import { SnsEventBus } from '../../Infrastructure/Sns/SnsEventBus';
import { CreateAppointment } from '../../Application/UseCases/CreateAppointment';
import { ListAppointments } from '../../Application/UseCases/ListAppointments';
import { DynamoAppointmentRepository } from '../../Infrastructure/DynamoDb/DynamoAppointmentRepository';

const repo = new DynamoAppointmentRepository();
const bus  = new SnsEventBus();

const createUC = new CreateAppointment(repo, bus);
const listUC   = new ListAppointments(repo);

// usamos `any` porque este handler recibe HTTP **y** SQS
export const router: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    // 1) MENSAJES DE SQS/EventBridge - confirmacion
    if ((event as SQSEvent).Records) {
      for (const r of (event as SQSEvent).Records) {
        const body = JSON.parse(r.body);
        const rawDetail = body?.detail ?? body?.Message ?? null;
        const detail = typeof rawDetail === 'string' ? JSON.parse(rawDetail) : rawDetail;

        if (!detail?.appointmentId) {
          console.warn('Mensaje de confirmación sin appointmentId:', body);
          continue;
        }

        await repo.complete(detail.appointmentId);
        console.log('Appointment completed', detail.appointmentId);
      }
      return ok({ updated: true });
    }

    // 2) RUTAS HTTP (API GATEWAY)
    if (event?.requestContext?.http?.method) {
      const method = event.requestContext.http.method as 'GET' | 'POST';

      if (method === 'POST') {
        const body = event.body ? JSON.parse(event.body) : {};
        validateCreate(body);
        const appointmentId = await createUC.exec(body);
        return ok({ message: 'Agendamiento en proceso', appointmentId }, 202);
      }

      if (method === 'GET') {
        const insuredId = event.pathParameters?.insuredId;
        if (!insuredId) return bad('insuredId requerido en path');
        const items = await listUC.exec(insuredId);
        return ok({ items });
      }

      return bad('Metodo no soportado', 405);
    }

    // 3) Evento no reconocido
    return bad('Evento no reconocido', 400);

  } catch (e: any) {
    console.error(e);
    return bad(e.message || 'Error', 400);
  }
};

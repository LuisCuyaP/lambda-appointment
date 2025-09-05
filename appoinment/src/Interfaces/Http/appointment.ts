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

export const router: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    // HTTP
    if (event.requestContext?.http?.method) {
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

    if ((event as SQSEvent).Records) {
      return ok({ received: true });
    }
    return bad('Evento no reconocido', 400);
  } catch (e: any) {
    console.error(e);
    return bad(e.message || 'Error', 400);
  }
};

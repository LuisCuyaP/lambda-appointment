import AWS from 'aws-sdk';
import { Appointment } from '../../Domain/types';
import { AppointmentRepository } from '../../Domain/Ports/AppointmentRepository';

const isOffline = process.env.IS_OFFLINE === 'true';
const TABLE = process.env.DDB_TABLE || 'AppointmentsTable';

const ddb = new AWS.DynamoDB.DocumentClient({});

const mem = { items: new Map<string, Appointment>() };

export class DynamoAppointmentRepository implements AppointmentRepository {
  async createPending(a: Appointment): Promise<void> {
    if (isOffline) { mem.items.set(a.appointmentId, a); return; }
    await ddb.put({ TableName: TABLE, Item: a }).promise();
  }

  async complete(appointmentId: string): Promise<void> {
    if (isOffline) {
      const it = mem.items.get(appointmentId);
      if (it) { it.status = 'completed'; it.updatedAt = new Date().toISOString(); }
      return;
    }
    await ddb.update({
      TableName: TABLE,
      Key: { appointmentId },
      UpdateExpression: 'SET #s = :c, updatedAt = :u',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':c': 'completed', ':u': new Date().toISOString() }
    }).promise();
  }

  async listByInsured(insuredId: string) {
    if (isOffline) {
      return Array.from(mem.items.values()).filter(x => x.insuredId === String(insuredId));
    }
    const res = await ddb.query({
      TableName: TABLE,
      IndexName: 'InsuredGSI',
      KeyConditionExpression: 'insuredId = :v',
      ExpressionAttributeValues: { ':v': String(insuredId) }
    }).promise();
    return (res.Items ?? []) as Appointment[];
  }
}

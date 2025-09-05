import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';

const eb = new AWS.EventBridge();

export const handler = async (event: SQSEvent) => {
  for (const r of event.Records) {
    const body = JSON.parse(r.body);
    const payload = body.Message ? JSON.parse(body.Message) : body; // SNS→SQS wrapper

    console.log('[PE] recibido', { appointmentId: payload.appointmentId });


    await eb.putEvents({
      Entries: [{
        Source: 'rimac.appointment',
        DetailType: 'AppointmentConfirmed',
        Detail: JSON.stringify({ appointmentId: payload.appointmentId, countryISO: 'PE' }),
        EventBusName: process.env.EVENT_BUS_NAME || 'default'
      }]
    }).promise();
  }
  return { statusCode: 200, body: 'OK' };
};

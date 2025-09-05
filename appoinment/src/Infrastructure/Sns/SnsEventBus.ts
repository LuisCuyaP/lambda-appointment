import AWS from 'aws-sdk';
import { EventBus } from '../../Domain/Ports/EventBus';

const isOffline = process.env.IS_OFFLINE === 'true';
const TOPIC_ARN = process.env.APPOINTMENT_TOPIC_ARN;

export class SnsEventBus implements EventBus {
  private sns = new AWS.SNS();

  async publish(eventName: string, payload: unknown, attributes?: Record<string, string>) {
    if (isOffline) {
      console.log(`[OFFLINE] publish ${eventName}`, { payload, attributes });
      return;
    }
    if (!TOPIC_ARN) throw new Error('APPOINTMENT_TOPIC_ARN is not set');

    const MessageAttributes = attributes
      ? Object.fromEntries(
          Object.entries(attributes).map(([key, value]) => [
            key,
            { DataType: 'String', StringValue: value },
          ])
        )
      : undefined;

    await this.sns
      .publish({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify(payload),
        MessageAttributes,
      })
      .promise();
  }
}

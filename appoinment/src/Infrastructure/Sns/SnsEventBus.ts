import AWS from 'aws-sdk';
import { EventBus } from '../../Domain/Ports/EventBus';

const isOffline = process.env.IS_OFFLINE === 'true';
const TOPIC_NAME = process.env.APPOINTMENT_TOPIC_NAME || 'appointment-topic';

export class SnsEventBus implements EventBus {
  private sns = new AWS.SNS();

  async publish(eventName: string, payload: unknown, attributes?: Record<string, string>) {
    if (isOffline) {
      console.log(`[OFFLINE] publish ${eventName}`, { payload, attributes });
      return;
    }
    const topicArn = await this.getTopicArnByName(TOPIC_NAME);
    await this.sns.publish({
      TopicArn: topicArn,
      Message: JSON.stringify(payload),
      MessageAttributes: attributes
        ? Object.fromEntries(Object.entries(attributes).map(([k, v]) => [k, { DataType: 'String', StringValue: v }]))
        : undefined
    }).promise();
  }

  private async getTopicArnByName(name: string): Promise<string> {
    const res = await this.sns.listTopics({}).promise();
    const t = res.Topics?.find(t => t.TopicArn?.endsWith(`:${name}`));
    if (!t?.TopicArn) throw new Error(`Topic ${name} no encontrado`);
    return t.TopicArn;
  }
}

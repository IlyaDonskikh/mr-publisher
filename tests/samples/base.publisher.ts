import { MrPublisher } from '../../src';
import amqp, { Channel } from 'amqplib';

interface Payload {
  text: string;
}

enum MessageBrokerQueue {
  basePublisher = 'base.publisher',
}

export class BasePublisher extends MrPublisher<Payload, MessageBrokerQueue>() {
  queueName: MessageBrokerQueue = MessageBrokerQueue.basePublisher;

  async setChannel() {
    const rabbitUrl = process.env.RABBITMQ_URL ?? '';
    const connection = await amqp.connect(rabbitUrl);

    this.channel = await connection.createChannel();
  }
}

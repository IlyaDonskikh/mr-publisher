import { Channel } from 'amqplib';

// have to define interface because declaration option is true
export interface MrPublisherInterface<P, Q> {
  new ({ payload }: { payload: P }): {
    payload: P;
    queueName: Q;
    setupChannel(): Promise<Channel>;
  };
  publish({ payload }: { payload: P }): Promise<void>;
}

export function MrPublisher<P extends object, Q extends string>() {
  return class BasePublisher {
    payload: P;
    channel: Channel;
    queueName: Q;

    constructor({ payload }: { payload: P }) {
      this.payload = payload;
    }

    static async publish({ payload }: { payload: P }) {
      return new this({ payload }).publish();
    }

    async publish() {
      await this.attachChannel();
      this.validate();

      await this.channel.assertQueue(this.queueName, { durable: true });

      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(this.payload)),
      );
    }

    validate() {
      if (!this.queueName) {
        throw new Error('Queue name is required');
      }
    }

    async attachChannel() {
      this.channel = await this.setupChannel();
    }

    async setupChannel(): Promise<Channel> {
      throw new Error('[Publisher][setChannel] Method not implemented.');
    }
  };
}

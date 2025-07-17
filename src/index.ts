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
      this.validate();
      await this.attachChannel();

      await this.channel.assertQueue(this.queueName, { durable: true });

      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(this.payload)),
      );
    }

    async attachChannel() {
      this.channel = await this.setupChannel();
    }

    validate() {
      this.validateQueueName();
    }

    validateQueueName() {
      if (this.queueName) return;

      throw new Error(
        '[MrPublisher][validateQueueName] Queue name is required',
      );
    }

    async setupChannel(): Promise<Channel> {
      throw new Error('[MrPublisher][setupChannel] Method not implemented');
    }
  };
}

import { Channel } from 'amqplib';

// have to define interface because declaration option is true
export interface MrPublisherInterface<P, Q> {
  new (params: P): {
    payload: P;
  };
  publish({ payload }: { payload: P }): Promise<void>;
}

export function MrPublisher<P extends object, Q extends string>() {
  return class BaseUseCase {
    payload: P;
    channel: Channel;
    queueName: Q;

    constructor({ payload }: { payload: P }) {
      this.payload = payload;
    }

    static async publish({ payload }: { payload: P }) {
      return new this({ payload }).publish();
    }

    // private

    async publish() {
      await this.setChannel();
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

    async setChannel() {
      throw new Error('[Publisher][setChannel] Method not implemented.');
    }
  };
}

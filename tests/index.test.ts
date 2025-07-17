import { BasePublisher } from './samples/base.publisher';
import { faker } from '@faker-js/faker';
import amqp from 'amqplib';

// Mock amqplib
jest.mock('amqplib', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

describe('BasePublisher', () => {
  describe('publish', () => {
    test('publish', async () => {
      const text = faker.lorem.word();
      const payload = { text };
      const mockChannel = {
        assertQueue: jest.fn().mockResolvedValue(undefined),
        sendToQueue: jest.fn(),
      };

      const mockConnection = {
        createChannel: jest.fn().mockResolvedValue(mockChannel),
      };

      (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

      await BasePublisher.publish({ payload });

      // Verify the mocks were called correctly
      expect(amqp.connect).toHaveBeenCalled();
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('base.publisher', {
        durable: true,
      });
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'base.publisher',
        Buffer.from(JSON.stringify(payload)),
      );
    });
  });
});

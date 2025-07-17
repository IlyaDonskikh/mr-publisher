import { MrUseCase } from '../../src';

interface Request {
  value?: number;
}

interface Response {
  valueSquared: number;
}

export class IntegerSquareCase extends MrUseCase<Request, Response>() {
  private value: number;

  async process() {
    await this.validate();

    const valueSquared = this.squareValue({ value: this.value });

    return { valueSquared };
  }

  protected async checks() {
    if (!this.request.value) {
      this.errors.add('value', 'presence');

      return;
    }

    if (!Number.isInteger(this.request.value)) {
      this.errors.add('value', 'format');
    }

    this.value = this.request.value;
  }

  private squareValue({ value }: { value: number }) {
    return value * value;
  }
}

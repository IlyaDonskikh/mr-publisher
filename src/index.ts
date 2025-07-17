import { MrError } from 'mr-error';

type ProcessReturn<R> = R extends object ? R : void;

// have to define interface because declaration option is true
export interface MrUseCaseInterface<T, R> {
  new (params: T): {
    request: T;
    errors: MrError;
    process(): Promise<ProcessReturn<R>>;
    validate(): Promise<void>;
  };
  call(
    ...params: T extends object ? [T] : [undefined?]
  ): Promise<ProcessReturn<R>>;
}

export function MrUseCase<
  T extends object | null = null,
  R extends object | null = null,
>(
  { errorsBuilder }: { errorsBuilder: typeof MrError } = {
    errorsBuilder: MrError,
  },
): MrUseCaseInterface<T, R> {
  return class BaseUseCase {
    request: T;
    errors: MrError;

    constructor(params: T) {
      this.request = params;
    }

    static call(params: T = null as T) {
      const response = new this(params).call();

      return response;
    }

    // private

    // have to find out the way keep the function protected with declaration: true option
    async validate() {
      await this.checks();

      if (!this.isValid()) {
        throw this.errors;
      }
    }

    async process(): Promise<ProcessReturn<R>> {
      return undefined as ProcessReturn<R>;
    }

    private async call() {
      this.errors = new errorsBuilder({
        localePath: this.buildLocalePath(),
      });

      const response = await this.process();

      return response;
    }

    private buildLocalePath() {
      const className = this.constructor.name;
      const formattedClassName =
        className[0].toLowerCase() + className.slice(1);

      return `useCases.${formattedClassName}`;
    }

    private isValid() {
      return Object.keys(this.errors.errors).length === 0;
    }

    protected async checks() {}
  };
}

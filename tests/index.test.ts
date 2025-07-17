import { MrUseCase } from '../src';
import { IntegerSquareCase } from './samples/integerSquare.case';
import { NoParamsRunCase } from './samples/noParamsRun.case';

describe('MrUseCase', () => {
  test('return undefined', async () => {
    const value = await MrUseCase().call();

    expect(value).toBeUndefined();
  });

  describe('IntegerSquareCase', () => {
    test('square it', async () => {
      const value = 3;
      const { valueSquared } = await IntegerSquareCase.call({ value });

      expect(valueSquared).toEqual(value * value);
    });

    describe('when value is undefined', () => {
      it('reject with value presence error', async () => {
        const value = undefined;

        const casePromise = IntegerSquareCase.call({ value });

        await expect(casePromise).rejects.toMatchObject({
          errors: { value: ['presence'] },
        });
      });
    });

    describe('when value is not integer', () => {
      it('reject with value format error', async () => {
        const value = 3.2;

        const casePromise = IntegerSquareCase.call({ value });

        await expect(casePromise).rejects.toMatchObject({
          errors: { value: ['format'] },
        });
      });
    });
  });

  describe('NoParamsRunCase', () => {
    describe('when nothing passed', () => {
      it('done with no response', async () => {
        const useCase = await NoParamsRunCase.call();

        expect(useCase).toBeUndefined();
      });
    });
  });
});

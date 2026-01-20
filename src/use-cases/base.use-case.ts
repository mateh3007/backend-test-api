export abstract class BaseUseCase<T, R> {
    abstract execute(input: T): Promise<R>;
}
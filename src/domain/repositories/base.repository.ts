export abstract class BaseRepository<T> {
    abstract findById(id: string): Promise<T | null>;
    abstract findAll(): Promise<T[]>;
    abstract create(entity: T): Promise<T>;
    abstract update(entity: T): Promise<T>;
    abstract delete(id: string): Promise<void>;
}
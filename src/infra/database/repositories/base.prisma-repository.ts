import { BaseRepository } from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';

export abstract class BasePrismaRepository<
  TEntity,
  TPrismaModel,
> extends BaseRepository<TEntity> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelDelegate: any,
  ) {
    super();
  }

  protected abstract toDomain(prismaModel: TPrismaModel): TEntity;
  protected abstract toPrisma(entity: TEntity): Record<string, unknown>;

  async findById(id: string): Promise<TEntity | null> {
    const result = await this.modelDelegate.findUnique({
      where: { id },
    });

    return result ? this.toDomain(result as TPrismaModel) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const results = await this.modelDelegate.findMany();
    return (results as TPrismaModel[]).map((result) => this.toDomain(result));
  }

  async create(entity: TEntity): Promise<TEntity> {
    const data = this.toPrisma(entity);
    const result = await this.modelDelegate.create({ data });
    return this.toDomain(result as TPrismaModel);
  }

  async update(entity: TEntity): Promise<TEntity> {
    const data = this.toPrisma(entity);
    const { id, ...updateData } = data as {
      id: string;
      [key: string]: unknown;
    };

    const result = await this.modelDelegate.update({
      where: { id },
      data: updateData,
    });

    return this.toDomain(result as TPrismaModel);
  }

  async delete(id: string): Promise<void> {
    await this.modelDelegate.delete({
      where: { id },
    });
  }
}

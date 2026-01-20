import { BaseRepository } from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';

interface PrismaDelegate {
  findUnique: (args: { where: { id: string } }) => Promise<unknown>;
  findMany: () => Promise<unknown[]>;
  create: (args: { data: unknown }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: unknown }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
}

export abstract class BasePrismaRepository<
  TEntity,
  TPrismaModel,
> extends BaseRepository<TEntity> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelDelegate: PrismaDelegate,
  ) {
    super();
  }

  protected abstract toDomain(prismaModel: TPrismaModel): TEntity;
  protected abstract toPrisma(entity: TEntity): Record<string, unknown>;

  async findById(id: string): Promise<TEntity | null> {
    const result = (await this.modelDelegate.findUnique({
      where: { id },
    })) as TPrismaModel | null;

    return result ? this.toDomain(result) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const results = (await this.modelDelegate.findMany()) as TPrismaModel[];
    return results.map((result) => this.toDomain(result));
  }

  async create(entity: TEntity): Promise<TEntity> {
    const data = this.toPrisma(entity);
    const result = (await this.modelDelegate.create({ data })) as TPrismaModel;
    return this.toDomain(result);
  }

  async update(entity: TEntity): Promise<TEntity> {
    const data = this.toPrisma(entity);
    const { id, ...updateData } = data as {
      id: string;
      [key: string]: unknown;
    };

    const result = (await this.modelDelegate.update({
      where: { id },
      data: updateData,
    })) as TPrismaModel;

    return this.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await this.modelDelegate.delete({
      where: { id },
    });
  }
}

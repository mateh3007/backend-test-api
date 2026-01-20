import { BaseRepository } from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';

export abstract class BasePrismaRepository<TEntity, TPrismaModel, TPrismaDelegate>
  extends BaseRepository<TEntity>
{
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelDelegate: TPrismaDelegate,
  ) {
    super();
  }

  protected abstract toDomain(prismaModel: TPrismaModel): TEntity;
  protected abstract toPrisma(entity: TEntity): any;

  async findById(id: string): Promise<TEntity | null> {
    const result = await (this.modelDelegate as any).findUnique({
      where: { id },
    });

    return result ? this.toDomain(result) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const results = await (this.modelDelegate as any).findMany();
    return results.map((result: TPrismaModel) => this.toDomain(result));
  }

  async create(entity: TEntity): Promise<TEntity> {
    const data = this.toPrisma(entity);
    const result = await (this.modelDelegate as any).create({ data });
    return this.toDomain(result);
  }

  async update(entity: TEntity): Promise<TEntity> {
    const data = this.toPrisma(entity);
    const { id, ...updateData } = data;
    
    const result = await (this.modelDelegate as any).update({
      where: { id },
      data: updateData,
    });

    return this.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await (this.modelDelegate as any).delete({
      where: { id },
    });
  }
}


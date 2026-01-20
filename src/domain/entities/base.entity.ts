export class BaseEntity {
  _id: string;
  _createdAt: Date;
  _updatedAt: Date;

  constructor(base: Partial<BaseEntity>) {
    Object.assign(this, base);
  }
}

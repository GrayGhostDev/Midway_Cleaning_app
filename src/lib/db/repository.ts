import { prisma } from './client';
import { handleDatabaseError } from './errors';
import { validateData, validatePartialData } from './validation';
import { z } from 'zod';

export class Repository<T extends z.ZodObject<any>> {
  constructor(
    private model: any,
    private schema: T,
    private includes: string[] = []
  ) {}

  private get includeObject() {
    return this.includes.reduce((acc, include) => {
      acc[include] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }

  async create(data: z.infer<T>): Promise<z.infer<T>> {
    try {
      const validatedData = validateData(this.schema, data);
      return await this.model.create({
        data: validatedData,
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async findById(id: string): Promise<z.infer<T> | null> {
    try {
      return await this.model.findUnique({
        where: { id },
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async findMany(params: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
  }): Promise<z.infer<T>[]> {
    try {
      return await this.model.findMany({
        ...params,
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async update(id: string, data: Partial<z.infer<T>>): Promise<z.infer<T>> {
    try {
      const validatedData = validatePartialData(this.schema, data);
      return await this.model.update({
        where: { id },
        data: validatedData,
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async delete(id: string): Promise<z.infer<T>> {
    try {
      return await this.model.delete({
        where: { id },
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async count(where: Record<string, unknown> = {}): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async findFirst(params: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<z.infer<T> | null> {
    try {
      return await this.model.findFirst({
        ...params,
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async upsert(
    where: Record<string, unknown>,
    create: z.infer<T>,
    update: Partial<z.infer<T>>
  ): Promise<z.infer<T>> {
    try {
      const validatedCreateData = validateData(this.schema, create);
      const validatedUpdateData = validatePartialData(this.schema, update);
      
      return await this.model.upsert({
        where,
        create: validatedCreateData,
        update: validatedUpdateData,
        include: this.includeObject,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  async transaction<R>(
    fn: (tx: Repository<T>) => Promise<R>
  ): Promise<R> {
    try {
      return await prisma.$transaction(async (prismaClient) => {
        const txRepository = new Repository(
          prismaClient[this.model.name],
          this.schema,
          this.includes
        );
        return await fn(txRepository);
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }
}

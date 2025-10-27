import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    try {
      await super.$connect();
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.handleConnectionError(err);
      } else {
        this.handleConnectionError(new Error(String(err)));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await super.$disconnect();
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.handleDisconnectionError(err);
      } else {
        this.handleDisconnectionError(new Error(String(err)));
      }
    }
  }

  private handleConnectionError(error: Error): never {
    const message = error.message;
    throw new Error(`Error connecting to database: ${message}`);
  }

  private handleDisconnectionError(error: Error): never {
    const message = error.message;
    throw new Error(`Error disconnecting from database: ${message}`);
  }
}

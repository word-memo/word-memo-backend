import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@generated/prisma/client';
import type { PoolConfig } from 'pg';

function decodeBase64CaCert(value: string): string {
  const trimmed = value.trim();
  return Buffer.from(trimmed, 'base64').toString('utf8');
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const environment = configService.getOrThrow<string>('ENVIRONMENT');
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const caCertB64 = configService.get<string>('DATABASE_SSL_CA_B64');

    let poolConfig: PoolConfig = { connectionString };

    if (environment === 'staging' && caCertB64) {
      poolConfig = {
        ...poolConfig,
        ssl: {
          ca: decodeBase64CaCert(caCertB64),
          rejectUnauthorized: true,
        },
      };
    }

    const adapter = new PrismaPg(poolConfig);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

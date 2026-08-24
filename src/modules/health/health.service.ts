import { AppException } from '@/common/errors/app.exception';
import { ErrorCodes } from '@/common/errors/error-codes';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { HealthStatusDto } from './dto/health-status.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getLiveness(): HealthStatusDto {
    return { status: 'ok' };
  }

  async getDatabaseHealth(): Promise<HealthStatusDto> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch {
      throw new AppException(
        ErrorCodes.HEALTH_DB_UNAVAILABLE,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

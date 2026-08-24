import { AppException } from '@/common/errors/app.exception';
import { ErrorCodes } from '@/common/errors/error-codes';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { HealthStatusDto } from './dto/health-status.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  getLiveness(): HealthStatusDto {
    return { status: 'ok' };
  }

  async getDatabaseHealth(): Promise<HealthStatusDto> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      throw new AppException(
        ErrorCodes.HEALTH_DB_UNAVAILABLE,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { HealthStatusDto } from './dto/health-status.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthStatusDto {
    return this.healthService.getLiveness();
  }

  @Get('db')
  getDatabaseHealth(): Promise<HealthStatusDto> {
    return this.healthService.getDatabaseHealth();
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [HealthModule],
})
export class AppModule {}
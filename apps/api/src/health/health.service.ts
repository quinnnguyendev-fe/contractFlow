import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    check() {
        return {
            status: 'OK',
            service: 'contractflow-api',
            timestamp: new Date().toISOString()
        }
    }
}

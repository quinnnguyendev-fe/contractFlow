import { Module } from '@nestjs/common';
import { OrganizationContextService } from './organization-context/organization-context.service.js';

@Module({
    providers: [OrganizationContextService],
    exports: [OrganizationContextService]
})
export class OrganizationModule {}

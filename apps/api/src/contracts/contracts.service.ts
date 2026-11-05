import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ContractsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.contract.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        })
    }
}

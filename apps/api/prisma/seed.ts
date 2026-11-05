import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const organization = await prisma.organization.upsert({
    where: {
      slug: 'acme',
    },
    update: {},
    create: {
      slug: 'acme',
      name: 'Acme Inc.',
    },
  });

  await prisma.contract.create({
    data: {
      organizationId: organization.id,
      contractNumber: 'CTR-001',
      title: 'Software Development Agreement',
      counterparty: 'Tech Solutions Ltd.',
      contractType: 'Service Agreement',
      status: 'ACTIVE',
      value: 50000,
      currency: 'USD',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
    },
  });

  console.log('Seed data inserted successfully');
}

main()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })

    .finally(async () => {
        await prisma.$disconnect()
    })

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

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

  await prisma.contract.upsert({
    where: {
      organizationId_contractNumber: {
        organizationId: organization.id,
        contractNumber: 'CTR-001',
      },
    },
    update: {},
    create: {
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

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const memberUser = await prisma.user.upsert({
    where: {
      email: 'member@acme.com',
    },
    update: {},
    create: {
      email: 'member@acme.com',
      name: 'Acme Member',
      passwordHash,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: memberUser.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: 'MEMBER',
    },
    create: {
      userId: memberUser.id,
      organizationId: organization.id,
      role: 'MEMBER',
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@acme.com',
    },
    update: {},
    create: {
      email: 'admin@acme.com',
      name: 'Acme Admin',
      passwordHash,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: 'OWNER',
    },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });

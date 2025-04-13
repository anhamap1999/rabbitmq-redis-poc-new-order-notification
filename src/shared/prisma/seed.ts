import { prismaClient } from './client';

const mockUserNames = [
  'Ervin Delacruz',
  'Jordan Larson',
  'Sammy Kirk',
  'Porfirio Wright',
  'Jonas Dickerson',
  'Helene Farmer',
  'Twila Rios',
  'Prince Brewer',
  'Darla Campbell',
  'Romeo Stanley',
];
const mockUserData = mockUserNames.map((i) => ({
  fullName: i,
  email: i.toLowerCase().replace(' ', '_') + '@test.com',
}));

async function seed() {
  const result = await prismaClient.$transaction(
    mockUserData.map((user) =>
      prismaClient.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      })
    )
  );
  console.log(
    `[Postgres] Seeded user data. Created IDs: ${result
      .map(({ id }) => id)
      .join(', ')}.`
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });

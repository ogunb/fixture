import { prisma } from "@/db/client";

export function getFixtureInBetween(gte: string, lt: string) {
  return prisma.fixture.findMany({
    where: {
      date: {
        gte,
        lt,
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
}

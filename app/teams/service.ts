import { prisma } from "@/db/client";
import { Team } from "@prisma/client";

export async function getTeams() {
  return prisma.team.findMany();
}

type FilterParams = {
  name?: string | null;
  is_following?: boolean | null;
};
export async function filterTeams({
  name = null,
  is_following = null,
}: FilterParams) {
  return prisma.team.findMany({
    where: {
      ...(name
        ? {
            name: {
              contains: name,
            },
          }
        : {}),
      ...(is_following !== null
        ? {
            is_following,
          }
        : {}),
    },
  });
}

// TODO
export async function addTeam() {
  const lastCreated = await prisma.team.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  const id = lastCreated ? lastCreated.id + 1 : 1;

  return prisma.team.create({
    data: {
      id,
      name: `Team ${id}`,
      name_slug: `team-${id}`,
      country: "USA",
      founded: 2021,
      national: false,
      logo: "https://via.placeholder.com/150",
    },
  });
}

export async function followTeam(teamId: number) {
  return prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      is_following: true,
    },
  });
}

export async function unfollowTeam(teamId: number) {
  return prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      is_following: false,
    },
  });
}

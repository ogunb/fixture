import { prisma } from "@/db/client";
import { fetchTeams } from "./api";
import { Team } from "@prisma/client";

export async function getTeams() {
  return prisma.team.findMany();
}

type FilterParams = {
  name?: string;
  is_following?: boolean;
};
export async function filterTeams({ name, is_following }: FilterParams) {
  const filtered = await prisma.team.findMany({
    where: {
      ...(name
        ? {
            name: {
              contains: name,
            },
          }
        : {}),
      is_following: is_following ?? true,
    },
  });

  if (!filtered.length && name) {
    return filterMissingTeams(name);
  }

  return filtered;
}

async function filterMissingTeams(name: string) {
  const teams = await fetchTeams({ name });
  const teamsToCreate = teams.map(({ team }) => ({
    id: team.id,
    name: team.name,
    code: team.code,
    logo: team.logo,
    country: team.country,
    founded: team.founded,
    national: team.national,
    is_following: false,
  }));

  for (const team of teamsToCreate) {
    addTeam(team);
  }

  return teamsToCreate;
}

export async function addTeam(team: Team) {
  return prisma.team.create({
    data: team,
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

import { prisma } from "@/db/client";
import { FetchTeamsResponse, fetchTeams } from "./api";
import { Team } from "@prisma/client";
import { fetchNextFiveMatches } from "./fixture/api";

export async function getTeam(id: number) {
  return prisma.team.findUnique({
    where: {
      id,
    },
  });
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
      is_following: is_following,
    },
  });

  if (!filtered.length && name) {
    const teams = await fetchTeams({ name });
    return saveMissingTeams(teams);
  }

  return filtered;
}

async function saveMissingTeams(teams: FetchTeamsResponse["response"]) {
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
    saveTeam(team);
  }

  return teamsToCreate;
}

export async function saveTeam(team: Team) {
  return prisma.team.create({
    data: team,
  });
}

export async function followTeam(teamId: number) {
  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      is_following: true,
    },
  });

  await saveNextFiveMatches(teamId);
}

export async function saveNextFiveMatches(teamId: number) {
  const fixture = await fetchNextFiveMatches(teamId);

  for (const match of fixture) {
    const [homeTeam, awayTeam] = await Promise.all([
      getTeam(match.teams.home.id),
      getTeam(match.teams.away.id),
    ]);

    const missingTeamId = !homeTeam
      ? match.teams.home.id
      : !awayTeam
      ? match.teams.away.id
      : null;

    if (missingTeamId) {
      const teams = await fetchTeams({ id: missingTeamId });
      await saveMissingTeams(teams);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const date = new Date(match.fixture.timestamp * 1000);

    await prisma.fixture.upsert({
      where: {
        id: match.fixture.id,
      },
      update: {
        date,
      },
      create: {
        id: match.fixture.id,
        date,
        homeTeam: {
          connect: {
            id: match.teams.home.id,
          },
        },
        awayTeam: {
          connect: {
            id: match.teams.away.id,
          },
        },
      },
    });
  }
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

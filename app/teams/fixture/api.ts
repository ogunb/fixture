type FixtureResponse = {
  response: Array<{
    fixture: {
      id: number;
      timestamp: number;
    };
    teams: {
      home: {
        id: number;
      };
      away: {
        id: number;
      };
    };
  }>;
};

export async function fetchNextFiveMatches(teamId: number) {
  if (process.env.FOOTBALL_API_KEY === undefined) {
    throw new Error("FOOTBALL_API_KEY is not defined");
  }

  if (teamId === undefined) {
    throw new Error("teamId is not defined");
  }

  const params = new URLSearchParams();
  params.append("team", teamId.toString());
  params.append("next", "5");
  params.append("status", "NS");

  const url = new URL(`${process.env.FOOTBALL_API_URL}/fixtures`);
  url.search = params.toString();

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": process.env.FOOTBALL_API_KEY,
    },
  });
  const json = (await response.json()) as FixtureResponse;
  return json.response;
}

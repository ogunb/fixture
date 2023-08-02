type FetchTeamsParams = {
  id?: number;
  name?: string;
};
export type FetchTeamsResponse = {
  response: Array<{
    team: {
      id: number;
      name: string;
      code: string;
      country: string;
      founded: number;
      national: boolean;
      logo: string;
    };
    venue: {
      id: number;
      name: string;
      address: string;
      city: string;
      capacity: number;
      surface: string;
      image: string;
    };
  }>;
};

export const fetchTeams = async ({ id, name }: FetchTeamsParams = {}) => {
  if (process.env.FOOTBALL_API_KEY === undefined) {
    throw new Error("FOOTBALL_API_KEY is not defined");
  }

  const params = new URLSearchParams();
  id && params.append("id", id.toString());
  name && params.append("name", name);
  if (!params.toString()) {
    throw new Error("No params provided");
  }

  const url = new URL(`${process.env.FOOTBALL_API_URL}/teams`);
  url.search = params.toString();

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": process.env.FOOTBALL_API_KEY,
    },
  });
  const json = (await response.json()) as FetchTeamsResponse;
  return json.response;
};

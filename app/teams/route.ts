import { NextRequest, NextResponse } from "next/server";
import { filterTeams } from "./service";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("name");
  const follow = request.nextUrl.searchParams.get("follow") || null;
  const is_following = follow === null ? null : JSON.parse(follow);

  if (!query)
    return NextResponse.json(
      await filterTeams({
        is_following,
      })
    );

  return NextResponse.json(await filterTeams({ name: query, is_following }));
}

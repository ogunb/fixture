import { NextRequest, NextResponse } from "next/server";
import { filterTeams } from "./service";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("name") || undefined;
  const follow = request.nextUrl.searchParams.get("follow") || undefined;
  const is_following = follow == undefined ? undefined : JSON.parse(follow);

  return NextResponse.json(await filterTeams({ name: query, is_following }));
}

import { NextRequest, NextResponse } from "next/server";
import { followTeam, unfollowTeam } from "../service";

export async function PUT(request: NextRequest) {
  const { teamId, follow = false } = (await request.json()) as {
    teamId: number;
    follow: boolean;
  };

  if (!teamId) {
    return NextResponse.json(
      {
        error: "Missing teamId",
      },
      {
        status: 400,
      }
    );
  }

  if (follow) {
    await followTeam(teamId);
  } else {
    await unfollowTeam(teamId);
  }

  return NextResponse.json({});
}

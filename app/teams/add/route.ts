import { NextRequest, NextResponse } from "next/server";
import { addTeam } from "../service";

// TODO
export async function POST(request: NextRequest) {
  await addTeam();
  return NextResponse.json({});
}

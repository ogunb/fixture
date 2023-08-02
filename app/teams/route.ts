import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 'asdasd',
      name: "Team 1",
    },
    {
      id: 'asdfasdfsdf',
      name: "Team 2",
    },
  ]);
}

export async function POST(request: NextRequest) {
  return NextResponse.json({})
}

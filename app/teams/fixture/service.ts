import { prisma } from "@/db/client";
import { getFormattedTime } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import schedule from "node-schedule";

export function getFixtureInBetween(gte: string, lt: string) {
  return prisma.fixture.findMany({
    where: {
      date: {
        gte,
        lt,
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
}

const scheduledFixtureJobs = new Map<number, schedule.Job>();
type Match = Prisma.FixtureGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;
export async function scheduleMatchMessage(match: Match) {
  try {
    console.log("Scheduling match:", JSON.stringify(match, null, 2));
    if (scheduledFixtureJobs.has(match.id)) {
      cancelScheduledMatchMessage(match.id);
    }

    const job = schedule.scheduleJob(match.date, async () => {
      sendDiscordMatchReminder(match);
    });

    scheduledFixtureJobs.set(match.id, job);
  } catch (err) {
    console.error("Error scheduling match:", match.id, err);
  }
}

export function cancelScheduledMatchMessage(matchId: number) {
  console.log("Cancelling scheduled match:", matchId);
  const job = scheduledFixtureJobs.get(matchId);
  job?.cancel();
}

async function sendDiscordMatchReminder(match: Match) {
  if (process.env.DISCORD_MATCH_REMINDER_WEBHOOK === undefined) {
    throw new Error("DISCORD_MATCH_REMINDER_WEBHOOK is not defined");
  }

  try {
    await fetch(process.env.DISCORD_MATCH_REMINDER_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({
        content: `${match.homeTeam.name} vs ${
          match.awayTeam.name
        } - ${getFormattedTime(match.date)}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Sending discord match reminder for match:", match.id);
  } catch (error) {
    console.error("Error sending discord match reminder:", error);
  }
}

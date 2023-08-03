async function scheduleMatchMessages() {
  const { getFixtureInBetween, scheduleMatchMessage } = await import(
    "@/teams/fixture/service"
  );

  const futureMatches = await getFixtureInBetween(
    new Date().toISOString(),
    new Date(Date.now() + 30 * 7 * 24 * 60 * 60 * 1000).toISOString()
  );

  for (const match of futureMatches) {
    scheduleMatchMessage(match);
  }
}

async function scheduleFixtureFetch() {
  const FIXTURE_FETCH_CRON_EVERY_TUESDAY = "0 0 0 * * 2";

  const [schedule, { filterTeams, saveNextFiveMatches }] = await Promise.all([
    await import("node-schedule"),
    await import("@/teams/service"),
  ]);

  schedule.scheduleJob(FIXTURE_FETCH_CRON_EVERY_TUESDAY, async function () {
    console.log("Fetching fixtures...");

    const teams = await filterTeams({ is_following: true });

    for (const team of teams) {
      console.log("Started fetching fixtures for team: ", team.id, team.name);
      saveNextFiveMatches(team.id)
        .then(() => {
          console.log("Saved fixtures for team: ", team.id, team.name);
        })
        .catch((err) => {
          console.error(
            "Error saving fixtures for team: ",
            team.id,
            team.name,
            err
          );
        });
    }
  });
}

export async function register() {
  try {
    if (process.env.NODE_ENV === "production") {
      await Promise.all([scheduleMatchMessages(), scheduleFixtureFetch()]);
      console.info("Scheduled jobs.");
    }
  } catch (err) {
    console.error("Error scheduling jobs:", err);
  }
}

import { Prisma, Team } from "@prisma/client";
import { getFixtureInBetween } from "./service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFormattedTime, isSameDate } from "@/lib/utils";

function Logo({ src }: { src: string }) {
  return <img src={src} className="max-h-5" />;
}

function Team(team: Pick<Team, "name" | "is_following">) {
  return (
    <span className={team.is_following ? "text-bold" : ""}>{team.name}</span>
  );
}

type DayProps = {
  date: Date;
  matches: Prisma.FixtureGetPayload<{
    include: { homeTeam: true; awayTeam: true };
  }>[];
};
function Day({ date, matches }: DayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{date.toLocaleDateString("tr-TR")}</CardTitle>
        <CardDescription>
          {date.toLocaleDateString("tr-TR", { weekday: "long" })}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {matches.map((match) => (
          <p key={match.id} className="flex flex-wrap gap-1">
            {match.homeTeam.logo && <Logo src={match.homeTeam.logo} />}
            <Team
              name={match.homeTeam.name}
              is_following={match.homeTeam.is_following}
            />
            <span>-</span>
            <Team
              name={match.awayTeam.name}
              is_following={match.awayTeam.is_following}
            />
            {match.awayTeam.logo && <Logo src={match.awayTeam.logo} />}
            <span>{getFormattedTime(match.date)}</span>
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function Calendar() {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  // Monday should be the first day of the week
  const firstDayOfMonthIndex = firstDayOfMonth.getDay() - 1;
  const startPadding = 7 - (7 - firstDayOfMonthIndex);

  const gte = new Date();
  gte.setDate(firstDayOfMonth.getDate() - startPadding);

  const lt = new Date();
  lt.setDate(gte.getDate() + 35);

  const matches = await getFixtureInBetween(
    gte.toISOString(),
    lt.toISOString()
  );

  return (
    <div className="grid grid-cols-7 grid-rows-5 gap-2">
      {Array.from({ length: 35 }, (v, i) => i).map((day) => {
        const date = new Date();
        date.setDate(day - startPadding + 1);

        return (
          <Day
            key={day}
            date={date}
            matches={matches.filter((match) => isSameDate(match.date, date))}
          />
        );
      })}
    </div>
  );
}

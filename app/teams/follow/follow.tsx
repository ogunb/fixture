"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { debounce } from "@/lib/utils";
import { Team } from "@prisma/client";

const selectedTeamClasses = "border-lime-500 border border-dotted";

export default function Select() {
  const [isFetching, setIsFetching] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`/teams`);
        const data = await response.json();
        setTeams(data);
      } finally {
        setIsFetching(false);
      }
    };

    fetchTeams();
  }, []);

  const handleInput = debounce(async (value: string) => {
    try {
      setIsFetching(true);
      setInput(value);

      const hasFollowKeyword = value.includes("follow");
      const name = value.replace("follow", "").trim();
      const response = await fetch(
        `/teams?name=${name}&follow=${hasFollowKeyword || ""}`
      );
      const data = await response.json();
      setTeams(data);
    } finally {
      setIsFetching(false);
    }
  });

  const handleTeamClick = async (team: Team) => {
    try {
      const follow = !team.is_following;

      await fetch(`/teams/follow`, {
        method: "PUT",
        body: JSON.stringify({ teamId: team.id, follow }),
      });

      setTeams(
        teams.map((t) =>
          t.id === team.id ? { ...t, is_following: follow } : t
        )
      );
    } finally {
      setIsFetching(false);
    }
  };

  const isFollowing = (team: Team) => {
    console.log(team);
    return team.is_following;
  };

  return (
    <Command
      className="rounded-lg border shadow-md w-full h-screen max-w-screen-sm max-h-96"
      shouldFilter={false}
    >
      <CommandInput placeholder="Search teams..." onValueChange={handleInput} />
      <CommandList>
        <CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
          {teams.map((team) => (
            <CommandItem
              className={isFollowing(team) ? selectedTeamClasses : "border border-transparent"}
              key={team.id}
              value={team.id.toString()}
              onSelect={() => handleTeamClick(team)}
            >
              {team.name} {team.code} {team.founded}{" "}
              {isFollowing(team) ? "- ✅" : ""}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

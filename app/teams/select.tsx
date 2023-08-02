"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useState } from "react";
import { debounce } from "@/lib/utils";

type Team = {
  id: string;
  name: string;
};

const selectedTeamClasses = "border-lime-500 border border-dotted";

export default function Select() {
  const [isFetching, setIsFetching] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [input, setInput] = useState("");

  const handleInput = debounce(async (value: string) => {
    try {
      setInput(value);
      if (!value) {
        setTeams([]);
        return;
      }

      setIsFetching(true);
      const response = await fetch(`/teams?name=${value}`);
      const data = await response.json();
      setTeams(data);
    } finally {
      setIsFetching(false);
    }
  });

  const handleSelect = async (id: string) => {
    try {
      await fetch(`/teams`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      const removed = teams.filter((team) => team.id !== id);
      setTeams(removed);
    } finally {
      setIsFetching(false);
    }
  };

  const isSelected = (team: Team) => {
    // todo
    return teams.some((t) => t.id === team.id);
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
              className={isSelected(team) ? selectedTeamClasses : ""}
              key={team.id}
              value={team.name}
              onSelect={handleSelect}
            >
              {team.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

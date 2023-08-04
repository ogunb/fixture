import Calendar from "./teams/fixture/calendar";
import Follow from "./teams/follow/follow";

export const revalidate = 10;

export default function Home() {
  return (
    <main className="p-5 flex items-center flex-col gap-5">
      <Follow></Follow>
      <Calendar></Calendar>
    </main>
  );
}

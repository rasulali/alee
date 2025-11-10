import TerminalLoader from "@/src/components/terminal-loader";

export default async function Home() {
  return (
    <main className="h-[500vh]">
      <TerminalLoader />
    </main>
  );
}

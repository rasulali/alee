'use client'
import Nav from "../components/nav";

export default function Home() {
  return (
    <main className="h-dvh w-dvw relative">
      <Nav />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <h1 className="text-xl font-medium text-black dark:text-white">under development</h1>
      </div>
    </main>
  );
}

'use client'
import Nav from "../components/nav";

export default function Home() {
  return (
    <main className="h-dvh w-dvw relative bg-background">
      <Nav />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <h1 className="text-xl font-medium text-primary">under development</h1>
      </div>
    </main>
  );
}

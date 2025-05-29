'use client'
import Nav from "../components/nav";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <main className="h-[200vh]">
        <div className="p-5">
          <p className="text-current text-xl text-center">
            coming soon
          </p>
        </div>
      </main>
    </main>
  );
}

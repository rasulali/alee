'use client'
import Divier from "../components/divier";
import Nav from "../components/nav";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <section className="p-6 min-h-screen">
        <div>
          <h1 className="text-5xl font-semibold">I deliver your digital footprint</h1>
        </div>
        <Divier text="about" />
      </section>
    </main>
  );
}

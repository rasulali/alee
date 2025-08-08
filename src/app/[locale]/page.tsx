"use client";

import BPM from "@/src/components/bpm";

export default function Home() {
  return (
    <main className="relative">
      <section
        id="home"
        className="w-full h-screen flex justify-center items-center"
      >
        <BPM />
      </section>
    </main>
  );
}

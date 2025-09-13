"use client";

import RasulText from "@/src/components/rasul-text";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero section */}
      <section className="h-[83vh] px-6">
        <div className="flex w-full h-full flex-col justify-between select-none uppercase">
          <div className="w-4 h-0" />
          <div className="flex flex-col gap-y-2">
            <p className="font-bold">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos
              necessitatibus eaque itaque.
            </p>
            <div className="h-[70px] w-fit">
              <RasulText className="text-primary w-full h-full" />
              <h1 className="sr-only">RASUL</h1>
            </div>
          </div>
          <div className="h-fit">
            <h2 className="font-bold text-xl">
              Lorem <br /> ipsum dolor sit.
            </h2>
          </div>
        </div>
      </section>
      <section className="h-[117vh]"></section>
    </main>
  );
}

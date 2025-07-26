"use client";
export default function Home() {
  return (
    <main className="relative">
      <section
        id="home"
        className="w-full h-screen flex justify-center items-center"
      >
        <h1 className="block text-center text-4xl">HOME</h1>
      </section>
      <section
        id="projects"
        className="w-full h-screen flex justify-center items-center"
      >
        <h1 className="block text-center text-4xl">PROJECTS</h1>
      </section>
      <section
        id="writings"
        className="w-full h-screen flex justify-center items-center"
      >
        <h1 className="block text-center text-4xl">WRITINGS</h1>
      </section>
      <section
        id="about"
        className="w-full h-screen flex justify-center items-center"
      >
        <h1 className="block text-center text-4xl">ABOUT</h1>
      </section>
    </main>
  );
}

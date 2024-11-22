import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
  return (
    <>
      <title>404: This page could not be found.</title>
      <div className="h-dvh flex items-center justify-center bg-black">
        <div className="flex flex-col gap-y-4 items-end">
          <h1 className="text-3xl text-white">404 | Not Found</h1>
          <Link href="/" className="text-center text-white/50 text-lg font-medium uppercase
            hover:text-white transition-colors">
            Home</Link>
        </div>
      </div>
    </>
  );
}

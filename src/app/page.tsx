export default function Home() {
  return (
    <main className="h-dvh flex items-center justify-center px-4">
      <div className="mockup-code xl:w-1/2 text-xs xl:text-base">
        <pre data-prefix="$"><code>launch personal-website</code></pre>
        <pre data-prefix=">" className="text-success"><code>Initializing portfolio components...</code></pre>
        <pre data-prefix=">" className="text-warning"><code>Building site assets...</code></pre>
        <pre data-prefix=">" className="text-info"><code>Deploying to <span className="underline">alee.az</span> ⚡️</code></pre>
      </div>
    </main>
  );
}

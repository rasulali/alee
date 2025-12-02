"use server";
export default async function TerminalLoader() {
  return (
    <div className="terminal-loader fixed inset-0 flex items-center justify-center bg-background text-primary">
      <style>{`
    @keyframes terminal-spin {
      0% { content: "⠋"; }
      10% { content: "⠙"; }
      20% { content: "⠹"; }
      30% { content: "⠸"; }
      40% { content: "⠼"; }
      50% { content: "⠴"; }
      60% { content: "⠦"; }
      70% { content: "⠧"; }
      80% { content: "⠇"; }
      90% { content: "⠏"; }
      100% { content: "⠋"; }
    }

    .terminal-loader .terminal-spinner::before {
      content: "⠋";
      display: inline-block;
      animation: terminal-spin 0.8s steps(1) infinite;
      font-size: 1.3em; /* 30% bigger than inherited font size */
    }
  `}</style>
      <div className="text-2xl md:text-3xl font-bold">
        <div className="flex items-center">
          <span className="text-accent">#</span>
          <span
            className="terminal-spinner ml-2"
            role="status"
            aria-label="Loading"
          ></span>
        </div>
      </div>
    </div>
  );
}

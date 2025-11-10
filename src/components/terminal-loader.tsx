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
    .terminal-loader .cursor-line {
      display: block;
      width: 0.6ch;
      height: 2px;
      background: currentColor;
      margin-left: 0.25rem;
      transform: translateY(0.3em);
    }
    .terminal-loader .terminal-spinner::before {
      content: "⠋";
      display: inline-block;
      animation: terminal-spin 0.8s steps(1) infinite;
    }
  `}</style>
      <div className="text-sm md:text-base">
        <div className="flex items-center">
          <span className="text-accent">#</span>
          <span className="cursor-line"></span>
          <span
            className="terminal-spinner ml-2 text-accent"
            role="status"
            aria-label="Loading"
          ></span>
        </div>
      </div>
    </div>
  );
}

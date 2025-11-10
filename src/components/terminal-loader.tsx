"use server";
export default async function TerminalLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
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
        }
        .terminal-spinner::before {
          content: "⠋";
          animation: terminal-spin 0.8s steps(1) infinite;
        }
      `}</style>
      <div className="text-base font-bold flex items-center">
        <span className="text-accent">#</span>
        <span className="block w-[0.6ch] h-[2px] bg-current translate-y-[0.3em]"></span>
        <span className="text-primary terminal-spinner"></span>
      </div>
    </div>
  );
}

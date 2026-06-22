export default function AgentAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClass =
    size === 'xl'
      ? 'h-24 w-24'
      : size === 'lg'
        ? 'h-16 w-16'
        : size === 'md'
          ? 'h-12 w-12'
          : 'h-9 w-9';

  return (
    <div
      className={`${sizeClass} relative flex shrink-0 items-center justify-center rounded-[1.35rem] bg-slate-950 shadow-lg shadow-indigo-200/40`}
    >
      <div className="absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_28%_22%,rgba(99,102,241,0.75),transparent_36%),radial-gradient(circle_at_70%_72%,rgba(14,165,233,0.42),transparent_38%)]" />
      <div className="absolute inset-1 rounded-[1.1rem] border border-white/10" />
      <div className="relative flex h-[62%] w-[62%] items-center justify-center rounded-2xl border border-white/35 bg-white/10">
        <div className="absolute top-[28%] left-[27%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute top-[28%] right-[27%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute bottom-[25%] h-1 w-7 rounded-full bg-white/80" />
      </div>
      <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500" />
    </div>
  );
}

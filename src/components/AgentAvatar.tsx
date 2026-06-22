export default function AgentAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-14 w-14' : size === 'md' ? 'h-11 w-11' : 'h-8 w-8';

  return (
    <div
      className={`${sizeClass} relative flex shrink-0 items-center justify-center rounded-2xl bg-slate-950 shadow-sm`}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.65),transparent_36%),radial-gradient(circle_at_72%_74%,rgba(14,165,233,0.35),transparent_40%)]" />
      <div className="relative flex h-[62%] w-[62%] items-center justify-center rounded-xl border border-white/35 bg-white/10">
        <div className="absolute top-[28%] left-[27%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute top-[28%] right-[27%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute bottom-[25%] h-1 w-6 rounded-full bg-white/80" />
      </div>
      <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
    </div>
  );
}

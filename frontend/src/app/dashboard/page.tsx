import type { Metadata } from 'next';
import GlassMoodChart from './_components/GlassMoodChart';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {
  return (
    <main
      className="
        relative h-dvh w-dvw overflow-hidden p-6
        bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-950
        before:content-[''] before:pointer-events-none before:absolute before:inset-0
        before:bg-[radial-gradient(1100px_circle_at_18%_12%,rgba(99,102,241,0.28),transparent_55%)]
        after:content-[''] after:pointer-events-none after:absolute after:inset-0
        after:bg-[radial-gradient(900px_circle_at_85%_90%,rgba(34,211,238,0.22),transparent_58%)]
      "
    >
      <GlassMoodChart />
    </main>
  );
}

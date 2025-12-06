import { getHomeView, getStatistics } from '@/lib/data';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Skills } from '@/components/Skills';
import { Contact } from '@/components/Contact';
import { Background } from '@/components/Background';
import { VisitorCounter } from '@/components/VisitorCounter';
import { BrainCursor } from '@/components/BrainCursor';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const homeData = await getHomeView();
  const statsData = await getStatistics();

  if (!homeData || !statsData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Loading Portfolio...</h1>
          <p className="text-gray-400">Connecting to neural network...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden font-sans">
      <VisitorCounter />
      <Background />
      <BrainCursor />
      
      <Hero data={homeData} />
      <Stats data={statsData} />
      <Skills data={homeData} />
      <Contact data={homeData} />
    </main>
  );
}

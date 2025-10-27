import InsightsCardRemote from '@/components/insights/InsightsCard.Remote';

export default function MePage() {
  return (
    <div className="h-full overflow-auto">
      <div className="h-full px-4 md:px-6 lg:px-8 pt-6 pb-0">
        <InsightsCardRemote />
      </div>
    </div>
  );
}

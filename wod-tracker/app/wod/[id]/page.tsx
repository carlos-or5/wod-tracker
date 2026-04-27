import { WodDetail } from "@/app/components/WodDetail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function WodDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WodDetail wodId={id} />
    </div>
  );
}

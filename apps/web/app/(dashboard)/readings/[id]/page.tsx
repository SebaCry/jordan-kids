import { ReadingDetail } from "./reading-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReadingDetailPage({ params }: Props) {
  const { id } = await params;
  return <ReadingDetail readingId={parseInt(id)} />;
}

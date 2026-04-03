import { getSession, canManageScores } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChildDetail } from "./child-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChildDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const canManage = canManageScores(session.role);

  return <ChildDetail childId={parseInt(id)} canManageScores={canManage} />;
}

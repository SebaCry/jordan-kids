import { getSession, canManageChildren } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChildrenList } from "./children-list";

export default async function ChildrenPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const canManage = canManageChildren(session.role);

  let children: Array<{
    id: number;
    name: string;
    email: string;
    age?: number;
    totalPoints: number;
    badgeCount: number;
    avatarUrl?: string | null;
  }> = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/children`, {
      cache: "no-store",
      headers: { Cookie: `session=${(await import("next/headers")).cookies().then ? "" : ""}` },
    });
    if (res.ok) {
      const data = await res.json();
      children = data.children ?? data ?? [];
    }
  } catch {
    // Will show empty state
  }

  return <ChildrenList children={children} canManage={canManage} />;
}

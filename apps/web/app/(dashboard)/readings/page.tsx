import { ReadingsGrid } from "./readings-grid";

export default async function ReadingsPage() {
  let readings: Array<{
    id: number;
    title: string;
    bibleReference: string;
    difficulty: "easy" | "medium" | "hard";
    pointsValue: number;
    status?: "pending" | "in_progress" | "completed";
  }> = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/readings`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      readings = data.readings ?? data ?? [];
    }
  } catch {
    // empty
  }

  return <ReadingsGrid readings={readings} />;
}

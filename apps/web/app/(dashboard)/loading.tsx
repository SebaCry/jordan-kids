import { Sparkles } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce-gentle">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 shadow-fun">
            <Sparkles className="h-8 w-8 text-white animate-spin-slow" />
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-400">Cargando...</p>
      </div>
    </div>
  );
}

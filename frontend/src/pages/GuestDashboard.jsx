import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import NinosTable from '../components/NinosTable';
import useNinos from '../hooks/useNinos';
import { Users, Loader2, LogOut, Eye, Info } from 'lucide-react';

export function GuestDashboard() {
  const { user, logout } = useAuth();
  const { ninos, loading, error } = useNinos();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-300 text-lg">Cargando datos...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header con info del usuario */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-blue-700/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Panel de Invitado</h2>
              <p className="text-blue-200">Bienvenido, {user?.nombre}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

        {/* Info box */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6 flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-blue-300 font-semibold mb-1">Modo Solo Lectura</h3>
            <p className="text-slate-400 text-sm">
              Tu cuenta tiene permisos de invitado. Puedes ver la información de los niños y sus puntos,
              pero no puedes crear, editar o eliminar registros. Si necesitas permisos de administrador,
              contacta con el administrador del sistema.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-xl shadow-lg backdrop-blur-sm">
            <strong className="font-bold">Error:</strong> {error}
          </div>
        )}

        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-400" />
            Listado de Niños (Solo Lectura)
          </h2>
          {ninos.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No hay niños registrados en el sistema.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Mostrando {ninos.length} {ninos.length === 1 ? 'niño' : 'niños'}. Los botones de edición y eliminación están deshabilitados.
                </p>
              </div>
              {/* Tabla sin botones de acción */}
              <NinosTable ninos={ninos} onEliminar={null} readOnly={true} />
            </>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

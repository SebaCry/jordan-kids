import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import NinoForm from '../components/NinoForm';
import NinosTable from '../components/NinosTable';
import useNinos from '../hooks/useNinos';
import { Users, Loader2, LogOut, ShieldCheck, Heart, Award } from 'lucide-react';
import img1 from '../assets/images/img1.png';
import img2 from '../assets/images/img2.png';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { ninos, loading, error, crearNino, eliminarNino } = useNinos();
  const navigate = useNavigate();

  const handleCrearNino = async (ninoData) => {
    await crearNino(ninoData);
  };

  const handleEliminarNino = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este niño?')) {
      await eliminarNino(id);
    }
  };

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
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-700/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Panel de Administrador</h2>
              <p className="text-purple-200">Bienvenido, {user?.nombre}</p>
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

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl backdrop-blur-sm group-hover:scale-105 transition-transform duration-300" />
              <img
                src={img1}
                alt="Niños de la iglesia"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-400" />
                  Comunidad y Amor
                </h3>
                <p className="text-slate-200 text-sm mt-1">
                  Juntos crecemos en fe y amistad
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl backdrop-blur-sm group-hover:scale-105 transition-transform duration-300" />
              <img
                src={img2}
                alt="Niños felices"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Sistema de Recompensas
                </h3>
                <p className="text-slate-200 text-sm mt-1">
                  Motiva y reconoce el esfuerzo de cada niño
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-xl shadow-lg backdrop-blur-sm">
            <strong className="font-bold">Error:</strong> {error}
          </div>
        )}

        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Agregar Nuevo Niño
          </h2>
          <NinoForm onSubmit={handleCrearNino} />
        </section>

        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Listado de Niños
          </h2>
          {ninos.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No hay niños registrados. Agrega el primero.
              </p>
            </div>
          ) : (
            <NinosTable ninos={ninos} onEliminar={handleEliminarNino} />
          )}
        </section>
      </div>
    </MainLayout>
  );
}

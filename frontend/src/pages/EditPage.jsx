import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import NinoForm from '../components/NinoForm';
import useNino from '../hooks/useNino';
import { allActivities } from '../utils/activities';
import {
  ArrowLeft,
  Book,
  ScrollText,
  MessageCircle,
  Search,
  UserPlus,
  HelpCircle,
  Clock,
  Heart,
  Plus,
  Minus,
  Trophy,
  Loader2,
  Save
} from 'lucide-react';
import img2 from '../assets/images/img2.png';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { nino, loading, error, actualizarNino, agregarPuntos, restarPuntos } = useNino(id);
  const [isEditing, setIsEditing] = useState(false);

  const actividades = allActivities(Book, ScrollText, MessageCircle, Search, UserPlus, HelpCircle, Clock, Heart);

  const handleActualizarNino = async (ninoData) => {
    await actualizarNino(ninoData);
    setIsEditing(false);
  };

  const handleAgregarPuntos = async (actividad) => {
    await agregarPuntos(actividad);
  };

  const handleRestarPuntos = async (actividad) => {
    await restarPuntos(actividad);
  };

  if (loading || !nino) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-300 text-lg">Cargando información...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al Listado</span>
        </button>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-xl shadow-lg backdrop-blur-sm">
            <strong className="font-bold">Error:</strong> {error}
          </div>
        )}

        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
          {/* Decorative background image */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${img2})` }}
          />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {nino.nombre} {nino.apellido}
              </h2>
              <p className="text-slate-400">Edad: {nino.edad} años</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                <div>
                  <p className="text-xs text-purple-200">Total Puntos</p>
                  <p className="text-2xl font-bold">{nino.total || 0}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Cancelar' : 'Editar Info'}
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="mb-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700 relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Actualizar Información</h3>
              <NinoForm onSubmit={handleActualizarNino} ninoInicial={nino} />
            </div>
          )}
        </section>

        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-purple-400" />
            Sistema de Puntos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {actividades.map((actividad) => {
              const Icon = actividad.icon;
              const count = nino.puntos?.[actividad.key] || 0;
              const totalPuntos = count * actividad.puntos;

              return (
                <div
                  key={actividad.key}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 shadow-xl border border-slate-600 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${actividad.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-white font-semibold text-base mb-2 min-h-[3rem] flex items-center">
                    {actividad.label}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm">
                      +{actividad.puntos} pts c/u
                    </span>
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                      {totalPuntos} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRestarPuntos(actividad.key)}
                      disabled={count === 0}
                      className="flex-1 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2 group"
                      title="Restar"
                    >
                      <Minus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="px-4 py-3 bg-slate-900 text-white font-bold text-xl rounded-lg min-w-[60px] text-center border border-slate-600">
                      {count}
                    </div>

                    <button
                      onClick={() => handleAgregarPuntos(actividad.key)}
                      className={`flex-1 p-3 bg-gradient-to-r ${actividad.buttonColor} text-white rounded-lg ${actividad.hoverColor} transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group`}
                      title="Agregar"
                    >
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default EditPage;

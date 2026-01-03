import MainLayout from '../layouts/MainLayout';
import NinoForm from '../components/NinoForm';
import NinosTable from '../components/NinosTable';
import useNinos from '../hooks/useNinos';

const HomePage = () => {
  const { ninos, loading, error, crearNino, eliminarNino, agregarPuntos, restarPuntos } = useNinos();

  const handleCrearNino = async (ninoData) => {
    await crearNino(ninoData);
  };

  const handleEliminarNino = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este niño?')) {
      await eliminarNino(id);
    }
  };

  const handleAgregarPuntos = async (id, actividad) => {
    await agregarPuntos(id, actividad);
  };

  const handleRestarPuntos = async (id, actividad) => {
    await restarPuntos(id, actividad);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center text-lg py-12">Cargando...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Agregar Nuevo Niño
          </h2>
          <NinoForm onSubmit={handleCrearNino} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Listado de Niños
          </h2>
          {ninos.length === 0 ? (
            <p className="text-center text-gray-600 py-8 text-base">
              No hay niños registrados. Agrega el primero.
            </p>
          ) : (
            <NinosTable
              ninos={ninos}
              onAgregarPuntos={handleAgregarPuntos}
              onRestarPuntos={handleRestarPuntos}
              onEliminar={handleEliminarNino}
            />
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;

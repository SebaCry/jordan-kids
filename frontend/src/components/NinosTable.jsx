const NinosTable = ({ ninos, onAgregarPuntos, onRestarPuntos, onEliminar }) => {
  const actividades = [
    { key: 'traerBiblia', label: 'Biblia', puntos: 2 },
    { key: 'versiculoMemorizado', label: 'Versículo', puntos: 2 },
    { key: 'participacion', label: 'Participación', puntos: 1 },
    { key: 'busquedaRapida', label: 'Búsqueda', puntos: 2 },
    { key: 'traerAmigo', label: 'Amigo', puntos: 5 },
    { key: 'responderPreguntas', label: 'Preguntas', puntos: 1 },
    { key: 'asistenciaPuntual', label: 'Asistencia', puntos: 1 },
    { key: 'realizarOracion', label: 'Oración', puntos: 1 }
  ];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="px-4 py-3 text-left text-xs font-bold">Nombre</th>
            <th className="px-4 py-3 text-left text-xs font-bold">Apellido</th>
            <th className="px-4 py-3 text-left text-xs font-bold">Edad</th>
            {actividades.map(act => (
              <th key={act.key} className="px-4 py-3 text-left text-xs font-bold">
                {act.label} (+{act.puntos})
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-bold">Total</th>
            <th className="px-4 py-3 text-left text-xs font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ninos.map(nino => (
            <tr key={nino.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm">{nino.nombre}</td>
              <td className="px-4 py-3 text-sm">{nino.apellido}</td>
              <td className="px-4 py-3 text-sm">{nino.edad}</td>
              {actividades.map(act => (
                <td key={act.key} className="px-2 py-3">
                    <div className="flex items-center gap-1 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded min-w-[50px] text-center">
                        {nino.puntos?.[act.key] || 0}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onRestarPuntos(nino.id, act.key)}
                        className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors duration-200"
                        title="Restar punto"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onAgregarPuntos(nino.id, act.key)}
                        className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors duration-200"
                        title="Agregar punto"
                      >
                        +
                      </button>
                    </div>
                    
                </td>
              ))}
              <td className="px-4 py-3 text-base font-bold text-green-600">{nino.total || 0}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onEliminar(nino.id)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NinosTable;

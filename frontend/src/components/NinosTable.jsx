import { Pencil, Trash2, Trophy, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NinosTable = ({ ninos, onEliminar }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="overflow-x-auto shadow-2xl rounded-xl border border-slate-700">
      <table className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white border-b border-purple-700">
            <th className="px-6 py-4 text-left text-sm font-bold">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold">Apellido</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Edad</th>
            <th className="px-6 py-4 text-left text-sm font-bold">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Total Puntos
              </div>
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ninos.map((nino, index) => (
            <tr
              key={nino.id}
              className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-200 ${
                index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'
              }`}
            >
              <td className="px-6 py-4 text-sm text-slate-200 font-medium">{nino.nombre}</td>
              <td className="px-6 py-4 text-sm text-slate-200">{nino.apellido}</td>
              <td className="px-6 py-4 text-sm text-slate-300">
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-semibold">
                  {nino.edad} años
                </span>
              </td>
              <td className="px-6 py-4 text-base font-bold">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg inline-flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {nino.total || 0}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(nino.id)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 group"
                    title="Editar niño"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => onEliminar(nino.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/50 group"
                    title="Eliminar niño"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NinosTable;

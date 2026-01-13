import { useState } from 'react';
import { UserPlus } from 'lucide-react';

const NinoForm = ({ onSubmit, ninoInicial = null }) => {
  const [nombre, setNombre] = useState(ninoInicial?.nombre || '');
  const [apellido, setApellido] = useState(ninoInicial?.apellido || '');
  const [edad, setEdad] = useState(ninoInicial?.edad || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, apellido, edad: parseInt(edad) });
    if (!ninoInicial) {
      setNombre('');
      setApellido('');
      setEdad('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-2xl border border-slate-600">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="flex-1 px-4 py-3 text-sm bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 transition-all"
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
        className="flex-1 px-4 py-3 text-sm bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 transition-all"
      />
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        required
        className="w-full sm:w-24 px-4 py-3 text-sm bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
      >
        <UserPlus className="w-4 h-4" />
        {ninoInicial ? 'Actualizar' : 'Agregar Niño'}
      </button>
    </form>
  );
};

export default NinoForm;

import { useState } from 'react';

const NinoForm = ({ onSubmit, ninoInicial = null }) => {
  const [nombre, setNombre] = useState(ninoInicial?.nombre || '');
  const [apellido, setApellido] = useState(ninoInicial?.apellido || '');
  const [edad, setEdad] = useState(ninoInicial?.edad || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, apellido, edad: parseInt(edad) });
    setNombre('');
    setApellido('');
    setEdad('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6 p-5 bg-gray-50 rounded-lg shadow-sm">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        required
        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-24"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors duration-200"
      >
        {ninoInicial ? 'Actualizar' : 'Agregar Niño'}
      </button>
    </form>
  );
};

export default NinoForm;

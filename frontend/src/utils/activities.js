export function allActivities(book, scrolltext, messagecircle, search, userplus, helpcircle, clock, heart) {
    return [
    {
      key: 'traerBiblia',
      label: 'Traer la Biblia',
      puntos: 2,
      icon: book,
      color: 'from-blue-600 to-blue-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800'
    },
    {
      key: 'versiculoMemorizado',
      label: 'Versículo Memorizado',
      puntos: 2,
      icon: scrolltext,
      color: 'from-purple-600 to-purple-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800'
    },
    {
      key: 'participacion',
      label: 'Participación',
      puntos: 1,
      icon: messagecircle,
      color: 'from-green-600 to-green-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-700 hover:to-green-800'
    },
    {
      key: 'busquedaRapida',
      label: 'Búsqueda Rápida',
      puntos: 2,
      icon: search,
      color: 'from-yellow-600 to-yellow-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-yellow-700 hover:to-yellow-800'
    },
    {
      key: 'traerAmigo',
      label: 'Traer un Amigo',
      puntos: 5,
      icon: userplus,
      color: 'from-pink-600 to-pink-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-pink-700 hover:to-pink-800'
    },
    {
      key: 'responderPreguntas',
      label: 'Responder Preguntas',
      puntos: 1,
      icon: helpcircle,
      color: 'from-indigo-600 to-indigo-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-indigo-700 hover:to-indigo-800'
    },
    {
      key: 'asistenciaPuntual',
      label: 'Asistencia Puntual',
      puntos: 1,
      icon: clock,
      color: 'from-teal-600 to-teal-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-teal-700 hover:to-teal-800'
    },
    {
      key: 'realizarOracion',
      label: 'Realizar una Oración',
      puntos: 1,
      icon: heart,
      color: 'from-red-600 to-red-700',
      buttonColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-red-700 hover:to-red-800'
    }
  ];
}
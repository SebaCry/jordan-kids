export const ACTIVITIES = {
  traerBiblia: { key: "traerBiblia", label: "Traer la biblia", points: 2 },
  versiculoMemorizado: { key: "versiculoMemorizado", label: "Versiculo memorizado", points: 2 },
  participacion: { key: "participacion", label: "Participacion", points: 1 },
  busquedaRapida: { key: "busquedaRapida", label: "Busqueda rapida", points: 2 },
  traerAmigo: { key: "traerAmigo", label: "Traer un amigo", points: 5 },
  responderPreguntas: { key: "responderPreguntas", label: "Responder preguntas", points: 1 },
  asistenciaPuntual: { key: "asistenciaPuntual", label: "Asistencia puntual", points: 1 },
  realizarOracion: { key: "realizarOracion", label: "Realizar una oracion", points: 1 },
} as const;

export type ActivityKey = keyof typeof ACTIVITIES;

export const SCORE_CATEGORIES = ["attendance", "reading", "game", "activity"] as const;

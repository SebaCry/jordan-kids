-- Crear tabla de niños
CREATE TABLE IF NOT EXISTS ninos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de puntos
CREATE TABLE IF NOT EXISTS puntos (
    id SERIAL PRIMARY KEY,
    nino_id INTEGER NOT NULL REFERENCES ninos(id) ON DELETE CASCADE,
    traer_biblia INTEGER DEFAULT 0,
    versiculo_memorizado INTEGER DEFAULT 0,
    participacion INTEGER DEFAULT 0,
    busqueda_rapida INTEGER DEFAULT 0,
    traer_amigo INTEGER DEFAULT 0,
    responder_preguntas INTEGER DEFAULT 0,
    asistencia_puntual INTEGER DEFAULT 0,
    realizar_oracion INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nino_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_ninos_nombre ON ninos(nombre);
CREATE INDEX IF NOT EXISTS idx_puntos_nino_id ON puntos(nino_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_ninos_updated_at BEFORE UPDATE ON ninos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_puntos_updated_at BEFORE UPDATE ON puntos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

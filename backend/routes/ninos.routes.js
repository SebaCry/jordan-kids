const express = require('express');
const router = express.Router();
const ninoService = require('../services/nino.service');

// GET /api/ninos - Obtener todos los niños
router.get('/', async (req, res) => {
  try {
    const ninos = await ninoService.getAll();
    res.json(ninos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ninos/:id - Obtener niño por ID
router.get('/:id', async (req, res) => {
  try {
    const nino = await ninoService.getById(req.params.id);
    if (!nino) {
      return res.status(404).json({ error: 'Niño no encontrado' });
    }
    res.json(nino);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ninos - Crear niño
router.post('/', async (req, res) => {
  try {
    const nuevoNino = await ninoService.create(req.body);
    res.status(201).json(nuevoNino);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/ninos/:id - Actualizar niño
router.put('/:id', async (req, res) => {
  try {
    const ninoActualizado = await ninoService.update(req.params.id, req.body);
    if (!ninoActualizado) {
      return res.status(404).json({ error: 'Niño no encontrado' });
    }
    res.json(ninoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/ninos/:id - Eliminar niño
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await ninoService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Niño no encontrado' });
    }
    res.json({ message: 'Niño eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ninos/:id/puntos - Agregar puntos a una actividad
router.post('/:id/puntos', async (req, res) => {
  try {
    const { actividad } = req.body;
    const ninoActualizado = await ninoService.agregarPuntos(req.params.id, actividad);
    if (!ninoActualizado) {
      return res.status(404).json({ error: 'Niño no encontrado' });
    }
    res.json(ninoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/ninos/:id/puntos - Restar puntos de una actividad
router.delete('/:id/puntos', async (req, res) => {
  try {
    const { actividad } = req.body;
    const ninoActualizado = await ninoService.restarPuntos(req.params.id, actividad);
    if (!ninoActualizado) {
      return res.status(404).json({ error: 'Niño no encontrado' });
    }
    res.json(ninoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

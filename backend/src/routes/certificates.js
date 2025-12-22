const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const certificateController = require('../controllers/certificateController');

// POST: Generar certificados masivos desde Excel
router.post('/generate', 
  upload.single('excel'), 
  certificateController.generateCertificates
);

// POST: Generar certificado individual con datos manuales
router.post('/generate-single', 
  certificateController.generateSingleCertificate
);

// GET: Health check
router.get('/health', certificateController.healthCheck);

module.exports = router;
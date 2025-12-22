const excelService = require('../services/excelService');
const pdfService = require('../services/pdfService');
const zipService = require('../services/zipService');

class CertificateController {
  /**
   * Genera certificados masivos desde un archivo Excel
   * Compatible con Vercel Serverless (usa buffers en memoria)
   */
  async generateCertificates(req, res) {
    try {
      // Verificar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({ 
          error: 'No se subió ningún archivo' 
        });
      }

      // Validar datos del curso (vienen en el body)
      const { nombreCurso, fechaCurso } = req.body;
      
      if (!nombreCurso || !fechaCurso) {
        return res.status(400).json({ 
          error: 'Faltan datos del curso (nombreCurso y fechaCurso)' 
        });
      }

      console.log('📄 Procesando archivo:', req.file.originalname);
      console.log('📚 Curso:', nombreCurso);
      console.log('📅 Fecha del curso:', fechaCurso);

      // 1. Leer y parsear el Excel desde buffer (compatible con serverless)
      const personas = excelService.parseExcelFromBuffer(req.file.buffer);
      console.log(`👥 Se encontraron ${personas.length} personas`);

      // 2. Generar PDFs para cada persona
      const certificados = [];
      
      for (let i = 0; i < personas.length; i++) {
        const persona = personas[i];
        console.log(`📝 Generando certificado ${i + 1}/${personas.length} para ${persona.nombre} ${persona.apellido}`);
        
        // Combinar datos de la persona con datos del curso
        const datosCompletos = {
          ...persona,
          nombreCurso,
          fechaCurso,
          fechaEmision: new Date() // Fecha actual
        };
        
        const pdfBuffer = await pdfService.generateCertificate(datosCompletos);
        const fileName = pdfService.getFileName(persona);
        
        certificados.push({
          nombre: fileName,
          buffer: pdfBuffer
        });
      }

      // 3. Crear ZIP en memoria (compatible con serverless)
      const zipBuffer = await zipService.createZipInMemory(certificados);
      
      console.log('✅ Certificados generados exitosamente');

      // 4. Enviar el ZIP directamente como buffer
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="constancias_infogep.zip"');
      res.setHeader('Content-Length', zipBuffer.length);
      res.send(zipBuffer);

    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).json({ 
        error: 'Error al generar certificados',
        message: error.message 
      });
    }
  }

  /**
   * Genera un certificado individual con datos manuales
   */
  async generateSingleCertificate(req, res) {
    try {
      const { nombre, apellido, dni, nombreCurso, fechaCurso } = req.body;
      
      // Validar todos los campos requeridos
      if (!nombre || !apellido || !dni || !nombreCurso || !fechaCurso) {
        return res.status(400).json({ 
          error: 'Faltan datos requeridos',
          campos: ['nombre', 'apellido', 'dni', 'nombreCurso', 'fechaCurso']
        });
      }

      console.log('📝 Generando certificado individual para:', nombre, apellido);

      // Preparar datos completos
      const datosCompletos = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        nombreCurso: nombreCurso.trim(),
        fechaCurso: fechaCurso.trim(),
        fechaEmision: new Date()
      };

      // Generar PDF
      const pdfBuffer = await pdfService.generateCertificate(datosCompletos);
      const fileName = pdfService.getFileName(datosCompletos);

      console.log('✅ Certificado generado exitosamente');

      // Enviar PDF directamente
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).json({ 
        error: 'Error al generar certificado individual',
        message: error.message 
      });
    }
  }

  /**
   * Endpoint de health check
   */
  async healthCheck(req, res) {
    res.json({ 
      status: 'OK', 
      message: 'Servicio de certificados INFOGEP funcionando correctamente',
      timestamp: new Date().toISOString(),
      endpoints: {
        masivo: 'POST /api/certificates/generate',
        individual: 'POST /api/certificates/generate-single',
        health: 'GET /api/certificates/health'
      }
    });
  }
}

module.exports = new CertificateController();
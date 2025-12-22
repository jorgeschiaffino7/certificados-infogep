const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

class ZipService {
  /**
   * Crea un archivo ZIP con múltiples PDFs
   * @param {Array} certificados - Array de objetos con {nombre, buffer}
   * @param {string} outputPath - Ruta donde guardar el ZIP
   * @returns {Promise} - Promesa que se resuelve cuando el ZIP está listo
   */
  async createZipWithCertificates(certificados, outputPath) {
    return new Promise((resolve, reject) => {
      // Crear stream de escritura
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Máxima compresión
      });

      // Escuchar eventos
      output.on('close', () => {
        console.log(`ZIP creado: ${archive.pointer()} bytes`);
        resolve(outputPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      // Pipe del archivo
      archive.pipe(output);

      // Agregar cada certificado al ZIP
      certificados.forEach(cert => {
        archive.append(cert.buffer, { name: cert.nombre });
      });

      // Finalizar el archivo
      archive.finalize();
    });
  }

  /**
   * Elimina archivo temporal
   * @param {string} filePath - Ruta del archivo a eliminar
   */
  async deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
    }
  }
}

module.exports = new ZipService();
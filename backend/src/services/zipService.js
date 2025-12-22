const archiver = require('archiver');

class ZipService {
  /**
   * Crea un archivo ZIP en memoria con múltiples PDFs
   * Compatible con Vercel Serverless (no usa sistema de archivos)
   * @param {Array} certificados - Array de objetos con {nombre, buffer}
   * @returns {Promise<Buffer>} - Promesa que se resuelve con el buffer del ZIP
   */
  async createZipInMemory(certificados) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      const archive = archiver('zip', {
        zlib: { level: 9 } // Máxima compresión
      });

      // Recolectar chunks en memoria
      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });

      archive.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log(`ZIP creado en memoria: ${buffer.length} bytes`);
        resolve(buffer);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      // Agregar cada certificado al ZIP
      certificados.forEach(cert => {
        archive.append(cert.buffer, { name: cert.nombre });
      });

      // Finalizar el archivo
      archive.finalize();
    });
  }
}

module.exports = new ZipService();
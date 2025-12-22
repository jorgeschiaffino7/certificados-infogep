const XLSX = require('xlsx');

class ExcelService {
  /**
   * Lee un archivo Excel desde un buffer y extrae los datos de asistentes
   * Compatible con Vercel Serverless (memoryStorage)
   * @param {Buffer} buffer - Buffer del archivo Excel
   * @returns {Array} - Array de objetos con datos de personas
   */
  parseExcelFromBuffer(buffer) {
    try {
      // Leer el archivo desde buffer (compatible con serverless)
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // Obtener la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Validar y normalizar datos
      const normalizedData = data.map((row, index) => {
        const nombre = row.Nombre || row.nombre || row.NOMBRE || '';
        const apellido = row.Apellido || row.apellido || row.APELLIDO || '';
        const dni = row.DNI || row.dni || row.Dni || '';
        
        // Validar que tenga los datos mínimos
        if (!nombre || !apellido) {
          throw new Error(`Fila ${index + 2}: Falta nombre o apellido`);
        }
        
        if (!dni) {
          throw new Error(`Fila ${index + 2}: Falta DNI`);
        }
        
        return {
          nombre: nombre.toString().trim(),
          apellido: apellido.toString().trim(),
          dni: dni.toString().trim()
        };
      });
      
      return normalizedData;
      
    } catch (error) {
      throw new Error(`Error al procesar Excel: ${error.message}`);
    }
  }
}

module.exports = new ExcelService();
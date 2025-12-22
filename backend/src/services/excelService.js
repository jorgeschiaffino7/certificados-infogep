const XLSX = require('xlsx');
const fs = require('fs');

class ExcelService {
  /**
   * Lee un archivo Excel y extrae los datos de asistentes
   * @param {string} filePath - Ruta del archivo Excel
   * @returns {Array} - Array de objetos con datos de personas
   */
  parseExcelFile(filePath) {
    try {
      // Leer el archivo
      const workbook = XLSX.readFile(filePath);
      
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
      
      // Eliminar el archivo temporal después de leerlo
      this.deleteFile(filePath);
      
      return normalizedData;
      
    } catch (error) {
      // Eliminar archivo en caso de error
      this.deleteFile(filePath);
      throw new Error(`Error al procesar Excel: ${error.message}`);
    }
  }
  
  /**
   * Elimina un archivo del sistema
   * @param {string} filePath - Ruta del archivo a eliminar
   */
  deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
    }
  }
}

module.exports = new ExcelService();
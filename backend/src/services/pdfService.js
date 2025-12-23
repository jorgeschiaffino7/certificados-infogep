const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFService {
  constructor() {
    this.logoPath = path.join(__dirname, '../assets/logo-header.png');
    this.firmaPath = path.join(__dirname, '../assets/firma.png');
  }

  /**
   * Carga una imagen PNG y la embebe en el documento PDF
   */
  async embedImage(pdfDoc, imagePath) {
    try {
      const imageBytes = await fs.readFile(imagePath);
      return await pdfDoc.embedPng(imageBytes);
    } catch (error) {
      console.warn(`No se pudo cargar imagen ${imagePath}:`, error.message);
      return null;
    }
  }

  /**
   * Genera un certificado PDF para una persona
   * @param {Object} datos - Datos completos para el certificado
   * @returns {Buffer} - Buffer del PDF generado
   */
  async generateCertificate(datos) {
    // Crear documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Agregar página A4
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 en puntos
    const { width, height } = page.getSize();
    
    // Cargar fuentes
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Cargar imágenes
    const logoImage = await this.embedImage(pdfDoc, this.logoPath);
    const firmaImage = await this.embedImage(pdfDoc, this.firmaPath);
    
    // Márgenes
    const marginLeft = 60;
    const marginRight = 60;
    const contentWidth = width - marginLeft - marginRight;
    
    let yPosition = height - 60;
    
    // === LOGO ===
    if (logoImage) {
      const logoWidth = 300;
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
      const logoX = (width - logoWidth) / 2;
      
      page.drawImage(logoImage, {
        x: logoX,
        y: yPosition - logoHeight,
        width: logoWidth,
        height: logoHeight,
      });
      
      yPosition -= logoHeight + 40;
    } else {
      yPosition -= 80;
    }
    
    // === FECHA (alineada a la derecha) ===
    const fechaEmision = this.formatFechaEmision(datos.fechaEmision || new Date());
    const fechaText = `Posadas, ${fechaEmision}`;
    const fechaWidth = timesRoman.widthOfTextAtSize(fechaText, 12);
    
    page.drawText(fechaText, {
      x: width - marginRight - fechaWidth,
      y: yPosition,
      size: 12,
      font: timesRoman,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 60;
    
    // === CONTENIDO PRINCIPAL ===
    const fontSize = 12;
    const lineHeight = 24;
    
    // Texto del certificado dividido en líneas
    const nombreCompleto = `${datos.nombre} ${datos.apellido}`.toUpperCase();
    
    const lineas = [
      { text: 'Por medio de la presente se deja constancia que el/la agente', font: timesRoman },
      { text: nombreCompleto + ',', font: timesBold },
      { text: `D.N.I "${datos.dni}" ha participado de la Capacitación:`, font: timesRoman, boldParts: [datos.dni] },
      { text: datos.nombreCurso + ',', font: timesBold },
      { text: 'dictada por el', font: timesRoman },
      { text: 'INFOGEP - Instituto de Formación para la Gestión Pública,', font: timesBold },
      { text: `el día ${datos.fechaCurso}.`, font: timesRoman, boldParts: [datos.fechaCurso] },
    ];
    
    // Dibujar el párrafo principal
    for (const linea of lineas) {
      const textWidth = linea.font.widthOfTextAtSize(linea.text, fontSize);
      const x = (width - textWidth) / 2; // Centrado
      
      page.drawText(linea.text, {
        x: x,
        y: yPosition,
        size: fontSize,
        font: linea.font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
    }
    
    yPosition -= 40;
    
    // === FOOTER ===
    const footerText = 'Se extiende la presente constancia a los efectos de ser presentada';
    const footerText2 = 'ante las autoridades que correspondan.';
    
    page.drawText(footerText, {
      x: marginLeft,
      y: yPosition,
      size: fontSize,
      font: timesRoman,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= lineHeight;
    
    page.drawText(footerText2, {
      x: marginLeft,
      y: yPosition,
      size: fontSize,
      font: timesRoman,
      color: rgb(0, 0, 0),
    });
    
    // === FIRMA ===
    if (firmaImage) {
      const firmaWidth = 150;
      const firmaHeight = (firmaImage.height / firmaImage.width) * firmaWidth;
      const firmaX = width - marginRight - firmaWidth;
      const firmaY = 120;
      
      page.drawImage(firmaImage, {
        x: firmaX,
        y: firmaY,
        width: firmaWidth,
        height: firmaHeight,
      });
    }
    
    // Generar bytes del PDF
    const pdfBytes = await pdfDoc.save();
    
    return Buffer.from(pdfBytes);
  }

  /**
   * Formatea la fecha de emisión
   */
  formatFechaEmision(fecha) {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const dia = date.getDate();
    const mes = this.getMesNombre(date.getMonth());
    const anio = date.getFullYear();
    return `${dia} de ${mes}, ${anio}`;
  }

  /**
   * Obtiene el nombre del mes en español
   */
  getMesNombre(mesIndex) {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[mesIndex];
  }

  /**
   * Genera el nombre del archivo PDF
   */
  getFileName(datos) {
    const nombreLimpio = datos.nombre.replace(/\s+/g, '_');
    const apellidoLimpio = datos.apellido.replace(/\s+/g, '_');
    return `Constancia_${apellidoLimpio}_${nombreLimpio}.pdf`;
  }
}

module.exports = new PDFService();

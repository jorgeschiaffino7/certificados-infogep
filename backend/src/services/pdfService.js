const fs = require('fs').promises;
const path = require('path');

// Configuración para Vercel (usa chromium) o desarrollo local (usa puppeteer)
let puppeteer;
let chrome;

if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // En Vercel, usa chrome-aws-lambda
  chrome = require('@sparticuz/chromium');
  puppeteer = require('puppeteer-core');
} else {
  // En desarrollo local, usa puppeteer completo
  puppeteer = require('puppeteer');
}

class PDFService {
  constructor() {
    this.templatePath = path.join(__dirname, '../templates/infogep-template.html');
    this.headerImagePath = path.join(__dirname, '../assets/logo-header.png');
    this.firmaImagePath = path.join(__dirname, '../assets/firma.png');
  }

  /**
   * Convierte la imagen del header a base64
   * @returns {string} - Imagen en formato base64
   */
  async getHeaderImageBase64() {
    try {
      const imageBuffer = await fs.readFile(this.headerImagePath);
      const base64Image = imageBuffer.toString('base64');
      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.warn('No se pudo cargar la imagen del header:', error.message);
      return '';
    }
  }

  /**
   * Convierte la imagen de firma a base64
   * @returns {string} - Imagen en formato base64
   */
  async getFirmaImageBase64() {
    try {
      const imageBuffer = await fs.readFile(this.firmaImagePath);
      const base64Image = imageBuffer.toString('base64');
      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.warn('No se pudo cargar la imagen de firma:', error.message);
      return '';
    }
  }

  /**
   * Genera un certificado PDF para una persona
   * @param {Object} datos - Datos completos para el certificado
   * @returns {Buffer} - Buffer del PDF generado
   */
  async generateCertificate(datos) {
    try {
      // Leer el template HTML
      let template = await fs.readFile(this.templatePath, 'utf-8');
      
      // Obtener imágenes en base64
      const headerImageBase64 = await this.getHeaderImageBase64();
      const firmaImageBase64 = await this.getFirmaImageBase64();
      
      // Reemplazar variables en el template
      template = this.replaceTemplateVariables(template, datos, headerImageBase64, firmaImageBase64);
      
      // Generar PDF con Puppeteer
      let browser;
      
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        // Configuración para Vercel
        browser = await puppeteer.launch({
          args: chrome.args,
          defaultViewport: chrome.defaultViewport,
          executablePath: await chrome.executablePath(),
          headless: chrome.headless,
        });
      } else {
        // Configuración para desarrollo local
        browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }
      
      const page = await browser.newPage();
      await page.setContent(template, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        landscape: false, // Vertical para este template
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      
      return pdf;
      
    } catch (error) {
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Reemplaza las variables del template con los datos reales
   * @param {string} template - HTML del template
   * @param {Object} datos - Datos completos del certificado
   * @param {string} headerImageBase64 - Imagen del header en formato base64
   * @param {string} firmaImageBase64 - Imagen de la firma en formato base64
   * @returns {string} - Template con datos reemplazados
   */
  replaceTemplateVariables(template, datos, headerImageBase64, firmaImageBase64) {
    const fechaEmision = this.formatFechaEmision(datos.fechaEmision || new Date());
    
    return template
      .replace(/\{\{headerImage\}\}/g, headerImageBase64)
      .replace(/\{\{firmaImage\}\}/g, firmaImageBase64)
      .replace(/\{\{fechaEmision\}\}/g, fechaEmision)
      .replace(/\{\{nombreCompleto\}\}/g, `${datos.nombre} ${datos.apellido}`)
      .replace(/\{\{dni\}\}/g, datos.dni)
      .replace(/\{\{nombreCurso\}\}/g, datos.nombreCurso)
      .replace(/\{\{fechaCurso\}\}/g, datos.fechaCurso);
  }

  /**
   * Formatea la fecha de emisión en el formato requerido
   * @param {Date|string} fecha - Fecha a formatear
   * @returns {string} - Fecha formateada
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
   * @param {number} mesIndex - Índice del mes (0-11)
   * @returns {string} - Nombre del mes
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
   * @param {Object} datos - Datos de la persona
   * @returns {string} - Nombre del archivo
   */
  getFileName(datos) {
    const nombreLimpio = datos.nombre.replace(/\s+/g, '_');
    const apellidoLimpio = datos.apellido.replace(/\s+/g, '_');
    return `Constancia_${apellidoLimpio}_${nombreLimpio}.pdf`;
  }
}

module.exports = new PDFService();
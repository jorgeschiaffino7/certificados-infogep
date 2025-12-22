const fs = require('fs').promises;
const path = require('path');

// Detectar si estamos en Vercel/producción
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

class PDFService {
  constructor() {
    this.templatePath = path.join(__dirname, '../templates/infogep-template.html');
    this.headerImagePath = path.join(__dirname, '../assets/logo-header.png');
    this.firmaImagePath = path.join(__dirname, '../assets/firma.png');
  }

  /**
   * Obtiene el browser de Puppeteer según el entorno
   * @returns {Promise<Browser>} - Instancia del browser
   */
  async getBrowser() {
    if (isServerless) {
      // En Vercel/Lambda: usar @sparticuz/chromium + puppeteer-core
      const chromium = require('@sparticuz/chromium');
      const puppeteerCore = require('puppeteer-core');
      
      return await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // En desarrollo local: usar puppeteer completo
      const puppeteer = require('puppeteer');
      return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
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
    let browser;
    try {
      // Leer el template HTML
      let template = await fs.readFile(this.templatePath, 'utf-8');
      
      // Obtener imágenes en base64
      const headerImageBase64 = await this.getHeaderImageBase64();
      const firmaImageBase64 = await this.getFirmaImageBase64();
      
      // Reemplazar variables en el template
      template = this.replaceTemplateVariables(template, datos, headerImageBase64, firmaImageBase64);
      
      // Obtener browser según el entorno
      browser = await this.getBrowser();
      
      const page = await browser.newPage();
      await page.setContent(template, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        landscape: false,
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
      // Asegurar que el browser se cierre en caso de error
      if (browser) {
        await browser.close().catch(() => {});
      }
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
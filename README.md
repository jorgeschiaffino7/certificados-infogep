# 📜 Generador de Certificados INFOGEP

Sistema web para generar certificados de asistencia a cursos del Instituto de Formación para la Gestión Pública (INFOGEP).

## ✨ Características

- 📋 **Generación masiva**: Carga un archivo Excel y genera múltiples certificados
- 👤 **Generación individual**: Crea certificados uno por uno
- 📄 **Formato PDF**: Certificados profesionales en formato PDF
- 🎨 **Diseño personalizado**: Plantilla con logo y firma institucional
- 💼 **Fácil de usar**: Interfaz intuitiva y moderna

## 🏗️ Arquitectura

### Frontend
- **React 18**: Framework de interfaz de usuario
- **Vite**: Build tool y dev server rápido
- **Tailwind CSS 4**: Framework de estilos utility-first
- **Axios**: Cliente HTTP para llamadas a la API

### Backend
- **Node.js + Express**: API REST
- **Puppeteer**: Generación de PDFs
- **xlsx**: Procesamiento de archivos Excel
- **Multer**: Manejo de uploads
- **Archiver**: Creación de archivos ZIP

## 🚀 Instalación y Desarrollo

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd certfificados-infogep
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Desarrollo Local

1. **Iniciar el backend:**
   ```bash
   cd backend
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3001`

2. **Iniciar el frontend (en otra terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`

## 📦 Despliegue en Vercel

Para desplegar la aplicación en Vercel, consulta la [Guía de Despliegue](./DEPLOY.md).

## 📝 Uso

### Generación Masiva

1. Prepara un archivo Excel (.xlsx) con las siguientes columnas:
   - **Nombre**: Nombre del participante
   - **Apellido**: Apellido del participante
   - **DNI**: Documento de identidad

2. En la aplicación:
   - Selecciona la pestaña "Generación Masiva"
   - Ingresa el nombre del curso
   - Ingresa la fecha del curso
   - Sube el archivo Excel
   - Haz clic en "Generar Certificados"

3. Se descargará un archivo ZIP con todos los certificados

### Generación Individual

1. En la aplicación:
   - Selecciona la pestaña "Certificado Individual"
   - Completa el formulario con los datos del participante
   - Completa los datos del curso
   - Haz clic en "Generar Certificado"

2. Se descargará el certificado en formato PDF

## 🗂️ Estructura del Proyecto

```
certfificados-infogep/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MasiveGenerator.jsx
│   │   │   └── SingleGenerator.jsx
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── index.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── backend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo-header.png
│   │   │   └── firma.png
│   │   ├── controllers/
│   │   │   └── certificateController.js
│   │   ├── middleware/
│   │   │   └── upload.js
│   │   ├── routes/
│   │   │   └── certificates.js
│   │   ├── services/
│   │   │   ├── excelService.js
│   │   │   ├── pdfService.js
│   │   │   └── zipService.js
│   │   ├── templates/
│   │   │   └── infogep-template.html
│   │   └── index.js
│   ├── package.json
│   └── vercel.json
├── vercel.json
├── DEPLOY.md
└── README.md
```

## 🔧 Configuración

### Variables de Entorno

#### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3001/api/certificates  # URL del backend
```

#### Backend (`.env`)
```env
PORT=3001  # Puerto del servidor (opcional, default: 3001)
NODE_ENV=development  # Entorno (development | production)
```

## 🎨 Personalización

### Modificar el Template del Certificado

Edita el archivo `backend/src/templates/infogep-template.html` para cambiar el diseño del certificado.

Variables disponibles:
- `{{headerImage}}`: Logo institucional
- `{{firmaImage}}`: Imagen de la firma
- `{{nombreCompleto}}`: Nombre completo del participante
- `{{dni}}`: DNI del participante
- `{{nombreCurso}}`: Nombre del curso
- `{{fechaCurso}}`: Fecha del curso
- `{{fechaEmision}}`: Fecha de emisión del certificado

### Cambiar Imágenes

Reemplaza las imágenes en:
- `backend/src/assets/logo-header.png`: Logo institucional
- `backend/src/assets/firma.png`: Firma digital

## 🐛 Troubleshooting

### El backend no inicia
- Verifica que el puerto 3001 no esté ocupado
- Revisa que todas las dependencias estén instaladas

### Error al generar PDFs
- Asegúrate de tener Chrome/Chromium instalado (en desarrollo)
- En producción (Vercel), se usa automáticamente `@sparticuz/chromium`

### Archivo Excel no se procesa
- Verifica que el archivo tenga las columnas correctas: Nombre, Apellido, DNI
- Asegúrate de que el archivo sea .xlsx o .xls

## 📄 Licencia

Este proyecto es propiedad del Instituto de Formación para la Gestión Pública (INFOGEP).

## 👥 Contribuir

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para consultas o soporte, contacta al equipo de desarrollo de INFOGEP.

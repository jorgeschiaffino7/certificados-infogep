# 🚀 Guía de Despliegue en Vercel (Backend y Frontend Separados)

Esta guía te ayudará a desplegar la aplicación de generación de certificados en Vercel con backend y frontend como proyectos independientes.

## 📋 Requisitos Previos

- Cuenta de Vercel (https://vercel.com)
- Repositorio en GitHub con el código
- Node.js 18+ instalado localmente

## 🏗️ Estructura del Proyecto

```
certificados-infogep/
├── frontend/          # React + Vite (Proyecto 1 en Vercel)
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── backend/          # Express API (Proyecto 2 en Vercel)
    ├── src/
    ├── package.json
    └── vercel.json
```

---

## 📦 PASO 1: Desplegar el Backend

### 1.1 Crear Proyecto Backend en Vercel

1. Ve a https://vercel.com/new
2. Selecciona tu repositorio: `certificados-infogep`
3. Configura el proyecto:

   **Project Name**: `certificados-infogep-backend` (o el nombre que prefieras)
   
   **Framework Preset**: `Other`
   
   **Root Directory**: Haz clic en "Edit" → Selecciona `backend` → Save
   
   **Build Settings**:
   - Build Command: (dejar vacío o `npm install`)
   - Output Directory: (dejar vacío)
   - Install Command: `npm install`

4. **NO hagas clic en Deploy todavía**

### 1.2 Configurar Variables de Entorno (Opcional)

Si necesitas variables de entorno para el backend:
- Haz clic en "Environment Variables"
- Agrega las variables necesarias (por ejemplo, `NODE_ENV=production`)

### 1.3 Desplegar Backend

1. Haz clic en **"Deploy"**
2. Espera a que termine el deploy (2-5 minutos)
3. **Copia la URL del backend** que Vercel te da (ej: `https://certificados-infogep-backend.vercel.app`)

---

## 🎨 PASO 2: Desplegar el Frontend

### 2.1 Crear Proyecto Frontend en Vercel

1. Ve nuevamente a https://vercel.com/new
2. Selecciona el mismo repositorio: `certificados-infogep`
3. Configura el proyecto:

   **Project Name**: `certificados-infogep-frontend` (o el nombre que prefieras)
   
   **Framework Preset**: `Vite`
   
   **Root Directory**: Haz clic en "Edit" → Selecciona `frontend` → Save
   
   **Build Settings** (se configuran automáticamente):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **NO hagas clic en Deploy todavía**

### 2.2 Configurar Variable de Entorno del Frontend

**MUY IMPORTANTE**: Configura la URL del backend

1. Haz clic en "Environment Variables"
2. Agrega:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://certificados-infogep-backend.vercel.app/api/certificates`
     (Reemplaza con la URL real de tu backend del Paso 1.3)
   - **Environment**: Selecciona todos (Production, Preview, Development)

### 2.3 Desplegar Frontend

1. Haz clic en **"Deploy"**
2. Espera a que termine el deploy (2-5 minutos)
3. ¡Tu aplicación estará lista! Vercel te dará una URL (ej: `https://certificados-infogep-frontend.vercel.app`)

---

## ✅ PASO 3: Verificar el Despliegue

### 3.1 Probar el Backend

Visita: `https://TU-BACKEND.vercel.app`

Deberías ver:
```json
{
  "message": "API de Certificados funcionando correctamente",
  "endpoints": {
    "generateCertificates": "POST /api/certificates/generate",
    "health": "GET /api/certificates/health"
  }
}
```

### 3.2 Probar el Frontend

1. Visita: `https://TU-FRONTEND.vercel.app`
2. Deberías ver la interfaz de la aplicación
3. Intenta generar un certificado individual para verificar que se conecta con el backend

---

## 🔧 Configuración Adicional

### Límites de Vercel (Plan Hobby/Free)

- **Timeout**: 10 segundos (Plan Free) / 60 segundos (Plan Pro)
- **Memoria**: 1024 MB
- **Tamaño de archivos**: 50 MB máximo para uploads

⚠️ **Nota importante sobre Puppeteer**: 
- La generación de PDFs con Puppeteer puede tardar 5-10 segundos en cold start
- Si el plan Free (10s timeout) no es suficiente, considera actualizar a Pro

### Configurar Dominio Personalizado (Opcional)

Para cada proyecto:
1. Ve a Project Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

---

## 🐛 Troubleshooting

### Backend no responde o da timeout

1. **Verifica los logs**:
   - Ve a tu proyecto backend en Vercel
   - Click en la pestaña "Functions"
   - Revisa los logs de errores

2. **Cold Start**: La primera petición siempre tarda más (5-10 segundos)
   - Es normal en funciones serverless
   - Las siguientes peticiones serán más rápidas

3. **Timeout**: Si excede 10 segundos en plan Free:
   - Considera actualizar a plan Pro (60s timeout)
   - O divide las tareas grandes en lotes más pequeños

### Frontend no se conecta con el Backend

1. **Verifica la variable de entorno**:
   - Ve a Project Settings → Environment Variables
   - Asegúrate que `VITE_API_URL` tenga la URL correcta del backend
   - Debe incluir `/api/certificates` al final

2. **Redesplegar después de cambiar variables**:
   - Los cambios en variables de entorno requieren un nuevo deploy
   - Ve a Deployments → Click en los 3 puntos → Redeploy

3. **Revisar CORS**:
   - El backend ya tiene CORS habilitado para todos los orígenes
   - Si tienes problemas, revisa los logs del backend

### Error "Module not found" o dependencias

1. **Verifica package.json**:
   - Asegúrate que todas las dependencias estén en `dependencies` (no en `devDependencies`)
   - Para producción, Vercel solo instala `dependencies`

2. **Reinstalar node_modules localmente**:
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Hacer commit y push**:
   ```bash
   git add .
   git commit -m "Fix: Actualizar dependencias"
   git push
   ```

### Puppeteer / Chrome no funciona

El backend está configurado para usar `@sparticuz/chromium` en producción, que es compatible con Vercel.

Si tienes problemas:
1. Verifica que `@sparticuz/chromium` y `puppeteer-core` estén en `backend/package.json`
2. Revisa los logs del backend para ver errores específicos de Chromium

---

## 🔄 Actualizar la Aplicación

Cada vez que hagas cambios en el código:

1. **Hacer commit y push a GitHub**:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```

2. **Vercel desplegará automáticamente**:
   - Ambos proyectos se actualizarán automáticamente
   - Recibirás notificaciones de los deploys

3. **Deploy manual** (si es necesario):
   - Ve al proyecto en Vercel
   - Click en Deployments → 3 puntos → Redeploy

---

## 📝 URLs de tu Aplicación

Después del despliegue, anota tus URLs:

- **Backend**: `https://_____________________.vercel.app`
- **Frontend**: `https://_____________________.vercel.app`
- **API Base**: `https://_____________________.vercel.app/api/certificates`

---

## 🔒 Seguridad para Producción

Considera implementar:

1. **CORS específico**: Limitar orígenes en el backend
   ```javascript
   app.use(cors({
     origin: 'https://tu-frontend.vercel.app'
   }));
   ```

2. **Rate Limiting**: Limitar peticiones por IP
3. **Validación de archivos**: Validar tamaño y tipo de archivos Excel
4. **Autenticación**: Agregar login si es necesario

---

## 📚 Recursos Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Troubleshooting Vercel](https://vercel.com/docs/errors)
- [Puppeteer en Vercel](https://github.com/Sparticuz/chromium)

---

## 📧 Resumen Rápido

```bash
# 1. Backend
- Ir a vercel.com/new
- Seleccionar repo: certificados-infogep
- Root Directory: backend
- Framework: Other
- Deploy

# 2. Frontend  
- Ir a vercel.com/new
- Seleccionar repo: certificados-infogep
- Root Directory: frontend
- Framework: Vite
- Variable: VITE_API_URL = https://tu-backend.vercel.app/api/certificates
- Deploy

# 3. ¡Listo! 🎉
```

¿Tienes alguna pregunta? ¡No dudes en consultar! 🚀

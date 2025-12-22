# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar la aplicación de generación de certificados en Vercel.

## 📋 Requisitos Previos

- Cuenta de Vercel (https://vercel.com)
- Git instalado
- Node.js 18+ instalado

## 🏗️ Estructura del Proyecto

```
certfificados-infogep/
├── frontend/          # React + Vite
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── backend/          # Express API
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── vercel.json      # Configuración del monorepo
```

## 📦 Paso 1: Preparar el Proyecto

### 1.1 Instalar Dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 1.2 Configurar Variables de Entorno

En Vercel, necesitarás configurar las siguientes variables de entorno:

#### Para el Frontend:
- `VITE_API_URL`: URL de tu API backend (ej: `https://tu-proyecto.vercel.app/api/certificates`)

## 🔧 Paso 2: Despliegue

### Opción A: Desplegar desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Importa el proyecto en Vercel:**
   - Ve a https://vercel.com/new
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. **Configura las variables de entorno:**
   - En el panel de Vercel, ve a Settings > Environment Variables
   - Agrega `VITE_API_URL` con el valor de tu API

4. **Despliega:**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará automáticamente

### Opción B: Desplegar con Vercel CLI

1. **Instala Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Inicia sesión:**
   ```bash
   vercel login
   ```

3. **Despliega el proyecto:**
   ```bash
   vercel
   ```

4. **Para producción:**
   ```bash
   vercel --prod
   ```

## 🔄 Paso 3: Actualizar la URL del Backend

Después del primer despliegue:

1. Vercel te dará una URL como `https://tu-proyecto.vercel.app`
2. Ve a Settings > Environment Variables en Vercel
3. Actualiza `VITE_API_URL` con: `https://tu-proyecto.vercel.app/api/certificates`
4. Redespliega el frontend para que tome los cambios

## ⚙️ Configuración Adicional

### Límites de Vercel

- **Timeout**: Las funciones serverless tienen un límite de 60 segundos (configurado en `backend/vercel.json`)
- **Memoria**: 1024 MB por función (configurado en `backend/vercel.json`)
- **Tamaño de archivos**: Límite de 50 MB para archivos subidos

Si necesitas generar muchos certificados, considera dividir la tarea en lotes más pequeños.

### Debugging

Si tienes problemas:

1. **Revisa los logs:**
   - Ve a tu proyecto en Vercel
   - Selecciona la pestaña "Functions"
   - Haz clic en cualquier función para ver sus logs

2. **Variables de entorno:**
   - Verifica que todas las variables estén configuradas correctamente
   - Recuerda que necesitas redesplegar después de cambiar variables

3. **Build errors:**
   - Revisa la pestaña "Deployments" en Vercel
   - Haz clic en el despliegue fallido para ver los errores

## 🧪 Probar la Aplicación

Una vez desplegada:

1. Visita tu URL de Vercel (ej: `https://tu-proyecto.vercel.app`)
2. Prueba generar un certificado individual
3. Prueba generar certificados masivos con un archivo Excel de prueba

## 📝 Notas Importantes

- **Chromium**: El backend usa `@sparticuz/chromium` para generar PDFs en Vercel
- **CORS**: Está configurado para aceptar peticiones desde cualquier origen
- **Archivos temporales**: Vercel usa un sistema de archivos temporal, los archivos se eliminan después de la ejecución
- **Cold starts**: La primera petición puede tardar más (5-10 segundos) debido al cold start de las funciones serverless

## 🔒 Seguridad

Para producción, considera:

1. **CORS**: Limitar los orígenes permitidos en el backend
2. **Rate limiting**: Agregar límites de peticiones
3. **Validación**: Validar y sanitizar todos los datos de entrada
4. **Autenticación**: Agregar autenticación si es necesario

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Despliegue de Monorepos](https://vercel.com/docs/concepts/monorepos)

## 🆘 Soporte

Si encuentras problemas, revisa:
- Los logs en Vercel Dashboard
- La configuración de variables de entorno
- Los archivos `vercel.json`

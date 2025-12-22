# 🚀 Próximos Pasos para Desplegar

## 📝 Cambios Realizados

He simplificado la configuración para desplegar backend y frontend por separado:

✅ Eliminado `vercel.json` de la raíz (ya no es monorepo)
✅ Simplificado `backend/vercel.json`
✅ Simplificado `frontend/vercel.json`
✅ Actualizado `DEPLOY.md` con instrucciones paso a paso

---

## 🔄 PASO 1: Hacer Commit de los Cambios

Copia y pega estos comandos en tu terminal:

```bash
git add .
git commit -m "Refactor: Configurar para despliegue separado de backend y frontend"
git push
```

---

## 🚀 PASO 2: Cancelar el Deploy Actual (si está corriendo)

Si tienes un deploy en progreso en Vercel:
1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Click en los 3 puntos del deploy en progreso
4. Click en "Cancel Deployment"

---

## 📦 PASO 3: Crear Dos Proyectos Nuevos en Vercel

### A) Desplegar el Backend

1. Ve a https://vercel.com/new
2. Importa tu repo: `certificados-infogep`
3. **Project Name**: `certificados-infogep-backend`
4. **Framework Preset**: `Other`
5. Click en **"Edit"** en Root Directory → Selecciona `backend` → Save
6. Click en **"Deploy"**
7. **⚠️ IMPORTANTE**: Copia la URL que te da (ej: `https://certificados-infogep-backend.vercel.app`)

### B) Desplegar el Frontend

1. Ve nuevamente a https://vercel.com/new
2. Importa el mismo repo: `certificados-infogep`
3. **Project Name**: `certificados-infogep-frontend`
4. **Framework Preset**: `Vite`
5. Click en **"Edit"** en Root Directory → Selecciona `frontend` → Save
6. **ANTES de hacer Deploy**, configura la variable de entorno:
   - Click en "Environment Variables"
   - Name: `VITE_API_URL`
   - Value: `https://TU-BACKEND-URL.vercel.app/api/certificates`
     (Usa la URL del backend del paso anterior)
7. Click en **"Deploy"**

---

## ✅ PASO 4: Verificar que Todo Funciona

### Probar el Backend:
Abre en tu navegador: `https://tu-backend.vercel.app`

Deberías ver:
```json
{
  "message": "API de Certificados funcionando correctamente",
  ...
}
```

### Probar el Frontend:
1. Abre: `https://tu-frontend.vercel.app`
2. Intenta generar un certificado individual
3. ¡Debería funcionar! 🎉

---

## 🐛 Si Algo Sale Mal

### Backend da timeout:
- Es normal en el primer request (cold start)
- Espera 5-10 segundos e intenta de nuevo
- Si persiste, revisa los logs en Vercel

### Frontend no se conecta al Backend:
- Verifica que `VITE_API_URL` esté configurada correctamente
- Debe terminar en `/api/certificates`
- Redesplega el frontend después de cambiar variables

### Más ayuda:
Lee el archivo `DEPLOY.md` para instrucciones detalladas y troubleshooting.

---

## 📚 Documentación

- `DEPLOY.md` - Guía completa de despliegue
- `README.md` - Documentación del proyecto
- Vercel Docs: https://vercel.com/docs

---

¡Buena suerte! 🚀

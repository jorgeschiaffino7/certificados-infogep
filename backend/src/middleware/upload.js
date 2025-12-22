const multer = require('multer');

// Usar memoryStorage para compatibilidad con Vercel Serverless
// Los archivos se almacenan en memoria como Buffer (req.file.buffer)
const storage = multer.memoryStorage();

// Filtro para aceptar solo archivos Excel
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos Excel (.xls, .xlsx)'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

module.exports = upload;
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function MasiveGenerator() {
  const [file, setFile] = useState(null);
  const [nombreCurso, setNombreCurso] = useState('');
  const [fechaCurso, setFechaCurso] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !nombreCurso || !fechaCurso) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('excel', file);
      formData.append('nombreCurso', nombreCurso);
      formData.append('fechaCurso', fechaCurso);

      const response = await axios.post(`${API_URL}/generate`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Descargar el archivo ZIP
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'constancias_infogep.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess('¡Certificados generados y descargados exitosamente!');
      
      // Limpiar formulario
      setFile(null);
      setNombreCurso('');
      setFechaCurso('');
      e.target.reset();

    } catch (err) {
      setError(err.response?.data?.message || 'Error al generar certificados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Generación Masiva desde Excel
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Curso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Datos del Curso</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Curso *
              </label>
              <input
                type="text"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                placeholder="Ej: Gestión Administrativa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Curso *
              </label>
              <input
                type="text"
                value={fechaCurso}
                onChange={(e) => setFechaCurso(e.target.value)}
                placeholder="Ej: 15 de noviembre, 2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: día de mes, año (Ej: 15 de noviembre, 2025)
              </p>
            </div>
          </div>
        </div>

        {/* Archivo Excel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo Excel *
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Haz clic para seleccionar archivo Excel'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Formato: .xlsx o .xls
            </span>
          </label>
        </div>

        {/* Información del Excel */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">
            📝 Formato del Excel requerido:
          </h4>
          <div className="text-sm text-gray-600">
            <p>El archivo debe tener estas columnas:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Nombre</strong></li>
              <li><strong>Apellido</strong></li>
              <li><strong>DNI</strong></li>
            </ul>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading || !file || !nombreCurso || !fechaCurso}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generando certificados...
            </>
          ) : (
            '🚀 Generar Certificados'
          )}
        </button>
      </form>
    </div>
  );
}

export default MasiveGenerator;
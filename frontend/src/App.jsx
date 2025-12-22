import React, { useState } from 'react';
import MasiveGenerator from './components/MasiveGenerator';
import SingleGenerator from './components/SingleGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('masivo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Generador de Constancias
          </h1>
          <p className="text-gray-600">INFOGEP - Instituto de Formación para la Gestión Pública</p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('masivo')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'masivo'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 Generación Masiva (Excel)
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'individual'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👤 Certificado Individual
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'masivo' ? <MasiveGenerator /> : <SingleGenerator />}
        </div>
      </div>
    </div>
  );
}

export default App;
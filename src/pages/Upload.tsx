// src/pages/Upload.tsx

import React, { useState } from 'react';
import { detectionAPI } from '../services/api'; 
// ✨ PERBAIKAN: Import tipe 'Detection' dari folder types, bukan dari api.ts
import type { Detection } from '../types';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [result, setResult] = useState<Detection | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError('');
      // Buat preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Silakan pilih file gambar terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Panggil fungsi dari detectionAPI
      const data = await detectionAPI.detect({ file: selectedFile, notes: notes });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Terjadi kesalahan saat deteksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Deteksi Kondisi Tanaman Tomat</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Gambar
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

        {preview && <img src={preview} alt="Preview" className="mt-4 mb-4 rounded-lg max-h-60 w-auto mx-auto"/>}
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Catatan (Opsional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Contoh: Daun tampak layu di bagian bawah..."
          />
        </div>
        
        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Mendeteksi...' : 'Mulai Deteksi'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 text-red-700 bg-red-100 rounded-md animate-pulse">{error}</div>}

      {result && (
        <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Hasil Deteksi</h2>
          <p className="mt-2"><strong>Penyakit:</strong> <span className="font-bold text-lg text-green-700">{result.disease}</span></p>
          <p><strong>Tingkat Keyakinan:</strong> <span className="font-bold text-lg text-green-700">{Math.round(result.confidence * 100)}%</span></p>
        </div>
      )}
    </div>
  );
};

export default Upload;
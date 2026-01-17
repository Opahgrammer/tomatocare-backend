// src/pages/Upload.tsx

import React, { useState, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import { detectionAPI } from '../services/api';
import type { Detection } from '../types';

const Upload = () => {
  // State untuk Mode (File vs Kamera)
  const [isCameraMode, setIsCameraMode] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [result, setResult] = useState<Detection | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref untuk Webcam
  const webcamRef = useRef<Webcam>(null);

  // Fungsi 1: Handle File Upload Biasa
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Fungsi Helper: Proses File untuk Preview & State
  const processFile = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Fungsi 2: Handle Capture dari Webcam
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-scan.jpg", { type: "image/jpeg" });
          processFile(file);
          setIsCameraMode(false);
        });
    }
  }, [webcamRef]);

  // Fungsi Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Silakan pilih gambar atau ambil foto terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await detectionAPI.detect({ file: selectedFile, notes: notes });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Objek tidak dikenali atau bukan daun tomat.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk menentukan apakah hasil valid atau "Low Confidence"
  // Kita anggap Low Confidence jika di bawah 70% (0.7)
  const isLowConfidence = result ? result.confidence < 0.70 : false;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        Deteksi Tanaman Tomat
      </h1>
      
      {/* TOMBOL GANTI MODE */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => { setIsCameraMode(false); setPreview(null); setSelectedFile(null); setResult(null); }}
          className={`px-4 py-2 rounded-full font-semibold transition-all shadow-sm ${!isCameraMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          📂 Upload File
        </button>
        <button
          type="button"
          onClick={() => { setIsCameraMode(true); setPreview(null); setSelectedFile(null); setResult(null); }}
          className={`px-4 py-2 rounded-full font-semibold transition-all shadow-sm ${isCameraMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          📸 Scan Kamera
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
        
        {/* AREA INPUT: KAMERA ATAU FILE */}
        <div className="mb-6 text-center">
          {isCameraMode ? (
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleCapture}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors"
              >
                Ambil Foto
              </button>
            </div>
          ) : (
            !preview && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 hover:border-indigo-400 transition-colors bg-gray-50">
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <span className="text-4xl mb-2">📥</span>
                  <span className="text-gray-600 font-medium">Klik untuk memilih gambar</span>
                  <span className="text-gray-400 text-sm mt-1">Format: JPG, PNG</span>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            )
          )}
        </div>

        {/* PREVIEW GAMBAR */}
        {preview && (
          <div className="mb-6 relative group">
            <p className="text-sm text-gray-500 mb-2">Preview Gambar:</p>
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={preview} alt="Preview" className="w-full max-h-80 object-contain bg-gray-50 mx-auto" />
                <button 
                    onClick={() => { setPreview(null); setSelectedFile(null); setResult(null); if(isCameraMode) setIsCameraMode(true); }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm shadow-md hover:bg-red-600 transition-colors"
                >
                    ✕ Hapus
                </button>
            </div>
          </div>
        )}
        
        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border resize-none"
              placeholder="Tambahkan catatan (opsional)..."
            />
          </div>
          
          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang Menganalisis...
                </span>
            ) : '🔍 Mulai Deteksi'}
          </button>
        </form>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mt-4 p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg text-center font-medium animate-pulse">
            ⚠️ {error}
        </div>
      )}

      {/* HASIL DETEKSI */}
      {result && (
        <div className={`mt-6 overflow-hidden rounded-xl shadow-lg border ${isLowConfidence ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <div className={`p-4 text-center font-bold text-white ${isLowConfidence ? 'bg-red-500' : 'bg-green-600'}`}>
            HASIL DIAGNOSA
          </div>
          
          <div className="p-6">
            {/* GAMBAR HASIL (Ada kotaknya, tapi tanpa tulisan) */}
            <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-gray-200">
               <img src={result.image_path || ''} alt="Hasil Deteksi" className="w-full object-cover" />
            </div>

            {/* INFO DETEKSI */}
            <div className="flex flex-col items-center justify-center text-center">
                
                {/* Nama Penyakit */}
                <div className="mb-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Kondisi Terdeteksi</p>
                    <p className={`text-2xl font-bold ${isLowConfidence ? 'text-red-600' : 'text-green-700'}`}>
                        {result.disease}
                    </p>
                </div>

                {/* LOGIKA: HANYA TAMPILKAN AKURASI JIKA YAKIN (>70%) */}
                {!isLowConfidence && (
                    <div className="mt-4 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200">
                        <span className="text-gray-500 text-sm mr-2">Tingkat Keyakinan:</span>
                        <span className="font-bold text-lg text-green-600">
                            {Math.round(result.confidence * 100)}%
                        </span>
                    </div>
                )}
                
                {/* Pesan Tambahan untuk Low Confidence */}
                {isLowConfidence && (
                    <div className="mt-2 text-sm text-red-500 italic">
                        *Sistem tidak dapat mengenali objek ini sebagai daun tomat yang valid.
                    </div>
                )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
// src/pages/Dashboard.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { detectionAPI } from '../services/api';
import type { DiseaseSummary } from '../types';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];

// Custom Label Pie Chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-[10px] sm:text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const [summaryData, setSummaryData] = useState<DiseaseSummary[]>([]);
  const [dailyChartData, setDailyChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk mendeteksi mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const summary = await detectionAPI.getStats();
      setSummaryData(summary);

      const formattedData = summary
        .filter((item: any) => !item.disease_name.toLowerCase().includes('healthy'))
        .map((item: any) => ({
          disease: item.disease_name,
          cases: item.count,
        }));
        
      setDailyChartData(formattedData);
    } catch (error) {
      console.error('Gagal memuat data dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') loadDashboardData();
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadDashboardData]);

  const healthyString = 'healthy';
  const totalDetections = summaryData.reduce((acc, curr) => acc + curr.count, 0);
  const healthyData = summaryData.find(d => d.disease_name.toLowerCase().includes(healthyString));
  const healthyCount = healthyData ? healthyData.count : 0;
  const diseaseCount = totalDetections - healthyCount;
  const healthyPercentage = totalDetections > 0 ? ((healthyCount / totalDetections) * 100).toFixed(1) : '0.0';
  const jenisPenyakitCount = summaryData.filter(d => !d.disease_name.toLowerCase().includes(healthyString)).length;
  
  const topDiseases = summaryData
    .filter(d => !d.disease_name.toLowerCase().includes(healthyString))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (isLoading && !summaryData.length) {
    return <div className="flex justify-center items-center min-h-screen">Memuat data dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1">
          Dashboard Monitoring {user ? `- ${user.name}` : ''}
        </h1>
        <p className="text-sm md:text-base text-gray-600">Sistem Deteksi Kondisi Tanaman Tomat</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* ... (Isi Kartu Statistik sama seperti sebelumnya) ... */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div><p className="text-teal-100 text-xs md:text-sm mb-1">Total Deteksi</p><h3 className="text-2xl md:text-3xl font-bold">{totalDetections}</h3></div>
            <Activity className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm"><TrendingUp className="w-4 h-4" /><span>+12% dari minggu lalu</span></div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div><p className="text-red-100 text-xs md:text-sm mb-1">Tanaman Sakit</p><h3 className="text-2xl md:text-3xl font-bold">{diseaseCount}</h3></div>
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
          </div>
          <div className="text-xs md:text-sm opacity-90">Memerlukan perhatian</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div><p className="text-green-100 text-xs md:text-sm mb-1">Tanaman Sehat</p><h3 className="text-2xl md:text-3xl font-bold">{healthyCount}</h3></div>
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
          </div>
          <div className="text-xs md:text-sm opacity-90">{healthyPercentage}% dari total</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div><p className="text-purple-100 text-xs md:text-sm mb-1">Jenis Penyakit</p><h3 className="text-2xl md:text-3xl font-bold">{jenisPenyakitCount}</h3></div>
            <Activity className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
          </div>
          <div className="text-xs md:text-sm opacity-90">Teridentifikasi</div>
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Hasil Deteksi</h2>
          
          <div className="w-full h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              {dailyChartData.length > 0 ? (
                <BarChart 
                  data={dailyChartData} 
                  margin={{ top: 10, right: 10, left: 0, bottom: isMobile ? 60 : 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="disease" 
                    stroke="#9ca3af" 
                    tick={{ fontSize: isMobile ? 10 : 11 }} 
                    interval={0} 
                    angle={isMobile ? -45 : -30} 
                    textAnchor="end" 
                    height={isMobile ? 70 : 50} 
                  />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="cases" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={isMobile ? 30 : 40} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Belum ada data visualisasi</div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✨ PERBAIKAN PIE CHART (Responsif Mobile Fix) */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Top 5 Penyakit</h2>
          
          {/* ✨ Container dengan tinggi pasti agar muncul di Mobile */}
          <div className="w-full h-[300px] md:h-[350px]">
            {topDiseases.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topDiseases}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel} // Label di dalam
                    // ✨ Ukuran dinamis: lebih kecil di mobile agar legend muat
                    outerRadius={isMobile ? "65%" : "80%"} 
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="disease_name"
                  >
                    {topDiseases.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} kasus`, name]} />
                  {/* ✨ Legend di bawah dengan ukuran font responsif */}
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ 
                        fontSize: isMobile ? '10px' : '12px', 
                        paddingTop: '10px',
                        width: '100%' // Pastikan legend mengambil lebar penuh
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Belum ada data visualisasi</div>
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan List (Tetap Sama) */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Ringkasan Semua Hasil Deteksi</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {summaryData.map((disease, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 border-b sm:border-none border-gray-100 last:border-0">
                {/* ... (isi list sama) ... */}
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                   <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                   <span className={`font-medium text-sm md:text-base ${disease.disease_name.toLowerCase().includes(healthyString) ? 'text-green-700' : 'text-gray-700'}`}>{disease.disease_name}</span>
                 </div>
                 <div className="flex items-center justify-between sm:justify-end gap-4 ml-6 sm:ml-0">
                   <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{totalDetections > 0 ? ((disease.count / totalDetections) * 100).toFixed(1) : '0.0'}%</span>
                   <span className="font-bold text-gray-800 min-w-[30px] text-right">{disease.count}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
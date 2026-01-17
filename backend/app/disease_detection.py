import numpy as np
from ultralytics import YOLO
from typing import Tuple, Optional, Any
from PIL import Image
import os
import io

class DiseaseDetector:
    def __init__(self, model_path: str):
        # --- MODEL 1: SPESIALIS (Model Skripsi Kamu) ---
        self.disease_model = YOLO(model_path)
        self.disease_classes = self.disease_model.names
        
        # --- MODEL 2: SATPAM UMUM (YOLO Standar / COCO) ---
        # Model ini kenal 80 benda umum (Orang, HP, Laptop, dll)
        # File ini akan didownload otomatis oleh Ultralytics saat pertama kali dijalankan
        self.general_model = YOLO("yolov8n.pt") 
        
        print("✅ Dua Model berhasil dimuat: General (yolov8n) & Spesialis (Custom).")

    def detect_disease(self, image: Image.Image) -> Optional[Tuple[str, float, Any]]:
        """
        Returns: (nama_penyakit, confidence, gambar_dengan_box)
        """
        try:
            # ========================================================
            # TAHAP 1: CEK BENDA ASING (SATPAM)
            # ========================================================
            # Kita suruh model umum menebak dulu
            gen_results = self.general_model(image)
            gen_result = gen_results[0]

            if gen_result.boxes:
                # Ambil deteksi paling yakin dari model umum
                box = gen_result.boxes[0]
                conf = float(box.conf)
                cls_id = int(box.cls)
                obj_name = self.general_model.names[cls_id] # misal: 'cell phone', 'person'

                # Daftar benda yang HARUS DITOLAK (Blacklist)
                # Jika YOLO melihat ini dengan yakin, langsung tolak.
                blacklist = [
                    'person', 'cell phone', 'mobile phone', 'mouse', 'keyboard', 
                    'laptop', 'cup', 'bottle', 'remote', 'tv', 'car', 'monitor'
                ]
                
                # Jika deteksinya yakin (>50%) DAN termasuk benda terlarang
                if conf > 0.50 and obj_name in blacklist:
                    print(f"🚫 BLOCKED by General Model: Terdeteksi '{obj_name}'")
                    
                    # GAMBAR KOTAK PADA BENDA ASING TERSEBUT
                    # labels=False, conf=False -> Cuma kotak aja, tanpa teks
                    plotted_array = gen_result.plot(line_width=4, labels=False, conf=False)
                    plotted_image = Image.fromarray(plotted_array[..., ::-1])

                    # PENTING: Kembalikan Confidence 0.0
                    # Ini agar logika di main.py menganggapnya "Objek Tidak Dikenali"
                    # Tapi gambarnya tetap ada kotaknya!
                    return (f"Objek Asing ({obj_name})", 0.0, plotted_image)

            # ========================================================
            # TAHAP 2: CEK WARNA (BACKUP FILTER)
            # ========================================================
            # Jika lolos dari YOLO umum (misal objeknya tembok polos), cek warna.
            if not self._is_plant_colored(image):
                print("⚠️ Gagal Filter Warna: Gambar tidak dominan warna tanaman.")
                # Kembalikan confidence 0.0, gambar asli (tanpa kotak)
                return ("Bukan Daun Tomat", 0.0, image)

            # ========================================================
            # TAHAP 3: CEK PENYAKIT (SPESIALIS)
            # ========================================================
            # Kalau lolos Satpam & Cek Warna, baru pakai model kamu
            
            results = self.disease_model(image)
            result = results[0]
            
            # Cek apakah ada objek terdeteksi oleh model kamu
            if not result.boxes:
                return None
            
            box = result.boxes[0] 
            confidence = float(box.conf)
            class_id = int(box.cls)
            disease_name = self.disease_classes[class_id]

            # --- SOFT THRESHOLD (0.20) ---
            # Biar kotak tetap muncul walau confidence rendah
            MIN_THRESHOLD = 0.20 
            if confidence < MIN_THRESHOLD:
                print(f"Deteksi diabaikan: Confidence terlalu rendah ({confidence:.2f})")
                return None 

            # GENERATE BOUNDING BOX PENYAKIT
            # labels=False, conf=False -> Bersih, cuma kotak
            plotted_array = result.plot(line_width=4, labels=False, conf=False) 
            plotted_image = Image.fromarray(plotted_array[..., ::-1]) 

            return (disease_name, confidence, plotted_image)
            
        except Exception as e:
            print(f"Error detection: {e}")
            return None

    def _is_plant_colored(self, image: Image.Image) -> bool:
        """ 
        Mengecek apakah gambar memiliki spektrum warna daun (Hijau/Kuning/Coklat).
        Berguna sebagai backup jika Model Umum gagal mendeteksi objek asing.
        """
        try:
            # Resize kecil agar hitungan cepat
            img_small = image.resize((50, 50)).convert('HSV')
            img_array = np.array(img_small)
            
            # Ambil channel Hue (Warna) dan Saturation (Kepekatan)
            h = img_array[:, :, 0]
            s = img_array[:, :, 1]
            
            # Rentang Warna Tanaman di HSV (OpenCV scale H:0-180)
            # Kita ambil range luas: 10 (Coklat/Kuning) s.d 90 (Hijau Tua)
            plant_mask = ((h > 10) & (h < 90) & (s > 40))
            
            # Hitung rasio piksel tanaman
            plant_ratio = np.sum(plant_mask) / (50 * 50)
            
            # Minimal 15% gambar harus berwarna tanaman
            return plant_ratio > 0.15

        except Exception:
            return True # Jika error, loloskan saja (fail-open)

# Setup Global Detector
MODEL_FILE_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt")
try:
    detector = DiseaseDetector(model_path=MODEL_FILE_PATH)
except Exception as e:
    print(f"Failed to load model: {e}")
    detector = None
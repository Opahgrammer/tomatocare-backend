import numpy as np
from ultralytics import YOLO
from typing import Tuple, Optional
from PIL import Image
import os

class DiseaseDetector:
    """
    Sebuah kelas untuk memuat model YOLOv8 dan melakukan deteksi penyakit.
    """
    def __init__(self, model_path: str):
        """
        Inisialisasi detector dengan memuat model YOLO.
        
        Args:
            model_path (str): Path menuju file model .pt Anda.
        """
        # Muat model YOLO dari path yang diberikan.
        # Ini akan otomatis dijalankan di CPU atau GPU jika tersedia.
        self.model = YOLO(model_path)
        
        # Ambil daftar nama kelas langsung dari model yang sudah dilatih.
        # Ini memastikan kelasnya selalu cocok dengan modelnya.
        self.class_names = self.model.names
        print("Model loaded successfully.")
        print(f"Model classes: {list(self.class_names.values())}")

    def detect_disease(self, image: Image.Image) -> Optional[Tuple[str, float]]:
        """
        Mendeteksi penyakit dari objek gambar PIL.
        
        Args:
            image (Image.Image): Objek gambar dari library PIL.
            
        Returns:
            Optional[Tuple[str, float]]: Sebuah tuple berisi (nama_penyakit, confidence)
                                         jika terdeteksi, atau None jika tidak ada yang terdeteksi.
        """
        try:
            # Lakukan inferensi/prediksi menggunakan model.
            results = self.model(image)
            
            # Proses hasil untuk mendapatkan deteksi terbaik.
            return self._process_results(results)
            
        except Exception as e:
            print(f"Error during disease detection: {e}")
            return None

    def _process_results(self, results) -> Optional[Tuple[str, float]]:
        """
        Memproses hasil output dari model YOLOv8.
        Fungsi ini akan mencari deteksi dengan confidence score tertinggi.
        """
        best_detection = None
        # 👇 Atur ambang batas kepercayaan minimal di sini (misal: 0.10 untuk 10%)
        min_confidence_threshold = 0.10 
        max_confidence = min_confidence_threshold # Mulai dari ambang batas

        for result in results:
            if result.boxes:
                for box in result.boxes:
                    confidence = float(box.conf)
                    # Hanya pertimbangkan deteksi di atas ambang batas
                    # dan yang lebih baik dari deteksi terbaik saat ini
                    if confidence > max_confidence:
                        max_confidence = confidence
                        class_id = int(box.cls)
                        disease_name = self.class_names[class_id]
                        best_detection = (disease_name, max_confidence)
                        
        return best_detection

# --- CARA MENGGUNAKANNYA DI APLIKASI ANDA ---

# 1. Simpan file model Anda (misal: 'best.pt') di dalam folder backend.
#    Contoh: backend/app/models/best.pt
MODEL_FILE_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt") # Ganti 'yolov8n.pt' dengan nama file model Anda

# 2. Buat satu instance global dari detector yang akan digunakan di seluruh aplikasi.
#    Ini mencegah model dimuat ulang setiap kali ada request.
#    Pastikan file modelnya ada di path yang benar!
try:
    detector = DiseaseDetector(model_path=MODEL_FILE_PATH)
except Exception as e:
    print(f"Failed to load model: {e}")
    detector = None

# 3. Contoh Pengujian (bisa Anda hapus jika tidak perlu)
if __name__ == '__main__':
    # Pastikan Anda punya gambar contoh di path ini untuk pengujian
    test_image_path = 'path/to/your/test/image.jpg' 
    if os.path.exists(test_image_path) and detector:
        print(f"\nTesting with image: {test_image_path}")
        img = Image.open(test_image_path)
        detection_result = detector.detect_disease(img)
        
        if detection_result:
            disease, conf = detection_result
            print(f"✅ Detection successful!")
            print(f"   Disease: {disease}")
            print(f"   Confidence: {conf:.2%}")
        else:
            print("❌ No disease detected in the image.")
    elif not detector:
        print("Detector could not be initialized. Check model path and file.")
    else:
        print(f"Test image not found at '{test_image_path}'. Please provide a valid path to test.")
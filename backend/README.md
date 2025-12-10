# Plant Disease Detection Backend

FastAPI backend for plant disease detection application with YOLOv8 integration.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup MySQL database:**
   - Create database named `plantdb`
   - Import your existing table structure or create tables:

   ```sql
   CREATE DATABASE plantdb;
   USE plantdb;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(120) UNIQUE NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE plots (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       rows INT NOT NULL,
       cols INT NOT NULL,
       FOREIGN KEY (user_id) REFERENCES users(id)
   );

   CREATE TABLE detections (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       row INT NOT NULL,
       col INT NOT NULL,
       disease VARCHAR(100) NOT NULL,
       confidence FLOAT NOT NULL,
       image_path VARCHAR(255),
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

4. **Run the server:**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## YOLOv8 Integration

The current implementation includes a simulation of YOLOv8 detection. To use a real trained model:

1. Train your YOLOv8 model on plant disease dataset
2. Save the model as `.pt` file
3. Update `disease_detection.py` to load your model:
   ```python
   self.model = YOLO('path/to/your/model.pt')
   ```
4. Implement proper result processing based on your model's classes

## Features

- User authentication with JWT tokens
- Image upload and validation
- Plant disease detection (simulated)
- Plot configuration management
- Detection history and statistics
- CORS enabled for frontend integration
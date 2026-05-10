# Smart Leaf Identification and Health Monitoring System

A production-grade web application for real-time plant diagnostics using Computer Vision and AI.

## Features
- **Live Stream Integration:** Seamless MJPEG stream handling from ESP32-CAM modules.
- **AI Diagnosis:** Powered by Gemini 1.5 Flash to identify plant species and detect diseases.
- **Multimodal Chatbot:** Chat interface that understands both text and image context.
- **Health Metrics:** Detailed analysis of leaf structure (shape, edges, color).
- **Responsive Dashboard:** Modern SaaS-style UI built with React and Tailwind CSS.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Motion (animations), Lucide Icons.
- **Backend:** Node.js, Express (serving static assets and health checks).
- **AI Model:** Google Gemini 1.5 Flash (vision & conversational AI).

## Setup instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- ESP32-CAM (configured with CameraWebServer example)

### 2. Environment Variables
Ensure you have a `.env` file with your Gemini API Key:
```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Installation
```bash
npm install
```

### 4. Running the App
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## How it Works
1. The user provides the IP address of their ESP32-CAM.
2. The browser captures the live MJPEG stream.
3. Upon clicking 'Capture', a high-resolution snapshot is sent to the Gemini AI.
4. Gemini identifies the plant and diagnoses any health conditions.
5. The PhytoGuard AI explains the results and provides actionable recommendations.

## License
Apache-2.0

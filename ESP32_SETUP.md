# ESP32-CAM Setup Instructions

To integrate your ESP32-CAM with the Smart Leaf ID system, follow these steps:

## 1. Hardware Requirements
- ESP32-CAM Module (e.g., AI-Thinker)
- FTDI Programmer (for uploading code)
- Jumper wires

## 2. Firmware Installation
Use the **Arduino IDE** and follow these steps:

1. Go to **File > Examples > ESP32 > Camera > CameraWebServer**.
2. Select your camera model (uncomment `#define CAMERA_MODEL_AI_THINKER`).
3. Enter your Wi-Fi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
4. Upload the code to your ESP32-CAM.
5. Open the Serial Monitor at 115200 baud to find the local IP address (e.g., `192.168.1.10`).

## 3. Connecting to the Web App
1. Once the ESP32-CAM is running, it will host a web server.
2. In the Smart Leaf ID web app, click the **Settings** icon on the camera feed.
3. Enter the stream URL. Usually, it is:
   `http://<ESP32_IP_ADDRESS>:81/stream` or `http://<ESP32_IP_ADDRESS>/mjpeg`
4. Click **Integrate Stream** to begin the live feed.

## 4. Troubleshooting
- **CORS Issues:** If the browser blocks the stream, ensures the ESP32 is on the same local network.
- **Power:** The ESP32-CAM is power-hungry; ensure it is powered via a stable 5V source.
- **Firewall:** Ensure your router allows communication between local devices on the specified port.

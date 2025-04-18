// =============================
// 📦 proxy.js - Proxy tối ưu hỗ trợ nhiều BE kết nối
// =============================

require('dotenv').config();
const express = require('express');
const http = require('http');
const websocket = require('websocket-stream');
const mqtt = require('mqtt');
const { Duplex } = require('stream');
require('events').defaultMaxListeners = 50;

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('✨ MQTT Proxy đang hoạt động!');
});

// Kết nối MQTT duy nhất tới Adafruit IO
const mqttClient = mqtt.connect('wss://io.adafruit.com:443/mqtt', {
    username: process.env.ADAFRUIT_USERNAME,
    password: process.env.ADAFRUIT_KEY,
    clientId: 'proxy_' + Date.now() + '_' + Math.random().toString(16).substring(2, 6),
    clean: true,
    protocolVersion: 4
});

mqttClient.on('connect', () => {
    console.log('✅ Proxy đã kết nối tới Adafruit IO!');
});

mqttClient.on('error', (err) => {
    console.error('❌ Proxy lỗi:', err.message);
});

websocket.createServer({ server, path: '/mqtt' }, (stream) => {
    console.log('🌐 BE vừa kết nối tới Proxy');

    // Tạo một cặp stream ảo để tách riêng kết nối cho từng client
    const clientToBroker = new Duplex({
        write(chunk, encoding, callback) {
            mqttClient.stream.write(chunk, encoding, callback);
        },
        read(size) {
            // Để trống vì ta đẩy data từ mqttClient ngược lại
        }
    });

    mqttClient.stream.on('data', (chunk) => {
        try {
            stream.write(chunk);
        } catch (err) {
            console.error('❌ Lỗi ghi dữ liệu vào BE:', err.message);
        }
    });

    stream.on('data', (chunk) => {
        clientToBroker.write(chunk);
    });

    stream.on('close', () => {
        console.warn('🔌 BE đã đóng kết nối WebSocket');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Proxy server chạy tại PORT 3000');
});

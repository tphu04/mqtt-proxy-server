require('dotenv').config();
const express = require('express');
const http = require('http');
const websocket = require('websocket-stream');
const mqtt = require('mqtt');
const { defaultMaxListeners } = require('events');

// Tăng giới hạn listeners nếu có nhiều kết nối
require('events').defaultMaxListeners = 50;

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('✨ MQTT Proxy đang hoạt động!');
});

// Kết nối MQTT 1 lần duy nhất
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
  stream.pipe(mqttClient.stream).pipe(stream);
});

server.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Proxy server chạy tại PORT 3000');
});
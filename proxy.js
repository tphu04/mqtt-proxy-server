require('dotenv').config();
const express = require('express');
const http = require('http');
const websocket = require('websocket-stream');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);

app.use('/', (req, res) => {
    res.send('✨ MQTT Proxy đang hoạt động ✨');
});

websocket.createServer({ server, path: '/mqtt' }, (stream) => {
    try {
        const client = mqtt.connect('wss://io.adafruit.com:443/mqtt', {
            username: process.env.ADAFRUIT_USERNAME,
            password: process.env.ADAFRUIT_KEY,
            clientId: 'proxy_' + Date.now() + '_' + Math.random().toString(16).slice(2, 6),
            clean: true,
            protocolVersion: 4
        });

        client.on('connect', () => {
            console.log('✅ Proxy đã kết nối tới Adafruit IO!');
            stream.pipe(client.stream).pipe(stream);
        });

        client.on('error', (err) => {
            console.error('❌ Proxy lỗi:', err.message);
            console.error(err); // <- In cả object để thấy rõ lý do
        });
    } catch (err) {
        console.error('❌ Không thể khởi tạo MQTT:', err.message);
    }



});

server.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Proxy server chạy tại PORT 3000');
});

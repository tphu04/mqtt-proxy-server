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
    const client = mqtt.connect('wss://io.adafruit.com:443/mqtt', {
        username: 'leduccuongks0601',
        password: 'aio_ahYG19od0kE9mpAQJBwsfOPl7Oyx', // AIO Key chắc chắn đúng của chị
        clientId: 'proxy_' + Math.random().toString(16).substring(2, 8),
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

});

server.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Proxy server chạy tại PORT 3000');
});

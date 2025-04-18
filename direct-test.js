const mqtt = require('mqtt');

const client = mqtt.connect('wss://io.adafruit.com:443/mqtt', {
    username: 'leduccuongks0601',
    password: 'aio_yWsP58sLGgOeO1nomRIexg7QyRZ1',
    clientId: 'direct_test_' + Math.random().toString(16).substring(2, 8),
    protocolVersion: 4,
    clean: true,
});

client.on('connect', () => {
    console.log('✅ Đã kết nối tới Adafruit IO!');
    client.end();
});

client.on('error', (err) => {
    console.error('❌ Lỗi:', err.message);
});

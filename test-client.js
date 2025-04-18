const mqtt = require('mqtt');

const client = mqtt.connect('ws://127.0.0.1:3000/mqtt', {
    clientId: 'tester_' + Math.random().toString(16).substring(2, 8)
});

client.on('connect', () => {
    console.log('🎉 Kết nối thành công tới proxy local!');
    client.end();
});

client.on('error', (err) => {
    console.error('❌ Lỗi test:', err.message);
});

const express = require('express');
const mqtt = require('mqtt');

const app = express();
const port = 5001;

const brokerUrl = 'mqtt://mosquitto';
const topic = 'Fire detected';
let currentValues = null;

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log(`Connected to MQTT broker`);
  client.subscribe(topic, { qos: 2 }, (err) => {
    if (!err) {
      console.log(`Subscribed to topic '${topic}'`);
    } else {
      console.error(`Failed to subscribe to topic '${topic}':`, err);
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const messageData = JSON.parse(message.toString());
    currentValues = messageData;
    console.log(`Received message from topic ${topic}`);
  } catch (error) {
    console.error('Failed to parse MQTT message:', error);
  }
});

app.get('/', (req, res) => {
  res.send('Event info microservice');
});

app.get('/get', (req, res) => {
  const response = {
    message: 'Fire detected!!!',
    data: currentValues,
  };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Event info microservice listening at http://localhost:${port}`);
});

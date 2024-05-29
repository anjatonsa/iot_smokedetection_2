from flask import Flask
import paho.mqtt.client as mqtt
import json
import threading

app = Flask(__name__)

broker_address = "mosquitto"
broker_port = 1883
sub_topic = "Sensor data"
pub_topic = "Fire detected"


def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with result code "+str(rc))
    client.subscribe(sub_topic, qos=2)


def on_message(client, userdata, msg):
    message_thread = threading.Thread(target=process_message, args=(msg,))
    message_thread.start()


def process_message(msg):
    message_data = json.loads(msg.payload.decode())
    print(f"Received message from topic {msg.topic}")

    fire_alarm = message_data.get("FireAlarm", "")
    if fire_alarm is True:
        client.publish(pub_topic, msg.payload, qos=2)
        print(f"Message sent to {pub_topic} topic.")


@app.route('/')
def index():
    return 'Analytics  microservice'


if __name__ == '__main__':

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(broker_address, broker_port, 60)
    client.loop_start()

    app.run()

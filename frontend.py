from flask import Flask, jsonify, request, Response, render_template
from pykafka import KafkaClient
import json

def get_kafka_client():
    return KafkaClient(hosts='ec2-3-111-52-162.ap-south-1.compute.amazonaws.com:9092')

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/topic/<topicname>')
def get_messages(topicname):
    client = get_kafka_client()
    def events():
        for i in client.topics[topicname].get_simple_consumer():
            yield 'data:{0}\n\n'.format(i.value.decode())
    return (Response(events(), mimetype="text/event-stream"))

if __name__ == "__main__":
    app.run(debug=True, port=5001)
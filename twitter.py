from operator import inv
import tweepy
import credentials
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import API
from pykafka import KafkaClient
import json

def invokeKafkaClient():

    return KafkaClient(hosts='ec2-3-109-3-173.ap-south-1.compute.amazonaws.com:9092')


class StdOutListener(tweepy.Stream):
    def on_data(self, data):
        #print(data)  
        message = json.loads(data)
        print(message['place'])
        if message['place'] is not None:
            client = invokeKafkaClient()
            topic = client.topics['twitterdata1']
            producer = topic.get_sync_producer()
            producer.produce(data)
        return True

    def on_status(self, status):
        print("\n\n\n\n",status)
        return True

    def on_error(self, status):
        print(status.id)


def main():
    auth = OAuthHandler(credentials.API_KEY, credentials.API_SECRET_KEY)
    auth.set_access_token(credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET)

    # Authentication validator (prints the user name, if logged in and credentials are right)
    api = API(auth)
    print("{} is logged in right now!!".format(api.verify_credentials().screen_name))


    listener = StdOutListener(credentials.API_KEY, credentials.API_SECRET_KEY,credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET)
    stream = Stream(credentials.API_KEY, credentials.API_SECRET_KEY,credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET)
    
    listener.filter(track=["Twitscape"])
    listener.sample()


if __name__ == "__main__":
    main()




































# from kafka import KafkaProducer

# import json

# class MessageProducer:
#     broker = ""
#     topic = ""
#     producer = None

#     def __init__(self, broker, topic):
#         self.broker = broker
#         self.topic = topic
#         self.producer = KafkaProducer(bootstrap_servers=self.broker,
#         value_serializer=lambda v: json.dumps(v).encode('utf-8'),
#         acks='all',
#         retries = 3)


#     def send_msg(self, msg):
#         print("sending message...")
#         try:
#             future = self.producer.send(self.topic,msg)
#             self.producer.flush()
#             future.get(timeout=60)
#             print("message sent successfully...")
#             return {'status_code':200, 'error':None}
#         except Exception as ex:
#             return ex


# broker = 'ec2-3-109-3-173.ap-south-1.compute.amazonaws.com:9092'
# topic = 'twitterdata1'
# message_producer = MessageProducer(broker,topic)

# data = {'name':'abc', 'email':'abc@example.com'}
# resp = message_producer.send_msg(data)
# print(resp)


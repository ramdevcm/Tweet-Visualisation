from tweepy import Stream
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import API
import tweepy
import credentials
from pykafka import KafkaClient
import json

def invokeKafkaClient():
    return KafkaClient(hosts='127.0.0.1:9092')


class StdOutListener(tweepy.Stream):
    def on_data(self, data):
        print(data)
        return True

    def on_status(self, status):
        print(status)
        return True

    def on_error(self, status):
        print(status.id)

if __name__ == "__main__":
    auth = OAuthHandler(credentials.API_KEY, credentials.API_SECRET_KEY)
    auth.set_access_token(credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET)

    # Authentication validator (prints the user name, if logged in and credentials are right)
    api = API(auth)
    print(api.verify_credentials().screen_name)


    listener = StdOutListener(credentials.API_KEY, credentials.API_SECRET_KEY,credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET)
    stream = Stream(credentials.API_KEY, credentials.API_SECRET_KEY,credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET)
    
    #filters the tweet that contains  strings defined within track
    listener.filter(track=["ramu1010"])
    listener.sample()

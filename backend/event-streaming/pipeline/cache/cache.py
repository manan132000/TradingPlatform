import ast
from kafka import KafkaConsumer
from util.config import config,path
from pymongo import MongoClient
import json
import os

client = MongoClient("mongodb+srv://user1:pass1@cluster0.4vqjg.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database('total_records')
# user_info = db.user_info
# portfolio_table = db.portfolio
stock_table = db.stock_table

consumer = KafkaConsumer(
                        config['topic_name2'],
                        bootstrap_servers=config['kafka_broker'])    

for msg in consumer:
    dict_data=ast.literal_eval(msg.value.decode("utf-8"))
    print(dict_data)
    stock_table.insert_one(dict_data)
    # with open(os.path.join(path,'./data.json'),'a') as f:
    #     json.dump(dict_data,f)
    print(str(dict_data['time']))





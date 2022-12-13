import ast
from kafka import KafkaConsumer
from pymongo import MongoClient
import json
import os

client = MongoClient("mongodb+srv://user1:pass1@cluster0.4vqjg.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database('total_records')

user_profile = db.user_profile # {demat, username, passwordHash, email, walletBalance}
user_portfolio = db.user_portfolio # {demat, portfolio: []}
user_dailyupdates = db.user_dailyupdates # {demat, profit, portfolioValue}
stock_table = db.stock_table

consumer=KafkaConsumer("portfolio_update",bootstrap_servers='localhost:9092',value_deserializer=lambda m: json.loads(m))   

def computePortfolio(dematId):
    # data=request.json
    # print(data)
    # dematId=data["demat_id"]
    found_user = user_portfolio.find_one({'demat_id': dematId})
    #print("MY_USER : ",found_user)
    myStocks = found_user["portfolio"]
    profit = 0
    value = 0
    for stock in myStocks:

        current_value = stock_table.find({"symbol" : stock["stockTicker"]}).sort([("time", -1)]).limit(1)
        # current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
        # print("The cursor is", current_value)
        for curvalue in current_value:
            close = float(curvalue["close"])
            value += stock["number_of_stocks"] * close
            profit += ((stock["number_of_stocks"] * close) - stock["cost"])
    found_user = user_profile.find_one({"demat_id": dematId})
    value += float(found_user["walletBalance"])
    return profit, value

for msg in consumer:
	current_value = user_profile.find()
	# current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
	print("The cursor is", current_value)
	for curvalue in current_value:
		profit, value = computePortfolio(curvalue["demat_id"])
		myquery = { "demat_id": curvalue["demat_id"] }
		newvalues = { "$push": { "profit": profit} }
		user_dailyupdates.update_one(myquery, newvalues)
		newvalues = { "$push": { "portfolioValue": value} }
		user_dailyupdates.update_one(myquery, newvalues)
		print("Pushed values for user", curvalue["demat_id"])
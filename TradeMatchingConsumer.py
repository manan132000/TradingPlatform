import json
from kafka import KafkaConsumer
from tradeMatchingClasses import *
from datetime import datetime
from dateutil import parser
from pymongo import MongoClient

consumer=KafkaConsumer("tradesTopic",bootstrap_servers='localhost:9092',value_deserializer=lambda m: json.loads(m))
# sellConsumer=KafkaConsumer("sellersTopic",bootstrap_servers='localhost:9092',value_deserializer=lambda m: json.loads(m))
client = MongoClient("mongodb+srv://user1:pass1@cluster0.4vqjg.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database('total_records')
user_portfolio = db.user_portfolio # {demat, portfolio: []}
user_transactions = db.user_transactions # {demat, transactions: []}
user_profile = db.user_profile
# buyers_data=[]
# sellers_data=[]
stocks=[]
stock_name_arr=[]
for message in consumer:
	print("Message is", message)
	print("Json is", message.value)
	data=(message.value)
	data["time"] = parser.parse(data["time"])
	data["num"] = int(data["num"])
	if message.value["tradeType"] == "Buy":
		# print("got element in buy")
		# stock_name_arr=[stock.stock for stock in stocks]
		data["maxPrice"] = float(data["maxPrice"])
		if data["stockCode"] not in stock_name_arr:
			stocks.append(Stock(str(data["stockCode"])))
			idxBuyer=stocks[-1].buyerAppend(Buyer(data["dematId"],data["maxPrice"],data["num"],data["time"]))
			stock_name_arr.append(data["stockCode"])
		else:
			idx=stock_name_arr.index(data["stockCode"])
			idxBuyer=stocks[idx].buyerAppend(Buyer(data["dematId"],data["maxPrice"],data["num"],data["time"]))
	else:
		# print("got element in sell")
		data["minPrice"] = float(data["minPrice"])
		if data["stockCode"] not in stock_name_arr:
			stocks.append(Stock(str(data["stockCode"])))
			idxSeller=stocks[-1].sellerAppend(Seller(data["dematId"],data["minPrice"],data["num"],data["time"]))
			stock_name_arr.append(data["stockCode"])
		else:
			idx=stock_name_arr.index(data["stockCode"])
			idxSeller=stocks[idx].sellerAppend(Seller(data["dematId"],data["minPrice"],data["num"],data["time"]))


	# newStocks=load_data(buyers_data,sellers_data)
	buyersExhausted=[]
	sellersExhausted=[]
	numStocksExchanged=0
	# m represents number of sellers and n represents number of buyers
	# O(m+n) algorithm implemented below
	# O(m*log(m) + n*log(n)) time will be spent in sorting the buyers and sellers list
	# print(buyers_data, sellers_data)
	idx=stock_name_arr.index(data["stockCode"])
	stock=stocks[idx]
	# buyers=stock.allBuyers()
	# sellers=stock.allSellers()
	if data["tradeType"]=="Buy":
		while len(stock.sellers)>0 and stock.buyers[idxBuyer].maxPrice>=stock.sellers[0].minPrice:
			stocksExchangePossible=min(stock.buyers[idxBuyer].num,stock.sellers[0].num)
			numStocksExchanged+=stocksExchangePossible
			if stocksExchangePossible==stock.sellers[0].num:
				sellersExhausted.append({
					'dematId':stock.sellers[0].dematId,
					"num":stock.sellers[0].num,
					"time":stock.sellers[0].time,
					"price":stock.sellers[0].minPrice
				})
				stock.sellers.pop(0)
				buyersExhausted.append({
					'dematId':stock.buyers[idxBuyer].dematId,
					'num':stocksExchangePossible,
					"time":stock.buyers[idxBuyer].time,
					"price":stock.buyers[idxBuyer].maxPrice
				})
				stock.buyers[idxBuyer].num-=stocksExchangePossible

			else:
				buyersExhausted.append({
					'dematId':stock.buyers[idxBuyer].dematId,
					'num':stock.buyers[idxBuyer].num,
					"time":stock.buyers[idxBuyer].time,
					"price":stock.buyers[idxBuyer].maxPrice
				})
				sellersExhausted.append({
					'dematId':stock.sellers[0].dematId,
					'num':stocksExchangePossible,
					"time":stock.sellers[0].time,
					"price":stock.sellers[0].minPrice
				})
				stock.sellers[0].num-=stocksExchangePossible
				stock.buyers.pop(idxBuyer)
				break
	else:
		# print("entered trade matching condition for sell")
		while len(stock.buyers)>0 and stock.sellers[idxSeller].minPrice<=stock.buyers[-1].maxPrice:
			# print("entered while loop for sell")
			stocksExchangePossible=min(stock.sellers[idxSeller].num,stock.buyers[-1].num)
			# print("Exchanges possible", stocksExchangePossible)
			numStocksExchanged+=stocksExchangePossible
			if stocksExchangePossible==stock.buyers[-1].num:
				buyersExhausted.append( {
					'dematId':stock.buyers[-1].dematId,
					'num':stock.buyers[-1].num,
					"time":stock.buyers[-1].time,
					"price":stock.buyers[-1].maxPrice
				})
				stock.buyers.pop(-1)
				sellersExhausted.append({
					'dematId':stock.sellers[idxSeller].dematId,
					'num':stocksExchangePossible,
					"time":stock.sellers[idxSeller].time,
					"price":stock.sellers[idxSeller].minPrice
				})
				stock.sellers[idxSeller].num-=stocksExchangePossible

			else:
				# print("entered inner else")
				sellersExhausted.append({
					'dematId':stock.sellers[idxSeller].dematId,
					'num':stock.sellers[idxSeller].num,
					"time":stock.sellers[idxSeller].time,
					"price":stock.sellers[idxSeller].minPrice
				})
				buyersExhausted.append({
					'dematId':stock.buyers[-1].dematId,
					'num':stocksExchangePossible,
					"time":stock.buyers[-1].time,
					"price":stock.buyers[-1].maxPrice
				})
				stock.buyers[-1].num-=stocksExchangePossible
				stock.sellers.pop(idxSeller)
				break
	
	# print(sellersExhausted, buyersExhausted)
	if data["tradeType"]=="Buy":
		trades=[]
		for i in sellersExhausted:
			if buyersExhausted[0]["time"]<i["time"]:
				price=buyersExhausted[0]["price"]
			else:
				price=i["price"]
			trades.append({
				'sellerDematId':i["dematId"],
				'buyerDematId':buyersExhausted[0]["dematId"],
				'stockCode':stock.stock,
				"num":i["num"],
				"price":price
			})
	else:
		trades=[]
		for i in buyersExhausted:
			if sellersExhausted[0]["time"]<i["time"]:
				price=sellersExhausted[0]["price"]
			else:
				price=i["price"]
			trades.append({
				'sellerDematId':sellersExhausted[0]["dematId"],
				'buyerDematId':i["dematId"],
				'stockCode':stock.stock,
				"num":i["num"],
				"price":price
			})
	print(trades) 
	print(buyersExhausted)
	print(sellersExhausted)

	for trade in trades:
		seller_demat_id = trade["sellerDematId"]
		buyer_demat_id = trade["buyerDematId"]

		balanceChange = trade["num"] * trade["price"]

		#update wallet of buyer
		found_buyer = user_profile.find_one({"demat_id": buyer_demat_id})
		oldBalance = found_buyer["walletBalance"]
		newBalance = oldBalance - balanceChange
		myquery = {"demat_id": buyer_demat_id}
		newvalues = {"$set": {"walletBalance": newBalance}}
		user_profile.update_one(myquery, newvalues)

		#update wallet of seller
		found_seller = user_profile.find_one({"demat_id": seller_demat_id})
		oldBalance = found_seller["walletBalance"]
		newBalance = oldBalance + balanceChange
		myquery = {"demat_id": seller_demat_id}
		newvalues = {"$set": {"walletBalance": newBalance}}
		user_profile.update_one(myquery, newvalues)

		#append to buyer transactions
		buytrade = trade
		buytrade["type"] = "Buy"
		myquery = {"demat_id": buyer_demat_id}
		newvalues = {"$push": {"transactions": buytrade}}

		user_transactions.update_one(myquery, newvalues)
		#append to seller transactions
		selltrade = trade
		selltrade["type"] = "Sell"
		myquery = {"demat_id": seller_demat_id}
		newvalues = {"$push": {"transactions": selltrade}}

		user_transactions.update_one(myquery, newvalues)

		#update seller portfolio
		found_user = user_portfolio.find_one({"demat_id": seller_demat_id})
		portfolio = found_user["portfolio"]
		
		for i, stock in enumerate(portfolio):
			stock["number_of_stocks"] = int(stock["number_of_stocks"])
			stock["cost"] = float(stock["cost"])
		deleted = False
		for i, item in enumerate(portfolio):
			if item["stockTicker"] == trade["stockCode"]:
				deleted_stock = portfolio.pop(i)
				newNum = deleted_stock["number_of_stocks"] - trade["num"]
				if newNum != 0:
					newCost = deleted_stock["cost"] - trade["price"]*trade["num"]
					portfolio.append({"stockTicker": item["stockTicker"], "number_of_stocks": newNum, "cost": newCost})
					deleted = True
					break
				else:
					deleted = True
					break

		if deleted:
			myquery = {"demat_id" : seller_demat_id}
			newvalues = {"$set": {"portfolio": portfolio}}
			user_portfolio.update_one(myquery, newvalues)
		else: 
			print("error")	
		
		#update buyer portfolio
		found_user = user_portfolio.find_one({"demat_id": buyer_demat_id})
		portfolio = found_user["portfolio"]
		deleted = False
		for i, item in enumerate(portfolio):
			if item["stockTicker"] == trade["stockCode"]:
				deleted_stock = portfolio.pop(i)
				newNum = deleted_stock["number_of_stocks"] + trade["num"]
				newCost = deleted_stock["cost"] + trade["price"]*trade["num"]
				portfolio.append({"stockTicker": item["stockTicker"], "number_of_stocks": newNum, "cost": newCost})
				deleted = True
				break

		if deleted:
			myquery = {"demat_id" : buyer_demat_id}
			newvalues = {"$set": {"portfolio": portfolio}}
			user_portfolio.update_one(myquery, newvalues)
		else: 
			portfolio.append({"stockTicker": item["stockTicker"], "number_of_stocks": trade["num"], "cost": trade["price"]*trade["num"]})
			myquery = {"demat_id" : buyer_demat_id}
			newvalues = {"$set": {"portfolio": portfolio}}
			user_portfolio.update_one(myquery, newvalues)	




	# bIdx=0
	# sIdx=0
	# # stock.sortBuyers(0, stock.lenBuyers())
	# # stock.sortSellers(0, stock.lenSellers())
	# buyers=stock.allBuyers()
	# sellers=stock.allSellers()
	# while sIdx<stock.lenSellers():
	# 	while bIdx<stock.lenBuyers():
	# 		if buyers[bIdx].maxPrice >= sellers[sIdx].minPrice:
	# 			#means compatible trade
	# 			trade = [sellers[sIdx].orderId,buyers[bIdx].orderId]
	# 			for id, element in enumerate(buyers_data):
	# 				if element["orderId"] == trades[1]:	
	# 					buyers_data.pop(id)
	# 					break
	# 			for id, element in enumerate(sellers_data):
	# 				if element["orderId"] == trades[0]:	
	# 					sellers_data.pop(id)
	# 					break
	# 			#sIdx+=1
	# 			bIdx+=1
	# 			break
	# 		else:
	# 			bIdx+=1
	# 	sIdx+=1

	# # O(mn) algorithm implemented below - 
	# # stock.sortBuyers(0,stock.lenBuyers())
	# # stock.sortSellers(0,stock.lenSellers())
	# # for i in stock.allSellers():
	# #     for j in stock.allBuyers():
	# #         if i.minPrice <= j.maxPrice:
	# #             #means compatible trade
	# #             trades.append([i.orderId,j.orderId])
	# print(trade)
	# print(buyers_data, sellers_data)
import json
from kafka import KafkaConsumer
from tradeMatching import *

buyConsumer=KafkaConsumer("buyersTopic",bootstrap_servers='localhost:9092',value_deserializer=lambda m: json.loads(m))
# sellConsumer=KafkaConsumer("sellersTopic",bootstrap_servers='localhost:9092',value_deserializer=lambda m: json.loads(m))

buyers_data=[]
# sellers_data=[]

for message in buyConsumer:
    print("got element in buy")
    buyers_data.append(message)

# for message in sellConsumer:
#     print("got element in sell")
#     sellers_data.append(message)


stocks=load_data(buyers_data)
trades=[]
# m represents number of sellers and n represents number of buyers
# O(m+n) algorithm implemented below
# O(m*log(m) + n*log(n)) time will be spent in sorting the buyers and sellers list
for stock in stocks:
    bIdx=0
    sIdx=0
    stock.sortBuyers(0, stock.lenBuyers())
    stock.sortSellers(0, stock.lenSellers())
    buyers=stock.allBuyers()
    sellers=stock.allSellers()
    while sIdx<stock.lenSellers():
        while bIdx<stock.lenBuyers():
            if buyers[bIdx].maxPrice >= sellers[sIdx].minPrice:
                #means compatible trade
                trades.append([sellers[sIdx].orderId,buyers[bIdx].orderId])
                #sIdx+=1
                bIdx+=1
                break
            else:
                bIdx+=1
        sIdx+=1

    # O(mn) algorithm implemented below - 
    # stock.sortBuyers(0,stock.lenBuyers())
    # stock.sortSellers(0,stock.lenSellers())
    # for i in stock.allSellers():
    #     for j in stock.allBuyers():
    #         if i.minPrice <= j.maxPrice:
    #             #means compatible trade
    #             trades.append([i.orderId,j.orderId])
print(trades)
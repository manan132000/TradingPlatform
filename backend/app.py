import enum
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import bcrypt
import yfinance as yf
import json
import string
import re
import uuid
#from kafka import KafkaProducer
from datetime import datetime
from pprint import pprint



app = Flask(__name__)
cors = CORS(app, resources={
            r"*": {"origins": "http://localhost:3000"}})

client = MongoClient("mongodb+srv://user1:pass1@cluster0.4vqjg.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database('total_records')
user_profile = db.user_profile # {demat, username, passwordHash, email, walletBalance}
user_watchlist = db.user_watchlist # {demat, watchlist: []}
user_portfolio = db.user_portfolio # {demat, portfolio: []}
user_transactions = db.user_transactions # {demat, transactions: []}
user_alerts = db.user_alerts # {demat, alerts}
user_dailyupdates = db.user_dailyupdates # {demat, profit, portfolioValue}
stock_alerts = db.stock_alerts # {stock, alert_list: [user, config]}
stock_live = db.stock_live # {}
stock_table = db.stock_table

our_stocks = ['AAPL', 'NFLX', 'WFC', 'GOOGL', 'MSFT']

@app.route('/signup', methods=['POST', 'GET'])
@cross_origin()
def signup():
    print(request.json)
    data = request.json
    username = data["username"]
    password = data["password"]
    email = data["email"]

    found_user = user_profile.find_one({"username": username})
    if found_user:
        response = {"status": "ALREADY EXISTS"}
        return response

    demat_id = str(uuid.uuid4())
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    profile_input = {'demat_id': demat_id, 'username': username, 'email': email, 'password': hashed_password, 'walletBalance': 0}
    portfolio_input = {'demat_id': demat_id, 'portfolio': []}
    watchlist_input = {'demat_id': demat_id, 'watchlist': []}
    transaction_input = {'demat_id': demat_id, 'transactions': []}
    alert_input = {'demat_id': demat_id, 'alerts': []}
    dailyUpdate_input = {'demat_id': demat_id, 'profit': [], 'portfolioValue': []}

    user_profile.insert_one(profile_input)
    user_watchlist.insert_one(watchlist_input)
    user_portfolio.insert_one(portfolio_input)
    user_alerts.insert_one(alert_input)
    user_transactions.insert_one(transaction_input)
    user_dailyupdates.insert_one(dailyUpdate_input)
    response = {"status": "SUCCESS", "demat_id": demat_id}
    return response

@app.route('/login', methods=['POST', 'GET'])
@cross_origin()
def login():
    print(request.json)
    data = request.json
    username = data["username"]
    password = data["password"]

    found_user = user_profile.find_one({"username": username})
    if found_user:
        passwordcheck = found_user['password']
        
        if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
            return {"status": "SUCCESS", "demat_id": found_user["demat_id"]}
        else:
            return {"status": "INVALID PASSWORD"}

    else:
        return {"status": "INVALID USERNAME"}


@app.route('/getUserAccount', methods=['POST', 'GET'])
@cross_origin()
def getUserAccount():
    data = request.json
    demat_id = data["demat_id"]
    found_user = user_profile.find_one({"demat_id": demat_id})
    if not found_user:
        return {"status": "FAILURE"}
    userProfile = {"demat_id": demat_id, "username": found_user["username"], "email": found_user["email"], "walletBalance": found_user["walletBalance"]}
    return {"status": "SUCCESS", "userProfile": userProfile}

@app.route('/addToWallet', methods=['POST', 'GET'])
@cross_origin()
def addToWallet():
    data = request.json
    demat_id = data["demat_id"]
    amount = float(data["amount"])
    found_user = user_profile.find_one({"demat_id": demat_id})
    oldAmount = float(found_user["walletBalance"])
    newAmount = oldAmount + amount
    myquery = { "demat_id": demat_id }
    newvalues = { "$set": { "walletBalance": str(newAmount) } }
    user_profile.update_one(myquery, newvalues)
    return {"status" : "SUCCESS"}




#user_info is the name of the collection
@app.route('/userAccount', methods=['POST', 'GET'])
@cross_origin()
def home():
    print(request.json)
    data = request.json
    username = data["username"]
    found_user = user_info.find_one({"username": username})
    if found_user:
        response = {"status": "SUCCESS", "username": found_user["username"], "email": found_user["email"], "balance": found_user["balance"]}
        return response
    response = {"status": "INVALID USERNAME"} 
    return response


# @app.route('/addToPortfolio', methods=['POST', 'GET'])
# @cross_origin()
# def addPortfolio():
#     print(request.json)
#     data = request.json
#     username = data["username"]
#     stock_name = data["stock"]

#     found_user = user_info.find_one({"username": username})
#     if found_user:
#         passwordcheck = found_user['password']
        
#         if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
#             return {"status": "SUCCESS", "username": username}
#         else:
#             return {"status": "INVALID PASSWORD"}

#     else:
#         return {"status": "INVALID USERNAME"}

# @app.route('/showPortfolio1', methods=['POST', 'GET'])
# @cross_origin()
# def showPortfolio1():
#     print(request.json)
#     data = request.json
#     username = data["username"]
#     stock_name = data["stock"]

#     # found_user = user_info.find_one({"username": username})
#     # if found_user:
#     #     passwordcheck = found_user['password']
        
#     #     if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
#     #         return {"status": "SUCCESS", "username": username}
#     #     else:
#     #         return {"status": "INVALID PASSWORD"}

#     # else:
#     #     return {"status": "INVALID USERNAME"}
#     return {
#                 "status" : "Success", 
#                 "stocks": [{
#                             "name" : "AAPL", 
#                             "bought_at" : "2056", 
#                             "shares" : 6,
#                             "current_price": 300
#                             },
#                             {
#                             "name" : "MSFT", 
#                             "bought_at" : "366", 
#                             "shares" : 3,
#                             "current_price": 122
#                             }]
#             }



@app.route('/showWatchlist', methods=['POST', 'GET'])
@cross_origin()
def showWatchlist():
    data = request.json
    demat_id = data["demat_id"]

    
    # mystocks = ['MSFT','FB','GOOGL']
    found_user = user_watchlist.find_one({'demat_id': demat_id})
    myStocks = found_user["watchlist"]
    print(myStocks)
    stockdata = []
    for item in myStocks:
        print("In while loop", item)
        if item in our_stocks:
            print("entered mongo")
            current_value = stock_table.find({"symbol" : item}).sort([("time", -1)]).limit(1)
            # current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
            print("The cursor is", current_value)
            for value in current_value:
                stock = {
                    # 'name': long_name,
                    'symbol' : value["symbol"],
                    'market_price' : value["open"],
                    # 'previous close price ' : previous_close_price ,
                    # 'volume' : volume ,
                    # 'market cap' : market_Cap,
                    'day_high' : value["high"] ,
                    'day_low' : value["low"]
                    # 'fifty Two Week High' : fifty_Two_Week_High ,
                    # 'fifty Two Week Low' : fifty_Two_Week_Low , 
                    # 'dividend Rate' : dividend_Rate ,
                }
        else:    
            stock_info = yf.Ticker(item).info
            #    long_name = stock_info['longName']
            market_price = stock_info['regularMarketPrice']
            #    previous_close_price = stock_info['regularMarketPreviousClose']
            #    volume = stock_info['volume']
            #    market_Cap = stock_info['marketCap']
            day_High = stock_info['dayHigh']
            day_Low  = stock_info['dayLow']
            #    fifty_Two_Week_High = stock_info['fiftyTwoWeekHigh']
            #    fifty_Two_Week_Low = stock_info['fiftyTwoWeekLow']
            #    dividend_Rate = stock_info['dividendRate']
            stock = {
                # 'name': long_name,
                'symbol' : item,
                'market_price' : market_price ,
                # 'previous close price ' : previous_close_price ,
                # 'volume' : volume ,
                # 'market cap' : market_Cap,
                'day_high' : day_High ,
                'day_low' : day_Low ,
                # 'fifty Two Week High' : fifty_Two_Week_High ,
                # 'fifty Two Week Low' : fifty_Two_Week_Low , 
                # 'dividend Rate' : dividend_Rate ,
            }
        stockdata.append(stock)
    print("left while")
    #with open('stock_data_file.json', 'w') as f:
    #   json.dump(stockdata, f)
    print(stockdata)
    return {"status": "SUCCESS", "watchlist": stockdata}

@app.route('/addToWatchlist', methods=['POST', 'GET'])
@cross_origin()   
def addToWatchlist():
    data = request.json
    demat_id = data["demat_id"]
    ticker = data["stockTicker"]

    found_user = user_watchlist.find_one({'demat_id': demat_id})
    # print(stockTicker)
    watchlist = found_user['watchlist']
    if (ticker not in watchlist):
        myquery = { "demat_id": demat_id }
        newvalues = { "$push": { "watchlist": ticker } }
        user_watchlist.update_one(myquery, newvalues)
        # print(found_user['watchlist'])
        return {"status": "SUCCESS"}
    else:
        return {"status":"already in wl"}    

@app.route('/deleteFromWatchlist', methods=['POST', 'GET'])
@cross_origin()
def deleteFromWatchlist():
    data = request.json
    demat_id = data["demat_id"]
    stockTicker = data["stockTicker"]
    found_user = user_watchlist.find_one({"demat_id":demat_id})
    watchlist = found_user["watchlist"]
    for i, stock in enumerate(watchlist): 
        print(stock)
        if stock == stockTicker:
            watchlist.pop(i)
            break

    myquery = { "demat_id": demat_id }
    newvalues = { "$set": { "watchlist": watchlist } }
    user_watchlist.update_one(myquery, newvalues)    
    return {"status": "SUCCESS", 'watchlist': watchlist}
    
@app.route('/addAlert', methods=['POST', 'GET'])
@cross_origin()
def addAlert():
    print("here")
    data = request.json
    demat_id = data["demat_id"]
    stockTicker = data["stockTicker"]
    if stockTicker not in our_stocks:
        return {"status": "stock not in our list"}
    alert_id = str(uuid.uuid4())    
    price = data["price"]
    currentPrice = data["currentPrice"]
    isGreater = (float(price) > float(currentPrice))
    print (price, currentPrice, isGreater)
    alert = {"alert_id": alert_id, "demat_id": demat_id, "stock": stockTicker, "price": price, "isGreater": isGreater}

    #update in user's alerts
    myquery = { "demat_id": demat_id }
    newvalues = { "$push": { "alerts": alert } }
    user_alerts.update_one(myquery, newvalues)

    #update in stock's alerts
    found_stock = stock_alerts.find_one({"stockTicker": stockTicker})
    if not found_stock: 
        stock_alerts.insert_one({"stockTicker": stockTicker, "alerts": []})

    myquery = { "stockTicker": stockTicker }
    newvalues = { "$push": {"alerts": alert}}

    stock_alerts.update_one(myquery, newvalues)
    return {"status": "SUCCESS"}

@app.route('/showAlerts', methods=['POST', 'GET'])
@cross_origin()
def showAlerts():
    data = request.json
    demat_id = data["demat_id"]
    found_user = user_alerts.find_one({"demat_id": demat_id})
    return {"status": "SUCCESS", "alerts": found_user["alerts"]}


@app.route('/deleteAlert', methods=['POST', 'GET'])
@cross_origin()
def deleteAlert():
    data = request.json
    status = "FAILURE"
    demat_id = data["demat_id"]
    alert_id = data["alert_id"]
    stockTicker = data["stockTicker"]
    found_user = user_alerts.find_one({"demat_id": demat_id})
    alert_list = found_user["alerts"]
    deleted = False
    for i, item in enumerate(alert_list):
        if item["alert_id"] == alert_id:
            alert_list.pop(i)
            deleted = True
            break
    
    if deleted:
        myquery = {"demat_id" : demat_id}
        newvalues = {"$set": {"alerts": alert_list}}
        user_alerts.update_one(myquery, newvalues)
        status = "SUCCESS"
        
   
    found_stock = stock_alerts.find_one({"stockTicker": stockTicker})
    alert_list = found_stock["alerts"]
    deleted = False
    for i, item in enumerate(alert_list):
        if item["alert_id"] == alert_id:
            print("here")
            alert_list.pop(i)
            deleted = True
            break
    
    if deleted:
        myquery = {"stockTicker" : stockTicker}
        newvalues = {"$set": {"alerts": alert_list}}
        stock_alerts.update_one(myquery, newvalues)
        status = "SUCCESS"

    

    return {"status" : status}

@app.route('/showPortfolio', methods=['POST', 'GET'])
@cross_origin()
def showPortfolio():
    data = request.json
    #print("data :",data)
    demat_id = data["demat_id"]
    found_user = user_portfolio.find_one({'demat_id': demat_id})
    #print("MY_USER : ",found_user)
    myStocks = found_user["portfolio"]
    return {"status": "SUCCESS", "portfolio": myStocks}



@app.route('/showTransaction', methods=['POST', 'GET'])
@cross_origin()
def showTransaction():
    data = request.json
    demat_id = data["demat_id"]
    found_user = user_transactions.find_one({'demat_id': demat_id})
    myStocks = found_user["transactions"]
    print("MYSTOCKS",myStocks)
    return {"status": "SUCCESS", "transactions": myStocks}
    



def generate_regex_list(user_input):
    text = user_input.lower()
    text_list = text.split()
    regex_list = []

    for word in text_list:
        regex_list.append(".*" + word + ".*")

    return regex_list

#send a string and get list of relevant stocks
@app.route('/searchStocks', methods=['POST', 'GET'])
@cross_origin()
def search_for_stocks():
    data = request.json
    user_input= data["user_input"]
    print(user_input)
    f = open('constituents.json')
    data = json.load(f)
    regex_list = generate_regex_list(user_input)
    response = []

    for item in data:
        for reg in regex_list:
            if re.search(reg, item["Name"].lower()) != None or re.search(reg, item["Symbol"].lower()) != None:
                response.append(item)
                break
    

    f.close()
    print(response)
    return {"list": response}

@app.route('/getCandleStickData', methods=['POST', 'GET'])
@cross_origin()
def get_candlestick_info():
    data = request.json
    ticker_symbol= data["ticker_symbol"]
    
    stock = []

    if ticker_symbol in our_stocks:
        print("entered mongo")
        current_value = stock_table.find({"symbol" : ticker_symbol}).sort([("time", -1)])
        # current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
        print("The cursor is", current_value)
        for value in current_value:
            stock.append([
                # 'name': long_name,
                value["time"],
                value["low"],
                value["close"],
                value["open"], 
                value["high"]])
    else:    
        stock_info = yf.Ticker(ticker_symbol).info
        #    long_name = stock_info['longName']
        market_price = stock_info['regularMarketPrice']
        day_High = stock_info['dayHigh']
        day_Low  = stock_info['dayLow']
        stock = {
            'symbol' : ticker_symbol,
            'regular_market_price' : market_price ,
            'day_high' : day_High ,
            'day_low' : day_Low ,
        }
    #with open('stock_data_file.json', 'w') as f:
    #   json.dump(stockdata, f)
    print(stock)
    response = {"status": "SUCCESS", "stock": stock}
    
    return response

#send a ticker symbol and get that stocks info
@app.route('/getStock', methods=['POST', 'GET'])
@cross_origin()
def get_stock_info():
    data = request.json
    ticker_symbol= data["ticker_symbol"]
    print("stock is ", ticker_symbol)
    stock = {}
    candlestickvalues = []

    if ticker_symbol in our_stocks:
        print("entered mongo")
        current_value = stock_table.find({"symbol" : ticker_symbol}).sort([("time", -1)]).limit(1)
        # current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
        print("The cursor is", current_value)
        for value in current_value:
            stock = {
                # 'name': long_name,
                'symbol' : value["symbol"],
                'regular_market_price' : value["open"],
                'day_high' : value["high"] ,
                'day_low' : value["low"]
            }
        current_value = stock_table.find({"symbol" : ticker_symbol}).sort([("time", -1)])
        # current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
        print("The cursor is", current_value)
        for value in current_value:
            print("type of value is", type(value["low"]))
            candlestickvalues.append([
                # 'name': long_name,
                value["time"],
                float(value["low"]),
                float(value["close"]),
                float(value["open"]), 
                float(value["high"])])
    else:    
        stock_info = yf.Ticker(ticker_symbol).info
        #    long_name = stock_info['longName']
        market_price = stock_info['regularMarketPrice']
        day_High = stock_info['dayHigh']
        day_Low  = stock_info['dayLow']
        stock = {
            'symbol' : ticker_symbol,
            'regular_market_price' : market_price ,
            'day_high' : day_High ,
            'day_low' : day_Low ,
        }
    #with open('stock_data_file.json', 'w') as f:
    #   json.dump(stockdata, f)
    print(stock, candlestickvalues)
    response = {"status": "SUCCESS", "stock": stock, "candleStick": candlestickvalues}
    
    return response

#get a list of all stocks and their tickers
@app.route('/getAllStocks', methods=['POST', 'GET'])
@cross_origin()
def get_all_stocks():
    f = open('constituents.json')
    data = json.load(f)

    response = []
    for item in data:
        response.append({"Name": item["Name"], "Ticker_Symbol": item["Symbol"]})

    f.close()
    return {"list": response}

@app.route('/buyStock',methods=['POST','GET'])
@cross_origin()
def buyStock():
    data=request.json
    print(data)
    stockCode=data["stockCode"]
    demat_id= data["demat_id"]
    num= int(data["number"])
    maxPrice=int(data["maxPrice"])
    costNeeded = num * maxPrice

    found_user = user_profile.find_one({"demat_id": demat_id})
    if costNeeded > found_user["walletBalance"]:
        return {"status" : "INSUFFICIENT BALANCE"}

    time=datetime.now()
    # try:
    producer=KafkaProducer(bootstrap_servers='localhost:9092', value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8'))
    # value = {
    #             "orderId":orderId,
    #             "stockCode":stockCode,
    #             "number":number,
    #             "maxPrice":maxPrice
    #         }
    producer.send('tradesTopic',    value={
                                            "dematId":demat_id,
                                            "tradeType":"Buy",
                                            "stockCode":stockCode,
                                            "num":num,
                                            "maxPrice":maxPrice,
                                            "time":time
                                        })
    # except:
    #     return {"status":"FAIL","value":"Kafka error"}
    return {"status":"SUCCESS","value":"Successfully sent to Kafka"}

@app.route('/sellStock',methods=['POST','GET'])
@cross_origin()
def sellStock():
    data=request.json
    print(data)
    stockCode=data["stockCode"]
    demat_id=data["demat_id"]
    num= int(data["number"])
    minPrice= int(data["minPrice"])
    time=datetime.now()
    if num <1:
        return {"status":"FAIL","value":"Cant trade 0 stocks"}

    found_user = user_portfolio.find_one({"demat_id": demat_id})
    portfolio = found_user["portfolio"]

    foundStock = False
    for i, item in enumerate(portfolio):
        if item["stockTicker"] ==  stockCode :
            foundStock = True
            if int(item["number_of_stocks"]) < num:
                return {"status": "INSUFFICIENT NUMBER OF STOCKS"}
            else:
                break
        
    if foundStock == False:
        return {"status" : "STOCK NOT IN PORTFOLIO"}

    # try:
    producer=KafkaProducer(bootstrap_servers='localhost:9092', value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8'))
    producer.send('tradesTopic',value={
        "dematId":demat_id,
        "tradeType":"Sell",
        "stockCode":stockCode,
        "num":num,
        "minPrice":minPrice,
        "time":time
    })
    # except:
        # return {"status":"FAIL","value":"Kafka error"}
    return {"status":"SUCCESS","value":"Successfully sent to Kafka"}

def getMetrics(stockCode):
    tickerData=yf.Ticker(stockCode)
    forwardEps=tickerData.info['forwardEps']
    sharePrice=tickerData.info['regularmarketprice']
    forwardPE=sharePrice/forwardEps
    trailingEps=tickerData.info['trailingEps']
    trailingPE=sharePrice/trailingEps
    bvps=tickerData.info['bookValue']/tickerData.info['outstandingShares']
    PBratio=sharePrice/bvps
    
    return

@app.route('/getAnalytics',methods=['POST','GET'])
@cross_origin()
def getAnalytics():
    data=request.json
    # print(data)
    demat_id=data["demat_id"]
    current_value = user_dailyupdates.find_one({"demat_id" : demat_id})
    profit = current_value["profit"][-2:]
    value = current_value["portfolioValue"][-2:]
    return  {
                "status": "SUCCESS",
                "profit": profit, 
                "net_worth": value
            }

# @app.route('/computePortfolio',methods=['POST','GET'])
# @cross_origin()
# def computePortfolio():
#     data=request.json
#     print(data)
#     dematId=data["demat_id"]
#     found_user = user_portfolio.find_one({'demat_id': dematId})
#     #print("MY_USER : ",found_user)
#     myStocks = found_user["portfolio"]
#     profit = 0
#     value = 0
#     for stock in myStocks:

#         current_value = stock_table.find({"symbol" : stock["stockTicker"]}).sort([("time", -1)]).limit(1)
#         # current_value = stock_table.find_one({"symbol" : "NFLX"}).sort({"time":-1})
#         print("The cursor is", current_value)
#         for curvalue in current_value:
#             close = float(curvalue["close"])
#             value += stock["number_of_stocks"] * close
#             profit += ((stock["number_of_stocks"] * close) - stock["cost"])
#     found_user = user_profile.find_one({"demat_id": dematId})
#     value += float(found_user["walletBalance"])
#     return {"profit": profit, "value": value}


if __name__=="__main__":
    app.run(debug=True)

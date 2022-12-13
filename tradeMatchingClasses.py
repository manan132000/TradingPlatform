import json
from datetime import datetime
class Buyer():
    def __init__(self,dematId,maxPrice,num,time):
        self.dematId=dematId
        self.num=num
        self.maxPrice=maxPrice
        self.time=time

class Seller():
    def __init__(self,dematId,minPrice,num,time):
        self.dematId=dematId
        self.num=num
        self.minPrice=minPrice
        self.time=time


class Stock():
    def __init__(self,stock):
        self.stock=stock
        self.buyers=[]
        self.sellers=[]
    
    def buyerAppend(self,buyer):
        
        if len(self.buyers)==0:
            self.buyers.append(buyer)
            return 0
        if buyer.maxPrice>self.buyers[-1].maxPrice:
            self.buyers.append(buyer)
            return -1
        if buyer.maxPrice<self.buyers[0].maxPrice:
            self.buyers.insert(0,buyer)
            return 0
        start=0
        end=len(self.buyers)-1
        while start+1<end:
            mid=int((end+start)/2)
            if self.buyers[mid].maxPrice>buyer.maxPrice:
                end=mid
            elif self.buyers[mid].maxPrice<buyer.maxPrice:
                start=mid
            elif self.buyers[mid].time<buyer.time:
                end=mid # because one with lower time stamp gets preference and preference imcreases with index in buyers list
            elif self.buyers[mid].time>buyer.time:
                start=mid
            else:
                self.buyers.insert(mid,buyer)
                return mid
        
        # if self.buyers[start].maxPrice!=buyer.maxPrice:
        #     if self.buyers[end].maxPrice!=buyer.maxPrice:
        #         self.buyers.insert(end,buyer)
        # elif self.buyers[end].maxPrice!=buyer.maxPrice:
        #     self.buyers.insert(end,buyer)
        # else:
        #     if self.buyers[end].time>buyer.time:
        #         self.buyers.insert
        #     elif self.buyers[mid].time<buyer.time:
        #         start=mid
        #     elif self.buyers[mid].time>buyer.time:
        #         end=mid
        #     else:
        #         self.buyers.insert(mid,buyer)
        #         return
        self.buyers.insert(end,buyer)
        return end
    
    def sellerAppend(self,seller):
        if len(self.sellers)==0:
            self.sellers.append(seller)
            return 0
        if seller.minPrice>=self.sellers[-1].minPrice:
            self.sellers.append(seller)
            return -1
        if seller.minPrice<=self.sellers[0].minPrice:
            self.sellers.insert(0,seller)
            return 0
        start=0
        end=len(self.sellers)-1
        while start+1<end:
            mid=int((end+start)/2)
            if self.sellers[mid].minPrice>seller.minPrice:
                end=mid
            elif self.sellers[mid].minPrice<seller.minPrice:
                start=mid
            elif self.sellers[mid].time<seller.time:
                start=mid
            elif self.sellers[mid].time>seller.time:
                end=mid
            else:
                self.sellers.insert(mid,seller)
                return mid
        self.sellers.insert(end,seller)
        return end
    
    def lenBuyers(self):
        return len(self.buyers)

    def lenSellers(self):
        return len(self.sellers)

    def allBuyers(self):
        return self.buyers
    
    def allSellers(self):
        return self.sellers
    
    def buyerPop(self,idx):
        self.buyers.pop(idx)
    
    def sellerPop(self,idx):
        self.sellers.pop(idx)

    def sortBuyers(self,idx1,idx2):
        if idx1>=idx2:
            return
        
        mid=int((idx1+idx2)/2)
        self.sortBuyers(idx1,mid)
        self.sortBuyers(mid+1,idx2)
        arr1=self.buyers[idx1:mid+1]
        arr2=self.buyers[mid+1:idx2+1]
        idx=idx1
        while True:
            if len(arr1)==0:
                self.buyers[idx:idx2+1]=arr2
                break
            elif len(arr2)==0:
                self.buyers[idx:idx2+1]=arr1
                break
            elif arr1[0].maxPrice<=arr2[0].maxPrice:
                self.buyers[idx]=arr1[0]
                arr1.pop(0)
                idx+=1
            else:
                self.buyers[idx]=arr2[0]
                arr2.pop(0)
                idx+=1
        del arr1
        del arr2
        return
    
    def sortSellers(self,idx1,idx2):
        if idx1>=idx2:
            return
        
        mid=int((idx1+idx2)/2)
        self.sortSellers(idx1,mid)
        self.sortSellers(mid+1,idx2)
        arr1=self.sellers[idx1:mid+1]
        arr2=self.sellers[mid+1:idx2+1]
        idx=idx1
        while True:
            if len(arr1)==0:
                self.sellers[idx:idx2+1]=arr2
                break
            elif len(arr2)==0:
                self.sellers[idx:idx2+1]=arr1
                break
            elif arr1[0].minPrice<=arr2[0].minPrice:
                self.sellers[idx]=arr1[0]
                arr1.pop(0)
                idx+=1
            else:
                self.sellers[idx]=arr2[0]
                arr2.pop(0)
                idx+=1
        del arr1
        del arr2
        return


#FIFO algorithm
# def load_data(buyers_data,sellers_data):
#     stocks=[]
#     for i in sellers_data:
#         stock_name_arr=[stock.stock for stock in stocks]
#         if i["stockCode"] not in stock_name_arr:
#             stocks.append(Stock(str(i["stockCode"])))
#             stocks[-1].sellerAppend(Seller(i["dematId"],i["minPrice"],i["num"]))
#         else:
#             idx=stock_name_arr.index(i["stockCode"])
#             stocks[idx].sellerAppend(Seller(i["dematId"],i["minPrice"],i["num"]))

#     for j in buyers_data:    
#         stock_name_arr=[stock.stock for stock in stocks]
#         if j["stockCode"] not in stock_name_arr: #stocks stores objects of class stock
#             stocks.append(Stock(str(j["stockCode"])))
#             stocks[-1].buyerAppend(Buyer(j["dematId"],j["maxPrice"],j["num"]))
#         else:
#             idx=stock_name_arr.index(j["stockCode"])
#             stocks[idx].buyerAppend(Buyer(j["dematId"],j["maxPrice"],j["num"]))
#     return stocks